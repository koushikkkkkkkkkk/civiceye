import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Map as MapIcon, Sparkles, Users } from 'lucide-react';
import { MapView } from '@/components/map/MapView';
import { useReports } from '@/hooks/useReports';
import { useBrand } from '@/hooks/useBrand';
import { useMemo } from 'react';
import { FEATURES, HOW_IT_WORKS } from '@/data/features';

const DETAILS = [
  {
    icon: MapIcon,
    title: 'Interactive map, two engines',
    points: [
      'Full Google Maps integration when a key is configured',
      'Zero-config fallback vector map for instant demos',
      'Marker clustering, severity heatmap, live filters & search',
      'One-tap directions to any verified report',
    ],
  },
  {
    icon: Sparkles,
    title: 'AI photo analysis (mocked)',
    points: [
      'Category, confidence & severity auto-detected from the photo',
      'Detected objects and a human-readable AI description',
      'GPS extracted from the browser automatically',
      'Deterministic pipeline \u2014 the same photo gives the same result',
    ],
  },
  {
    icon: Users,
    title: 'Community validation',
    points: [
      'Upvote / downvote every report',
      'Confirm or reject based on local knowledge',
      'Auto-verification once enough neighbours confirm',
      'Verified reports surface on the map & dashboards',
    ],
  },
];

/** Features page, strictly structural HIG. */
export function Features() {
  const { reports } = useReports();
  const { isAmrita } = useBrand();
  // Only the active brand's reports for the live map preview.
  const scoped = useMemo(
    () => reports.filter((r) => r.scope === (isAmrita ? 'campus' : 'city')).slice(0, 40),
    [reports, isAmrita],
  );

  return (
    <div className="bg-white dark:bg-black">
      {/* ------------------------------------------------ Header */}
      <section className="border-b border-neutral-200 dark:border-neutral-800 pt-32 pb-24 sm:pt-40">
        <div className="mx-auto max-w-[1920px] px-5 sm:px-8 lg:px-12 xl:px-16">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
            <span className="inline-block h-1.5 w-1.5 bg-[#800020] mr-2" aria-hidden="true" />
            Features
          </div>
          <h1 className="mt-8 text-[3.5rem] font-semibold leading-[0.98] tracking-[-0.04em] text-neutral-900 dark:text-white sm:text-6xl md:text-7xl">
            Everything you need to
            <br />
            <span className="text-neutral-400">fix your street</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-neutral-500 dark:text-neutral-400">
            CivicEye is a full product: a 60-second reporting flow, an AI assistant, a live map, community trust signals and a command centre for authorities.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              to="/report"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-[#800020] px-8 text-sm font-semibold text-white transition-colors hover:bg-[#600018] active:scale-[0.98]"
            >
              Try reporting an issue
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/map"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md border border-neutral-300 bg-white dark:bg-black px-8 text-sm font-semibold text-neutral-900 dark:text-white transition-colors hover:border-neutral-900 hover:bg-neutral-50 dark:bg-neutral-900 active:scale-[0.98]"
            >
              Open the map
            </Link>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="border-b border-neutral-200 dark:border-neutral-800 bg-[#f5f5f5] dark:bg-[#111] py-24">
        <div className="mx-auto max-w-[1920px] px-5 sm:px-8 lg:px-12 xl:px-16">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
            Capabilities
          </div>
          <h2 className="mb-6 text-3xl font-semibold tracking-[-0.035em] text-neutral-900 dark:text-white sm:text-4xl">
            Built like a real product, not a prototype
          </h2>
          <p className="mb-16 max-w-2xl text-lg text-neutral-500 dark:text-neutral-400">
            Every flow a citizen or a ward officer touches \u2014 designed, tested and polished.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="flex flex-col rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black p-8 shadow-sm">
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold tracking-[-0.02em] text-neutral-900 dark:text-white">{f.title}</h3>
                  <p className="text-sm leading-6 text-neutral-500 dark:text-neutral-400">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detail blocks */}
      <section className="border-b border-neutral-200 dark:border-neutral-800 py-24 bg-white dark:bg-black">
        <div className="mx-auto max-w-[1920px] px-5 sm:px-8 lg:px-12 xl:px-16 space-y-16">
          {DETAILS.map((d, i) => (
            <div
              key={d.title}
              className={`grid items-center gap-12 rounded-md border border-neutral-200 dark:border-neutral-800 bg-[#f5f5f5] dark:bg-[#111] p-8 lg:grid-cols-2 lg:p-16 ${
                i % 2 === 1 ? 'lg:[direction:rtl]' : ''
              }`}
            >
              <div className="lg:[direction:ltr]">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-sm bg-neutral-900 text-white shadow-sm">
                  <d.icon className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-semibold tracking-[-0.03em] text-neutral-900 dark:text-white sm:text-3xl">
                  {d.title}
                </h3>
                <ul className="mt-8 space-y-4">
                  {d.points.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-4 text-sm font-medium leading-relaxed text-neutral-600 dark:text-neutral-300"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-neutral-900 dark:text-white" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:[direction:ltr]">
                {i === 0 ? (
                  // The "interactive map" feature shows a live map preview
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black shadow-sm">
                    <MapView
                      reports={scoped}
                      center={{ lat: 12.9716, lng: 77.5946 }}
                      zoom={12}
                      onViewChange={() => undefined}
                      selectedId={null}
                      onSelect={() => undefined}
                      heatmap
                      className="h-full w-full"
                    />
                    <div className="absolute bottom-4 right-4 rounded-sm bg-white/90 px-3 py-2 text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white backdrop-blur border border-neutral-200 dark:border-neutral-800">
                      LIVE \u00b7 {scoped.length} reports
                    </div>
                  </div>
                ) : (
                  <img
                    src={i === 1 ? '/reports/pothole.jpg' : '/reports/garbage.jpg'}
                    alt={d.title}
                    loading="lazy"
                    className="relative aspect-[16/10] w-full rounded-md border border-neutral-200 dark:border-neutral-800 object-cover shadow-sm"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-neutral-200 dark:border-neutral-800 py-24 bg-[#f5f5f5] dark:bg-[#111]">
        <div className="mx-auto max-w-[1920px] px-5 sm:px-8 lg:px-12 xl:px-16">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
            How it works
          </div>
          <h2 className="mb-16 text-3xl font-semibold tracking-[-0.035em] text-neutral-900 dark:text-white sm:text-4xl">
            From broken street to fixed, in 5 steps
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="relative flex flex-col p-6 border border-neutral-200 dark:border-neutral-800 rounded-md bg-white dark:bg-black shadow-sm">
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded bg-neutral-900 text-sm font-semibold text-white">
                  {step.step}
                </div>
                <h3 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-white">{step.title}</h3>
                <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">
                  {step.description}
                </p>
                {i < HOW_IT_WORKS.length - 1 ? (
                  <ArrowRight className="absolute -right-5 top-1/2 hidden h-4 w-4 -tranneutral-y-1/2 text-neutral-300 lg:block" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-black">
        <div className="mx-auto max-w-[1920px] px-5 sm:px-8 lg:px-12 xl:px-16">
          <div className="rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-900 p-12 text-center shadow-sm sm:p-20">
            <h2 className="text-[2rem] font-semibold tracking-[-0.03em] text-white sm:text-4xl">
              Ready to make your street safer?
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-base leading-7 text-neutral-400">
              The fastest way to understand CivicEye is to file a report. It takes less than a
              minute.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/report"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-white dark:bg-black px-8 text-sm font-semibold text-neutral-900 dark:text-white transition-colors hover:bg-neutral-100 dark:bg-neutral-800 active:scale-[0.98]"
              >
                Report an issue
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md border border-neutral-700 bg-transparent px-8 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 active:scale-[0.98]"
              >
                View authority dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
