import { motion } from 'framer-motion';
import { Building2, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

interface AmritaMetricsProps {
  stats: {
    total: number;
    verified: number;
    resolved: number;
    pending: number;
    inProgress: number;
  };
}

export function AmritaMetrics({ stats }: AmritaMetricsProps) {
  return (
    <section className="relative overflow-hidden bg-[#F5F5F7] dark:bg-[#181818] py-24 sm:py-32 border-b border-[#E5E5E5] dark:border-[#313131] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:gap-8">
          
          {/* Metric 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="glass-card glass-card-hover p-6 sm:p-8 flex flex-col space-y-3"
          >
            <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
              <Building2 className="h-5 w-5 text-[#A51636] dark:text-[#E52B50]" />
              <span>Total Reports</span>
            </div>
            <div className="text-5xl sm:text-6xl font-bold tracking-tight text-[#1D1D1F] dark:text-white leading-none tabular-nums">
              {stats.total}
            </div>
          </motion.div>

          {/* Metric 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="glass-card glass-card-hover p-6 sm:p-8 flex flex-col space-y-3"
          >
            <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
              <ShieldCheck className="h-5 w-5 text-[#A51636] dark:text-[#E52B50]" />
              <span>Verified</span>
            </div>
            <div className="text-5xl sm:text-6xl font-bold tracking-tight text-[#1D1D1F] dark:text-white leading-none tabular-nums">
              {stats.verified}
            </div>
          </motion.div>

          {/* Metric 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="glass-card glass-card-hover p-6 sm:p-8 flex flex-col space-y-3"
          >
            <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
              <CheckCircle2 className="h-5 w-5 text-[#A51636] dark:text-[#E52B50]" />
              <span>Resolved</span>
            </div>
            <div className="text-5xl sm:text-6xl font-bold tracking-tight text-[#A51636] dark:text-[#E52B50] leading-none tabular-nums">
              {stats.resolved}
            </div>
          </motion.div>

          {/* Metric 4 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="glass-card glass-card-hover p-6 sm:p-8 flex flex-col space-y-3"
          >
            <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
              <Clock className="h-5 w-5 text-[#A51636] dark:text-[#E52B50]" />
              <span>In Progress</span>
            </div>
            <div className="text-5xl sm:text-6xl font-bold tracking-tight text-[#1D1D1F] dark:text-white leading-none tabular-nums">
              {stats.inProgress + stats.pending}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
