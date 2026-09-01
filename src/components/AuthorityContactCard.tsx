import { Building2, Check, Clock, Copy, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import type { Authority } from '@/types';
import { telLink } from '@/data/authorities';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/utils/cn';

/**
 * Compact, ultra-sleek card with an authority's public contact channels.
 * Used inside the ReportToAuthority modal and on the report page sidebar.
 */
export function AuthorityContactCard({
  authority,
  heading = 'Responsible Authority',
  className,
}: {
  authority: Authority;
  heading?: string;
  className?: string;
}) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const phoneHref = telLink(authority);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(authority.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
      toast.success('Email copied', authority.email);
    } catch {
      toast.info('Email address', authority.email);
    }
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-4 sm:p-5 dark:border-white/10 dark:bg-white/[0.03] backdrop-blur-sm',
        className,
      )}
    >
      {/* Subtle background ambient glow */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-[#A51636]/10 blur-2xl dark:bg-[#E52B50]/15" />

      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#A51636]/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#A51636] dark:bg-[#E52B50]/15 dark:text-[#E52B50]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#A51636] dark:bg-[#E52B50] animate-pulse" />
          {heading}
        </span>
        <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500">
          Official Desk
        </span>
      </div>

      <div className="mt-3 flex items-center gap-3.5">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm transition-transform hover:scale-105"
          style={{
            background: authority.color
              ? `linear-gradient(135deg, ${authority.color}, #A51636)`
              : 'linear-gradient(135deg, #A51636, #E52B50)',
          }}
        >
          <Building2 className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold text-neutral-900 dark:text-white">
            {authority.name}
          </p>
          <p className="truncate text-xs font-medium text-neutral-500 dark:text-neutral-400">
            {authority.department}
          </p>
        </div>
      </div>

      <div className="mt-3.5 space-y-2 border-t border-neutral-200/60 pt-3 text-xs dark:border-white/[0.08]">
        {/* Email row with quick copy */}
        <div className="flex items-center justify-between gap-2 rounded-xl bg-white/80 px-3 py-2 border border-neutral-200/60 dark:bg-white/[0.04] dark:border-white/[0.06]">
          <div className="flex items-center gap-2 min-w-0">
            <Mail className="h-3.5 w-3.5 shrink-0 text-[#A51636] dark:text-[#E52B50]" />
            <span className="truncate font-medium text-neutral-800 dark:text-neutral-200">
              {authority.email}
            </span>
          </div>
          <button
            onClick={() => void copyEmail()}
            className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200/70 dark:text-neutral-300 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] transition-colors"
            title="Copy email address"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-500 font-bold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Phone */}
        {authority.phone ? (
          <div className="flex items-center justify-between gap-2 rounded-xl bg-white/80 px-3 py-2 border border-neutral-200/60 dark:bg-white/[0.04] dark:border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 shrink-0 text-[#A51636] dark:text-[#E52B50]" />
              <span className="font-medium text-neutral-800 dark:text-neutral-200">
                {authority.phone}
              </span>
            </div>
            {phoneHref ? (
              <a
                href={phoneHref}
                className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold text-[#A51636] hover:bg-[#A51636]/10 dark:text-[#E52B50] dark:hover:bg-[#E52B50]/15 transition-colors"
              >
                Call now
              </a>
            ) : null}
          </div>
        ) : null}

        {/* Hours & Office */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-neutral-500 dark:text-neutral-400">
          {authority.hours ? (
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
              <span className="truncate">{authority.hours}</span>
            </div>
          ) : null}

          {authority.address ? (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
              <span className="truncate">{authority.address}</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
