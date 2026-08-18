import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, ListFilter, X } from 'lucide-react';
import type { CategoryId, Coordinates, ReportStatus, Severity, ScopeFilter } from '@/types';
import { useReports } from '@/hooks/useReports';
import { useBrand } from '@/hooks/useBrand';
import { useDebounce } from '@/hooks/useDebounce';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { MapView } from '@/components/map/MapView';
import { SearchBar } from '@/components/SearchBar';
import { FilterBar } from '@/components/FilterBar';
import { Drawer } from '@/components/Drawer';
import { SEVERITY_META, STATUS_META } from '@/data/categories';
import { cn } from '@/utils/cn';

interface MapFilters {
  categories: CategoryId[];
  severities: Severity[];
  status: ReportStatus[];
  verifiedOnly: boolean;
  search: string;
  scope: ScopeFilter;
}

const DEFAULT_FILTERS: MapFilters = {
  categories: [],
  severities: [],
  status: [],
  verifiedOnly: false,
  search: '',
  scope: 'all',
};

const ALL = (list: unknown[]) => list.length === 0;

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)", 
    transition: { type: "spring", duration: 0.4, bounce: 0 } 
  }
};

export function MapPage() {
  const { reports } = useReports();
  const { isAmrita } = useBrand();
  const [filters, setFilters] = useLocalStorage<MapFilters>('civiceye:map-filters', {
    ...DEFAULT_FILTERS,
    scope: isAmrita ? 'campus' : 'city',
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [heatmap, setHeatmap] = useLocalStorage<boolean>('civiceye:map-heatmap', false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState<{ center: Coordinates; zoom: number }>({
    center: { lat: 12.9716, lng: 77.5946 },
    zoom: 12,
  });

  const debouncedSearch = useDebounce(filters.search, 250);

  const visibleReports = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    return reports.filter((r) => {
      if (filters.scope !== 'all' && r.scope !== filters.scope) return false;
      if (!ALL(filters.categories) && !filters.categories.includes(r.category)) return false;
      if (!ALL(filters.severities) && !filters.severities.includes(r.severity)) return false;
      if (!ALL(filters.status) && !filters.status.includes(r.status)) return false;
      if (filters.verifiedOnly && !r.verified) return false;
      if (q) {
        const haystack =
          `${r.title} ${r.description} ${r.locationName} ${r.author} ${r.id}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [reports, filters, debouncedSearch]);

  useEffect(() => {
    if (selectedId && !visibleReports.some((r) => r.id === selectedId)) setSelectedId(null);
  }, [visibleReports, selectedId]);

  useEffect(() => {
    if (!selectedId) return;
    const report = reports.find((r) => r.id === selectedId || r.code === selectedId);
    if (report) {
      setView({ center: report.coordinates, zoom: 16 });
    }
  }, [selectedId, reports]);

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.severities.length > 0 ||
    filters.status.length > 0 ||
    filters.verifiedOnly ||
    filters.search.trim().length > 0 ||
    filters.scope !== (isAmrita ? 'campus' : 'city');

  return (
    <div className="relative h-screen w-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden font-sans">
      
      {/* Full Bleed Map Background */}
      <div className="absolute inset-0">
        <MapView
          reports={visibleReports}
          selectedId={selectedId}
          onSelect={setSelectedId}
          center={view.center}
          zoom={view.zoom}
          heatmap={heatmap}
        />
      </div>

      {/* Floating Sidebar Container */}
      <motion.aside
        initial={{ x: -40, opacity: 0, filter: "blur(8px)" }}
        animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{ type: 'spring', duration: 0.6, bounce: 0 }}
        className="pointer-events-none absolute inset-y-0 left-0 z-40 flex w-full flex-col px-4 pb-6 pt-24 sm:w-[420px] lg:px-6"
      >
        
        {/* Main Glass Panel */}
        <div className="pointer-events-auto flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white/90 shadow-2xl backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 dark:bg-black/80">
          
          {/* Header & Search */}
          <div className="flex-none border-b border-neutral-200/50 dark:border-neutral-800/50 p-6">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-[14px] font-bold uppercase tracking-widest text-[#A51636] dark:text-[#E52B50]">Map View</span>
              {hasActiveFilters && (
                <button
                  onClick={() => setFilters({ ...DEFAULT_FILTERS, scope: isAmrita ? 'campus' : 'city' })}
                  className="text-xs font-semibold text-neutral-900 hover:text-neutral-600 dark:text-white dark:hover:text-neutral-300"
                >
                  Clear filters
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <SearchBar
                  value={filters.search}
                  onChange={(search) => setFilters((f) => ({ ...f, search }))}
                  placeholder="Search locations..."
                />
              </div>
              <button
                onClick={() => setFiltersOpen(true)}
                aria-label="Filters"
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl border transition-all active:scale-95',
                  hasActiveFilters
                    ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-transparent dark:text-neutral-300 dark:hover:bg-neutral-900'
                )}
              >
                <ListFilter className="h-5 w-5" />
                {hasActiveFilters && (
                  <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[#A51636] ring-2 ring-white dark:ring-black dark:bg-[#E52B50]" />
                )}
              </button>
            </div>
          </div>

          {/* Report List */}
          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            {visibleReports.length === 0 ? (
              <div className="mt-8 flex flex-col items-center justify-center p-8 text-center">
                <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3">
                  <X className="h-5 w-5 text-neutral-400" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">No reports found</h3>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Try adjusting your filters or zooming out.</p>
              </div>
            ) : (
              <motion.div variants={listVariants} initial="hidden" animate="visible" className="space-y-2">
                {visibleReports.map((report) => {
                  const isSelected = selectedId === report.id;
                  const severity = SEVERITY_META[report.severity];
                  return (
                    <motion.button
                      variants={cardVariants}
                      key={report.id}
                      onClick={() => setSelectedId(isSelected ? null : report.id)}
                      className={cn(
                        'w-full rounded-2xl p-5 text-left transition-all active:scale-[0.98]',
                        isSelected
                          ? 'bg-[#A51636] text-white shadow-xl dark:bg-[#E52B50]'
                          : 'bg-transparent hover:bg-[#F5F5F7] dark:hover:bg-[#161618]'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn('mt-1 h-2.5 w-2.5 shrink-0 rounded-full', severity.dot)} />
                        <div className="min-w-0 flex-1">
                          <p className={cn('truncate text-sm font-bold', isSelected ? 'text-inherit' : 'text-neutral-900 dark:text-white')}>
                            {report.title}
                          </p>
                          <p className={cn('mt-0.5 truncate text-xs', isSelected ? 'opacity-80' : 'text-neutral-500 dark:text-neutral-400')}>
                            {report.locationName}
                          </p>
                          <div className="mt-2.5 flex items-center gap-2">
                            <span className={cn(
                              'inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                              isSelected ? 'bg-white/20 text-white dark:bg-black/20 dark:text-white' : 'bg-[#F5F5F7] text-neutral-600 dark:bg-[#161618] dark:text-neutral-300'
                            )}>
                              {STATUS_META[report.status].label}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Floating Map Controls (Right Side) */}
      <motion.div
        initial={{ x: 40, opacity: 0, filter: "blur(8px)" }}
        animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{ type: 'spring', duration: 0.6, bounce: 0, delay: 0.1 }}
        className="pointer-events-none absolute right-4 top-24 z-40 flex flex-col items-end gap-3 lg:right-6"
      >
        <button
          onClick={() => setHeatmap(!heatmap)}
          className={cn(
            'pointer-events-auto flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold shadow-sm backdrop-blur-md transition-transform active:scale-95 border',
            heatmap
              ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black'
              : 'border-neutral-200/50 bg-white/90 text-neutral-900 hover:bg-white dark:border-neutral-800/50 dark:bg-black/90 dark:text-white dark:hover:bg-black'
          )}
        >
          <Layers className="h-4 w-4" />
          {heatmap ? 'Heatmap' : 'Markers'}
        </button>

        {!heatmap && (
          <div className="pointer-events-auto mt-2 w-40 rounded-xl border border-neutral-200/50 bg-white/90 p-4 shadow-sm backdrop-blur-md dark:border-neutral-800/50 dark:bg-black/90">
            <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              Severity
            </h3>
            <div className="space-y-2.5">
              {Object.entries(SEVERITY_META).map(([key, sev]) => (
                <div key={key} className="flex items-center gap-2 text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                  <span className={cn('h-2.5 w-2.5 rounded-full', sev.dot)} />
                  {sev.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <Drawer open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters">
        <div className="p-5">
          <FilterBar filters={filters} onChange={(f) => setFilters(f)} />
        </div>
      </Drawer>
    </div>
  );
}
