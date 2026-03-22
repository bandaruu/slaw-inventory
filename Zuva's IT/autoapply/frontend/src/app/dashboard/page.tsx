'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase, FileText, BarChart3, Settings, Bell, Crown,
  Search, MapPin, GraduationCap, Sparkles, RefreshCw, Loader2, Zap
} from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import ResumeUploader from '@/components/ResumeUploader';
import JobCard, { Job } from '@/components/JobCard';
import ApplicationTracker, { Application } from '@/components/ApplicationTracker';
import { getUser, User, isAuthenticated } from '@/lib/auth';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

type Tab = 'overview' | 'jobs' | 'applications' | 'settings';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<Tab>('overview');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingApps, setLoadingApps] = useState(false);
  const [resumeId, setResumeId] = useState<string | undefined>();
  const [prefs, setPrefs] = useState({ role: '', location: '', experience: 'junior' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadUser();
    loadJobs();
    loadApplications();
  }, []);

  const loadUser = async () => {
    const u = await getUser();
    setUser(u);
  };

  const loadJobs = async () => {
    setLoadingJobs(true);
    try {
      const res = await api.get('/api/jobs/latest');
      setJobs(res.data.jobs || []);
    } catch {
      // fail silently in demo mode
      setJobs([]);
    } finally {
      setLoadingJobs(false);
    }
  };

  const loadApplications = async () => {
    setLoadingApps(true);
    try {
      const res = await api.get('/api/applications');
      setApplications(res.data.applications || []);
    } catch {
      setApplications([]);
    } finally {
      setLoadingApps(false);
    }
  };

  const savePrefs = async () => {
    setSaving(true);
    try {
      await api.put('/api/auth/preferences', prefs);
      toast.success('Preferences saved!');
    } catch {
      toast.error('Failed to save preferences.');
    } finally {
      setSaving(false);
    }
  };

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'jobs', label: 'Matched Jobs', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const stats = [
    { label: 'Jobs Matched', value: jobs.length, icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Applied', value: applications.filter(a => a.status === 'applied').length, icon: FileText, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Interviews', value: applications.filter(a => a.status === 'interview').length, icon: BarChart3, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { label: 'Plan', value: user?.plan === 'pro' ? 'Pro' : 'Free', icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  ];

  return (
    <div className="min-h-screen bg-[#050510] text-white">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">
              Dashboard <Sparkles className="inline w-6 h-6 text-blue-400 mb-1" />
            </h1>
            <p className="text-white/50 mt-1">
              Welcome back, <span className="text-white font-medium">{user?.name || 'User'}</span>
            </p>
          </div>
          {user?.plan === 'free' && (
            <motion.a
              href="/pricing"
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-yellow-600/80 to-orange-600/80 text-white text-sm font-bold border border-yellow-500/20 shadow-lg shadow-yellow-500/10"
            >
              <Crown className="w-4 h-4" /> Upgrade to Pro
            </motion.a>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="glass border border-white/10 rounded-2xl p-5">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-white/50 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-2xl bg-white/5 border border-white/10 mb-8 w-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                tab === t.id
                  ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <t.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="glass border border-white/10 rounded-3xl p-7">
                <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" /> Upload Resume
                </h2>
                <ResumeUploader onUploadSuccess={(id) => { setResumeId(id); toast.success('Resume ready for AI optimization!'); }} />
              </div>

              <div className="glass border border-white/10 rounded-3xl p-7">
                <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-violet-400" /> Job Preferences
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-white/60 mb-2 block">Target Role</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        value={prefs.role}
                        onChange={(e) => setPrefs({ ...prefs, role: e.target.value })}
                        placeholder="e.g. Software Engineer, Product Manager"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-white/60 mb-2 block">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        value={prefs.location}
                        onChange={(e) => setPrefs({ ...prefs, location: e.target.value })}
                        placeholder="e.g. Mumbai, Remote, Bangalore"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-white/60 mb-2 block">Experience Level</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <select
                        value={prefs.experience}
                        onChange={(e) => setPrefs({ ...prefs, experience: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 transition-all appearance-none"
                      >
                        <option value="intern" className="bg-[#0d0d1a]">Internship</option>
                        <option value="junior" className="bg-[#0d0d1a]">Junior (0–2 years)</option>
                        <option value="mid" className="bg-[#0d0d1a]">Mid-Level (2–5 years)</option>
                        <option value="senior" className="bg-[#0d0d1a]">Senior (5+ years)</option>
                        <option value="lead" className="bg-[#0d0d1a]">Lead / Manager</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={savePrefs}
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold text-sm hover:from-blue-500 hover:to-violet-500 transition-all shadow-lg"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {saving ? 'Saving...' : 'Save & Find Jobs'}
                  </button>
                </div>
              </div>

              {/* Recent Applications */}
              <div className="lg:col-span-2 glass border border-white/10 rounded-3xl p-7">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-400" /> Recent Applications
                  </h2>
                  <button onClick={() => setTab('applications')} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    View all →
                  </button>
                </div>
                <ApplicationTracker applications={applications.slice(0, 5)} />
              </div>
            </div>
          )}

          {/* ── JOBS ── */}
          {tab === 'jobs' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Matched Jobs</h2>
                  <p className="text-white/50 text-sm mt-1">Jobs fetched in the last 3 hours</p>
                </div>
                <button
                  onClick={loadJobs}
                  disabled={loadingJobs}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 text-white/70 hover:text-white text-sm transition-all"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingJobs ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              {loadingJobs ? (
                <div className="flex items-center justify-center py-20">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
                    <p className="text-white/50">Fetching latest jobs...</p>
                  </div>
                </div>
              ) : jobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Briefcase className="w-12 h-12 text-white/20 mb-4" />
                  <p className="text-white/50 font-medium">No jobs fetched yet</p>
                  <p className="text-white/30 text-sm mt-2">The job fetcher runs every hour. Check back soon!</p>
                  <button onClick={loadJobs} className="mt-4 px-6 py-2.5 rounded-xl bg-blue-600/20 text-blue-400 text-sm font-medium hover:bg-blue-600/30 transition-all">
                    Try fetching now
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {jobs.map((job) => (
                    <JobCard key={job._id} job={job} resumeId={resumeId} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── APPLICATIONS ── */}
          {tab === 'applications' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Application Tracker</h2>
                  <p className="text-white/50 text-sm mt-1">{applications.length} total applications</p>
                </div>
                <button onClick={loadApplications} disabled={loadingApps} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 text-white/70 hover:text-white text-sm transition-all">
                  <RefreshCw className={`w-4 h-4 ${loadingApps ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
              <div className="glass border border-white/10 rounded-3xl p-6">
                <ApplicationTracker applications={applications} />
              </div>
            </div>
          )}

          {/* ── SETTINGS ── */}
          {tab === 'settings' && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="glass border border-white/10 rounded-3xl p-7">
                <h2 className="text-lg font-bold text-white mb-5">Account Settings</h2>
                <div className="space-y-5">
                  <div>
                    <label className="text-sm text-white/60 mb-2 block">Display Name</label>
                    <input
                      defaultValue={user?.name}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-white/60 mb-2 block">Email</label>
                    <input
                      defaultValue={user?.email}
                      disabled
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/50 cursor-not-allowed"
                    />
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white text-sm">Current Plan</p>
                        <p className="text-white/50 text-xs mt-0.5">
                          {user?.plan === 'pro' ? 'Pro – Unlimited applications' : 'Free – 5 applications/day'}
                        </p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                        user?.plan === 'pro'
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20'
                          : 'bg-white/10 text-white/60 border border-white/10'
                      }`}>
                        {user?.plan?.toUpperCase() || 'FREE'}
                      </span>
                    </div>
                    {user?.plan !== 'pro' && (
                      <a href="/pricing" className="inline-flex items-center gap-1.5 mt-3 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors">
                        <Crown className="w-3 h-3" /> Upgrade to Pro
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="glass border border-white/10 rounded-3xl p-7">
                <h2 className="text-lg font-bold text-white mb-5">Gmail Integration</h2>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                    <Zap className="w-8 h-8 text-red-400" />
                  </div>
                  <p className="font-medium text-white mb-2">Connect Gmail</p>
                  <p className="text-white/40 text-sm mb-5 max-w-xs">Connect your Gmail account to enable auto-apply — Zuva Technologies will send applications on your behalf.</p>
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/google`}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold text-sm hover:from-red-500 hover:to-orange-500 transition-all shadow-lg"
                  >
                    Connect with Google
                  </a>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
