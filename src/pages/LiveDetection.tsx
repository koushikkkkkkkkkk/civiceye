import { AnimatedText } from '@/components/ui/AnimatedText';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Activity,
  Camera,
  CircleDot,
  Construction,
  Eye,
  FastForward,
  Pause,
  Play,
  ShieldAlert,
  Sparkles,
  Zap,
} from 'lucide-react';
import type { Severity } from '@/types';
import { categoryById } from '@/data/categories';
import { CATEGORY_ICONS } from '@/components/categoryIcons';
import { useToast } from '@/hooks/useToast';
import { LIVE_CAMERAS, detectFrame } from '@/services/detectionService';
import type { DetectionResult, LiveCamera } from '@/services/detectionService';
import { timeAgo } from '@/utils/format';
import { cn } from '@/utils/cn';

interface FeedEvent extends DetectionResult {
  id: string;
  reportId?: string;
}

const SPEEDS = [
  { label: '0.5\u00d7', ms: 1800 },
  { label: '1\u00d7', ms: 1100 },
  { label: '2\u00d7', ms: 550 },
];

const BOX_COLORS: Record<Severity, string> = {
  low: 'border-emerald-400 text-emerald-300',
  medium: 'border-amber-400 text-amber-300',
  high: 'border-orange-500 text-orange-300',
  critical: 'border-[#800020] text-rose-300',
};

export function LiveDetection() {
  const toast = useToast();

  const [camera, setCamera] = useState<LiveCamera>(LIVE_CAMERAS[0]);
  const [playing, setPlaying] = useState(true);
  const [speedIdx, setSpeedIdx] = useState(1);
  const [threshold, setThreshold] = useState(0.7);
  const [autoReport, setAutoReport] = useState(true);
  const [frameIndex, setFrameIndex] = useState(0);
  const [current, setCurrent] = useState<DetectionResult | null>(null);
  const [feed, setFeed] = useState<FeedEvent[]>([]);
  const [detections, setDetections] = useState(0);
  const [reportsCreated, setReportsCreated] = useState(0);
  const lastAuto = useRef<Record<string, number>>({});

  const intervalMs = SPEEDS[speedIdx].ms;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setFrameIndex((f) => f + 1);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [playing, intervalMs]);

  useEffect(() => {
    if (frameIndex === 0 && !current) return;
    const result = detectFrame(camera, frameIndex);

    setCurrent(result);
    const event: FeedEvent = { ...result, id: `evt-${frameIndex}-${camera.id}` };

    let reportId: string | undefined;
    const wouldReport =
      autoReport &&
      result.category !== null &&
      result.confidence >= threshold &&
      (lastAuto.current[`${camera.id}:${result.category}`] ?? 0) < Date.now() - 15000;

    if (wouldReport && result.category) {
      lastAuto.current[`${camera.id}:${result.category}`] = Date.now();
      setReportsCreated((c) => c + 1);
      toast.info(
        'Detection preview',
        `${categoryById(result.category).label} detected \u2014 auto-reporting is in progress.`,
      );
    }

    setFeed((prev) => [{ ...event, reportId }, ...prev].slice(0, 24));
    if (result.category) setDetections((d) => d + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameIndex]);

  const averageConfidence = useMemo(() => {
    if (feed.length === 0) return 0;
    const sum = feed.reduce((s, e) => s + e.confidence, 0);
    return Math.round((sum / feed.length) * 100);
  }, [feed]);

  return (
    <div className="bg-[#FFF5F7] dark:bg-[#1A030A] min-h-screen">
      <section className="border-b border-[#A51636]/10 dark:border-[#E52B50]/10 pt-32 pb-24 sm:pb-36 bg-gradient-to-b from-[#FFF5F7] to-white dark:from-[#1A030A] dark:to-[#0D0105]">
        <div className="mx-auto max-w-[1920px] px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="mb-12 flex items-start gap-3 rounded-2xl border border-amber-200/50 bg-amber-50/50 p-6 backdrop-blur-sm dark:border-amber-900/30 dark:bg-amber-900/10">
            <Construction className="mt-1 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-500" />
            <div className="text-sm leading-[1.5] text-amber-900 dark:text-amber-200">
              <strong className="font-semibold">Work in progress.</strong> This page previews detections only — it does not
              create real reports yet. The production pipeline (real CCTV → YOLO model → verified
              events) is being rebuilt; see{' '}
              <code className="rounded bg-amber-100/50 px-1.5 py-0.5 text-xs font-semibold dark:bg-amber-900/30">
                LIVESTREAM_DETECTION.md
              </code>{' '}
              for the plan.
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ type: 'spring', duration: 0.45, bounce: 0 }}
            className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end"
          >
            <div>
              <div className="mb-6 flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-[#A51636] dark:text-[#E52B50]">
                <span>Live AI Detection</span>
              </div>
              <h1 className="text-[56px] sm:text-[72px] font-bold leading-[1.05] tracking-[-0.03em] text-neutral-900 dark:text-white max-w-4xl">
                <AnimatedText text="CCTV vision" /> <span className="font-serif italic font-normal text-[#A51636] dark:text-[#E52B50]"><AnimatedText text="watchtower" /></span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-[1.5] text-neutral-600 dark:text-neutral-400">
                A mock computer-vision model watches city camera feeds and previews potholes,
                accidents, garbage and more.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="inline-flex h-12 items-center gap-3 rounded-full bg-[#F5F5F7] dark:bg-[#161618] px-5 text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                <span className="relative flex h-2 w-2">
                  {playing && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#A51636] opacity-75" />}
                  <span className={cn("relative inline-flex h-2 w-2 rounded-full", playing ? "bg-[#A51636]" : "bg-neutral-400")} />
                </span>
                {playing ? 'STREAMING' : 'PAUSED'}
              </span>
              <button
                onClick={() => setPlaying((p) => !p)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-neutral-900"
                aria-label={playing ? 'Pause stream' : 'Play stream'}
              >
                {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-white dark:bg-[#0D0105]">
        <div className="mx-auto max-w-[1920px] px-6 sm:px-8 lg:px-12 xl:px-16">
          <motion.div 
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: 'spring', duration: 0.45, bounce: 0, delay: 0.1 }}
            className="grid grid-cols-2 gap-px bg-neutral-200 dark:bg-neutral-800 rounded-2xl overflow-hidden lg:grid-cols-4 mb-16"
          >
            {[
              { icon: Activity, label: 'Frames analysed', value: frameIndex },
              { icon: Eye, label: 'Issues detected', value: detections },
              { icon: Zap, label: 'Auto-reports created', value: reportsCreated },
              { icon: Sparkles, label: 'Avg. confidence', value: `${averageConfidence}%` },
            ].map((s) => (
              <div key={s.label} className="bg-white dark:bg-[#161618] p-8 flex flex-col justify-center items-center text-center">
                <div className="flex flex-col items-center gap-3 text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-4">
                  <s.icon className="h-5 w-5 text-neutral-900 dark:text-white" />
                  <span>{s.label}</span>
                </div>
                <div className="text-4xl font-bold leading-[1.2] tracking-tight text-neutral-900 dark:text-white tabular-nums">
                  {s.value}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: 'spring', duration: 0.45, bounce: 0, delay: 0.2 }}
            className="grid gap-8 lg:grid-cols-[1.6fr_1fr]"
          >
            <div className="flex flex-col rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161618] overflow-hidden shadow-sm">
              <div className="relative aspect-[16/9] w-full bg-neutral-900">
                {current?.image ? (
                  <img
                    src={current.image}
                    alt="Live camera frame"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-neutral-500 dark:text-neutral-400">
                    <Camera className="h-10 w-10" />
                    <p className="ml-2 text-sm font-semibold">No signal \u2014 scene clear</p>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />

                <div className="absolute left-6 top-5 text-white">
                  <p className="flex items-center gap-2 text-xs font-bold tracking-[0.18em]">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-primary-500" />
                    REC
                  </p>
                  <p className="mt-1 text-xs font-semibold text-white">{camera.streamLabel}</p>
                  <p className="text-xs text-white/60">{camera.name}</p>
                </div>

                <div className="absolute right-6 top-5 text-right">
                  <p className="font-mono text-xs font-semibold text-white">
                    {new Date(current?.timestamp ?? Date.now()).toLocaleTimeString('en-IN', {
                      hour12: false,
                    })}
                  </p>
                  <p className="text-xs text-white/60 uppercase tracking-wider">FRAME {frameIndex.toLocaleString()}</p>
                </div>

                {playing && (
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-16 animate-scan bg-gradient-to-b from-[#A51636]/20 to-transparent" />
                )}

                {current?.boxes.map((box, i) => (
                  <div
                    key={`${current.frameIndex}-${i}`}
                    className={cn(
                      'absolute border-2 bg-black/30 backdrop-blur-[1px] transition-all',
                      BOX_COLORS[current.severity],
                    )}
                    style={{
                      left: `${box.x}%`,
                      top: `${box.y}%`,
                      width: `${box.w}%`,
                      height: `${box.h}%`,
                    }}
                  >
                    <span className="absolute -top-6 left-0 bg-black/80 px-1.5 py-0.5 text-xs font-bold tracking-wider text-white">
                      {box.label} {Math.round(box.confidence * 100)}%
                    </span>
                  </div>
                ))}

                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3">
                  {current?.category ? (
                    <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur border border-white/20">
                      <ShieldAlert className="h-3.5 w-3.5" />
                      {categoryById(current.category).label} \u00b7 {Math.round(current.confidence * 100)}%
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur border border-white/20">
                      <CircleDot className="h-3.5 w-3.5" />
                      Scene clear
                    </span>
                  )}
                  <span className="bg-black/60 px-3 py-1.5 text-xs font-semibold text-white/80 backdrop-blur">
                    {camera.area}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 border-t border-neutral-200 dark:border-white/10 dark:border-white/10  p-5">
                <select
                  value={camera.id}
                  onChange={(e) =>
                    setCamera(LIVE_CAMERAS.find((c) => c.id === e.target.value) ?? LIVE_CAMERAS[0])
                  }
                  className="rounded-md border border-neutral-300  py-2 pl-3 pr-8 text-xs font-semibold text-neutral-900 dark:text-white focus:border-neutral-900 focus:outline-none"
                >
                  {LIVE_CAMERAS.map((c) => (
                    <option key={c.id} value={c.id}>
                      \ud83d\udcf7 {c.streamLabel} \u2014 {c.name}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-1 rounded-md border border-neutral-200 dark:border-white/10 dark:border-white/10 bg-white/50 dark:bg-[#111113]/50 backdrop-blur-md p-1">
                  {SPEEDS.map((s, i) => (
                    <button
                      key={s.label}
                      onClick={() => setSpeedIdx(i)}
                      className={cn(
                        'rounded px-3 py-1.5 text-xs font-semibold transition-colors',
                        i === speedIdx
                          ? ' text-neutral-900 dark:text-white shadow-sm border border-neutral-200 dark:border-white/10 dark:border-white/10'
                          : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:text-white',
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3 text-xs font-semibold text-neutral-900 dark:text-white">
                  Threshold
                  <input
                    type="range"
                    min={50}
                    max={95}
                    value={Math.round(threshold * 100)}
                    onChange={(e) => setThreshold(Number(e.target.value) / 100)}
                    className="w-24 accent-neutral-900"
                  />
                  <span className="tabular-nums text-neutral-500 dark:text-neutral-400">
                    {Math.round(threshold * 100)}%
                  </span>
                </div>

                <div className="ml-auto flex cursor-pointer items-center gap-2 text-xs font-semibold text-neutral-900 dark:text-white">
                  <button
                    role="switch"
                    aria-checked={autoReport}
                    onClick={() => setAutoReport((a) => !a)}
                    className={cn(
                      'relative h-5 w-9 rounded-full transition-colors focus:outline-none',
                      autoReport ? 'bg-primary-500' : 'bg-neutral-300',
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-0.5 h-4 w-4 rounded-full  transition-all',
                        autoReport ? 'left-[18px]' : 'left-0.5',
                      )}
                    />
                  </button>
                  Auto-report
                </div>
              </div>

              <div className="border-t border-neutral-200 dark:border-white/10 dark:border-white/10 bg-white/50 dark:bg-[#111113]/50 backdrop-blur-md p-4 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
                <FastForward className="mr-1 inline h-3.5 w-3.5 text-neutral-400" />
                Detections above the threshold are auto-created as <strong>pending</strong> reports \u2014
                neighbours confirm them to make them Verified, exactly like manual reports.
              </div>
            </div>

            <div className="flex flex-col rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161618] shadow-sm overflow-hidden h-[730px]">
              <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-6 py-5">
                <p className="text-base font-semibold text-neutral-900 dark:text-white">Detection feed</p>
                <span className="bg-[#F5F5F7] dark:bg-[#0D0D0D] text-neutral-600 dark:text-neutral-300 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full">{feed.length} events</span>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto p-6">
                <AnimatePresence initial={false}>
                {feed.map((event) => {
                  const Icon = event.category ? CATEGORY_ICONS[event.category] : CircleDot;
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: -12, scale: 0.98, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                      transition={{ type: 'spring', duration: 0.45, bounce: 0 }}
                      key={event.id}
                      className={cn(
                        'flex items-start gap-4 rounded-xl border p-5 shadow-sm',
                        event.category
                          ? 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111113]'
                          : 'border-neutral-100 dark:border-neutral-800/50 bg-[#F5F5F7]/50 dark:bg-[#0D0D0D]/50',
                      )}
                    >
                      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center bg-[#F5F5F7] dark:bg-[#0D0D0D] rounded-full text-neutral-900 dark:text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className={cn(
                              'truncate text-sm font-semibold',
                              event.category ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400',
                            )}
                          >
                            {event.category ? categoryById(event.category).label : 'Scene clear'}
                          </p>
                          <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                            {timeAgo(event.timestamp)}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
                          {event.summary}
                        </p>
                        <div className="mt-3 flex items-center gap-3">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-200">
                            <div
                              style={{ width: `${event.confidence * 100}%` }}
                              className={cn(
                                'h-full rounded-full transition-all duration-300',
                                event.confidence >= 0.8
                                  ? 'bg-[#10b981]'
                                  : event.confidence >= 0.6
                                    ? 'bg-[#f59e0b]'
                                    : 'bg-[#f43f5e]',
                              )}
                            />
                          </div>
                          <span className="shrink-0 text-xs font-bold tabular-nums text-neutral-500 dark:text-neutral-400">
                            {Math.round(event.confidence * 100)}%
                          </span>
                        </div>
                        {event.reportId ? (
                          <Link
                            to={`/report/${event.reportId}`}
                            className="mt-3 inline-flex items-center gap-1.5 border border-[#800020]/20 bg-primary-500/5 px-2 py-1 text-xs font-semibold text-[#800020] hover:bg-primary-500/10 rounded-sm"
                          >
                            <Zap className="h-3 w-3" />
                            Auto-report {event.reportId}
                          </Link>
                        ) : null}
                      </div>
                    </motion.div>
                  );
                })}
                </AnimatePresence>
                {feed.length === 0 ? (
                  <div className="flex h-full items-center justify-center py-20 text-center text-sm font-medium text-neutral-400">
                    Waiting for the first frame\u2026
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
