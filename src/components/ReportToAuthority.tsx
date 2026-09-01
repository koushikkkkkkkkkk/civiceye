import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  Loader2,
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
  Send,
  ShieldAlert,
} from 'lucide-react';
import { Modal } from './Modal';
import { AuthorityContactCard } from './AuthorityContactCard';
import type { Authority, Report } from '@/types';
import { authorityForCategory, telLink } from '@/data/authorities';
import {
  buildEscalationPayload,
  escalationMailToUrl,
  escalationSmsUrl,
  escalationWhatsAppTargets,
  isEmailJSConfigured,
  logEscalation,
  newEscalationRef,
  sendEscalationEmail,
  sendEscalationViaEmailJS,
} from '@/services/authorityService';
import { useToast } from '@/hooks/useToast';
import { useNotifications } from '@/hooks/useNotifications';
import { useBrand } from '@/hooks/useBrand';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';

interface ReportToAuthorityProps {
  /** The real report being escalated. Omit for a generic/bulk escalation. */
  report?: Report;
  /** What is being sent (e.g. "your report" or "the selected ward package"). */
  subject?: string;
  label?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  className?: string;
  onDone?: () => void;
}

const SENDING_STEPS = [
  'Compiling official report package…',
  'Attaching evidence photo & GPS coordinates…',
  'Routing securely to the responsible office…',
  'Awaiting delivery confirmation…',
];

type Phase = 'compose' | 'sending' | 'done' | 'fallback' | 'failed';

/**
 * Report to Authority — REAL escalation.
 *
 * Shows the authority responsible for the report's category with its public
 * contact channels (call / WhatsApp / email), and emails a formatted report
 * package to the authority's official inbox via /api/report-authority.
 */
export function ReportToAuthority({
  report,
  subject = 'your report',
  label = 'Report to authority',
  variant = 'primary',
  className,
  onDone,
}: ReportToAuthorityProps) {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>('compose');
  const [stepIndex, setStepIndex] = useState(0);
  const [escRef, setEscRef] = useState<string>('');
  const [note, setNote] = useState('');
  const toast = useToast();
  const notifications = useNotifications();
  const { isAmrita } = useBrand();
  const { user, profile } = useAuth();
  const timerRef = useRef<number | null>(null);

  const scope: 'city' | 'campus' = report?.scope ?? (isAmrita ? 'campus' : 'city');
  const authority: Authority = useMemo(
    () => authorityForCategory(report?.category, scope),
    [report?.category, scope],
  );
  const reporterEmail = user?.email ?? profile?.email ?? null;
  const reporterId = user?.id ?? null;

  const resolvedLabel = isAmrita && !report ? 'Report to staff' : label;
  const phoneHref = telLink(authority);
  const waTargets = report ? escalationWhatsAppTargets(report, authority) : [];
  const smsHref = report ? escalationSmsUrl(report, authority) : undefined;
  const mailToHref = report
    ? escalationMailToUrl(report, authority, reporterEmail, note.trim() || undefined)
    : `mailto:${authority.email}?subject=${encodeURIComponent(
        `[Amrita Eye Inquiry] ${authority.department}`,
      )}`;

  useEffect(
    () => () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    },
    [],
  );

  const log = (channel: 'email' | 'whatsapp' | 'phone' | 'sms' | 'mailto') => {
    void logEscalation({
      report: report ?? null,
      authority,
      channel,
      reporterId,
      reporterEmail,
      message: note.trim() || undefined,
    });
  };

  /** Send the escalation through the serverless email gateway. */
  const send = async () => {
    if (!report) return;
    setPhase('sending');
    setStepIndex(0);

    // Drive the progress animation while the request is in flight.
    let i = 0;
    timerRef.current = window.setInterval(() => {
      i = Math.min(i + 1, SENDING_STEPS.length - 1);
      setStepIndex(i);
    }, 520);

    try {
      const result = await sendEscalationEmail(
        buildEscalationPayload(report, authority, reporterEmail, note.trim() || undefined),
      );

      if (timerRef.current) window.clearInterval(timerRef.current);
      setEscRef(result.ref);

      if (result.status === 'not-configured') {
        // No SMTP on the server — try the third-party EmailJS sender next.
        if (isEmailJSConfigured) {
          const ref = newEscalationRef();
          try {
            await sendEscalationViaEmailJS(
              report,
              authority,
              reporterEmail,
              note.trim() || undefined,
              ref,
            );
            await logEscalation({
              report,
              authority,
              channel: 'email',
              reporterId,
              reporterEmail,
              message: note.trim() || undefined,
            });
            setEscRef(ref);
            setPhase('done');
            toast.success('Report sent!', `${authority.name} has been emailed your report package.`);
            notifications.add({
              type: 'report',
              title: 'Report sent to authority',
              message: `${report.title} was emailed to ${authority.name} (ref ${ref}).`,
            });
            onDone?.();
            return;
          } catch {
            // EmailJS failed too — fall through to the mail app fallback.
          }
        }
        setPhase('fallback');
        return;
      }

      await logEscalation({
        report,
        authority,
        channel: 'email',
        reporterId,
        reporterEmail,
        message: note.trim() || undefined,
      });
      setPhase('done');
      toast.success('Report sent!', `${authority.name} has been emailed your report package.`);
      notifications.add({
        type: 'report',
        title: 'Report sent to authority',
        message: `${report.title} was emailed to ${authority.name} (ref ${result.ref}).`,
      });
      onDone?.();
    } catch (err) {
      if (timerRef.current) window.clearInterval(timerRef.current);
      setPhase('failed');
      toast.error(
        'Could not send the email',
        err instanceof Error ? err.message : 'Please try again or use a direct channel below.',
      );
    }
  };

  const close = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setOpen(false);
    // Reset so reopening starts fresh from the compose view.
    window.setTimeout(() => {
      setPhase('compose');
      setStepIndex(0);
      setEscRef('');
    }, 250);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          variant === 'primary' &&
            'inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#A51636] px-6 text-sm font-semibold text-white transition-all hover:bg-[#8B122D] shadow-md hover:shadow-lg shadow-[#A51636]/20 dark:bg-[#E52B50] dark:hover:bg-[#C41E3A] dark:shadow-[#E52B50]/20',
          variant === 'secondary' && 'btn-secondary',
          variant === 'ghost' && 'btn-ghost',
          variant === 'danger' && 'btn-danger',
          className,
        )}
      >
        <Send className="h-4 w-4" />
        {resolvedLabel}
      </button>

      <Modal
        open={open}
        onClose={phase === 'sending' ? undefined : close}
        hideClose={phase === 'sending'}
        title={isAmrita ? 'Report to Campus Staff' : 'Report to Authority'}
        subtitle={
          isAmrita
            ? 'Direct escalation channel with university administration'
            : 'Official civic dispatch & resolution channel'
        }
      >
        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* ------------------------------ compose ------------------------------ */}
            {phase === 'compose' ? (
              <motion.div
                key="compose"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                {/* Responsible authority contact card */}
                <AuthorityContactCard authority={authority} />

                {report ? (
                  <>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="rta-note"
                        className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
                      >
                        Add urgent instructions / note (optional)
                      </label>
                      <textarea
                        id="rta-note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={2}
                        maxLength={500}
                        placeholder="Anything specific or urgent the staff team should know…"
                        className="w-full rounded-2xl border border-neutral-200/80 bg-neutral-50/50 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#A51636] focus:outline-none focus:ring-2 focus:ring-[#A51636]/20 dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:focus:border-[#E52B50] dark:focus:ring-[#E52B50]/20"
                      />
                    </div>

                    <button
                      onClick={() => void send()}
                      className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#A51636] via-[#C41E3A] to-[#E52B50] py-3.5 px-6 text-sm font-bold text-white shadow-lg shadow-[#A51636]/25 transition-all hover:opacity-95 hover:shadow-xl hover:shadow-[#A51636]/35 active:scale-[0.99]"
                    >
                      <Mail className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                      Email Report Package to {authority.name.split(' ').slice(0, 3).join(' ')}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>

                    <p className="text-center text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                      The {isAmrita ? 'campus administration' : 'authority'} receives high-res photos,
                      accurate GPS pins, and reporter details instantly.
                    </p>
                  </>
                ) : (
                  <div className="space-y-3 pt-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                      Direct Channels · {subject}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {phoneHref ? (
                        <a
                          href={phoneHref}
                          onClick={() => log('phone')}
                          className="group flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white/60 p-3.5 transition-all hover:border-[#A51636]/40 hover:bg-neutral-50 hover:shadow-sm dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-[#E52B50]/40 dark:hover:bg-white/[0.06]"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#A51636]/10 text-[#A51636] group-hover:scale-105 transition-transform dark:bg-[#E52B50]/15 dark:text-[#E52B50]">
                            <Phone className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-neutral-900 dark:text-white">
                              Call Desk
                            </p>
                            <p className="truncate text-[11px] text-neutral-500 dark:text-neutral-400">
                              {authority.phone || 'Direct line'}
                            </p>
                          </div>
                        </a>
                      ) : null}

                      <a
                        href={mailToHref}
                        onClick={() => log('mailto')}
                        className="group flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white/60 p-3.5 transition-all hover:border-[#A51636]/40 hover:bg-neutral-50 hover:shadow-sm dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-[#E52B50]/40 dark:hover:bg-white/[0.06]"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 group-hover:scale-105 transition-transform dark:bg-blue-500/15 dark:text-blue-400">
                          <Mail className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-neutral-900 dark:text-white">
                            Send Email
                          </p>
                          <p className="truncate text-[11px] text-neutral-500 dark:text-neutral-400">
                            Open mail client
                          </p>
                        </div>
                      </a>

                      {waTargets.map((t) => (
                        <a
                          key={t.number}
                          href={t.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => log('whatsapp')}
                          className="group flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white/60 p-3.5 transition-all hover:border-emerald-500/40 hover:bg-neutral-50 hover:shadow-sm dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-emerald-500/40 dark:hover:bg-white/[0.06]"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 group-hover:scale-105 transition-transform dark:bg-emerald-500/15 dark:text-emerald-400">
                            <MessageCircle className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-neutral-900 dark:text-white">
                              WhatsApp
                            </p>
                            <p className="truncate text-[11px] text-neutral-500 dark:text-neutral-400">
                              +{t.number}
                            </p>
                          </div>
                        </a>
                      ))}

                      {report && smsHref ? (
                        <a
                          href={smsHref}
                          onClick={() => log('sms')}
                          className="group flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white/60 p-3.5 transition-all hover:border-purple-500/40 hover:bg-neutral-50 hover:shadow-sm dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-purple-500/40 dark:hover:bg-white/[0.06]"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 group-hover:scale-105 transition-transform dark:bg-purple-500/15 dark:text-purple-400">
                            <MessageSquare className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-neutral-900 dark:text-white">
                              Direct SMS
                            </p>
                            <p className="truncate text-[11px] text-neutral-500 dark:text-neutral-400">
                              Send quick text
                            </p>
                          </div>
                        </a>
                      ) : null}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : null}

            {/* ------------------------------ sending ------------------------------ */}
            {phase === 'sending' ? (
              <motion.div
                key="sending"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-8 text-center"
              >
                <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
                  <span className="absolute inset-0 animate-ping rounded-full bg-[#A51636]/20 dark:bg-[#E52B50]/20" />
                  <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#A51636] to-[#E52B50] text-white shadow-xl shadow-[#A51636]/30">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </span>
                </div>

                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  Dispatching to {authority.name}…
                </h3>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  Please keep this window open while we secure delivery
                </p>

                <div className="mx-auto mt-6 max-w-xs space-y-3 text-left">
                  {SENDING_STEPS.map((step, idx) => (
                    <div key={step} className="flex items-center gap-3">
                      <span
                        className={cn(
                          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all',
                          idx < stepIndex
                            ? 'bg-emerald-500 text-white'
                            : idx === stepIndex
                              ? 'bg-[#A51636] text-white dark:bg-[#E52B50]'
                              : 'bg-neutral-100 text-neutral-400 dark:bg-white/10 dark:text-neutral-500',
                        )}
                      >
                        {idx < stepIndex ? <CheckCircle2 className="h-3.5 w-3.5" /> : idx + 1}
                      </span>
                      <span
                        className={cn(
                          'text-xs font-medium',
                          idx <= stepIndex
                            ? 'text-neutral-800 dark:text-neutral-200'
                            : 'text-neutral-400 dark:text-neutral-500',
                        )}
                      >
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : null}

            {/* ------------------------------- done -------------------------------- */}
            {phase === 'done' ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                className="py-6 text-center"
              >
                <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
                  <span className="absolute inset-0 animate-pulse rounded-full bg-emerald-500/20" />
                  <motion.span
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 16, delay: 0.05 }}
                    className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/30"
                  >
                    <CheckCircle2 className="h-9 w-9" />
                  </motion.span>
                </div>

                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                  Dispatched Successfully! 🎉
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Your report package with live coordinates and evidence photos was officially
                  emailed to <strong className="text-neutral-900 dark:text-white">{authority.name}</strong>.
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs font-medium">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:text-emerald-400">
                    <FileCheck2 className="h-3.5 w-3.5" />
                    Ref: {escRef}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-amber-700 dark:text-amber-400">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    SLA: 7 working days
                  </span>
                </div>

                <button
                  onClick={close}
                  className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-[#A51636] px-8 text-sm font-semibold text-white transition-all hover:bg-[#8B122D] shadow-md hover:shadow-lg dark:bg-[#E52B50] dark:hover:bg-[#C41E3A]"
                >
                  Done
                </button>
              </motion.div>
            ) : null}

            {/* ------------------- fallback: mail not configured ------------------- */}
            {phase === 'fallback' ? (
              <motion.div
                key="fallback"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-6 text-center"
              >
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 dark:bg-amber-500/20">
                  <Mail className="h-7 w-7" />
                </span>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  Send via Mail App
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                  We have pre-composed the official dispatch packet for you. Tap below to launch
                  your mail client with all data pre-filled to{' '}
                  <strong className="text-neutral-900 dark:text-white">{authority.email}</strong>.
                </p>

                <div className="mt-6 flex flex-col items-center gap-3">
                  <a
                    href={mailToHref}
                    onClick={() => log('mailto')}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#A51636] px-6 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#8B122D] dark:bg-[#E52B50] dark:hover:bg-[#C41E3A]"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open Pre-filled Email
                  </a>
                  {escRef ? (
                    <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                      Tracking Reference: {escRef}
                    </span>
                  ) : null}
                </div>
                <button
                  onClick={close}
                  className="mt-4 text-xs font-semibold text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                >
                  Close
                </button>
              </motion.div>
            ) : null}

            {/* ------------------------------- failed ------------------------------ */}
            {phase === 'failed' ? (
              <motion.div
                key="failed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-6 text-center"
              >
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 dark:bg-rose-500/20">
                  <AlertTriangle className="h-7 w-7" />
                </span>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  Dispatch Unsuccessful
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                  You can retry immediately or contact {authority.name} directly via phone or email below.
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => void send()}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-[#A51636] px-6 text-sm font-semibold text-white transition-all hover:bg-[#8B122D] dark:bg-[#E52B50] dark:hover:bg-[#C41E3A]"
                  >
                    Retry Dispatch
                  </button>
                  {phoneHref ? (
                    <a
                      href={phoneHref}
                      onClick={() => log('phone')}
                      className="btn-secondary text-xs"
                    >
                      <Phone className="h-4 w-4" />
                      Call
                    </a>
                  ) : null}
                  <a
                    href={mailToHref}
                    onClick={() => log('mailto')}
                    className="btn-secondary text-xs"
                  >
                    <Mail className="h-4 w-4" />
                    Mail App
                  </a>
                </div>
                <button
                  onClick={close}
                  className="mt-4 text-xs font-semibold text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                >
                  Close
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </Modal>
    </>
  );
}

