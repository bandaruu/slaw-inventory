'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Menu, X, ChevronRight } from 'lucide-react';
import { isAuthenticated, logout } from '@/lib/auth';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAuthed(isAuthenticated());
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/#features', label: 'Features' },
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '/pricing', label: 'Pricing' },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass border-b border-white/10 shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image src="/logo.svg" alt="Zuva Technologies" width={36} height={36} className="group-hover:scale-110 transition-transform duration-300" />
          <span className="font-bold text-lg text-white">
            Zuva <span className="gradient-text">Technologies</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/70 hover:text-white transition-colors duration-200 font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          {authed ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="text-sm px-4 py-2 rounded-lg border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all duration-200"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1 text-sm font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:from-blue-500 hover:to-violet-500 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
              >
                Get Started <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/10 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm text-white/70 hover:text-white transition-colors py-2 font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-white/10 pt-3 flex flex-col gap-2">
                {authed ? (
                  <>
                    <Link href="/dashboard" className="text-sm text-center py-2 px-4 rounded-lg border border-white/20 text-white">Dashboard</Link>
                    <button onClick={logout} className="text-sm py-2 px-4 rounded-lg border border-white/20 text-white/70">Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-sm text-center py-2 px-4 rounded-lg border border-white/20 text-white">Sign In</Link>
                    <Link href="/register" className="text-sm text-center py-2 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold">Get Started</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
