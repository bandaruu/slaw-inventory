const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const PLAN_PRICES = {
  pro: 99900, // ₹999 in paise
};

// POST /api/payments/razorpay/order
router.post('/razorpay/order', authMiddleware, async (req, res) => {
  try {
    const { plan } = req.body;
    const amount = PLAN_PRICES[plan];
    if (!amount) return res.status(400).json({ message: 'Invalid plan.' });

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `zuva_${req.user._id}_${Date.now()}`,
    });

    res.json({ order, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create order.', error: err.message });
  }
});

// POST /api/payments/razorpay/verify
router.post('/razorpay/verify', authMiddleware, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSig !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature.' });
    }

    await User.findByIdAndUpdate(req.user._id, { plan: 'pro' });
    res.json({ message: 'Payment verified. Plan upgraded to Pro!', plan: 'pro' });
  } catch (err) {
    res.status(500).json({ message: 'Payment verification failed.', error: err.message });
  }
});

// POST /api/payments/stripe/checkout (placeholder)
router.post('/stripe/checkout', authMiddleware, async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(503).json({ message: 'Stripe not configured.' });
    }
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: { name: 'Zuva Technologies Pro Plan' },
          unit_amount: 99900,
          recurring: { interval: 'month' },
        },
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/dashboard?upgraded=true`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?cancelled=true`,
      metadata: { userId: req.user._id.toString() },
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: 'Stripe checkout failed.', error: err.message });
  }
});

module.exports = router;
