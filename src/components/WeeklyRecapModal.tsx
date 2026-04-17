import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Trophy, Sparkles, Zap, Target, Clock, Flame, Award, Share2, ArrowRight, X } from 'lucide-react';
import { CountUp } from '@/components/CountUp';
import { useConfetti } from '@/hooks/useConfetti';
import type { Badge } from '@/hooks/useGamification';

interface WeeklyRecapModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicLabel: string;
  totalTasks: number;
  totalXp: number;
  level: number;
  levelTitle: string;
  streak: number;
  focusMinutes: number;
  badges: Badge[];
  onShare?: () => void;
  onContinue?: () => void;
}

const StatTile: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  delay: number;
  accent?: string;
}> = ({ icon, label, value, suffix, delay, accent = 'primary' }) => (
  <motion.div
    initial={{ opacity: 0, y: 24, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, type: 'spring', stiffness: 220, damping: 22 }}
    className="relative overflow-hidden rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-4 group"
  >
    <div
      className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity`}
      style={{ background: `hsl(var(--${accent}))` }}
    />
    <div className="relative flex items-center gap-2 mb-2 text-primary">
      {icon}
      <span className="hud-label">{label}</span>
    </div>
    <div className="relative font-mono text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
      <CountUp end={String(value)} duration={1.6} />
      {suffix && <span className="text-sm text-muted-foreground ml-1">{suffix}</span>}
    </div>
  </motion.div>
);

export const WeeklyRecapModal: React.FC<WeeklyRecapModalProps> = ({
  isOpen,
  onClose,
  topicLabel,
  totalTasks,
  totalXp,
  level,
  levelTitle,
  streak,
  focusMinutes,
  badges,
  onShare,
  onContinue,
}) => {
  const { fireConfetti, fireStars } = useConfetti();

  const unlockedBadges = useMemo(() => badges.filter((b) => b.unlockedAt), [badges]);

  useEffect(() => {
    if (!isOpen) return;
    fireStars();
    const t1 = setTimeout(() => fireConfetti(), 500);
    const t2 = setTimeout(() => fireStars(), 1400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isOpen, fireConfetti, fireStars]);

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-primary/30 bg-transparent shadow-none">
        <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-card via-card to-background border border-primary/20">
          {/* Cinematic background layers */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.4, scale: 1 }}
              transition={{ duration: 1.2 }}
              className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, hsl(160 84% 39% / 0.4), transparent 60%)' }}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
                backgroundSize: '32px 32px',
              }}
            />
            {/* Animated rays */}
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: [0, 0.15, 0], scaleY: 1 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="absolute top-0 left-1/2 w-px h-1/2 origin-top"
                style={{
                  background: 'linear-gradient(to bottom, hsl(var(--primary)), transparent)',
                  transform: `translateX(-50%) rotate(${(i - 2) * 18}deg)`,
                }}
              />
            ))}
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-background/60 backdrop-blur border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Content */}
          <div className="relative z-10 p-6 sm:p-8">
            {/* Trophy hero */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.1 }}
              className="flex justify-center mb-4"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/30 blur-2xl animate-pulse-glow" />
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-neon">
                  <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-primary-foreground" />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  className="absolute -inset-3 rounded-full border border-dashed border-primary/40"
                />
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-6"
            >
              <span className="hud-label flex items-center justify-center gap-1.5 mb-2">
                <Sparkles className="w-3 h-3" />
                Protocol Complete
                <Sparkles className="w-3 h-3" />
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-gradient-primary mb-2">
                7 Days. Mastered.
              </h2>
              <p className="text-sm text-muted-foreground">
                You've completed the <span className="text-foreground font-semibold">{topicLabel}</span> protocol.
              </p>
            </motion.div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <StatTile icon={<Target className="w-3.5 h-3.5" />} label="Tasks" value={totalTasks} delay={0.5} />
              <StatTile icon={<Zap className="w-3.5 h-3.5" />} label="XP Earned" value={totalXp} delay={0.6} />
              <StatTile icon={<Clock className="w-3.5 h-3.5" />} label="Focus" value={focusMinutes} suffix="min" delay={0.7} />
              <StatTile icon={<Flame className="w-3.5 h-3.5" />} label="Streak" value={streak} suffix="d" delay={0.8} />
            </div>

            {/* Level callout */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="rounded-xl border border-primary/30 bg-primary/5 p-4 mb-6 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center font-mono font-bold text-primary-foreground">
                  {level}
                </div>
                <div>
                  <span className="hud-label block">Current Rank</span>
                  <span className="text-base font-bold text-foreground">{levelTitle}</span>
                </div>
              </div>
              <Award className="w-6 h-6 text-primary" />
            </motion.div>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="hud-label">Badges Unlocked</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {unlockedBadges.length} / {badges.length}
                </span>
              </div>
              {unlockedBadges.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {unlockedBadges.map((badge, i) => (
                      <motion.div
                        key={badge.id}
                        initial={{ opacity: 0, scale: 0, rotate: -45 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{
                          delay: 1.1 + i * 0.05,
                          type: 'spring',
                          stiffness: 260,
                          damping: 18,
                        }}
                        whileHover={{ scale: 1.1, y: -2 }}
                        title={`${badge.name} — ${badge.description}`}
                        className="group relative flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5"
                      >
                        <span className="text-lg">{badge.icon}</span>
                        <span className="text-xs font-mono text-foreground">{badge.name}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground font-mono">No badges yet — keep going!</p>
              )}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              {onShare && (
                <button
                  onClick={onShare}
                  className="flex-1 h-11 rounded-lg border border-border bg-secondary/50 hover:bg-secondary text-foreground font-mono text-sm flex items-center justify-center gap-2 transition-all magnetic-hover"
                >
                  <Share2 className="w-4 h-4" />
                  Share Recap
                </button>
              )}
              <button
                onClick={() => {
                  onContinue?.();
                  onClose();
                }}
                className="flex-1 h-11 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-mono text-sm font-semibold flex items-center justify-center gap-2 shadow-neon magnetic-hover"
              >
                Choose Next Protocol
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
