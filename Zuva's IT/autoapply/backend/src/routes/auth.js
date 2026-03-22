const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Configure Passport Google OAuth
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await User.findOne({ email: profile.emails[0].value });
      if (user) {
        user.googleId = profile.id;
        user.gmailAccessToken = accessToken;
        user.gmailRefreshToken = refreshToken;
        await user.save();
      } else {
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          avatar: profile.photos[0]?.value,
          gmailAccessToken: accessToken,
          gmailRefreshToken: refreshToken,
        });
      }
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'change-me', { expiresIn: '7d' });
}

// POST /api/auth/register
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required.' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters.' });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'Email already registered.' });

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    res.status(201).json({ token, user: { _id: user._id, name: user.name, email: user.email, plan: user.plan } });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed.', error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required.' });

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !user.password) return res.status(401).json({ message: 'Invalid credentials.' });

    const valid = await user.comparePassword(password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials.' });

    const token = generateToken(user._id);
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, plan: user.plan } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed.', error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req, res) => {
  const { _id, name, email, plan, preferences, avatar } = req.user;
  res.json({ user: { _id, name, email, plan, preferences, avatar } });
});

// PUT /api/auth/preferences
router.put('/preferences', authMiddleware, async (req, res) => {
  try {
    const { role, location, experience } = req.body;
    req.user.preferences = { role, location, experience };
    await req.user.save();
    res.json({ message: 'Preferences updated.', preferences: req.user.preferences });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update preferences.' });
  }
});

// Google OAuth
if (process.env.GOOGLE_CLIENT_ID) {
  const passportMiddleware = require('passport');
  passportMiddleware.initialize();
  router.use(passportMiddleware.initialize());

  router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/gmail.send'],
    session: false,
  }));

  router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth` }),
    (req, res) => {
      const token = generateToken(req.user._id);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?token=${token}`);
    }
  );
}

module.exports = router;
