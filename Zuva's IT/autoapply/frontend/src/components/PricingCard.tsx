'use client';

import { motion } from 'framer-motion';
import { Check, Zap, Crown } from 'lucide-react';

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  onSelect: () => void;
  ctaLabel?: string;
}

export default function PricingCard({
  name, price, period, description, features,
  highlighted, badge, onSelect, ctaLabel = 'Get Started',
}: PricingCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className={`relative flex flex-col p-8 rounded-3xl transition-all duration-300 ${
        highlighted
          ? 'bg-gradient-to-br from-blue-600/20 to-violet-600/20 border-2 border-blue-500/50 shadow-2xl shadow-blue-500/20'
          : 'glass border border-white/10 hover:border-white/20'
      }`}
    >
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-bold shadow-lg shadow-blue-500/30">
            <Crown className="w-3 h-3" />
            {badge}
          </span>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            highlighted ? 'bg-gradient-to-br from-blue-500 to-violet-600' : 'bg-white/10'
          }`}>
            {highlighted ? <Crown className="w-4 h-4 text-white" /> : <Zap className="w-4 h-4 text-white/60" />}
          </div>
          <span className="text-white font-bold text-lg">{name}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black text-white">{price}</span>
          <span className="text-white/50 text-sm">/{period}</span>
        </div>
        <p className="text-white/50 text-sm mt-2">{description}</p>
      </div>

      <ul className="space-y-3 flex-1 mb-8">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-3 text-sm">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
              highlighted ? 'bg-blue-500/20' : 'bg-white/5'
            }`}>
              <Check className={`w-3 h-3 ${highlighted ? 'text-blue-400' : 'text-white/40'}`} />
            </div>
            <span className="text-white/70">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
          highlighted
            ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:from-blue-500 hover:to-violet-500 shadow-lg shadow-blue-500/30'
            : 'border border-white/20 text-white/70 hover:text-white hover:border-white/40'
        }`}
      >
        {ctaLabel}
      </button>
    </motion.div>
  );
}
