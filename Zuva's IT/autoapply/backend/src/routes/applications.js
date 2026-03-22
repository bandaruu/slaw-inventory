const express = require('express');
const Application = require('../models/Application');
const Resume = require('../models/Resume');
const Job = require('../models/Job');
const { authMiddleware } = require('../middleware/auth');
const { optimizeResume, generateCoverLetter } = require('../services/ai.service');
const gmailService = require('../services/gmail.service');
const { decryptData } = require('../services/crypto.service');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const router = express.Router();

const FREE_DAILY_LIMIT = 5;

// POST /api/apply
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { jobId, resumeId } = req.body;
    if (!jobId || !resumeId) return res.status(400).json({ message: 'jobId and resumeId required.' });

    // Check daily limit for free users
    if (req.user.plan === 'free') {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const todayApps = await Application.countDocuments({
        userId: req.user._id,
        appliedAt: { $gte: today },
      });
      if (todayApps >= FREE_DAILY_LIMIT) {
        return res.status(403).json({ message: `Free plan limit reached (${FREE_DAILY_LIMIT}/day). Upgrade to Pro for unlimited applications.` });
      }
    }

    const [resume, job] = await Promise.all([
      Resume.findOne({ _id: resumeId, userId: req.user._id }),
      Job.findById(jobId),
    ]);
    if (!resume) return res.status(404).json({ message: 'Resume not found.' });
    if (!job) return res.status(404).json({ message: 'Job not found.' });

    // Decrypt and extract resume text
    const decryptedBase64 = decryptData(resume.encryptedData, resume.iv);
    const buffer = Buffer.from(decryptedBase64, 'base64');
    let resumeText = '';
    if (resume.mimeType === 'application/pdf') {
      const pdfData = await pdfParse(buffer);
      resumeText = pdfData.text;
    } else {
      const result = await mammoth.extractRawText({ buffer });
      resumeText = result.value;
    }

    // AI optimize
    let optimized = resumeText;
    let coverLetter = '';
    try {
      [optimized, coverLetter] = await Promise.all([
        optimizeResume(resumeText, job.description),
        generateCoverLetter(resumeText, job.description, job.company),
      ]);
    } catch (aiErr) {
      console.warn('[AI] Skipping AI optimization:', aiErr.message);
    }

    // Send via Gmail
    let emailMessageId;
    try {
      const user = await require('../models/User').findById(req.user._id).select('+gmailAccessToken +gmailRefreshToken');
      if (user.gmailAccessToken) {
        emailMessageId = await gmailService.sendApplication({
          accessToken: user.gmailAccessToken,
          refreshToken: user.gmailRefreshToken,
          to: `careers@${job.company.toLowerCase().replace(/\s/g, '')}.com`,
          subject: `Application for ${job.title} – ${req.user.name}`,
          body: coverLetter || `Dear Hiring Team,\n\nI am writing to apply for the ${job.title} position at ${job.company}.\n\nBest regards,\n${req.user.name}`,
          attachmentContent: optimized,
          attachmentName: `${req.user.name.replace(/ /g, '_')}_Resume.txt`,
        });
      }
    } catch (gmailErr) {
      console.warn('[Gmail] Skipping email send:', gmailErr.message);
    }

    const application = await Application.create({
      userId: req.user._id,
      jobId: job._id,
      resumeId: resume._id,
      optimizedResume: optimized,
      coverLetter,
      emailMessageId,
      status: 'applied',
    });

    res.status(201).json({ message: 'Application sent!', applicationId: application._id });
  } catch (err) {
    res.status(500).json({ message: 'Application failed.', error: err.message });
  }
});

// GET /api/applications
router.get('/', authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id })
      .populate('jobId', 'title company location')
      .sort({ appliedAt: -1 })
      .limit(100);
    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch applications.', error: err.message });
  }
});

module.exports = router;
