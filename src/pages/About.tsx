import { AnimatedText } from '@/components/ui/AnimatedText';
import { Link } from 'react-router-dom';
import { Compass, GraduationCap, Heart, Lightbulb, MapPin, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: { 
    opacity: 1, 
    y: 0,
    filter: "blur(0px)",
    transition: { type: 'spring', duration: 0.45, bounce: 0 }
  }
};

const VALUES = [
  {
    icon: GraduationCap,
    title: 'Born in the hostel',
    text: 'We were students new to a city we knew nothing about. CivicEye exists so the next fresher never has to learn a pothole the hard way.',
  },
  {
    icon: Compass,
    title: 'City knowledge, shared',
    text: 'Broken lights, dark streets, flooded junctions \u2014 the things locals know and newcomers don\u2019t. We make that knowledge visible to everyone.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified by neighbours',
    text: 'Reports are confirmed by the people who live there. Numbers and community votes decide what gets fixed first \u2014 no one decides alone.',
  },
  {
    icon: Lightbulb,
    title: 'Progress you can see',
    text: 'When a report goes Pending \u2192 Verified \u2192 In progress \u2192 Resolved, everyone can watch it. Fixing things visibly builds trust.',
  },
];

const TIMELINE = [
  {
    date: '1 August 2026',
    title: 'The idea is born',
    text: 'Living in hostels in a brand-new city, we realised no one tells you where the potholes are, which streets go dark at night, or which junctions flood after rain. You find out by getting hurt. We decided to fix that.',
  },
  {
    date: 'August 2026',
    title: 'The first build',
    text: 'The very first version of CivicEye \u2014 a shared map where anyone can report what\u2019s broken, dark, flooded or unsafe, and neighbours can verify it. Real logins, real reports, live on a map.',
  },
  {
    date: 'Ongoing',
    title: 'Campus & city rollout',
    text: 'Amrita Eye brings the same idea inside campuses \u2014 water leaks, broken lights, suspicious activity \u2014 straight to the people who keep the campus safe.',
  },
  {
    date: 'Next',
    title: 'The mission',
    text: 'Help anyone new to a place \u2014 students, freshers, new residents \u2014 and the people already living there, understand the neighbourhood before trouble finds them.',
  },
];

/** About page. */
export function About() {
  return (
    <div className="bg-[#FFF5F7] dark:bg-[#1A030A] min-h-screen">
      <section className="border-b border-[#A51636]/10 dark:border-[#E52B50]/10 pt-32 pb-24 sm:pb-32 bg-gradient-to-b from-[#FFF5F7] to-white dark:from-[#1A030A] dark:to-[#0D0105]">
        <motion.div 
          initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ type: 'spring', duration: 0.45, bounce: 0 }}
          className="mx-auto max-w-[1920px] px-6 sm:px-8 lg:px-12 xl:px-16"
        >
          <div className="mb-6 flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-[#A51636] dark:text-[#E52B50]">
            <span>About CivicEye</span>
          </div>
          <h1 className="max-w-4xl text-[56px] sm:text-[72px] font-bold leading-[1.05] tracking-[-0.03em] text-neutral-900 dark:text-white">
            <AnimatedText text="Know your" /> <span className="font-serif italic font-normal text-[#A51636] dark:text-[#E52B50]"><AnimatedText text="place" /></span> <AnimatedText text="before it bites" />
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-[1.6] text-neutral-600 dark:text-neutral-400">
            CivicEye is a shared, living map of what’s broken, dark, flooded or unsafe in your city and campus — reported and verified by the people who live it, so newcomers and locals alike know where they’re going.
          </p>
        </motion.div>
      </section>

      <section className="border-b border-[#A51636]/10 dark:border-[#E52B50]/10 py-20 bg-white dark:bg-[#0D0105]">
        <div className="mx-auto max-w-[1920px] px-5 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-24">
            <div>
              <div className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                Our story
              </div>
              <h2 className="mb-6 text-3xl font-semibold tracking-[-0.035em] text-neutral-900 dark:text-white sm:text-4xl">
                From a hostel room to a safer city
              </h2>
              <div className="space-y-6 text-base leading-7 text-neutral-500 dark:text-neutral-400">
                <p>
                  Every year, thousands of students move to a new city and spend four years there
                  knowing almost nothing about it. Where are the potholes that swallow bike wheels?
                  Which streets have no lights at night? Which junction floods every monsoon? The
                  answers exist — scattered across the memory of people who've lived there a long
                  time. Newcomers just don't have access to them.
                </p>
                <p>
                  CivicEye started in the hostel as exactly that missing knowledge — a place where
                  anyone can report what they see and neighbours can confirm it, so the whole map of
                  "what to avoid" and "what to fix" is built together, one report at a time.
                </p>
                <p>
                  It's for students and citizens who are new to a place, and for the people who live
                  nearby — so a broken street light or a pothole costs you a scare instead of an
                  accident, and a future headache turns into a fixed report.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161618] p-8 sm:p-12 text-center shadow-sm">
              <p className="text-2xl font-bold tracking-[-0.03em] text-neutral-900 dark:text-white">
                Made by students, for students
              </p>
              <p className="mt-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                and for anyone new to their neighbourhood
              </p>
              <div className="mt-10 grid grid-cols-3 gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
                {[
                  ['1 Aug', '2026'],
                  ['4 yrs', 'of college life'],
                  ['100%', 'community-built'],
                ].map(([v, l]) => (
                  <div key={l} className="bg-white dark:bg-[#161618] p-6">
                    <p className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">{v}</p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#A51636]/10 dark:border-[#E52B50]/10 py-20 bg-white dark:bg-[#0D0105]">
        <div className="mx-auto max-w-[1920px] px-5 sm:px-8 lg:px-12 xl:px-16">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
            What we believe
          </div>
          <h2 className="mb-16 text-3xl font-semibold tracking-[-0.035em] text-neutral-900 dark:text-white sm:text-4xl">
            The values behind the product
          </h2>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {VALUES.map((v) => (
              <motion.div variants={itemVariants} key={v.title} className="flex flex-col rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-[#F5F5F7] dark:bg-[#161618] p-8 shadow-sm">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-lg font-semibold tracking-[-0.02em] text-neutral-900 dark:text-white">{v.title}</h3>
                <p className="text-sm leading-[1.6] text-neutral-600 dark:text-neutral-400">{v.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="border-b border-[#A51636]/10 dark:border-[#E52B50]/10 py-20 bg-white dark:bg-[#0D0105]">
        <div className="mx-auto max-w-[1920px] px-5 sm:px-8 lg:px-12 xl:px-16">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
            Timeline
          </div>
          <h2 className="mb-12 text-3xl font-semibold tracking-[-0.035em] text-neutral-900 dark:text-white sm:text-4xl">
            How this started
          </h2>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="mx-auto max-w-4xl space-y-8"
          >
            {TIMELINE.map((t) => (
              <motion.div variants={itemVariants} key={t.date} className="flex flex-col sm:flex-row sm:gap-12 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161618] p-8 shadow-sm">
                <div className="mb-4 sm:mb-0 sm:w-1/3 shrink-0">
                  <div className="text-sm font-semibold uppercase tracking-widest text-[#A51636] dark:text-[#E52B50]">
                    {t.date}
                  </div>
                </div>
                <div>
                  <h3 className="mb-3 text-xl font-semibold tracking-[-0.02em] text-neutral-900 dark:text-white">
                    {t.title}
                  </h3>
                  <p className="text-sm leading-[1.6] text-neutral-600 dark:text-neutral-400">{t.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 sm:py-32 text-center bg-[#FFF5F7] dark:bg-[#1A030A]">
        <motion.div 
          initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ type: 'spring', duration: 0.45, bounce: 0 }}
          className="mx-auto max-w-4xl px-5"
        >
          <MapPin className="mx-auto mb-6 h-12 w-12 text-[#A51636] dark:text-[#E52B50]" />
          <h2 className="text-[32px] font-bold leading-[1.05] tracking-[-0.04em] text-neutral-900 dark:text-white sm:text-5xl">
            New to the <span className="font-serif italic font-normal text-[#A51636] dark:text-[#E52B50]">neighbourhood?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-neutral-500 dark:text-neutral-400">
            See what the people around you already know — and add what you spot. It takes under a minute.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/report"
              className="inline-flex h-12 items-center justify-center gap-3 rounded-full bg-[#A51636] px-8 text-sm font-bold text-white transition-opacity hover:opacity-90 dark:bg-[#E52B50]"
            >
              <Heart className="h-4 w-4" />
              Report an issue
            </Link>
            <Link
              to="/map"
              className="inline-flex h-12 items-center justify-center rounded-full border border-neutral-300 px-8 text-sm font-bold text-neutral-900 dark:text-white transition-opacity hover:opacity-80 dark:border-neutral-700 bg-white dark:bg-[#161618] shadow-sm"
            >
              View the map
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
