import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Map, Plus, Users, LayoutDashboard, UtensilsCrossed } from 'lucide-react';
import { useBrand } from '@/hooks/useBrand';
import { cn } from '@/utils/cn';

/**
 * Mobile-native bottom navigation bar (visible ONLY on screens < 768px).
 *
 * Provides instant 1-thumb ergonomics on mobile phones and in standalone PWA mode,
 * while leaving desktop browsers completely untouched with their standard top navbar.
 */
export function MobileBottomNav() {
  const location = useLocation();
  const { isAmrita } = useBrand();

  // Hide on auth & onboarding routes
  const isAuthRoute =
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/auth') ||
    location.pathname.startsWith('/reset');

  if (isAuthRoute) return null;

  const homePath = isAmrita ? '/amrita' : '/';
  const mapPath = isAmrita ? '/amrita/map' : '/map';
  const reportPath = isAmrita ? '/amrita/report' : '/report';
  const feedPath = isAmrita ? '/amrita/feed' : '/community';
  const dashboardPath = '/dashboard';

  // Highlight check helpers
  const isHomeActive =
    location.pathname === homePath ||
    (isAmrita && location.pathname === '/amrita') ||
    (!isAmrita && location.pathname === '/');
  const isMapActive = location.pathname.startsWith('/map') || location.pathname.startsWith('/amrita/map');
  const isReportActive =
    location.pathname.startsWith('/report') ||
    location.pathname.startsWith('/amrita/report') ||
    location.pathname.startsWith('/food-hygiene');
  const isFeedActive =
    location.pathname.startsWith('/community') || location.pathname.startsWith('/amrita/feed');
  const isDashboardActive = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');

  return (
    <nav
      aria-label="Mobile navigation"
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 block md:hidden',
        'border-t border-slate-200/80 bg-white/95 backdrop-blur-xl dark:border-white/5 dark:bg-black/95',
        'transition-all duration-200 shadow-[0_-8px_24px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_24px_-4px_rgba(0,0,0,0.6)]',
        'pb-safe'
      )}
    >
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
        {/* Tab 1: Home */}
        <NavLink
          to={homePath}
          className="relative flex flex-1 flex-col items-center justify-center py-1 text-center transition-colors"
        >
          <motion.div whileTap={{ scale: 0.88 }} className="flex flex-col items-center">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-xl transition-colors',
                isHomeActive
                  ? isAmrita
                    ? 'bg-rose-100 text-[#A51636] dark:bg-rose-950/50 dark:text-rose-300'
                    : 'bg-primary-100 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              )}
            >
              <Home className="h-5 w-5" />
            </div>
            <span
              className={cn(
                'text-[10px] font-semibold tracking-tight transition-colors mt-0.5',
                isHomeActive
                  ? isAmrita
                    ? 'font-bold text-[#A51636] dark:text-rose-300'
                    : 'font-bold text-primary-700 dark:text-primary-300'
                  : 'text-slate-500 dark:text-slate-400'
              )}
            >
              Home
            </span>
          </motion.div>
        </NavLink>

        {/* Tab 2: Map */}
        <NavLink
          to={mapPath}
          className="relative flex flex-1 flex-col items-center justify-center py-1 text-center transition-colors"
        >
          <motion.div whileTap={{ scale: 0.88 }} className="flex flex-col items-center">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-xl transition-colors',
                isMapActive
                  ? isAmrita
                    ? 'bg-rose-100 text-[#A51636] dark:bg-rose-950/50 dark:text-rose-300'
                    : 'bg-primary-100 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              )}
            >
              <Map className="h-5 w-5" />
            </div>
            <span
              className={cn(
                'text-[10px] font-semibold tracking-tight transition-colors mt-0.5',
                isMapActive
                  ? isAmrita
                    ? 'font-bold text-[#A51636] dark:text-rose-300'
                    : 'font-bold text-primary-700 dark:text-primary-300'
                  : 'text-slate-500 dark:text-slate-400'
              )}
            >
              Map
            </span>
          </motion.div>
        </NavLink>

        {/* Center Primary Action: Elevated Report Button */}
        <NavLink
          to={reportPath}
          className="relative -mt-6 flex flex-1 flex-col items-center justify-center text-center focus:outline-none"
        >
          <motion.div
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            className={cn(
              'flex h-14 w-14 items-center justify-center rounded-2xl shadow-xl transition-all',
              'border-4 border-white dark:border-black',
              isAmrita
                ? 'bg-gradient-to-tr from-[#84122B] to-[#E52B50] text-white shadow-rose-900/40'
                : 'bg-gradient-to-tr from-primary-700 to-primary-500 text-white shadow-primary-700/40',
              isReportActive && 'ring-2 ring-offset-2 ring-primary-500 dark:ring-offset-black'
            )}
          >
            <Plus className="h-7 w-7 stroke-[2.75]" />
          </motion.div>
          <span
            className={cn(
              'text-[10px] font-bold tracking-tight mt-1 transition-colors',
              isReportActive
                ? isAmrita
                  ? 'text-[#A51636] dark:text-rose-300'
                  : 'text-primary-700 dark:text-primary-300'
                : 'text-slate-600 dark:text-slate-300'
            )}
          >
            Report
          </span>
        </NavLink>

        {/* Tab 4: Feed / Community */}
        <NavLink
          to={feedPath}
          className="relative flex flex-1 flex-col items-center justify-center py-1 text-center transition-colors"
        >
          <motion.div whileTap={{ scale: 0.88 }} className="flex flex-col items-center">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-xl transition-colors',
                isFeedActive
                  ? isAmrita
                    ? 'bg-rose-100 text-[#A51636] dark:bg-rose-950/50 dark:text-rose-300'
                    : 'bg-primary-100 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              )}
            >
              {isAmrita ? <UtensilsCrossed className="h-5 w-5" /> : <Users className="h-5 w-5" />}
            </div>
            <span
              className={cn(
                'text-[10px] font-semibold tracking-tight transition-colors mt-0.5',
                isFeedActive
                  ? isAmrita
                    ? 'font-bold text-[#A51636] dark:text-rose-300'
                    : 'font-bold text-primary-700 dark:text-primary-300'
                  : 'text-slate-500 dark:text-slate-400'
              )}
            >
              {isAmrita ? 'Feed' : 'Community'}
            </span>
          </motion.div>
        </NavLink>

        {/* Tab 5: Dashboard */}
        <NavLink
          to={dashboardPath}
          className="relative flex flex-1 flex-col items-center justify-center py-1 text-center transition-colors"
        >
          <motion.div whileTap={{ scale: 0.88 }} className="flex flex-col items-center">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-xl transition-colors',
                isDashboardActive
                  ? isAmrita
                    ? 'bg-rose-100 text-[#A51636] dark:bg-rose-950/50 dark:text-rose-300'
                    : 'bg-primary-100 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              )}
            >
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <span
              className={cn(
                'text-[10px] font-semibold tracking-tight transition-colors mt-0.5',
                isDashboardActive
                  ? isAmrita
                    ? 'font-bold text-[#A51636] dark:text-rose-300'
                    : 'font-bold text-primary-700 dark:text-primary-300'
                  : 'text-slate-500 dark:text-slate-400'
              )}
            >
              Status
            </span>
          </motion.div>
        </NavLink>
      </div>
    </nav>
  );
}
