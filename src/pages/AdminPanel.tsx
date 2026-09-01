import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCheck, Flag, Inbox, Layers, School, ShieldCheck, Trash2, UserRound, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useBrand } from '@/hooks/useBrand';
import { useToast } from '@/hooks/useToast';
import { useReports } from '@/hooks/useReports';
import { flagService } from '@/services/flagService';
import type { Flag as FlagModel } from '@/services/flagService';
import { isAdminEmail } from '@/data/admins';
import { categoryById } from '@/data/categories';
import { timeAgo } from '@/utils/format';
import { cn } from '@/utils/cn';
import { supabase } from '@/lib/supabase';

/** Staff / admin panel \u2014 strictly structural HIG layout. */
export function AdminPanel() {
  const { user } = useAuth();
  const { brand } = useBrand();
  const toast = useToast();
  const { reports, loading, removeReport, setScope } = useReports();

  const isAdmin = isAdminEmail(user?.email, brand);
  const [flags, setFlags] = useState<FlagModel[]>([]);
  const [flagsLoading, setFlagsLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<Array<{ id: string; email: string; full_name: string | null }>>([]);

  const loadFlags = useCallback(async () => {
    setFlagsLoading(true);
    try {
      const list = await flagService.getAll();
      setFlags(list);
    } catch {
      setFlags([]);
    } finally {
      setFlagsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      void loadFlags();
      // Load reporter profiles (emails) for the staff view.
      if (supabase) {
        void (async () => {
          try {
            const { data } = await supabase
              .from('profiles')
              .select('id, email, full_name');
            setProfiles((data as Array<{ id: string; email: string; full_name: string | null }>) ?? []);
          } catch {
            setProfiles([]);
          }
        })();
      }
    }
  }, [isAdmin, loadFlags]);

  const profileByUserId = useMemo(() => {
    const map = new Map<string, { email: string; full_name: string | null }>();
    for (const p of profiles) map.set(p.id, { email: p.email, full_name: p.full_name });
    return map;
  }, [profiles]);

  if (!isAdmin) {
    return (
      <div className="bg-white dark:bg-black min-h-screen py-32 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f5f5f5] dark:bg-[#111] text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h1 className="mt-8 text-2xl font-semibold tracking-[-0.02em] text-neutral-900 dark:text-white">
          Staff only
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
          This panel is for verified {brand === 'amrita' ? 'Amrita campus' : 'city'} staff
          members. If you're a teacher or listed admin, sign in with that account.
        </p>
        <Link to="/login" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#800020] px-8 text-sm font-semibold text-white transition-colors hover:bg-[#600018] active:scale-[0.98] mt-8 shadow-md">
          Sign in as staff
        </Link>
      </div>
    );
  }

  const handleTakeDown = async (flag: FlagModel) => {
    if (!flag.report?.id) return;
    setBusy(flag.id);
    try {
      await removeReport(flag.report.id);
      await flagService.remove(flag.id);
      toast.success('Post taken down', 'The flagged post has been removed.');
      await loadFlags();
    } catch (err) {
      toast.error('Could not take down', err instanceof Error ? err.message : 'Try again.');
    } finally {
      setBusy(null);
    }
  };

  const handleScope = async (id: string, to: 'city' | 'campus') => {
    setBusy(`scope-${id}`);
    try {
      await setScope(id, to);
      toast.success(to === 'campus' ? 'Marked as campus' : 'Marked as city', 'Report moved.');
    } catch (err) {
      toast.error('Could not update scope', err instanceof Error ? err.message : 'Try again.');
    } finally {
      setBusy(null);
    }
  };

  const handleDismiss = async (flagId: string) => {
    setBusy(flagId);
    try {
      await flagService.remove(flagId);
      toast.info('Flag dismissed', 'No action taken.');
      await loadFlags();
    } catch (err) {
      toast.error('Could not dismiss', err instanceof Error ? err.message : 'Try again.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="bg-white dark:bg-black pb-24 pt-32 sm:pt-40">
      <div className="mx-auto max-w-[1920px] px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
          <ShieldCheck className="h-4 w-4 text-neutral-900 dark:text-white" />
          Staff &amp; Admin
        </div>
        <h1 className="text-4xl font-semibold tracking-[-0.04em] text-neutral-900 dark:text-white sm:text-5xl">Moderation panel</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-500 dark:text-neutral-400">
          Posts reported by civilians show up here. Take down anything inappropriate, or dismiss
          flags that are unfounded.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-px border border-neutral-200 dark:border-neutral-800 bg-neutral-200 rounded-3xl overflow-hidden lg:grid-cols-4 shadow-sm">
          <div className="bg-white dark:bg-black p-6 sm:p-8 flex flex-col space-y-3">
            <div className="text-4xl font-semibold tracking-[-0.03em] text-neutral-900 dark:text-white tabular-nums">
              {flags.length}
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
              Open flags
            </p>
          </div>
          <div className="bg-white dark:bg-black p-6 sm:p-8 flex flex-col space-y-3">
            <div className="text-4xl font-semibold tracking-[-0.03em] text-neutral-900 dark:text-white tabular-nums">
              {reports.length}
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
              Total posts ({brand === 'amrita' ? 'campus' : 'city'})
            </p>
          </div>
        </div>

        {/* Flags inbox */}
        <div className="mt-16">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold tracking-[-0.02em] text-neutral-900 dark:text-white">
            <Flag className="h-5 w-5 text-[#800020]" />
            Flagged posts
          </h2>

          {flagsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }, (_, i) => (
                <div key={i} className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black p-6">
                  <div className="h-4 w-40 rounded-full bg-neutral-100 dark:bg-neutral-800" />
                  <div className="mt-4 h-4 w-full rounded-full bg-neutral-100 dark:bg-neutral-800" />
                </div>
              ))}
            </div>
          ) : flags.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 py-16 text-center">
              <Inbox className="mb-4 h-8 w-8 text-neutral-300" />
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                No flags right now
              </p>
              <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                Reported posts will appear here for review.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {flags.map((flag) => {
                const rep = flag.report;
                const cat = rep ? categoryById(rep.category as never) : null;
                return (
                  <div
                    key={flag.id}
                    className="flex flex-col gap-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black p-6 sm:flex-row sm:items-start"
                  >
                    {rep?.photo_url ? (
                      <img
                        src={rep.photo_url}
                        alt=""
                        className="h-24 w-24 shrink-0 rounded-2xl object-cover border border-neutral-200 dark:border-neutral-800"
                        loading="lazy"
                      />
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-700 border border-red-100">
                          {flag.reason}
                        </span>
                        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                          by {flag.flaggerEmail} · {timeAgo(flag.date)}
                        </span>
                      </div>
                      <Link
                        to={`/report/${rep?.id}`}
                        className="mt-3 block text-base font-semibold text-neutral-900 dark:text-white transition-colors hover:text-neutral-600 dark:text-neutral-300 underline decoration-neutral-300 underline-offset-4"
                      >
                        {rep?.title ?? 'Unknown post'}
                      </Link>
                      {cat ? (
                        <p className="mt-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                          {cat.label} · {rep?.location_name ?? ''} · by {rep?.author_name}
                        </p>
                      ) : null}
                      {flag.note ? (
                        <p className="mt-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 p-4 text-xs italic leading-relaxed text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800">
                          “{flag.note}”
                        </p>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <button
                        onClick={() => void handleTakeDown(flag)}
                        disabled={busy === flag.id}
                        className="flex min-h-9 items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white dark:bg-black px-5 text-xs font-semibold text-neutral-900 dark:text-white transition-colors hover:border-neutral-900 hover:bg-neutral-50 dark:bg-neutral-900 active:scale-[0.98] disabled:opacity-40 shadow-sm"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Take down
                      </button>
                      <button
                        onClick={() => void handleDismiss(flag.id)}
                        disabled={busy === flag.id}
                        className="flex min-h-9 items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white dark:bg-black px-5 text-xs font-semibold text-neutral-900 dark:text-white transition-colors hover:border-neutral-900 hover:bg-neutral-50 dark:bg-neutral-900 active:scale-[0.98] disabled:opacity-40 shadow-sm"
                      >
                        <CheckCheck className="h-3.5 w-3.5" />
                        Dismiss
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Scope manager */}
        <div className="mt-20">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold tracking-[-0.02em] text-neutral-900 dark:text-white">
            <Layers className="h-5 w-5 text-neutral-900 dark:text-white" />
            Switch scope (Campus vs City)
          </h2>
          <div className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-[#f5f5f5] dark:bg-[#111] text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                    <th className="py-4 pl-6 pr-4">Report</th>
                    <th className="py-4 pr-4">Current scope</th>
                    <th className="py-4 pr-6">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="py-4 px-6">
                        <div className="h-8 w-full rounded bg-neutral-100 dark:bg-neutral-800" />
                      </td>
                    </tr>
                  ) : reports.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-12 text-center text-sm font-medium text-neutral-500 dark:text-neutral-400">
                        No reports in database.
                      </td>
                    </tr>
                  ) : (
                    [...reports]
                      .sort((a, b) => (a.date < b.date ? 1 : -1))
                      .slice(0, 15)
                      .map((r) => (
                        <tr
                          key={r.id}
                          className="transition-colors hover:bg-neutral-50 dark:bg-neutral-900"
                        >
                          <td className="py-4 pl-6 pr-4">
                            <p className="max-w-[260px] truncate font-semibold text-neutral-900 dark:text-white">
                              {r.title}
                            </p>
                            <p className="mt-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                              {r.author} · {r.locationName}
                            </p>
                          </td>
                          <td className="py-4 pr-4">
                            <span
                              className={cn(
                                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider',
                                r.scope === 'campus'
                                  ? 'bg-[#800020]/10 text-[#800020]'
                                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300',
                              )}
                            >
                              {r.scope === 'campus' ? 'Campus' : 'City'}
                            </span>
                          </td>
                          <td className="py-4 pr-6">
                            <button
                              onClick={() => void handleScope(r.id, r.scope === 'campus' ? 'city' : 'campus')}
                              disabled={busy === `scope-${r.id}`}
                              className={cn(
                                'flex min-h-8 items-center justify-center gap-2 rounded-full border px-4 text-xs font-semibold transition-colors active:scale-[0.98] disabled:opacity-40 shadow-sm',
                                r.scope === 'campus'
                                  ? 'border-neutral-300 bg-white dark:bg-black text-neutral-900 dark:text-white hover:border-neutral-900'
                                  : 'border-[#800020] bg-[#800020] text-white hover:bg-[#600018]',
                              )}
                            >
                              <School className="h-3 w-3" />
                              {r.scope === 'campus' ? 'Mark as city' : 'Mark as campus'}
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Users (student details) */}
        <div className="mt-20">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold tracking-[-0.02em] text-neutral-900 dark:text-white">
            <Users className="h-5 w-5 text-neutral-900 dark:text-white" />
            Reporters &amp; details
          </h2>
          <div className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-[#f5f5f5] dark:bg-[#111] text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                    <th className="py-4 pl-6 pr-4">Reporter</th>
                    <th className="py-4 pr-4">Email</th>
                    <th className="py-4 pr-4">Scope</th>
                    <th className="py-4 pr-6">Posts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-4 px-6">
                        <div className="h-8 w-full rounded-full bg-neutral-100 dark:bg-neutral-800" />
                      </td>
                    </tr>
                  ) : reports.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-sm font-medium text-neutral-500 dark:text-neutral-400">
                        No reports yet.
                      </td>
                    </tr>
                  ) : (
                    [...new Map(reports.map((r) => [r.author, r])).values()].map((r) => (
                      <tr
                        key={r.userId ?? r.author}
                        className="transition-colors hover:bg-neutral-50 dark:bg-neutral-900"
                      >
                        <td className="py-4 pl-6 pr-4">
                          <span className="flex items-center gap-3 font-semibold text-neutral-900 dark:text-white">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-bold text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800">
                              {r.author[0]?.toUpperCase() ?? '?'}
                            </span>
                            {r.author}
                          </span>
                        </td>
                        <td className="py-4 pr-4 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                          {r.userId ? (profileByUserId.get(r.userId)?.email ?? '—') : '—'}
                        </td>
                        <td className="py-4 pr-4">
                          <span
                            className={cn(
                              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider',
                              r.scope === 'campus'
                                ? 'bg-[#800020]/10 text-[#800020]'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300',
                            )}
                          >
                            {r.scope === 'campus' ? 'Campus' : 'City'}
                          </span>
                        </td>
                        <td className="py-4 pr-6 text-sm font-semibold tabular-nums text-neutral-500 dark:text-neutral-400">
                          {reports.filter((x) => x.userId === r.userId).length}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
            <UserRound className="h-3.5 w-3.5 text-neutral-400" />
            Reporter emails come from their profiles — visible to staff for follow-ups.
          </p>
        </div>
      </div>
    </div>
  );
}
