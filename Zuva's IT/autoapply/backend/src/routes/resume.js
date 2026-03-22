const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const Resume = require('../models/Resume');
const Job = require('../models/Job');
const { authMiddleware } = require('../middleware/auth');
const { encryptData, decryptData } = require('../services/crypto.service');
const { optimizeResume, generateCoverLetter } = require('../services/ai.service');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// POST /api/resume/upload
router.post('/upload', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

    const { mimetype, originalname, buffer } = req.file;
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(mimetype)) return res.status(400).json({ message: 'Only PDF and DOCX files are allowed.' });

    const { encryptedData, iv } = encryptData(buffer.toString('base64'));

    const resume = await Resume.create({
      userId: req.user._id,
      originalFileName: originalname,
      encryptedData,
      iv,
      mimeType: mimetype,
    });

    res.status(201).json({ message: 'Resume uploaded and encrypted.', resumeId: resume._id });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed.', error: err.message });
  }
});

// POST /api/resume/optimize
router.post('/optimize', authMiddleware, async (req, res) => {
  try {
    const { resumeId, jobId } = req.body;
    if (!resumeId || !jobId) return res.status(400).json({ message: 'resumeId and jobId required.' });

    const [resume, job] = await Promise.all([
      Resume.findOne({ _id: resumeId, userId: req.user._id }),
      Job.findById(jobId),
    ]);
    if (!resume) return res.status(404).json({ message: 'Resume not found.' });
    if (!job) return res.status(404).json({ message: 'Job not found.' });

    // Decrypt resume
    const decryptedBase64 = decryptData(resume.encryptedData, resume.iv);
    const buffer = Buffer.from(decryptedBase64, 'base64');

    // Extract text
    let resumeText = '';
    if (resume.mimeType === 'application/pdf') {
      const pdfData = await pdfParse(buffer);
      resumeText = pdfData.text;
    } else {
      const result = await mammoth.extractRawText({ buffer });
      resumeText = result.value;
    }

    // AI optimize
    const optimized = await optimizeResume(resumeText, job.description);

    // Store optimized version
    resume.optimizedVersions.push({ jobId: job._id, content: optimized });
    await resume.save();

    res.json({ optimizedResume: optimized });
  } catch (err) {
    res.status(500).json({ message: 'Optimization failed.', error: err.message });
  }
});

// POST /api/resume/cover-letter
router.post('/cover-letter', authMiddleware, async (req, res) => {
  try {
    const { resumeId, jobId } = req.body;
    const [resume, job] = await Promise.all([
      Resume.findOne({ _id: resumeId, userId: req.user._id }),
      Job.findById(jobId),
    ]);
    if (!resume || !job) return res.status(404).json({ message: 'Resume or job not found.' });

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

    const coverLetter = await generateCoverLetter(resumeText, job.description, job.company);
    res.json({ coverLetter });
  } catch (err) {
    res.status(500).json({ message: 'Cover letter generation failed.', error: err.message });
  }
});

module.exports = router;
