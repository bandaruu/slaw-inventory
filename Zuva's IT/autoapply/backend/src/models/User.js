const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, select: false },
  googleId: { type: String, sparse: true },
  avatar: { type: String },
  plan: { type: String, enum: ['free', 'pro'], default: 'free' },
  preferences: {
    role: { type: String, default: '' },
    location: { type: String, default: '' },
    experience: { type: String, default: 'junior' },
  },
  dailyApplicationCount: { type: Number, default: 0 },
  dailyApplicationDate: { type: Date },
  gmailAccessToken: { type: String, select: false },
  gmailRefreshToken: { type: String, select: false },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
