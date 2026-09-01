import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ModalProps {
  open: boolean;
  /** Optional: omit to make the dialog non-dismissible (e.g. mid-animation). */
  onClose?: () => void;
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  /** Tailwind size classes for the dialog. */
  size?: string;
  /** Hide the default close button (for custom layouts). */
  hideClose?: boolean;
}

/** Accessible modal dialog with backdrop blur + escape handling + Portal centering. */
export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  size = 'max-w-lg',
  hideClose = false,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || !onClose) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    // Lock body scroll while open.
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-md dark:bg-black/80"
            aria-label="Close dialog"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className={cn(
              'relative z-10 w-full max-h-[90vh] flex flex-col overflow-hidden rounded-[28px] border border-neutral-200/80 bg-white/95 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#121214]/95 dark:shadow-[0_25px_70px_rgba(0,0,0,0.85)]',
              size,
            )}
          >
            {title !== undefined ? (
              <div className="flex items-start justify-between border-b border-neutral-100 px-6 py-5 dark:border-white/[0.08]">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900 dark:text-white">{title}</h2>
                  {subtitle ? (
                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">{subtitle}</p>
                  ) : null}
                </div>
                {!hideClose && onClose ? (
                  <button
                    onClick={onClose}
                    className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-white/10 dark:hover:text-white"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            ) : !hideClose && onClose ? (
              <button
                onClick={onClose}
                className="absolute right-5 top-5 z-20 rounded-full bg-white/80 p-2 text-neutral-500 shadow-sm backdrop-blur transition-colors hover:text-neutral-800 dark:bg-neutral-800/80 dark:text-neutral-300 dark:hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
            <div className="overflow-y-auto overflow-x-hidden">{children}</div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
