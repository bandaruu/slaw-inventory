const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
  status: {
    type: String,
    enum: ['applied', 'pending', 'rejected', 'interview'],
    default: 'applied',
  },
  emailMessageId: { type: String }, // Gmail message ID
  optimizedResume: { type: String }, // ATS-optimized resume text
  coverLetter: { type: String },
  appliedAt: { type: Date, default: Date.now },
}, { timestamps: true });

applicationSchema.index({ userId: 1, appliedAt: -1 });

module.exports = mongoose.model('Application', applicationSchema);
