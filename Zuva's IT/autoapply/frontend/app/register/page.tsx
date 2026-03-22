'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Zap, Eye, EyeOff, Loader2, ArrowRight, Chrome, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { setToken } from '@/lib/auth';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
});

type FormData = z.infer<typeof schema>;

const perks = [
  '5 free applications per day',
  'AI resume optimization',
  'Cover letter generation',
  'Application tracking',
];

export default function RegisterPage() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const password = watch('password', '');

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/register', data);
      setToken(res.data.token);
      toast.success('Account created! Welcome to Zuva Technologies 🎉');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/google`;
  };

  const strengthChecks = [
    { label: '8+ characters', pass: password.length >= 8 },
    { label: 'Uppercase letter', pass: /[A-Z]/.test(password) },
    { label: 'Contains a number', pass: /[0-9]/.test(password) },
  ];

  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="hero-glow w-[500px] h-[500px] bg-violet-600 top-[-20%] right-[-20%]" />
      <div className="hero-glow w-[400px] h-[400px] bg-blue-600 bottom-[-20%] left-[-20%]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-xl">
              <Zap className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="font-black text-xl text-white">ZUVA <span className="gradient-text">IT</span></span>
          </Link>
          <h1 className="text-3xl font-black text-white mt-6 mb-2">Create your account</h1>
          <p className="text-white/50">Start automating your job applications for free</p>
        </div>

        {/* Perks */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {perks.map((p) => (
            <span key={p} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">
              <CheckCircle className="w-3 h-3" /> {p}
            </span>
          ))}
        </div>

        <div className="glass border border-white/10 rounded-3xl p-8 shadow-2xl">
          <button
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border border-white/15 text-white/80 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-200 font-medium mb-6"
          >
            <Chrome className="w-5 h-5" />
            Sign up with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#0d0d1a] px-4 text-white/30">or with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Full Name</label>
              <input
                {...register('name')}
                placeholder="Priya Sharma"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Email address</label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPw ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Strength indicators */}
              {password && (
                <div className="flex gap-2 mt-2">
                  {strengthChecks.map((c) => (
                    <div key={c.label} className="flex items-center gap-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${c.pass ? 'bg-green-400' : 'bg-white/20'}`} />
                      <span className={`text-xs ${c.pass ? 'text-green-400' : 'text-white/30'}`}>{c.label}</span>
                    </div>
                  ))}
                </div>
              )}
              {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold hover:from-blue-500 hover:to-violet-500 shadow-lg shadow-blue-500/25 transition-all duration-300 disabled:opacity-60 mt-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {loading ? 'Creating account...' : 'Create Free Account'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <p className="text-center text-white/40 text-xs mt-6">
            By signing up, you agree to our{' '}
            <a href="#" className="text-white/60 hover:text-white transition-colors">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-white/60 hover:text-white transition-colors">Privacy Policy</a>
          </p>

          <p className="text-center text-white/40 text-sm mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
