import { useEffect } from 'react';
import { motion, useReducedMotion, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GraduationCap, PlusCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { CAMPUS_CONFIG } from '@/data/campus';

/**
 * Bold Apple HIG Hero section:
 * - Large Title: 56px mobile / 64px desktop, Bold (700), -0.03em tracking, leading-1.05.
 * - Subheadline: 20px mobile / 24px desktop, Semi-bold (600), AM Maroon (#A51636), leading-1.3.
 * - Body Text: 16px, Regular (400), dark grey (#1D1D1F), line-height 1.5.
 * - Bold Focal Feature: 60fps Eye Icon with ring-4 ring-[#A51636]/10 halo.
 */
export function AmritaHero() {
  const { profile } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  // Eye pupil tracking springs for 60fps fluid motion
  const pupilX = useSpring(0, { stiffness: 200, damping: 20 });
  const pupilY = useSpring(0, { stiffness: 200, damping: 20 });

  useEffect(() => {
    if (shouldReduceMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const normalizedX = (e.clientX / innerWidth) * 2 - 1;
      const normalizedY = (e.clientY / innerHeight) * 2 - 1;

      pupilX.set(normalizedX * 12);
      pupilY.set(normalizedY * 12);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [pupilX, pupilY, shouldReduceMotion]);

  const fadeIn = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  return (
    <section className="relative overflow-hidden bg-white dark:bg-black py-28 sm:py-36 border-b border-[#E5E5E5] dark:border-[#313131] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">

          {/* Hero Left Column */}
          <div className="lg:col-span-7 space-y-8 lg:pr-6">

            <motion.div
              initial="hidden"
              animate="visible"
              custom={0}
              variants={fadeIn}
              className="flex items-center gap-4 flex-wrap"
            >
              {/* Fluid 60fps Eye Icon inside Frosted Glass Tile */}
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/60 dark:border-[#313131] bg-white/70 dark:bg-[#1F1F1F] backdrop-blur-2xl ring-4 ring-[#A51636]/15 dark:ring-[#E52B50]/25 shadow-xl">
                <svg
                  viewBox="0 0 48 48"
                  fill="none"
                  className="h-10 w-10 text-[#A51636] dark:text-[#E52B50]"
                >
                  <path
                    d="M6 24C6 24 13.5 12 24 12C34.5 12 42 24 42 24C42 24 34.5 36 24 36C13.5 36 6 24 6 24Z"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="7"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  />
                  <motion.circle
                    cx="24"
                    cy="24"
                    r="3.5"
                    fill="currentColor"
                    style={{
                      x: pupilX,
                      y: pupilY,
                    }}
                  />
                </svg>
              </div>

              <div className="glass-pill text-[#A51636] dark:text-[#E52B50] font-semibold text-xs uppercase tracking-wider px-4 py-2">
                <GraduationCap className="h-4 w-4" />
                <span>{CAMPUS_CONFIG.name} · Official Portal</span>
              </div>
            </motion.div>

            {/* Approved Hero Heading Text Gradient (#FFFFFF -> #9B9B9B) */}
            <div className="space-y-4">
              <motion.h1
                initial="hidden"
                animate="visible"
                custom={0.05}
                variants={fadeIn}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
              >
                <span className="hero-text-gradient">Amrita</span>
                <span className="text-[#A51636] dark:text-[#E52B50]">Eye</span>
              </motion.h1>

              <motion.h2
                initial="hidden"
                animate="visible"
                custom={0.08}
                variants={fadeIn}
                className="text-lg sm:text-xl font-semibold text-[#A51636] dark:text-[#E52B50] leading-snug tracking-normal max-w-2xl"
              >
                Keeping our campus safe, clean, and sustainable
              </motion.h2>
            </div>

            {/* Body Text */}
            <motion.p
              initial="hidden"
              animate="visible"
              custom={0.1}
              variants={fadeIn}
              className="max-w-2xl text-base sm:text-lg font-normal text-slate-700 dark:text-zinc-300 leading-relaxed tracking-normal"
            >
              Empowering students and faculty with instant crowdsourced issue reporting, AI photo diagnostics, and real-time live map tracking across campus.
            </motion.p>
          </div>

          {/* Student Glass Container */}
          <div className="lg:col-span-5">
            <motion.div
              initial="hidden"
              animate="visible"
              custom={0.15}
              variants={fadeIn}
              className="glass-card p-10 space-y-8"
            >
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/60 dark:border-white/15 bg-white/80 dark:bg-white/10 backdrop-blur-xl text-4xl text-[#A51636] dark:text-[#E52B50] shadow-md">
                  🎓
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#1D1D1F] dark:text-white leading-tight tracking-tight">
                    {profile?.full_name || 'Amrita Student'}
                  </h3>
                  <p className="text-base font-medium text-slate-600 dark:text-zinc-400 mt-1">
                    {profile?.email || 'local.student@cb.amrita.edu'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="inline-flex items-center gap-2 text-[#A51636] dark:text-[#E52B50]">
                  <ShieldCheck className="h-4 w-4 text-[#A51636] dark:text-[#E52B50]" /> Offline Dev Mode
                </span>
                <span className="rounded-full border border-white/50 dark:border-white/15 bg-white/70 dark:bg-white/10 px-4 py-1.5 text-slate-800 dark:text-zinc-200 backdrop-blur-md text-xs font-bold">
                  Supabase Bypassed
                </span>
              </div>

              <Link
                to="/report"
                className="flex w-full items-center justify-center gap-3 rounded-full bg-[#A51636] dark:bg-[#C81D42] px-9 py-4 text-base font-bold text-white shadow-xl shadow-[#A51636]/30 dark:shadow-rose-950/80 transition-all hover:bg-[#8c122d] hover:scale-[1.02] active:scale-[0.98]"
              >
                <PlusCircle className="h-5 w-5" />
                <span>Report Campus Issue</span>
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
