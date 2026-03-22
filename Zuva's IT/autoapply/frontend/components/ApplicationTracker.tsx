'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Clock, XCircle, MessageSquare, Briefcase } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export interface Application {
  _id: string;
  jobId: {
    title: string;
    company: string;
    location?: string;
  };
  status: 'applied' | 'pending' | 'rejected' | 'interview';
  appliedAt: string;
  resumeVersion?: string;
}

const statusConfig = {
  applied: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', label: 'Applied' },
  pending: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', label: 'Pending' },
  rejected: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', label: 'Rejected' },
  interview: { icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', label: 'Interview' },
};

interface ApplicationTrackerProps {
  applications: Application[];
}

export default function ApplicationTracker({ applications }: ApplicationTrackerProps) {
  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Briefcase className="w-10 h-10 text-white/20 mb-3" />
        <p className="text-white/40 font-medium">No applications yet</p>
        <p className="text-white/30 text-sm mt-1">Apply to jobs from the dashboard to see them here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {applications.map((app, i) => {
        const { icon: Icon, color, bg, label } = statusConfig[app.status];
        return (
          <motion.div
            key={app._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 p-4 rounded-xl glass border border-white/10 hover:border-white/20 transition-all duration-200"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${bg} flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white text-sm truncate">{app.jobId?.title || 'Unknown Role'}</p>
              <p className="text-white/50 text-xs mt-0.5">{app.jobId?.company || 'Unknown Company'}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${bg} ${color}`}>
                {label}
              </span>
              <p className="text-white/30 text-xs mt-1">{formatDate(app.appliedAt)}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
