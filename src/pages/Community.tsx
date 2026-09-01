import { AnimatedText } from '@/components/ui/AnimatedText';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownUp, ArrowUpDown, Inbox, ListFilter } from 'lucide-react';
import type { CategoryId, Report, ReportStatus, Severity, SortKey, ScopeFilter } from '@/types';
import { useReports } from '@/hooks/useReports';
import { useBrand } from '@/hooks/useBrand';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchBar } from '@/components/SearchBar';
import { FilterBar } from '@/components/FilterBar';
import { ReportCard } from '@/components/ReportCard';
import { Drawer } from '@/components/Drawer';
import { Skeleton } from '@/components/Skeleton';
import { SEVERITY_META } from '@/data/categories';

interface CommunityFilters {
  categories: CategoryId[];
  severities: Severity[];
  status: ReportStatus[];
  verifiedOnly: boolean;
  search: string;
  scope: ScopeFilter;
}

const DEFAULT_FILTERS: CommunityFilters = {
  categories: [],
  severities: [],
  status: [],
  verifiedOnly: false,
  search: '',
  scope: 'all',
};

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'newest', label: 'Newest first' },
  { key: 'oldest', label: 'Oldest first' },
  { key: 'votes', label: 'Most votes' },
  { key: 'confirms', label: 'Most confirmed' },
  { key: 'severity', label: 'Most severe' },
];

const PAGE_SIZE = 9;

function sortReports(list: Report[], sort: SortKey): Report[] {
  const copy = [...list];
  switch (sort) {
    case 'newest':
      return copy.sort((a, b) => (a.date < b.date ? 1 : -1));
    case 'oldest':
      return copy.sort((a, b) => (a.date > b.date ? 1 : -1));
    case 'votes':
      return copy.sort((a, b) => b.votes - a.votes);
    case 'confirms':
      return copy.sort((a, b) => b.confirms - a.confirms);
    case 'severity':
      return copy.sort(
        (a, b) => SEVERITY_META[b.severity].weight - SEVERITY_META[a.severity].weight,
      );
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)", 
    transition: { type: "spring", duration: 0.45, bounce: 0 } 
  }
};

/** Community reports feed: search, filter, sort, paginate. */
export function Community() {
  const { reports, loading } = useReports();
  const { isAmrita } = useBrand();
  const [filters, setFilters] = useState<CommunityFilters>({
    ...DEFAULT_FILTERS,
    scope: isAmrita ? 'campus' : 'city',
  });
  const [sort, setSort] = useState<SortKey>('newest');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const debouncedSearch = useDebounce(filters.search, 250);

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    return reports.filter((r) => {
      if (filters.scope !== 'all' && r.scope !== filters.scope) return false;
      if (filters.categories.length && !filters.categories.includes(r.category)) return false;
      if (filters.severities.length && !filters.severities.includes(r.severity)) return false;
      if (filters.status.length && !filters.status.includes(r.status)) return false;
      if (filters.verifiedOnly && !r.verified) return false;
      if (q) {
        const haystack = `${r.title} ${r.description} ${r.locationName} ${r.author}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [reports, filters, debouncedSearch]);

  const sorted = useMemo(() => sortReports(filtered, sort), [filtered, sort]);
  const page = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  const resetPagination = () => setVisibleCount(PAGE_SIZE);

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
            <span>Community</span>
          </div>
          <h1 className="max-w-4xl text-[56px] sm:text-[72px] font-bold leading-[1.05] tracking-[-0.03em] text-neutral-900 dark:text-white">
            <AnimatedText text="Reports from your" /> <span className="font-serif italic font-normal text-[#A51636] dark:text-[#E52B50]"><AnimatedText text="neighbours" /></span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-[1.6] text-neutral-600 dark:text-neutral-400">
            Every report below is citizen-submitted and community-validated. Search, filter and vote — the numbers decide what gets fixed first.
          </p>
        </motion.div>
      </section>

      <section className="py-14 sm:py-20 bg-white dark:bg-[#0D0105]">
        <div className="mx-auto max-w-[1920px] px-5 sm:px-8 lg:px-12 xl:px-16">
          {/* Controls */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center border-b border-neutral-200 dark:border-white/10 dark:border-white/10 pb-8">
            <SearchBar
              value={filters.search}
              onChange={(search) => {
                setFilters((f) => ({ ...f, search }));
                resetPagination();
              }}
              placeholder="Search reports, areas, categories\u2026"
              className="flex-1"
            />
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:flex-none">
                <ArrowDownUp className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -tranneutral-y-1/2 text-neutral-400" />
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value as SortKey);
                    resetPagination();
                  }}
                  aria-label="Sort reports"
                  className="w-full appearance-none rounded-md border border-neutral-300  py-3 pl-10 pr-10 text-sm font-semibold text-neutral-900 dark:text-white focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 sm:w-48"
                >
                  {SORTS.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500 dark:text-neutral-400">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                  </svg>
                </div>
              </div>
              <button
                onClick={() => setFiltersOpen(true)}
                className="flex h-[46px] items-center gap-2 rounded-md border border-neutral-300  px-4 text-sm font-semibold text-neutral-900 dark:text-white lg:hidden"
                aria-label="Open filters"
              >
                <ListFilter className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Desktop filter bar */}
          <div className="mb-12 hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-[#F5F5F7]/50 dark:bg-[#161618] p-8 shadow-sm lg:block">
            <FilterBar
              filters={filters}
              onChange={(f) => {
                setFilters(f);
                resetPagination();
              }}
            />
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} card />
              ))}
            </div>
          ) : page.length === 0 ? (
            <div className="mt-8 flex min-h-56 flex-col items-center justify-center rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-[#F5F5F7] dark:bg-[#161618] p-8 text-center shadow-sm sm:p-12">
              <Inbox className="mb-4 h-12 w-12 text-neutral-400" />
              <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-neutral-900 dark:text-white">
                No reports found
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-[1.6] text-neutral-500 dark:text-neutral-400">
                Nothing matches your search and filters right now. Try clearing them, or be the first to report in this area.
              </p>
              <button
                onClick={() => {
                  setFilters({ ...DEFAULT_FILTERS, scope: isAmrita ? 'campus' : 'city' });
                  resetPagination();
                }}
                className="mt-6 inline-flex h-12 items-center justify-center rounded-full border border-neutral-300 px-8 text-sm font-bold text-neutral-900 dark:text-white transition-opacity hover:opacity-80 dark:border-neutral-700 bg-white dark:bg-[#111113] shadow-sm"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <motion.div 
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                {page.map((report, i) => (
                  <motion.div variants={itemVariants} key={report.id}>
                    <ReportCard report={report} index={i} />
                  </motion.div>
                ))}
              </motion.div>

              {hasMore ? (
                <div className="mt-16 text-center">
                  <button
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-neutral-300 px-8 text-sm font-bold text-neutral-900 dark:text-white transition-opacity hover:opacity-80 dark:border-neutral-700 bg-white dark:bg-[#161618] shadow-sm"
                  >
                    <ArrowUpDown className="h-4 w-4 rotate-90" />
                    Load more ({sorted.length - visibleCount} remaining)
                  </button>
                </div>
              ) : (
                <p className="mt-12 text-center text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Showing all {sorted.length} matching report{sorted.length === 1 ? '' : 's'}
                </p>
              )}
            </>
          )}
        </div>
      </section>

      {/* Mobile filters drawer */}
      <Drawer open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters">
        <div className="p-5">
          <FilterBar
            filters={filters}
            onChange={(f) => {
              setFilters(f);
              resetPagination();
            }}
          />
        </div>
      </Drawer>
    </div>
  );
}

