'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Loader2, Copy, Download, Check, FileText, Mail } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import type { Job } from './JobCard';

interface AIOptimizeModalProps {
  job: Job;
  resumeId?: string;
  onClose: () => void;
}

export default function AIOptimizeModal({ job, resumeId, onClose }: AIOptimizeModalProps) {
  const [tab, setTab] = useState<'resume' | 'cover'>('resume');
  const [loading, setLoading] = useState(false);
  const [optimizedResume, setOptimizedResume] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [copied, setCopied] = useState(false);

  const handleOptimize = async () => {
    if (!resumeId) {
      toast.error('Please upload your resume first.');
      return;
    }
    setLoading(true);
    try {
      const [resumeRes, coverRes] = await Promise.all([
        api.post('/api/resume/optimize', { resumeId, jobId: job._id }),
        api.post('/api/resume/cover-letter', { resumeId, jobId: job._id }),
      ]);
      setOptimizedResume(resumeRes.data.optimizedResume);
      setCoverLetter(coverRes.data.coverLetter);
      toast.success('AI optimization complete!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'AI optimization failed. Check your OpenAI key.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    const text = tab === 'resume' ? optimizedResume : coverLetter;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const content = tab === 'resume' ? optimizedResume : coverLetter;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-[#0d0d1a] border border-white/10 shadow-2xl shadow-black/50 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                AI Optimizer
              </h2>
              <p className="text-sm text-white/50 mt-1 truncate max-w-md">{job.title} @ {job.company}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10 px-6">
            {[
              { id: 'resume', label: 'ATS Resume', icon: FileText },
              { id: 'cover', label: 'Cover Letter', icon: Mail },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                  tab === id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-white/40 hover:text-white/70'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {!optimizedResume && !loading ? (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-white/60 font-medium">Generate AI-optimized content</p>
                <p className="text-white/30 text-sm mt-2">Creates ATS resume & cover letter tailored to this job</p>
              </div>
            ) : loading ? (
              <div className="flex flex-col items-center justify-center h-48 gap-4">
                <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
                <div className="text-center">
                  <p className="text-white font-medium">AI is analyzing the job description...</p>
                  <p className="text-white/40 text-sm mt-1">Tailoring your resume & generating cover letter</p>
                </div>
              </div>
            ) : (
              <pre className="text-sm text-white/80 whitespace-pre-wrap font-mono leading-relaxed">
                {content}
              </pre>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 flex items-center justify-between gap-3">
            <button
              onClick={handleOptimize}
              disabled={loading || !resumeId}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold text-sm disabled:opacity-50 hover:from-blue-500 hover:to-violet-500 transition-all shadow-lg shadow-blue-500/20"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Generating...' : optimizedResume ? 'Re-generate' : 'Generate with AI'}
            </button>

            {content && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 text-white/70 hover:text-white text-sm font-medium transition-all"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
