'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  Zap, FileText, Search, Mail, BarChart3, Shield,
  ChevronRight, ArrowRight, Star, CheckCircle, Sparkles,
  Brain, Clock, TrendingUp, Globe, Lock, Cpu
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const features = [
  {
    icon: Search,
    title: 'Smart Job Fetching',
    desc: 'Automatically discovers jobs posted within the last 3 hours from top platforms — filtered by your preferences.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Brain,
    title: 'ATS Resume Optimizer',
    desc: 'AI rewrites your resume with the right keywords and metrics to pass Applicant Tracking Systems every time.',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: FileText,
    title: 'Cover Letter Generator',
    desc: 'Personalised, professional cover letters generated in seconds — tailored to each job description.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: Mail,
    title: 'Gmail Auto-Apply',
    desc: 'Connects to your Gmail and sends applications with your optimized resume and cover letter attached.',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    icon: BarChart3,
    title: 'Application Tracker',
    desc: 'Real-time status tracking for every application — Applied, Pending, Interview, or Rejected.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Shield,
    title: 'AES-256 Encryption',
    desc: 'Your resume data is encrypted at rest with military-grade AES-256 encryption before storage.',
    gradient: 'from-red-500 to-orange-500',
  },
];

const steps = [
  {
    number: '01',
    title: 'Upload Your Resume',
    desc: 'Drag and drop your PDF or DOCX resume. It\'s encrypted and securely stored.',
    icon: FileText,
  },
  {
    number: '02',
    title: 'Set Job Preferences',
    desc: 'Tell us your target role, location, and experience level. We find the best matches.',
    icon: Search,
  },
  {
    number: '03',
    title: 'AI Applies For You',
    desc: 'Our AI optimizes your resume, writes cover letters, and sends applications — automatically.',
    icon: Zap,
  },
];

const stats = [
  { value: '10,000+', label: 'Jobs Fetched Daily' },
  { value: '94%', label: 'ATS Pass Rate' },
  { value: '3x', label: 'More Interviews' },
  { value: '< 2 hrs', label: 'First Response Time' },
];

const testimonials = [
  {
    name: 'Priya S.',
    role: 'Software Engineer',
    text: 'Zuva Technologies got me 12 interviews in my first week. The AI resumes are insanely good.',
    rating: 5,
  },
  {
    name: 'Rahul M.',
    role: 'Product Manager',
    text: 'I used to spend hours on each application. Now it\'s fully automated. Life-changing!',
    rating: 5,
  },
  {
    name: 'Ananya K.',
    role: 'Data Scientist',
    text: 'The ATS optimizer is the real deal. My response rate went from 5% to 40%.',
    rating: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050510] text-white overflow-x-hidden">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Animated glow orbs */}
        <div className="hero-glow w-[600px] h-[600px] bg-blue-600 top-[-10%] left-[-10%]" />
        <div className="hero-glow w-[500px] h-[500px] bg-violet-600 bottom-[-10%] right-[-10%]" />
        <div className="hero-glow w-[300px] h-[300px] bg-cyan-500 top-[40%] left-[50%]" />

        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-sm text-white/70 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            AI-Powered Job Application Automation Platform
            <ChevronRight className="w-4 h-4" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight mb-6"
          >
            Apply to jobs
            <br />
            <span className="gradient-text">automatically</span>
            <br />
            with AI.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 font-light text-balance"
          >
            Upload your resume once. Zuva Technologies fetches the latest jobs, optimizes your resume for ATS,
            writes cover letters, and sends applications — all on autopilot.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              href="/register"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-lg hover:from-blue-500 hover:to-violet-500 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
            >
              <Zap className="w-5 h-5" />
              Start Applying for Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl glass border border-white/15 text-white/80 hover:text-white font-semibold text-base hover:border-white/30 transition-all duration-300"
            >
              Sign In
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {stats.map((s) => (
              <div key={s.label} className="glass border border-white/10 rounded-2xl p-5 text-center">
                <div className="text-3xl font-black gradient-text-blue">{s.value}</div>
                <div className="text-white/50 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Floating demo card */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-20 max-w-3xl mx-auto"
          >
            <div className="glass border border-white/10 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div className="flex-1 h-6 rounded-md bg-white/5 mx-2" />
              </div>
              <div className="space-y-3">
                {[
                  { company: 'Google', role: 'Senior Software Engineer', status: 'Applied ✓', color: 'text-green-400' },
                  { company: 'Microsoft', role: 'Product Manager', status: 'Interview Scheduled', color: 'text-blue-400' },
                  { company: 'Stripe', role: 'Frontend Engineer', status: 'Applied ✓', color: 'text-green-400' },
                  { company: 'Figma', role: 'Full Stack Developer', status: 'Sent 2m ago', color: 'text-yellow-400' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{item.role}</p>
                      <p className="text-xs text-white/50">{item.company}</p>
                    </div>
                    <span className={`text-xs font-medium ${item.color}`}>{item.status}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── ALGORITHM PIPELINE (THEMED VERSION OF IMAGE 1) ─── */}
      <section className="py-24 relative overflow-hidden">
        <div className="hero-glow w-[300px] h-[300px] bg-blue-600 top-[10%] left-[20%] opacity-10" />
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <div className="font-mono glass border border-white/10 bg-white/[0.02] p-8 md:p-12 rounded-3xl shadow-2xl">
            <div className="text-blue-400/50 mb-6 text-sm">$_system.init("career_engine")</div>
            <h2 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400 tracking-tighter mb-2" style={{ textShadow: '0 0 20px rgba(59, 130, 246, 0.2)' }}>
              ZUVA
            </h2>
            <div className="text-white/40 tracking-[0.3em] md:tracking-[0.5em] text-xs md:text-sm mb-16 font-semibold">
              I N T E L L I G E N T &nbsp; J O B &nbsp; P L A C E M E N T &nbsp; S Y S T E M
            </div>

            <div className="border border-white/5 bg-black/40 p-6 md:p-10 rounded-2xl">
              <div className="text-blue-400/50 mb-8 text-sm">// AUTOMATED PIPELINE</div>
              <ul className="space-y-5 text-white/80 text-sm md:text-lg tracking-wide">
                <li><span className="text-blue-400 inline-block w-10">01.</span> BASE_RESUME → AI_PARSE → JD_MATCH</li>
                <li><span className="text-blue-400 inline-block w-10">02.</span> JD_SCRAPER → REAL_TIME [&lt;1HR FRESH]</li>
                <li><span className="text-blue-400 inline-block w-10">03.</span> ATS_OPTIMIZER → RESUME_GENERATE</li>
                <li><span className="text-blue-400 inline-block w-10">04.</span> COVER_LETTER_ENGINE → PERSONALIZE</li>
                <li><span className="text-blue-400 inline-block w-10">05.</span> GMAIL_DISPATCH → AUTO_SEND</li>
                <li><span className="text-violet-400 inline-block w-10">06.</span> LINKEDIN_BOT → 20+ APPLY/DAY</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section id="features" className="py-32 relative">
        <div className="hero-glow w-[400px] h-[400px] bg-blue-600 top-[20%] left-[50%] opacity-10" />
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-blue-400 tracking-wider uppercase mb-4">Features</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Everything you need to<br /><span className="gradient-text">land your dream job</span></h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">From finding jobs to sending applications — fully automated, powered by state-of-the-art AI.</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <AnimatedSection key={f.title}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.01 }}
                  transition={{ duration: 0.25 }}
                  className="group h-full p-7 rounded-3xl glass border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <f.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section id="how-it-works" className="py-32 relative">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-violet-400 tracking-wider uppercase mb-4">How It Works</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Three steps to<br /><span className="gradient-text">automated applications</span></h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <AnimatedSection key={step.number}>
                <div className="relative text-center">
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-full h-px bg-gradient-to-r from-white/20 to-transparent" />
                  )}
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 opacity-20 blur-xl" />
                    <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600/20 to-violet-600/20 border border-white/15 flex items-center justify-center">
                      <step.icon className="w-10 h-10 text-blue-400" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 flex items-center justify-center text-xs font-black text-white">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── AUTOMATED TICKER GRID (THEMED VERSION OF IMAGE 2) ─── */}
      <section className="py-24 relative overflow-hidden">
        <div className="hero-glow w-[500px] h-[500px] bg-violet-600 top-[-20%] right-[-10%] opacity-10" />
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="glass bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-10 mb-8 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-violet-600/10" />
            <h2 className="relative text-3xl md:text-5xl font-black tracking-tight text-white mb-2">
              20+ Applications Every Single Day
            </h2>
            <p className="relative text-blue-400 font-semibold uppercase tracking-widest text-sm">Fully Automated</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass border border-white/10 bg-white/5 hover:bg-white/10 p-8 md:p-10 rounded-3xl flex flex-col justify-center min-h-[180px] hover:-translate-y-2 transition-all duration-300">
              <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-cyan-400 mb-4 leading-none tracking-tighter">01</div>
              <p className="font-bold text-sm md:text-base uppercase tracking-wider text-white/80">AI reads your base resume & every job description</p>
            </div>
            <div className="glass border border-white/10 bg-white/5 hover:bg-white/10 p-8 md:p-10 rounded-3xl flex flex-col justify-center min-h-[180px] hover:-translate-y-2 transition-all duration-300">
              <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-violet-400 to-fuchsia-400 mb-4 leading-none tracking-tighter">02</div>
              <p className="font-bold text-sm md:text-base uppercase tracking-wider text-white/80">Fresh jobs scraped — postings under 1 hour old</p>
            </div>
            <div className="glass border border-white/10 bg-white/5 hover:bg-white/10 p-8 md:p-10 rounded-3xl flex flex-col justify-center min-h-[180px] hover:-translate-y-2 transition-all duration-300">
              <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-rose-400 mb-4 leading-none tracking-tighter">03</div>
              <p className="font-bold text-sm md:text-base uppercase tracking-wider text-white/80">New ATS-Optimized resume generated per job</p>
            </div>
            <div className="glass border border-white/10 bg-white/5 hover:bg-white/10 p-8 md:p-10 rounded-3xl flex flex-col justify-center min-h-[180px] hover:-translate-y-2 transition-all duration-300">
              <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-amber-400 mb-4 leading-none tracking-tighter">04</div>
              <p className="font-bold text-sm md:text-base uppercase tracking-wider text-white/80">Custom cover letter + auto-sent via your Gmail</p>
            </div>
            <div className="glass border border-white/10 bg-white/5 hover:bg-white/10 p-8 md:p-10 rounded-3xl flex flex-col justify-center min-h-[180px] hover:-translate-y-2 transition-all duration-300">
              <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-cyan-400 mb-4 leading-none tracking-tighter">OPT</div>
              <p className="font-bold text-sm md:text-base uppercase tracking-wider text-white/80">F-1 OPT & STEM OPT specialized targeting</p>
            </div>
            <div className="glass border border-white/10 bg-white/5 hover:bg-white/10 p-8 md:p-10 rounded-3xl flex flex-col justify-center min-h-[180px] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-violet-600/10 opacity-0 hover:opacity-100 transition-opacity" />
              <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-violet-400 mb-4 leading-none tracking-tighter relative z-10">✓</div>
              <p className="font-bold text-sm md:text-base uppercase tracking-wider text-white relative z-10">Interview guarantee or money back — period</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-pink-400 tracking-wider uppercase mb-4">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Loved by <span className="gradient-text">job seekers</span></h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <AnimatedSection key={t.name}>
                <div className="p-7 rounded-3xl glass border border-white/10 hover:border-white/20 transition-all duration-300">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                  <div>
                    <p className="font-semibold text-white text-sm">{t.name}</p>
                    <p className="text-white/40 text-xs">{t.role}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="relative max-w-4xl mx-auto text-center p-16 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-violet-600/20 rounded-3xl" />
              <div className="absolute inset-0 border border-blue-500/30 rounded-3xl" />
              <div className="hero-glow w-64 h-64 bg-blue-500 top-[-30%] left-[-10%] opacity-20" />
              <div className="hero-glow w-64 h-64 bg-violet-500 bottom-[-30%] right-[-10%] opacity-20" />
              <div className="relative">
                <h2 className="text-4xl md:text-6xl font-black mb-6">
                  Ready to automate<br /><span className="gradient-text">your job search?</span>
                </h2>
                <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
                  Join thousands of candidates who land interviews faster with Zuva Technologies.
                </p>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-lg hover:from-blue-500 hover:to-violet-500 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
                >
                  <Sparkles className="w-6 h-6" />
                  Get Started for Free
                  <ArrowRight className="w-6 h-6" />
                </Link>
                <p className="text-white/30 text-sm mt-6">No credit card required · Free plan available</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.svg" alt="Zuva Technologies" className="w-8 h-8" />
                <span className="font-bold text-white">Zuva <span className="gradient-text">Technologies</span></span>
              </div>
              <p className="text-white/40 text-sm leading-relaxed">
                AI-powered job application automation. Apply smarter, not harder.
              </p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Dashboard', 'API'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Cookies'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold text-white text-sm mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-white/40 hover:text-white/70 text-sm transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-sm">© 2026 Zuva Technologies. All rights reserved.</p>
            <div className="flex items-center gap-2 text-white/30 text-xs">
              <Lock className="w-3 h-3" /> AES-256 Encrypted &nbsp;·&nbsp;
              <Globe className="w-3 h-3" /> HTTPS Only &nbsp;·&nbsp;
              <Shield className="w-3 h-3" /> SOC 2 Ready
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
