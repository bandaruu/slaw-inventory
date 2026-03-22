'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Building2, Clock, ExternalLink, Sparkles, Loader2, Briefcase } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import { toast } from 'sonner';
import api from '@/lib/api';
import AIOptimizeModal from './AIOptimizeModal';

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  source: string;
  postedAt: string;
  salary?: string;
}

interface JobCardProps {
  job: Job;
  resumeId?: string;
}

export default function JobCard({ job, resumeId }: JobCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [applying, setApplying] = useState(false);

  const handleAutoApply = async () => {
    if (!resumeId) {
      toast.error('Please upload your resume first.');
      return;
    }
    setApplying(true);
    try {
      await api.post('/api/apply', { jobId: job._id, resumeId });
      toast.success(`Application sent to ${job.company}!`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to apply. Try again.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="group relative p-5 rounded-2xl glass border border-white/10 hover:border-blue-500/30 transition-all duration-300 flex flex-col gap-4"
      >
        {/* Source badge */}
        <div className="flex items-start justify-between">
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
            {job.source || 'Remotive'}
          </span>
          <span className="flex items-center gap-1 text-xs text-white/40">
            <Clock className="w-3 h-3" />
            {formatRelativeTime(job.postedAt)}
          </span>
        </div>

        {/* Job info */}
        <div>
          <h3 className="font-semibold text-white text-base leading-snug">{job.title}</h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
            <span className="flex items-center gap-1 text-sm text-white/60">
              <Building2 className="w-3.5 h-3.5" />
              {job.company}
            </span>
            <span className="flex items-center gap-1 text-sm text-white/60">
              <MapPin className="w-3.5 h-3.5" />
              {job.location || 'Remote'}
            </span>
            {job.salary && (
              <span className="flex items-center gap-1 text-sm text-green-400">
                <Briefcase className="w-3.5 h-3.5" />
                {job.salary}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-white/50 line-clamp-3 leading-relaxed">
          {job.description}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto pt-2 border-t border-white/10">
          <button
            onClick={() => setModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-violet-500 transition-all shadow-lg shadow-blue-500/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Optimize
          </button>
          <button
            onClick={handleAutoApply}
            disabled={applying}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-white/20 text-white/70 hover:text-white hover:border-white/40 text-sm font-medium transition-all disabled:opacity-50"
          >
            {applying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            {applying ? 'Sending...' : 'Auto Apply'}
          </button>
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </motion.div>

      {modalOpen && (
        <AIOptimizeModal job={job} resumeId={resumeId} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
