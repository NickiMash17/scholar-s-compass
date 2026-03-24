import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trophy, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/hooks/useGamification';

interface GamificationPanelProps {
  xp: number;
  level: number;
  levelTitle: string;
  levelProgress: number;
  currentLevelXp: number;
  xpForNextLevel: number;
  badges: Badge[];
}

export const GamificationPanel: React.FC<GamificationPanelProps> = ({
  xp, level, levelTitle, levelProgress, currentLevelXp, xpForNextLevel, badges,
}) => {
  const unlockedBadges = badges.filter(b => b.unlockedAt);

  return (
    <div className="rounded-2xl bg-card border border-border p-4 sm:p-6">
      <div className="flex items-center gap-4 mb-4">
        <motion.div
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0"
          whileHover={{ scale: 1.05, rotate: 3 }}
        >
          <span className="text-2xl sm:text-3xl font-bold text-primary">{level}</span>
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <Star className="w-3 h-3 text-primary-foreground" />
          </div>
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-foreground truncate">{levelTitle}</h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Zap className="w-3 h-3 text-primary" />
            <span>{xp} XP total</span>
            <span>•</span>
            <span>{Math.round(xpForNextLevel - currentLevelXp)} XP to next level</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(levelProgress, 100)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Badges ({unlockedBadges.length}/{badges.length})</span>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-5 gap-2">
          {badges.map((badge, idx) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={cn(
                "group relative flex flex-col items-center p-2 rounded-xl transition-all",
                badge.unlockedAt ? "bg-primary/10 border border-primary/20" : "bg-muted/20 border border-border opacity-40"
              )}
            >
              <span className="text-xl sm:text-2xl mb-1">{badge.icon}</span>
              <span className="text-[9px] sm:text-[10px] text-center text-foreground font-medium leading-tight line-clamp-2">{badge.name}</span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-md bg-popover border border-border text-[10px] text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 shadow-lg">
                {badge.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const BadgeUnlockToast: React.FC<{ badge: Badge | null }> = ({ badge }) => (
  <AnimatePresence>
    {badge && (
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.8 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl bg-card border border-primary/30 shadow-glow-lg flex items-center gap-3"
      >
        <span className="text-3xl">{badge.icon}</span>
        <div>
          <p className="text-xs text-primary font-semibold uppercase tracking-wider">Badge Unlocked!</p>
          <p className="text-foreground font-semibold">{badge.name}</p>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);
