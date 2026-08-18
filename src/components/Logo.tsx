import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { useBrand } from '@/hooks/useBrand';

interface LogoProps {
  /** Render as a link to home. */
  to?: string;
  /** Hide the wordmark (icon only). */
  iconOnly?: boolean;
  className?: string;
}

/**
 * Brand mark — automatically shows "CivicEye" (indigo pin) or
 * "Amrita Eye" (red → gold pin) depending on the active brand.
 */
export function Logo({ to, className }: LogoProps) {
  const { meta } = useBrand();

  const wordmark = (
    <span className="flex items-center gap-0.5 text-2xl font-extrabold tracking-tight">
      <span className="text-black dark:text-white">{meta.wordmarkPrefix}</span>
      <span className="text-primary-500">Eye</span>
    </span>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={cn('flex items-center', className)}
        aria-label={`${meta.appName} home`}
      >
        {wordmark}
      </Link>
    );
  }

  return (
    <span className={cn('flex items-center', className)}>
      {wordmark}
    </span>
  );
}
