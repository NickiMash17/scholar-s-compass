import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, BarChart3, User, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStudy } from '@/context/StudyContext';

const MobileBottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useStudy();

  // Hide on pages with their own bottom CTAs
  const hiddenRoutes = ['/diagnostic', '/generate', '/auth'];
  if (hiddenRoutes.some(r => location.pathname.startsWith(r))) return null;

  const items = [
    { icon: Home, label: 'Home', path: '/' },
    ...(profile?.generatedPlan
      ? [{ icon: BookOpen, label: 'Plan', path: '/plan' }]
      : []),
    { icon: BarChart3, label: 'Progress', path: '/progress' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.3 }}
      className="fixed bottom-0 inset-x-0 z-50 sm:hidden"
    >
      {/* Gradient fade above */}
      <div className="h-6 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      
      <div className="bg-card/95 backdrop-blur-xl border-t border-border/40 px-2 pb-[env(safe-area-inset-bottom,8px)]">
        <div className="flex items-center justify-around py-1.5">
          {items.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  'relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px]',
                  active
                    ? 'text-primary'
                    : 'text-muted-foreground active:text-foreground'
                )}
              >
                {active && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -top-1.5 w-8 h-0.5 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon className={cn('w-5 h-5', active && 'drop-shadow-[0_0_6px_hsl(var(--primary)/0.5)]')} />
                <span className={cn(
                  'text-[9px] font-mono uppercase tracking-wider',
                  active ? 'font-bold' : 'font-medium'
                )}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
};

export default MobileBottomNav;
