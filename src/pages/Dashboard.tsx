import { AnimatedText } from '@/components/ui/AnimatedText';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileDown,
  Inbox,
  Map as MapIcon,
  RefreshCcw,
  ShieldCheck,
  Wrench,
  XCircle,
} from 'lucide-react';
import type { Report, Severity } from '@/types';
import { useReports } from '@/hooks/useReports';
import { useBrand } from '@/hooks/useBrand';
import { useToast } from '@/hooks/useToast';
import { useNotifications } from '@/hooks/useNotifications';
import { ReportToAuthority } from '@/components/ReportToAuthority';
import { MapView } from '@/components/map/MapView';
import { CATEGORIES, SEVERITY_META, STATUS_META, categoryById } from '@/data/categories';
import { authoritiesForScope, authorityById } from '@/data/authorities';
import { formatDate, timeAgo } from '@/utils/format';
import { downloadTextFile } from '@/utils/download';
import { cn } from '@/utils/cn';

const SEVERITY_HEX: Record<Severity, string> = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#f97316',
  critical: '#f43f5e',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
  visible: { 
    opacity: 1, 
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', duration: 0.45, bounce: 0 }
  },
};

export function Dashboard() {
  const { reports, loading, markResolved, assignToAuthority, rejectAsAuthority, refresh } =
    useReports();
  const { isAmrita } = useBrand();
  const toast = useToast();
  const notifications = useNotifications();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const scopedReports = useMemo(
    () => reports.filter((r) => r.scope === (isAmrita ? 'campus' : 'city')),
    [reports, isAmrita],
  );

  const stats = useMemo(() => {
    const open = scopedReports.filter((r) => r.status === 'pending' || r.status === 'in-progress').length;
    const resolved = scopedReports.filter((r) => r.status === 'resolved').length;
    const pending = scopedReports.filter((r) => r.status === 'pending').length;
    const verified = scopedReports.filter((r) => r.verified).length;
    const critical = scopedReports.filter((r) => r.severity === 'critical').length;
    return { open, resolved, pending, verified, critical };
  }, [scopedReports]);

  const categoryBreakdown = useMemo(
    () =>
      CATEGORIES.map((c) => ({
        category: c,
        count: scopedReports.filter((r) => r.category === c.id).length,
      }))
        .filter((c) => c.count > 0)
        .sort((a, b) => b.count - a.count),
    [scopedReports],
  );

  const severityBreakdown = useMemo(
    () =>
      (Object.keys(SEVERITY_META) as Severity[]).map((s) => ({
        severity: s,
        count: scopedReports.filter((r) => r.severity === s).length,
      })),
    [scopedReports],
  );

  const weeklyTrend = useMemo(() => {
    const weeks: { label: string; count: number }[] = [];
    const now = Date.now();
    for (let w = 7; w >= 0; w--) {
      const end = now - (w - 1) * 7 * 86400000;
      const start = now - w * 7 * 86400000;
      const count = scopedReports.filter((r) => {
        const t = new Date(r.date).getTime();
        return t >= start && t < end;
      }).length;
      weeks.push({
        label: new Date(start).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        count,
      });
    }
    return weeks;
  }, [scopedReports]);

  const topAreas = useMemo(() => {
    const map = new Map<string, { count: number; critical: number }>();
    for (const r of scopedReports) {
      const area = r.locationName;
      const entry = map.get(area) ?? { count: 0, critical: 0 };
      entry.count += 1;
      if (r.severity === 'critical') entry.critical += 1;
      map.set(area, entry);
    }
    return [...map.entries()]
      .map(([area, v]) => ({ area, ...v }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [scopedReports]);

  const recent = useMemo(
    () => [...scopedReports].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 10),
    [scopedReports],
  );

  const generateReport = () => {
    const lines: string[] = [
      '=================================================================',
      '  CIVICEYE \u2014 WARD OFFICE REPORT (PROTOTYPE)',
      '  Generated: ' + new Date().toLocaleString('en-IN'),
      '=================================================================',
      '',
      `Total reports tracked: ${reports.length}`,
      `  Open / in progress : ${stats.open}`,
      `  Pending review     : ${stats.pending}`,
      `  Verified           : ${stats.verified}`,
      `  Resolved           : ${stats.resolved}`,
      `  Critical severity  : ${stats.critical}`,
      '',
      '-----------------------------------------------------------------',
      ' TOP CATEGORIES',
      '-----------------------------------------------------------------',
      ...categoryBreakdown.map(
        (c) => `  ${c.category.label.padEnd(22)} ${String(c.count).padStart(3)}`,
      ),
      '',
      '-----------------------------------------------------------------',
      ' HIGH-PRIORITY OPEN REPORTS',
      '-----------------------------------------------------------------',
      ...reports
        .filter((r) => r.status !== 'resolved' && r.severity !== 'low')
        .slice(0, 15)
        .map(
          (r) =>
            `  [${r.id}] ${r.title} \u2014 ${r.locationName} (${SEVERITY_META[r.severity].label}, ${STATUS_META[r.status].label}, reported ${formatDate(r.date)})`,
        ),
      '',
      '=================================================================',
      '  This report was generated from the CivicEye prototype.',
      '  All data is simulated for demonstration purposes.',
      '=================================================================',
    ];
    downloadTextFile(
      `civiceye-ward-report-${new Date().toISOString().slice(0, 10)}.txt`,
      lines.join('\n'),
    );
    toast.success('Report generated', 'Ward report downloaded as a text file.');
  };

  const handleResolve = (r: Report) => {
    void markResolved(r.id).then(() => {
      toast.success('Marked as resolved', `${r.id} is now Resolved.`);
      notifications.add({
        type: 'resolve',
        title: 'Issue resolved',
        message: `\u201c${r.title}\u201d was marked resolved.`,
      });
    });
  };

  const handleAssign = (r: Report, authorityId: string) => {
    void assignToAuthority(r.id, authorityId).then(() => {
      const a = authorityById(authorityId);
      toast.info('Assigned', `${r.id} \u2192 ${a?.name ?? authorityId}`);
      notifications.add({
        type: 'report',
        title: 'Report assigned',
        message: `\u201c${r.title}\u201d was assigned to ${a?.name ?? 'an agency'}.`,
      });
    });
  };

  const maxCategory = Math.max(1, ...categoryBreakdown.map((c) => c.count));
  const totalSeverity = Math.max(
    1,
    severityBreakdown.reduce((s, x) => s + x.count, 0),
  );
  const maxTrend = Math.max(1, ...weeklyTrend.map((w) => w.count));

  return (
    <div className="bg-[#FFF5F7] dark:bg-[#1A030A] min-h-screen">
      <section className="border-b border-[#A51636]/10 dark:border-[#E52B50]/10 pt-32 pb-24 sm:pb-36 bg-gradient-to-b from-[#FFF5F7] to-white dark:from-[#1A030A] dark:to-[#0D0105]">
        <div className="mx-auto max-w-[1920px] px-6 sm:px-8 lg:px-12 xl:px-16">
          <motion.div 
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ type: 'spring', duration: 0.45, bounce: 0 }}
            className="flex flex-col justify-between gap-12 lg:flex-row lg:items-end"
          >
            <div>
              <div className="mb-6 flex items-center gap-3 text-[14px] font-semibold uppercase tracking-widest text-[#A51636] dark:text-[#E52B50]">
                <span>Authorities · Prototype</span>
              </div>
              <h1 className="text-[56px] sm:text-[64px] font-bold leading-[1.05] tracking-[-0.03em] text-neutral-900 dark:text-white max-w-4xl">
                <AnimatedText text="Ward Operations " /> <span className="font-serif italic font-normal text-[#A51636] dark:text-[#E52B50]"><AnimatedText text="Dashboard" /></span>
              </h1>
              <p className="mt-6 max-w-2xl text-[16px] leading-[1.5] text-neutral-600 dark:text-neutral-400">
                A live view of every citizen report in your jurisdiction — prioritised, verified and
                ready to act on.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <ReportToAuthority
                subject="the selected ward package"
                label="Report to authority"
                variant="primary"
              />
              <button onClick={generateReport} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-neutral-300 px-6 text-[14px] font-semibold text-neutral-900 dark:text-white transition-opacity hover:opacity-80 dark:border-neutral-700 bg-white dark:bg-[#161618] shadow-sm">
                <FileDown className="h-4 w-4" />
                Generate report
              </button>
              <button
                onClick={() =>
                  void refresh().then(() => toast.info('Refreshed', 'Loaded the latest reports.'))
                }
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-neutral-300 text-neutral-900 dark:text-white transition-opacity hover:opacity-80 dark:border-neutral-700 bg-white dark:bg-[#161618] shadow-sm"
                title="Refresh data"
              >
                <RefreshCcw className="h-4 w-4" />
              </button>
            </div>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-20 grid grid-cols-2 gap-px bg-neutral-200 dark:bg-neutral-800 rounded-2xl overflow-hidden lg:grid-cols-4"
          >
            {loading ? (
              Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="bg-white dark:bg-[#161618] p-8">
                  <div className="h-4 w-24 bg-neutral-100 dark:bg-neutral-800 rounded mb-4" />
                  <div className="h-10 w-16 bg-neutral-100 dark:bg-neutral-800 rounded" />
                </div>
              ))
            ) : (
              <>
                <motion.div variants={itemVariants} className="bg-white dark:bg-[#161618] p-8 flex flex-col justify-center items-center text-center">
                  <div className="flex flex-col items-center gap-3 text-[12px] font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-4">
                    <ClipboardList className="h-5 w-5 text-neutral-900 dark:text-white" />
                    <span>Open reports</span>
                  </div>
                  <div className="text-[40px] font-bold leading-[1.2] tracking-tight text-neutral-900 dark:text-white tabular-nums">
                    {stats.open}
                  </div>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-white dark:bg-[#161618] p-8 flex flex-col justify-center items-center text-center">
                  <div className="flex flex-col items-center gap-3 text-[12px] font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-4">
                    <Clock className="h-5 w-5 text-neutral-900 dark:text-white" />
                    <span>Pending review</span>
                  </div>
                  <div className="text-[40px] font-bold leading-[1.2] tracking-tight text-neutral-900 dark:text-white tabular-nums">
                    {stats.pending}
                  </div>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-white dark:bg-[#161618] p-8 flex flex-col justify-center items-center text-center">
                  <div className="flex flex-col items-center gap-3 text-[12px] font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-4">
                    <ShieldCheck className="h-5 w-5 text-neutral-900 dark:text-white" />
                    <span>Verified</span>
                  </div>
                  <div className="text-[40px] font-bold leading-[1.2] tracking-tight text-neutral-900 dark:text-white tabular-nums">
                    {stats.verified}
                  </div>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-white dark:bg-[#161618] p-8 flex flex-col justify-center items-center text-center">
                  <div className="flex flex-col items-center gap-3 text-[12px] font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-4">
                    <CheckCircle2 className="h-5 w-5 text-[#A51636] dark:text-[#E52B50]" />
                    <span className="text-[#A51636] dark:text-[#E52B50]">Resolved</span>
                  </div>
                  <div className="text-[40px] font-bold leading-[1.2] tracking-tight text-[#A51636] dark:text-[#E52B50] tabular-nums">
                    {stats.resolved}
                  </div>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-white dark:bg-[#0D0105]">
        <div className="mx-auto max-w-[1920px] px-6 sm:px-8 lg:px-12 xl:px-16 space-y-12">
          
          {/* Charts Row */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid gap-8 lg:grid-cols-3"
          >
            <motion.div variants={itemVariants} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161618] shadow-sm p-8 flex flex-col">
              <h2 className="text-[20px] sm:text-[24px] font-semibold tracking-[-0.02em] text-neutral-900 dark:text-white leading-[1.3]">Category breakdown</h2>
              <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">Open reports by category</p>
              <ul className="mt-8 space-y-5">
                {categoryBreakdown.slice(0, 8).map((c) => (
                  <li key={c.category.id}>
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {c.category.label}
                      </span>
                      <span className="tabular-nums font-semibold text-neutral-500 dark:text-neutral-400">{c.count}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-sm bg-white dark:bg-[#111113]">
                      <div
                        style={{ width: `${(c.count / maxCategory) * 100}%` }}
                        className="h-full bg-neutral-900"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={itemVariants} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161618] shadow-sm p-8 flex flex-col">
              <h2 className="text-[20px] sm:text-[24px] font-semibold tracking-[-0.02em] text-neutral-900 dark:text-white leading-[1.3]">Severity distribution</h2>
              <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">Risk-weighted view of the ward</p>
              <div className="mt-8 flex flex-col items-center gap-8 sm:flex-row sm:justify-center">
                <div className="relative h-40 w-40 shrink-0">
                  <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      strokeWidth="14"
                      className="stroke-neutral-100"
                    />
                    {(() => {
                      let offset = 0;
                      return severityBreakdown.map((s) => {
                        const pct = s.count / totalSeverity;
                        const dash = pct * 2 * Math.PI * 52;
                        const el = (
                          <circle
                            key={s.severity}
                            cx="60"
                            cy="60"
                            r="52"
                            fill="none"
                            strokeWidth="14"
                            stroke={SEVERITY_HEX[s.severity]}
                            strokeDasharray={`${dash} ${2 * Math.PI * 52 - dash}`}
                            strokeDashoffset={-offset}
                            strokeLinecap="butt"
                          />
                        );
                        offset += dash;
                        return el;
                      });
                    })()}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-semibold tracking-[-0.03em] text-neutral-900 dark:text-white">
                      {scopedReports.length}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400 mt-1">
                      total
                    </span>
                  </div>
                </div>
                <ul className="w-full sm:w-auto space-y-4">
                  {severityBreakdown.map((s) => (
                    <li key={s.severity} className="flex items-center justify-between gap-6 text-xs">
                      <span className="flex items-center gap-2.5 font-semibold text-neutral-900 dark:text-white">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ background: SEVERITY_HEX[s.severity] }}
                        />
                        {SEVERITY_META[s.severity].label}
                      </span>
                      <span className="tabular-nums font-semibold text-neutral-500 dark:text-neutral-400">
                        {s.count} \u00b7 {Math.round((s.count / totalSeverity) * 100)}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161618] shadow-sm p-8 flex flex-col">
              <h2 className="text-[20px] sm:text-[24px] font-semibold tracking-[-0.02em] text-neutral-900 dark:text-white leading-[1.3]">Weekly activity</h2>
              <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">New reports per week (last 8 weeks)</p>
              <div className="mt-8 flex h-48 items-end gap-2 px-2">
                {weeklyTrend.map((w, i) => (
                  <div
                    key={w.label}
                    className="group relative flex flex-1 flex-col items-center gap-2"
                  >
                    <div
                      style={{ height: `${(w.count / maxTrend) * 100}%` }}
                      className={cn(
                        'w-full max-w-[2rem] rounded-t-sm',
                        i === weeklyTrend.length - 1
                          ? 'bg-primary-500'
                          : 'bg-neutral-200'
                      )}
                    />
                    <span className="text-[10px] font-semibold tabular-nums text-neutral-500 dark:text-neutral-400">
                      {w.count}
                    </span>
                    <span className="hidden text-[9px] font-semibold uppercase tracking-wider text-neutral-400 sm:block">
                      {w.label.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Map Row */}
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161618] shadow-sm p-8 flex flex-col">
              <div>
                <h2 className="text-[20px] sm:text-[24px] font-semibold tracking-[-0.02em] text-neutral-900 dark:text-white leading-[1.3]">Live ward map</h2>
                <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">Click a pin to inspect a report</p>
              </div>
              <div className="mt-6 flex-1 h-[400px] w-full overflow-hidden rounded-md border border-neutral-200 dark:border-white/10 dark:border-white/10">
                <MapView
                  reports={scopedReports}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  heatmap
                  className="h-full w-full"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161618] shadow-sm p-8 flex flex-col">
              <h2 className="text-[20px] sm:text-[24px] font-semibold tracking-[-0.02em] text-neutral-900 dark:text-white leading-[1.3]">Hotspots</h2>
              <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">Areas with the most reports</p>
              <ul className="mt-8 space-y-4">
                {topAreas.map((a, i) => (
                  <li key={a.area} className="flex items-center justify-between gap-3 border-b border-neutral-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-white dark:bg-[#111113] text-[10px] font-bold text-neutral-500 dark:text-neutral-400">
                        {i + 1}
                      </span>
                      <span className="truncate text-sm font-semibold text-neutral-900 dark:text-white">
                        {a.area}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      {a.critical > 0 ? (
                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#800020]">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          {a.critical}
                        </span>
                      ) : null}
                      <span className="text-sm font-semibold tabular-nums text-neutral-500 dark:text-neutral-400">
                        {a.count}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-8 rounded-sm bg-white/50 dark:bg-[#111113]/50 backdrop-blur-md border border-neutral-200 dark:border-white/10 dark:border-white/10 p-4 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                <strong>Tip:</strong> areas with high critical counts should get a site visit this week.
              </div>
            </div>
          </div>

          {/* Table Row */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161618] shadow-sm p-8">
            <h2 className="text-[20px] sm:text-[24px] font-semibold tracking-[-0.02em] text-neutral-900 dark:text-white leading-[1.3]">Recent reports</h2>
            <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">Latest citizen submissions awaiting action</p>
            
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-white/10 dark:border-white/10 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                    <th className="pb-4 pr-4">Report</th>
                    <th className="pb-4 pr-4">Category</th>
                    <th className="pb-4 pr-4">Severity</th>
                    <th className="pb-4 pr-4">Status</th>
                    <th className="pb-4 pr-4">Reported</th>
                    <th className="pb-4">Actions</th>
                  </tr>
                </thead>
                <motion.tbody
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                >
                  {loading
                    ? Array.from({ length: 4 }, (_, i) => (
                        <tr key={i}>
                          <td colSpan={6} className="py-4">
                            <div className="h-10 w-full bg-white dark:bg-[#111113] rounded" />
                          </td>
                        </tr>
                      ))
                    : null}
                  {recent.map((r) => {
                    const severity = SEVERITY_META[r.severity];
                    const status = STATUS_META[r.status];
                    const assigned = authorityById(r.assignedTo);
                    return (
                      <motion.tr
                        variants={itemVariants}
                        key={r.id}
                        className="border-b border-neutral-100 transition-colors hover:bg-white/50 dark:bg-[#111113]/50 backdrop-blur-md"
                      >
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={r.image}
                              alt=""
                              className="h-12 w-12 shrink-0 rounded-sm object-cover border border-neutral-200 dark:border-white/10 dark:border-white/10"
                              loading="lazy"
                            />
                            <div className="min-w-0">
                              <p className="max-w-[240px] truncate font-semibold text-neutral-900 dark:text-white">
                                {r.title}
                              </p>
                              <p className="mt-1 text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                                {r.id} \u00b7 {timeAgo(r.date)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 pr-4">
                          <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                            {categoryById(r.category).short}
                          </span>
                        </td>
                        <td className="py-4 pr-4">
                          <span className={cn('inline-flex items-center rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider', severity.bg, severity.color)}>
                            {severity.label}
                          </span>
                        </td>
                        <td className="py-4 pr-4">
                          <div className="flex flex-col items-start gap-1.5">
                            <span className={cn('inline-flex items-center rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider', status.bg, status.color)}>
                              {status.label}
                            </span>
                            {assigned ? (
                              <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400">
                                {assigned.name}
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td className="py-4 pr-4 text-xs font-medium tabular-nums text-neutral-500 dark:text-neutral-400">
                          {formatDate(r.date)}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleResolve(r)}
                              disabled={r.status === 'resolved'}
                              className="flex h-8 items-center gap-1.5 rounded-sm border border-neutral-300  px-3 text-[11px] font-semibold text-neutral-900 dark:text-white transition-colors hover:border-neutral-900 hover:bg-white/50 dark:bg-[#111113]/50 backdrop-blur-md disabled:cursor-not-allowed disabled:opacity-40"
                              title="Mark resolved"
                            >
                              <Wrench className="h-3 w-3" />
                              Resolve
                            </button>
                            <select
                              value={r.assignedTo ?? ''}
                              onChange={(e) => e.target.value && handleAssign(r, e.target.value)}
                              className="h-8 rounded-sm border border-neutral-300  px-2 text-[11px] font-semibold text-neutral-900 dark:text-white focus:border-neutral-900 focus:outline-none disabled:opacity-40"
                              aria-label={`Assign ${r.id}`}
                            >
                              <option value="">Assign to\u2026</option>
                              {authoritiesForScope(isAmrita ? 'campus' : 'city').map((a) => (
                                <option key={a.id} value={a.id}>
                                  {a.name}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => {
                                void rejectAsAuthority(r.id).then(() =>
                                  toast.info('Report rejected', `${r.id} marked as rejected.`),
                                );
                              }}
                              disabled={r.status === 'rejected' || r.status === 'resolved'}
                              className="flex h-8 w-8 items-center justify-center rounded-sm text-neutral-400 transition-colors hover:bg-white dark:bg-[#111113] hover:text-neutral-900 dark:text-white disabled:opacity-40"
                              title="Reject report"
                              aria-label="Reject report"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </motion.tbody>
              </table>
            </div>
            {recent.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center border-t border-neutral-100 py-16 text-center">
                <Inbox className="mb-4 h-10 w-10 text-neutral-300" />
                <p className="text-base font-semibold text-neutral-900 dark:text-white">No reports yet</p>
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                  Reports appear here the moment citizens submit them.
                </p>
              </div>
            ) : null}
            <div className="mt-6 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
              <MapIcon className="h-3.5 w-3.5" />
              Showing the 10 most recent reports \u2014 all actions update the shared database instantly.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
