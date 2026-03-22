'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import PricingCard from '@/components/PricingCard';
import api from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { HelpCircle, CheckCircle, X } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'month',
    description: 'Perfect to get started and test the platform.',
    features: [
      '5 job applications per day',
      'AI resume optimization',
      'AI cover letter generation',
      'Application tracking',
      'Email support',
    ],
    highlighted: false,
    ctaLabel: 'Start Free',
  },
  {
    name: 'Pro',
    price: '₹999',
    period: 'month',
    description: 'For serious job seekers who want maximum interviews.',
    features: [
      'Unlimited job applications',
      'Priority AI optimization',
      'Gmail auto-send integration',
      'Real-time job alerts',
      'Advanced application analytics',
      'Priority support',
      'Custom resume templates',
    ],
    highlighted: true,
    badge: 'Most Popular',
    ctaLabel: 'Get Pro',
  },
  {
    name: 'Enterprise',
    price: '₹4,999',
    period: 'month',
    description: 'For teams and placement agencies scaling job placements.',
    features: [
      'Everything in Pro',
      'Up to 20 team members',
      'Bulk resume uploads',
      'Dedicated account manager',
      'White-label options',
      'API access',
      'SLA guarantee',
    ],
    highlighted: false,
    ctaLabel: 'Contact Sales',
  },
];

const comparison = [
  { feature: 'Daily Applications', free: '5', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'AI Resume Optimizer', free: true, pro: true, enterprise: true },
  { feature: 'AI Cover Letters', free: true, pro: true, enterprise: true },
  { feature: 'Gmail Auto-Send', free: false, pro: true, enterprise: true },
  { feature: 'Job Alerts (Real-Time)', free: false, pro: true, enterprise: true },
  { feature: 'Analytics Dashboard', free: false, pro: true, enterprise: true },
  { feature: 'Team Members', free: '1', pro: '1', enterprise: '20' },
  { feature: 'API Access', free: false, pro: false, enterprise: true },
  { feature: 'White-Label', free: false, pro: false, enterprise: true },
];

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState('');

  const handleSelect = async (plan: string) => {
    if (plan === 'Free') {
      if (!isAuthenticated()) return router.push('/register');
      return router.push('/dashboard');
    }
    if (plan === 'Enterprise') {
      toast.info('Contact our team at hello@zuva.it for enterprise pricing.');
      return;
    }
    if (!isAuthenticated()) {
      return router.push('/register');
    }
    setLoading(plan);
    try {
      const res = await api.post('/api/payments/razorpay/order', { plan: 'pro' });
      const { order, key } = res.data;

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'Zuva Technologies',
        description: 'Pro Plan Subscription',
        order_id: order.id,
        handler: async (response: any) => {
          await api.post('/api/payments/razorpay/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          toast.success('🎉 Welcome to Pro! Enjoy unlimited applications.');
          router.push('/dashboard');
        },
        prefill: { name: 'User', email: 'user@example.com' },
        theme: { color: '#3b82f6' },
      };

      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        toast.error('Razorpay SDK not loaded. Please try again.');
      }
    } catch {
      toast.error('Payment initialization failed. Please try again.');
    } finally {
      setLoading('');
    }
  };

  return (
    <div className="min-h-screen bg-[#050510] text-white">
      <Navbar />

      {/* Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div className="container mx-auto px-4 pt-28 pb-24">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-sm font-semibold text-blue-400 tracking-wider uppercase mb-4"
          >
            Pricing
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black mb-5"
          >
            Simple, transparent<br /><span className="gradient-text">pricing</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg max-w-xl mx-auto"
          >
            Start free. Upgrade when you're ready to go full autopilot on your job applications.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
            >
              <PricingCard
                {...plan}
                onSelect={() => handleSelect(plan.name)}
                ctaLabel={loading === plan.name ? 'Processing...' : plan.ctaLabel}
              />
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-black text-white text-center mb-8">
            Full Feature Comparison
          </h2>
          <div className="glass border border-white/10 rounded-3xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-white/60">Feature</th>
                  {['Free', 'Pro', 'Enterprise'].map((p) => (
                    <th key={p} className="px-6 py-4 text-sm font-bold text-white text-center">{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={row.feature} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                    <td className="px-6 py-4 text-sm text-white/70">{row.feature}</td>
                    {[row.free, row.pro, row.enterprise].map((val, j) => (
                      <td key={j} className="px-6 py-4 text-center">
                        {typeof val === 'boolean' ? (
                          val
                            ? <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                            : <X className="w-5 h-5 text-white/20 mx-auto" />
                        ) : (
                          <span className="text-sm font-medium text-white">{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ teaser */}
        <div className="text-center mt-16">
          <p className="text-white/40 text-sm">
            Have questions?{' '}
            <a href="mailto:hello@zuva.it" className="text-blue-400 hover:text-blue-300 transition-colors">
              hello@zuva.it
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
