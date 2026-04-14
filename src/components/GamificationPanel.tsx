import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trophy, Zap, Lock } from 'lucide-react';
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
    <div className="rounded-2xl bg-card border border-border/50 p-4 sm:p-6 overflow-hidden relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, hsl(160 84% 39%) 1px, transparent 0)`,
        backgroundSize: '24px 24px',
      }} />

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0"
            whileHover={{ scale: 1.05, rotate: 3 }}
          >
            <span className="text-2xl sm:text-3xl font-bold text-primary font-mono">{level}</span>
            <motion.div
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Star className="w-3 h-3 text-primary-foreground" />
            </motion.div>
          </motion.div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground truncate">{levelTitle}</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Zap className="w-3 h-3 text-primary" />
              <span className="font-mono">{xp} XP</span>
              <span className="text-border">•</span>
              <span className="font-mono">{Math.round(xpForNextLevel - currentLevelXp)} to next</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, hsl(160 84% 39%), hsl(152 68% 50%), hsl(175 70% 40%))' }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(levelProgress, 100)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Achievements</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">{unlockedBadges.length}/{badges.length}</span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {badges.map((badge, idx) => {
              const unlocked = !!badge.unlockedAt;
              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.04 }}
                  whileHover={unlocked ? { scale: 1.1, y: -2 } : {}}
                  className={cn(
                    "group relative flex flex-col items-center p-2 rounded-xl transition-all cursor-default",
                    unlocked
                      ? "bg-primary/10 border border-primary/20 hover:border-primary/40 hover:shadow-glow"
                      : "bg-muted/10 border border-border/30 opacity-35 grayscale"
                  )}
                >
                  <span className="text-xl sm:text-2xl mb-1 select-none">{badge.icon}</span>
                  <span className="text-[8px] sm:text-[9px] text-center text-foreground font-medium leading-tight line-clamp-2">
                    {badge.name}
                  </span>
                  {!unlocked && (
                    <Lock className="absolute top-1 right-1 w-2.5 h-2.5 text-muted-foreground/40" />
                  )}
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg bg-popover border border-border text-[10px] text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 shadow-lg">
                    {badge.description}
                  </div>
                </motion.div>
              );
            })}
          </div>
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
        className="fixed bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl bg-card border border-primary/30 glow-neon flex items-center gap-3 shadow-2xl"
      >
        <motion.span
          className="text-3xl"
          animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5 }}
        >
          {badge.icon}
        </motion.span>
        <div>
          <p className="text-[10px] text-primary font-mono font-semibold uppercase tracking-wider">Achievement Unlocked!</p>
          <p className="text-foreground font-semibold">{badge.name}</p>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);
