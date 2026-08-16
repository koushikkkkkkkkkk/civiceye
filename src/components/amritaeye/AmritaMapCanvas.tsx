import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, ChevronRight } from 'lucide-react';
import { CAMPUS_CONFIG } from '@/data/campus';
import { MapView } from '@/components/map/MapView';
import type { Report } from '@/types';

interface AmritaMapCanvasProps {
  campusReports: Report[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function AmritaMapCanvas({ campusReports, selectedId, onSelect }: AmritaMapCanvasProps) {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-[#181818] py-24 sm:py-32 border-b border-[#e5e5e7] dark:border-[#313131] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card p-0 shadow-2xl"
        >
          {/* Header */}
          <div className="flex flex-col gap-6 border-b border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/[0.05] p-10 sm:p-12 sm:flex-row sm:items-center sm:justify-between backdrop-blur-2xl">
            <div className="space-y-2">
              <h2 className="flex items-center gap-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#A51636] dark:text-[#E52B50] leading-tight">
                <MapPin className="h-7 w-7 text-[#A51636] dark:text-[#E52B50]" />
                Campus Spatial Issue Map
              </h2>
              <p className="text-base font-medium text-slate-700 dark:text-zinc-300 tracking-normal">
                Live spatial tracking around {CAMPUS_CONFIG.name}
              </p>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/map"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/50 dark:border-white/20 bg-white/70 dark:bg-white/10 px-7 py-3.5 text-sm font-bold text-[#A51636] dark:text-[#E52B50] backdrop-blur-xl shadow-md transition-all hover:bg-[#A51636] hover:text-white dark:hover:bg-[#C81D42] dark:hover:text-white focus-visible:outline-none"
              >
                <span>Fullscreen Map</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          {/* Map Canvas */}
          <div className="h-[600px] w-full">
            <MapView
              reports={campusReports}
              selectedId={selectedId}
              onSelect={onSelect}
              center={CAMPUS_CONFIG.center}
              zoom={15}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
