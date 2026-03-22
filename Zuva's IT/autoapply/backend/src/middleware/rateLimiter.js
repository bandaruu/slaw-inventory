const rateLimit = require('express-rate-limit');

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: { message: 'Too many auth attempts, please wait 1 minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { globalLimiter, authLimiter };
