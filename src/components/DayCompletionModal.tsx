import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Zap, Clock, Target, ArrowRight, Sparkles } from 'lucide-react';
import { useConfetti } from '@/hooks/useConfetti';

interface DayCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue?: () => void;
  dayNumber: number;
  dayFocus: string;
  tasksCompleted: number;
  estimatedMinutes: number;
  xpEarned: number;
  hasNextDay: boolean;
}

export const DayCompletionModal: React.FC<DayCompletionModalProps> = ({
  isOpen,
  onClose,
  onContinue,
  dayNumber,
  dayFocus,
  tasksCompleted,
  estimatedMinutes,
  xpEarned,
  hasNextDay,
}) => {
  const { fireConfetti } = useConfetti();

  useEffect(() => {
    if (isOpen) {
      fireConfetti();
      const t = setTimeout(() => fireConfetti(), 600);
      return () => clearTimeout(t);
    }
  }, [isOpen, fireConfetti]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl bg-card border border-primary/30 shadow-[0_0_60px_-10px_hsl(160_84%_39%/0.4)] overflow-hidden"
          >
            {/* Glow background */}
            <div className="absolute inset-0 pointer-events-none opacity-60">
              <div
                className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl"
                style={{ background: 'radial-gradient(circle, hsl(160 84% 39% / 0.3), transparent 70%)' }}
              />
              <div
                className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-3xl"
                style={{ background: 'radial-gradient(circle, hsl(152 68% 50% / 0.2), transparent 70%)' }}
              />
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative p-6 sm:p-8 text-center">
              {/* Trophy */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.15 }}
                className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-5 shadow-[0_0_40px_-5px_hsl(160_84%_39%/0.6)]"
              >
                <Trophy className="w-10 h-10 text-primary-foreground" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary">
                    Day {dayNumber} Complete
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  Protocol Successful
                </h2>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                  {dayFocus}
                </p>
              </motion.div>

              {/* Stats grid */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="grid grid-cols-3 gap-2 sm:gap-3 mb-6"
              >
                <StatTile icon={<Target className="w-4 h-4" />} value={tasksCompleted} label="Tasks" />
                <StatTile icon={<Clock className="w-4 h-4" />} value={`${estimatedMinutes}m`} label="Focus" />
                <StatTile icon={<Zap className="w-4 h-4" />} value={`+${xpEarned}`} label="XP" />
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-2"
              >
                {hasNextDay ? (
                  <button
                    onClick={() => {
                      onContinue?.();
                      onClose();
                    }}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_30px_-5px_hsl(160_84%_39%/0.5)] transition-shadow"
                  >
                    Continue to Day {dayNumber + 1}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="rounded-xl bg-primary/10 border border-primary/30 p-4">
                    <p className="text-sm font-semibold text-primary">
                      🎉 You completed the entire protocol!
                    </p>
                  </div>
                )}
                <button
                  onClick={onClose}
                  className="w-full h-10 rounded-xl text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                >
                  Stay on this day
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const StatTile: React.FC<{ icon: React.ReactNode; value: React.ReactNode; label: string }> = ({
  icon,
  value,
  label,
}) => (
  <div className="rounded-xl bg-muted/30 border border-border/50 p-3 flex flex-col items-center gap-1">
    <div className="text-primary">{icon}</div>
    <div className="text-lg font-bold text-foreground font-mono">{value}</div>
    <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">{label}</div>
  </div>
);
