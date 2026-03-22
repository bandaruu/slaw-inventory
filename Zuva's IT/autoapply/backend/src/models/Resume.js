const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalFileName: { type: String, required: true },
  encryptedData: { type: String, required: true }, // AES-256-CBC encrypted base64
  iv: { type: String, required: true }, // Initialization vector
  mimeType: { type: String },
  optimizedVersions: [{
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    content: { type: String }, // AI-generated optimized resume text
    coverLetter: { type: String }, // AI-generated cover letter
    createdAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
