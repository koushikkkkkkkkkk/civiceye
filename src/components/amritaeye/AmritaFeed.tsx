import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryById } from '@/data/categories';
import type { Report, ReportStatus } from '@/types';

interface AmritaFeedProps {
  campusReports: Report[];
}

type FeedFilter = 'all' | 'pending' | 'resolved';

const FILTERS: Array<{ value: FeedFilter; label: string }> = [
  { value: 'all', label: 'All Reports' },
  { value: 'pending', label: 'Pending' },
  { value: 'resolved', label: 'Resolved' },
];

const STATUS_LABELS: Record<ReportStatus, string> = {
  pending: 'Pending',
  verified: 'Verified',
  'in-progress': 'In progress',
  resolved: 'Resolved',
  rejected: 'Rejected',
};

const STATUS_COLORS: Record<ReportStatus, string> = {
  pending: '#800020',
  verified: '#737373',
  'in-progress': '#64748b',
  resolved: '#171717',
  rejected: '#a3a3a3',
};

function StatusLight({ status }: { status: ReportStatus }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 10 10" className="h-2.5 w-2.5 shrink-0">
      <circle cx="5" cy="5" r="3.5" fill={STATUS_COLORS[status]} />
    </svg>
  );
}

function formatReportDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'Date unavailable';

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function AmritaFeed({ campusReports }: AmritaFeedProps) {
  const [activeFilter, setActiveFilter] = useState<FeedFilter>('all');

  const filteredReports = useMemo(() => {
    if (activeFilter === 'all') return campusReports;
    return campusReports.filter((report) => report.status === activeFilter);
  }, [activeFilter, campusReports]);

  const reportCounts = useMemo(
    () => ({
      all: campusReports.length,
      pending: campusReports.filter((report) => report.status === 'pending').length,
      resolved: campusReports.filter((report) => report.status === 'resolved').length,
    }),
    [campusReports],
  );

  return (
    <section
      aria-labelledby="campus-reports-title"
      className="border-b border-neutral-200 bg-white"
    >
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 xl:px-16">
        <div className="grid gap-8 border-b border-neutral-200 pb-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Public issue log
            </p>
            <h2
              id="campus-reports-title"
              className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-neutral-900 sm:text-4xl"
            >
              Campus reports
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-500 sm:text-base">
              Recent submissions from students and staff, with their current maintenance status.
            </p>
          </div>

          <div
            role="group"
            aria-label="Filter campus reports by status"
            className="flex items-center gap-6 overflow-x-auto lg:col-span-5 lg:justify-end"
          >
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveFilter(filter.value)}
                  aria-pressed={isActive}
                  className={`shrink-0 rounded-none border-b-2 pb-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-neutral-900 text-neutral-900'
                      : 'border-transparent text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  {filter.label}
                  <span className="ml-2 font-mono text-xs text-neutral-400">
                    {reportCounts[filter.value].toString().padStart(2, '0')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {filteredReports.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredReports.map((report) => {
              const category = categoryById(report.category);

              return (
                <article
                  key={report.id}
                  className="group flex min-w-0 flex-col rounded-md border border-neutral-200 bg-white transition-colors hover:border-neutral-400"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-t-md border-b border-neutral-200 bg-neutral-100">
                    <img
                      src={report.image}
                      alt={`Evidence for ${report.title}`}
                      loading="lazy"
                      className="h-full w-full object-cover grayscale-[20%] transition-[filter] duration-300 group-hover:grayscale-0"
                    />
                    <div className="absolute bottom-0 left-0 border-r border-t border-neutral-200 bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-600">
                      {category.short}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-mono text-[11px] text-neutral-400">
                        {report.code ?? `AMR-${report.id.slice(0, 6).toUpperCase()}`}
                      </span>
                      <span className="inline-flex items-center gap-2 text-xs font-medium text-neutral-600">
                        <StatusLight status={report.status} />
                        {STATUS_LABELS[report.status]}
                      </span>
                    </div>

                    <h3 className="mt-5 text-xl font-semibold leading-7 tracking-[-0.02em] text-neutral-900">
                      {report.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-500">
                      {report.description}
                    </p>

                    <div className="mt-6 flex items-start gap-2 border-t border-neutral-200 pt-4 text-sm leading-5 text-neutral-600">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        fill="none"
                        className="mt-0.5 h-4 w-4 shrink-0"
                      >
                        <path
                          d="M15.25 8.25c0 4-5.25 8-5.25 8s-5.25-4-5.25-8a5.25 5.25 0 1 1 10.5 0Z"
                          stroke="currentColor"
                          strokeWidth="1.4"
                        />
                        <circle
                          cx="10"
                          cy="8.25"
                          r="1.75"
                          stroke="currentColor"
                          strokeWidth="1.4"
                        />
                      </svg>
                      <span>{report.locationName}</span>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                      <time dateTime={report.date} className="text-xs text-neutral-400">
                        {formatReportDate(report.date)}
                      </time>
                      <Link
                        to={`/report/${report.id}`}
                        aria-label={`View report: ${report.title}`}
                        className="inline-flex items-center gap-2 rounded-none text-sm font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-4 transition-colors hover:decoration-neutral-900"
                      >
                        View report
                        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                          <path
                            d="M4 10h11m-4-4 4 4-4 4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="square"
                            strokeLinejoin="miter"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 flex min-h-56 flex-col items-start justify-center rounded-md border border-neutral-200 bg-[#f5f5f5] p-8 sm:p-10">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-6 w-6 text-neutral-400"
            >
              <path d="M5 7h14M5 12h9M5 17h6" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <h3 className="mt-5 text-lg font-semibold text-neutral-900">No reports in this view</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Select another status to return to the public issue log.
            </p>
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className="mt-5 rounded-none text-sm font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900"
            >
              Show all reports
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
