import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, MapPin, ThumbsUp, AlertCircle, LayoutGrid, List } from 'lucide-react';
import { CATEGORIES } from '@/data/categories';
import { useReports } from '@/hooks/useReports';
import type { CategoryId, Report, ReportStatus } from '@/types';

interface AmritaFeedProps {
  campusReports: Report[];
}

export function AmritaFeed({ campusReports }: AmritaFeedProps) {
  const { voteUp } = useReports();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [selectedStatus] = useState<ReportStatus | 'all'>('all');
  const [layoutMode, setLayoutMode] = useState<'list' | 'grid'>('list');

  const filteredReports = useMemo(() => {
    return campusReports.filter((r) => {
      const matchesSearch =
        searchQuery === '' ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || r.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [campusReports, searchQuery, selectedCategory, selectedStatus]);

  return (
    <section className="relative overflow-hidden bg-[#F5F5F7] dark:bg-[#181818] py-28 sm:py-36 border-b border-[#E5E5E5] dark:border-[#313131] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 space-y-12">
        
        {/* Bolder Section Header with Glass Search Bar & Layout Controls */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="space-y-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#A51636] dark:text-[#E52B50] backdrop-blur-xl"
            >
              <Sparkles className="h-4 w-4" /> Live Incident Stream
            </motion.div>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#1D1D1F] dark:text-white leading-[1.05]">
              Active Campus Reports
            </h2>
            <p className="text-lg sm:text-xl font-semibold text-[#A51636] dark:text-[#E52B50] leading-snug tracking-normal">
              Browse, confirm, and track infrastructure issues across campus
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Frosted Glass Search Bar */}
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search campus issues..."
                className="w-full rounded-2xl border border-white/60 dark:border-white/15 bg-white/70 dark:bg-white/[0.06] pl-12 pr-5 py-4 text-sm font-semibold text-[#1D1D1F] dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 backdrop-blur-2xl transition-all shadow-lg focus:border-[#A51636] dark:focus:border-[#E52B50] focus:outline-none focus:ring-2 focus:ring-[#A51636]/20"
              />
            </div>

            {/* Impeccable Animated Layout Mode Toggle */}
            <div className="flex items-center rounded-2xl border border-white/60 dark:border-white/15 bg-white/60 dark:bg-white/[0.06] p-2 backdrop-blur-2xl shadow-lg">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setLayoutMode('list')}
                className={`rounded-xl p-3 transition-all ${
                  layoutMode === 'list'
                    ? 'bg-[#A51636] dark:bg-[#C81D42] text-white shadow-md'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-[#1D1D1F] dark:hover:text-white'
                }`}
                title="Linear magazine layout"
                aria-label="Linear magazine layout"
              >
                <List className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setLayoutMode('grid')}
                className={`rounded-xl p-3 transition-all ${
                  layoutMode === 'grid'
                    ? 'bg-[#A51636] dark:bg-[#C81D42] text-white shadow-md'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-[#1D1D1F] dark:hover:text-white'
                }`}
                title="2-Column grid layout"
                aria-label="2-Column grid layout"
              >
                <LayoutGrid className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Category Filter Pills (Animated Framer Motion Buttons) */}
        <div
          role="group"
          aria-label="Filter campus reports by category"
          className="flex flex-wrap items-center gap-4"
        >
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory('all')}
            className={`rounded-2xl px-6 py-3.5 text-sm font-bold tracking-tight transition-all duration-300 backdrop-blur-xl focus-visible:outline-none ${
              selectedCategory === 'all'
                ? 'bg-[#A51636] dark:bg-[#C81D42] text-white shadow-lg shadow-[#A51636]/30 dark:shadow-rose-950/80 scale-105'
                : 'border border-white/60 dark:border-white/15 bg-white/60 dark:bg-white/[0.06] text-[#1D1D1F] dark:text-white hover:bg-white/90 dark:hover:bg-white/15'
            }`}
          >
            All Categories ({campusReports.length})
          </motion.button>
          {CATEGORIES.map((cat) => {
            const count = campusReports.filter((r) => r.category === cat.id).length;
            if (count === 0 && selectedCategory !== cat.id) return null;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-2xl px-6 py-3.5 text-sm font-bold tracking-tight transition-all duration-300 backdrop-blur-xl focus-visible:outline-none ${
                  selectedCategory === cat.id
                    ? 'bg-[#A51636] dark:bg-[#C81D42] text-white shadow-lg shadow-[#A51636]/30 dark:shadow-rose-950/80 scale-105'
                    : 'border border-white/60 dark:border-white/15 bg-white/60 dark:bg-white/[0.06] text-[#1D1D1F] dark:text-white hover:bg-white/90 dark:hover:bg-white/15'
                }`}
              >
                {cat.label} ({count})
              </motion.button>
            );
          })}
        </div>

        {/* Dynamic Glassmorphic Card Feed (AnimatePresence Layout Animations) */}
        {filteredReports.length > 0 ? (
          <motion.div
            layout
            className={
              layoutMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 gap-8'
                : 'space-y-6'
            }
          >
            <AnimatePresence mode="popLayout">
              {filteredReports.map((report, idx) => {
                const categoryMeta = CATEGORIES.find((c) => c.id === report.category);

                return (
                  <motion.div
                    key={report.id}
                    layout
                    initial={{ opacity: 0, y: 24, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    transition={{
                      duration: 0.4,
                      delay: Math.min(idx * 0.06, 0.3),
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{ y: -6, transition: { duration: 0.25 } }}
                    className={`glass-card glass-card-hover group flex flex-col p-6 sm:p-8 ${
                      layoutMode === 'list' ? 'sm:flex-row gap-6 items-stretch' : 'gap-6 items-start'
                    }`}
                  >
                    {/* Thumbnail Image with Glass Overlay */}
                    <div
                      className={`relative shrink-0 overflow-hidden rounded-2xl bg-black/10 dark:bg-white/5 border border-white/20 dark:border-white/10 shadow-inner ${
                        layoutMode === 'list' ? 'h-56 w-full sm:w-72' : 'h-64 w-full'
                      }`}
                    >
                      <img
                        src={report.image}
                        alt={report.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="rounded-xl px-3.5 py-1 text-xs font-black uppercase tracking-wider border border-white/40 bg-black/50 text-white backdrop-blur-md shadow-md">
                          {report.status}
                        </span>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="flex flex-1 flex-col justify-between h-full w-full space-y-4 py-1">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="rounded-xl bg-[#A51636]/15 dark:bg-[#E52B50]/20 border border-[#A51636]/30 dark:border-[#E52B50]/40 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#A51636] dark:text-[#E52B50] backdrop-blur-md">
                            {categoryMeta?.label || report.category}
                          </span>
                          {report.verified && (
                            <span className="rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 backdrop-blur-md">
                              ✓ Verified
                            </span>
                          )}
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-black tracking-wide text-[#1D1D1F] dark:text-white leading-tight transition-colors group-hover:text-[#A51636] dark:group-hover:text-[#E52B50]">
                          {report.title}
                        </h3>
                        <p className="text-base font-medium text-slate-700 dark:text-zinc-300 leading-relaxed line-clamp-2">
                          {report.description}
                        </p>
                      </div>

                      {/* Location & Upvotes Glass Footer */}
                      <div className="flex items-center justify-between border-t border-black/10 dark:border-white/10 pt-4 text-sm font-semibold text-slate-600 dark:text-zinc-400">
                        <span className="flex items-center gap-2 truncate max-w-[240px]">
                          <MapPin className="h-4 w-4 text-[#A51636] dark:text-[#E52B50] shrink-0" />
                          <span className="truncate font-bold text-slate-800 dark:text-zinc-200">{report.locationName}</span>
                        </span>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => voteUp(report.id)}
                          className="flex items-center gap-2.5 rounded-full border border-white/50 dark:border-white/20 bg-white/70 dark:bg-white/10 px-5 py-2.5 text-sm font-extrabold text-[#1D1D1F] dark:text-white backdrop-blur-xl shadow-md transition-all hover:bg-[#A51636] hover:text-white hover:border-[#A51636] dark:hover:bg-[#C81D42] dark:hover:border-[#C81D42]"
                          aria-label={`Upvote report ${report.title}`}
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span>{report.upvotes} Upvotes</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty Feed Glass Card View with Entrance Animation */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card flex flex-col items-center justify-center p-16 text-center space-y-4"
          >
            <AlertCircle className="h-12 w-12 text-[#A51636] dark:text-[#E52B50]" />
            <h3 className="text-2xl font-extrabold text-[#1D1D1F] dark:text-white">No campus reports found</h3>
            <p className="text-base font-normal text-slate-600 dark:text-zinc-400 max-w-sm">
              Try searching for a different keyword or resetting your category filters.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="rounded-full bg-[#A51636] dark:bg-[#C81D42] px-8 py-3 text-base font-extrabold text-white shadow-lg shadow-[#A51636]/30 transition-all hover:bg-[#8c122d]"
            >
              Reset Filters
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
