import { useEffect, useState } from 'react';

/**
 * Tiny PWA helpers: register the service worker and capture the
 * beforeinstallprompt event so we can show our own install UI later.
 */

type BeforeInstallPromptEvent = Event & {
  prompt?: () => Promise<void>;
  userChoice?: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<(ev: BeforeInstallPromptEvent | null) => void>();

export function onBeforeInstallPrompt(cb: (ev: BeforeInstallPromptEvent | null) => void) {
  listeners.add(cb);
  if (deferredPrompt) cb(deferredPrompt);
  return () => listeners.delete(cb);
}

export function consumeInstallPrompt() {
  const ev = deferredPrompt;
  deferredPrompt = null;
  listeners.forEach((l) => l(null));
  return ev;
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    listeners.forEach((l) => l(e as BeforeInstallPromptEvent));
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    listeners.forEach((l) => l(null));
    try { localStorage.setItem('civiceye:pwa-installed', '1'); } catch { /* noop */ }
  });
}

export function registerServiceWorker() {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;
  if (import.meta.env.DEV) return; // don't interfere with dev HMR
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  });
}

/** True if the page is running inside an installed PWA window. */
export function isStandalonePwa(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    ((window.navigator as unknown as { standalone?: boolean }).standalone === true)
  );
}

/**
 * Initializes PWA document attributes on <html> (pwa-standalone class and data-display-mode attribute).
 * Keeps them up-to-date if display-mode changes.
 */
export function initPwaMode() {
  if (typeof window === 'undefined') return;

  const update = () => {
    const standalone = isStandalonePwa();
    document.documentElement.classList.toggle('pwa-standalone', standalone);
    document.documentElement.setAttribute('data-display-mode', standalone ? 'standalone' : 'browser');
  };

  update();

  try {
    const mql = window.matchMedia('(display-mode: standalone)');
    mql.addEventListener?.('change', update);
  } catch {
    /* older browsers */
  }
}

/** React hook returning whether the app is currently in standalone PWA mode. */
export function useIsStandalonePwa(): boolean {
  const [standalone, setStandalone] = useState(isStandalonePwa);

  useEffect(() => {
    const update = () => setStandalone(isStandalonePwa());
    try {
      const mql = window.matchMedia('(display-mode: standalone)');
      mql.addEventListener?.('change', update);
      return () => mql.removeEventListener?.('change', update);
    } catch {
      return undefined;
    }
  }, []);

  return standalone;
}

/** React hook returning true if window width <= breakpoint (default 768px). */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < breakpoint;
  });

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);

  return isMobile;
}

const LATER_KEY = 'civiceye:pwa-prompt-later'; // "Maybe later" — soft dismiss, can re-prompt later
const SUPPRESS_KEY = 'civiceye:pwa-prompt-suppressed'; // "Don't show again" — permanent dismiss
const LATER_COOLDOWN_MS = 3 * 24 * 60 * 60 * 1000; // 3 days before re-asking after "Maybe later"

export function hasDismissedInstallPrompt(): boolean {
  try {
    if (localStorage.getItem(SUPPRESS_KEY) === '1') return true;
    const later = localStorage.getItem(LATER_KEY);
    if (!later) return false;
    const when = parseInt(later, 10);
    if (Number.isNaN(when)) return false;
    // Still within the cooldown — treat as dismissed for now.
    return Date.now() - when < LATER_COOLDOWN_MS;
  } catch { return false; }
}
export function markInstallPromptDismissed() {
  try { localStorage.setItem(LATER_KEY, String(Date.now())); } catch { /* noop */ }
}
export function suppressInstallPromptForever() {
  try {
    localStorage.setItem(SUPPRESS_KEY, '1');
    localStorage.removeItem(LATER_KEY);
  } catch { /* noop */ }
}
import { saveOfflineReport, getOfflineReports, deleteOfflineReport } from './idb';

export function isInstalled(): boolean {
  try { return localStorage.getItem('civiceye:pwa-installed') === '1'; } catch { return false; }
}

/** React hook returning update available status and an update function. */
export function usePWAUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    
    navigator.serviceWorker.ready.then((registration) => {
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            setUpdateAvailable(true);
            setWaitingWorker(newWorker);
          }
        });
      });
      // Check if already waiting
      if (registration.waiting) {
        setUpdateAvailable(true);
        setWaitingWorker(registration.waiting);
      }
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }, []);

  const update = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  return { updateAvailable, update };
}

export async function queueReportForSync(reportData: any) {
  try {
    await saveOfflineReport(reportData);
    
    // Background sync via SW (optional API)
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready.then(reg => {
        (reg as any).sync.register('sync-reports').catch(() => {});
      });
    }
  } catch (err) {
    console.error('Failed to queue report', err);
  }
}

/** Hook that automatically processes queued actions when the app comes back online. */
export function useOfflineSync(processItem: (item: any) => Promise<void>) {
  useEffect(() => {
    const flushQueue = async () => {
      if (!navigator.onLine) return;
      try {
        const queue = await getOfflineReports();
        if (queue.length === 0) return;
        
        for (const item of queue) {
          try {
            await processItem(item.data);
            await deleteOfflineReport(item.id);
          } catch (err) {
            console.error('Failed to process offline item', err);
          }
        }
      } catch (err) {
        console.error('Error flushing offline queue', err);
      }
    };

    window.addEventListener('online', flushQueue);
    // Also try on mount
    flushQueue();

    return () => window.removeEventListener('online', flushQueue);
  }, [processItem]);
}

