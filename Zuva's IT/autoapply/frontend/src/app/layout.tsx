import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Zuva Technologies – AI-Powered Job Application Automation',
  description:
    'Apply to 100s of jobs automatically with AI. Zuva Technologies generates tailored resumes, cover letters, and sends applications on your behalf.',
  keywords: ['job application', 'AI resume', 'auto apply', 'cover letter generator', 'ATS optimization'],
  openGraph: {
    title: 'Zuva Technologies – Apply to Jobs Automatically with AI',
    description: 'AI-powered job application automation platform',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Toaster position="top-right" theme="dark" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
