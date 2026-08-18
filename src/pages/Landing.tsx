import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Navigation,
  Play,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useReports } from '@/hooks/useReports';
import { useBrand } from '@/hooks/useBrand';
import { MapView } from '@/components/map/MapView';
import { HOW_IT_WORKS, FEATURES } from '@/data/features';
import { CommunityReviews } from '@/components/CommunityReviews';
import { CATEGORIES } from '@/data/categories';
import { compactNumber } from '@/utils/format';

/** Landing page. */
export function Landing() {
  const { reports } = useReports();
  const { isAmrita } = useBrand();

  const scoped = useMemo(
    () => reports.filter((r) => r.scope === (isAmrita ? 'campus' : 'city')),
    [reports, isAmrita],
  );

  const stats = useMemo(() => {
    const verified = scoped.filter((r) => r.verified).length;
    const resolved = scoped.filter((r) => r.status === 'resolved').length;
    const critical = scoped.filter((r) => r.severity === 'critical').length;
    const totalVotes = scoped.reduce((s, r) => s + r.upvotes, 0);
    return { total: scoped.length, verified, resolved, critical, totalVotes };
  }, [scoped]);

  const showcase = useMemo(() => scoped.slice(0, 40), [scoped]);

  return (
    <div className="bg-white dark:bg-black">
      {/* ------------------------------------------------ Hero */}
      <section className="border-b border-neutral-200 dark:border-neutral-800 pt-32 pb-24 sm:pt-40">
        <div className="mx-auto max-w-[1920px] px-5 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Copy */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                Prototype \u00b7 live demo data
              </div>

              <h1 className="mt-8 text-[4rem] font-semibold leading-[0.95] tracking-[-0.05em] text-neutral-900 dark:text-white sm:text-7xl lg:text-[5rem]">
                Making cities better,
                <br />
                <span className="text-neutral-400">one report at a time.</span>
              </h1>

              <p className="mt-8 max-w-xl text-lg leading-8 text-neutral-500 dark:text-neutral-400">
                New to the city, or lived here for years? Someone's already flagged the pothole,
                the dark street, the flooded junction. Spot something yourself? Snap it, pin it,
                and let your neighbours + local authorities take it from there.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link
                  to="/report"
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-[#800020] px-8 text-sm font-semibold text-white transition-colors hover:bg-[#600018] active:scale-[0.98]"
                >
                  Report an issue
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/map"
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md border border-neutral-300 bg-white dark:bg-black px-8 text-sm font-semibold text-neutral-900 dark:text-white transition-colors hover:border-neutral-900 hover:bg-neutral-50 dark:bg-neutral-900 active:scale-[0.98]"
                >
                  <Play className="h-4 w-4" />
                  Explore the map
                </Link>
              </div>

              <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-neutral-900 dark:text-white" />
                  Free for citizens
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-neutral-900 dark:text-white" />
                  Verified by neighbours
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-neutral-900 dark:text-white" />
                  Shared with authorities
                </span>
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative">
              <div className="rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black p-3 shadow-sm">
                <div className="pointer-events-none relative h-[400px] overflow-hidden rounded-sm bg-[#f5f5f5] dark:bg-[#111]">
                  <MapView
                    reports={showcase}
                    center={{ lat: 12.97, lng: 77.6 }}
                    zoom={12}
                    onViewChange={() => undefined}
                    selectedId={null}
                    onSelect={() => undefined}
                    heatmap
                    className="h-full w-full"
                  />
                  <div className="absolute bottom-4 right-4 rounded-sm bg-white/90 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-neutral-900 dark:text-white backdrop-blur border border-neutral-200 dark:border-neutral-800">
                    LIVE \u00b7 {compactNumber(stats.total)} reports
                  </div>
                </div>
              </div>

              <div className="absolute -left-6 top-16 hidden items-center gap-4 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black px-5 py-4 shadow-sm sm:flex">
                <span className="flex h-10 w-10 items-center justify-center bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {compactNumber(stats.verified)} verified
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">by the community</p>
                </div>
              </div>

              <div className="absolute -right-4 bottom-24 hidden items-center gap-4 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black px-5 py-4 shadow-sm sm:flex">
                <span className="flex h-10 w-10 items-center justify-center bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white">
                  <Zap className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {compactNumber(stats.totalVotes)} votes cast
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">across all reports</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ Stats */}
      <section className="border-b border-neutral-200 dark:border-neutral-800 bg-[#f5f5f5] dark:bg-[#111] py-16">
        <div className="mx-auto max-w-[1920px] px-5 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-2 gap-px border border-neutral-200 dark:border-neutral-800 bg-neutral-200 rounded-md overflow-hidden lg:grid-cols-4">
            <div className="bg-white dark:bg-black p-6 sm:p-8 flex flex-col space-y-3">
              <div className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                <MapPin className="h-4 w-4 text-neutral-900 dark:text-white" />
                <span>Active reports</span>
              </div>
              <div className="text-4xl font-semibold tracking-[-0.03em] text-neutral-900 dark:text-white tabular-nums">
                {stats.total}
              </div>
              <p className="text-[11px] font-medium text-neutral-400">in the database</p>
            </div>
            <div className="bg-white dark:bg-black p-6 sm:p-8 flex flex-col space-y-3">
              <div className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                <ShieldCheck className="h-4 w-4 text-neutral-900 dark:text-white" />
                <span>Verified reports</span>
              </div>
              <div className="text-4xl font-semibold tracking-[-0.03em] text-neutral-900 dark:text-white tabular-nums">
                {stats.verified}
              </div>
              <p className="text-[11px] font-medium text-neutral-400">confirmed by neighbours</p>
            </div>
            <div className="bg-white dark:bg-black p-6 sm:p-8 flex flex-col space-y-3">
              <div className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                <CheckCircle2 className="h-4 w-4 text-neutral-900 dark:text-white" />
                <span>Resolved</span>
              </div>
              <div className="text-4xl font-semibold tracking-[-0.03em] text-neutral-900 dark:text-white tabular-nums">
                {stats.resolved}
              </div>
              <p className="text-[11px] font-medium text-neutral-400">fixed by authorities</p>
            </div>
            <div className="bg-white dark:bg-black p-6 sm:p-8 flex flex-col space-y-3">
              <div className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                <Zap className="h-4 w-4 text-neutral-900 dark:text-white" />
                <span>Citizen votes</span>
              </div>
              <div className="text-4xl font-semibold tracking-[-0.03em] text-neutral-900 dark:text-white tabular-nums">
                {compactNumber(stats.totalVotes)}
              </div>
              <p className="text-[11px] font-medium text-neutral-400">community validation</p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ How it works */}
      <section className="border-b border-neutral-200 dark:border-neutral-800 py-24">
        <div className="mx-auto max-w-[1920px] px-5 sm:px-8 lg:px-12 xl:px-16">
          <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
            How it works
          </div>
          <h2 className="mb-6 text-3xl font-semibold tracking-[-0.035em] text-neutral-900 dark:text-white sm:text-4xl">
            Five steps from spotted to sorted
          </h2>
          <p className="mb-16 max-w-2xl text-lg text-neutral-500 dark:text-neutral-400">
            A reporting flow designed to take less than a minute \u2014 with AI and the community doing the heavy lifting.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="relative flex flex-col p-6 border border-neutral-200 dark:border-neutral-800 rounded-md bg-neutral-50 dark:bg-neutral-900">
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

      {/* ------------------------------------------------ Features */}
      <section className="border-b border-neutral-200 dark:border-neutral-800 bg-[#f5f5f5] dark:bg-[#111] py-24">
        <div className="mx-auto max-w-[1920px] px-5 sm:px-8 lg:px-12 xl:px-16">
          <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
            Features
          </div>
          <h2 className="mb-6 text-3xl font-semibold tracking-[-0.035em] text-neutral-900 dark:text-white sm:text-4xl">
            A complete civic toolkit
          </h2>
          <p className="mb-16 max-w-2xl text-lg text-neutral-500 dark:text-neutral-400">
            From AI-powered photo analysis to authority dashboards \u2014 every piece a real product needs.
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
          <div className="mt-12 text-center">
            <Link to="/features" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md border border-neutral-300 bg-white dark:bg-black px-8 text-sm font-semibold text-neutral-900 dark:text-white transition-colors hover:border-neutral-900 hover:bg-neutral-50 dark:bg-neutral-900 active:scale-[0.98]">
              Explore all features
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ Category marquee */}
      <section className="overflow-hidden border-b border-neutral-200 dark:border-neutral-800 py-10 bg-white dark:bg-black">
        <div className="pointer-events-none flex w-max animate-marquee gap-6">
          {[...CATEGORIES, ...CATEGORIES].map((c, i) => (
            <span key={`${c.id}-${i}`} className="inline-flex items-center rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
              {c.label}
            </span>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ Community reviews */}
      <CommunityReviews />

      {/* ------------------------------------------------ Map CTA */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="mx-auto max-w-[1920px] px-5 sm:px-8 lg:px-12 xl:px-16">
          <div className="rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-900 p-10 sm:p-16 shadow-sm overflow-hidden">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                  Live map
                </p>
                <h2 className="mt-6 text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.04em] text-white sm:text-5xl">
                  See the danger before you hit it
                </h2>
                <p className="mt-6 max-w-lg text-lg leading-8 text-neutral-400">
                  Heatmaps, filters and severity pins help you pick safer routes \u2014 and show
                  authorities exactly where to send crews first.
                </p>
                <Link
                  to="/map"
                  className="mt-10 inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-white dark:bg-black px-8 text-sm font-semibold text-neutral-900 dark:text-white transition-colors hover:bg-neutral-100 dark:bg-neutral-800 active:scale-[0.98]"
                >
                  <Navigation className="h-4 w-4" />
                  Open interactive map
                </Link>
              </div>
              <div className="hidden lg:block">
                <div className="rounded-sm border border-neutral-700 bg-black p-2">
                  <div className="pointer-events-none h-72 overflow-hidden rounded-sm bg-[#111]">
                    <MapView
                      reports={showcase.slice(0, 24)}
                      center={{ lat: 12.935, lng: 77.624 }}
                      zoom={13}
                      onViewChange={() => undefined}
                      selectedId={null}
                      onSelect={() => undefined}
                      heatmap
                      className="h-full w-full grayscale contrast-125 brightness-75"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
