import { usePWAUpdate } from '@/utils/pwa';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { useState } from 'react';

export function PwaUpdateToast() {
  const { updateAvailable, update } = usePWAUpdate();
  const [dismissed, setDismissed] = useState(false);

  return (
    <AnimatePresence>
      {updateAvailable && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95, pointerEvents: 'none' }}
          className="fixed bottom-24 left-4 right-4 md:left-auto md:right-4 md:bottom-8 md:w-96 z-[9999]"
          style={{ transform: 'translate3d(0,0,0)' }} // iOS stacking context fix
        >
          <div className="bg-neutral-900 dark:bg-neutral-800 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between border border-white/10 overflow-hidden relative">
            
            {/* Subtle animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-transparent opacity-50 pointer-events-none"></div>

            <div className="flex items-center gap-3 relative z-10">
              <div className="bg-primary-500/20 p-2 rounded-full text-primary-400">
                <Download className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">Update Available</span>
                <span className="text-xs text-neutral-400">Get the latest features and bug fixes.</span>
              </div>
            </div>

            <div className="flex items-center gap-2 relative z-10">
              <button
                onClick={update}
                className="bg-primary-600 hover:bg-primary-500 text-white px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              >
                Reload
              </button>
              <button
                onClick={() => setDismissed(true)}
                className="p-1.5 text-neutral-400 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Dismiss update"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
