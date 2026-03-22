const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, default: 'Remote' },
  description: { type: String, required: true },
  url: { type: String, required: true },
  source: { type: String, default: 'Remotive' },
  salary: { type: String },
  tags: [{ type: String }],
  postedAt: { type: Date, required: true },
  fetchedAt: { type: Date, default: Date.now },
}, { timestamps: true });

jobSchema.index({ postedAt: -1 });
jobSchema.index({ title: 'text', description: 'text', company: 'text' });

module.exports = mongoose.model('Job', jobSchema);
