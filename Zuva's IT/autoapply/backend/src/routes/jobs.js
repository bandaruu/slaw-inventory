const express = require('express');
const Job = require('../models/Job');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/jobs — paginated list
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.q || '';

    const query = search
      ? { $text: { $search: search } }
      : {};

    const [jobs, total] = await Promise.all([
      Job.find(query).sort({ postedAt: -1 }).skip(skip).limit(limit),
      Job.countDocuments(query),
    ]);

    res.json({ jobs, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch jobs.', error: err.message });
  }
});

// GET /api/jobs/latest — jobs within last 3 hours
router.get('/latest', authMiddleware, async (req, res) => {
  try {
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
    const user = req.user;

    // Build preference-based query
    const query = { postedAt: { $gte: threeHoursAgo } };
    if (user.preferences?.role) {
      query.$or = [
        { title: { $regex: user.preferences.role, $options: 'i' } },
        { description: { $regex: user.preferences.role, $options: 'i' } },
      ];
    }
    if (user.preferences?.location) {
      query.location = { $regex: user.preferences.location, $options: 'i' };
    }

    const jobs = await Job.find(query).sort({ postedAt: -1 }).limit(50);
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch latest jobs.', error: err.message });
  }
});

module.exports = router;
