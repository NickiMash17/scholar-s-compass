import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStudy } from '@/context/StudyContext';
import { Sparkles, ArrowRight, Flame } from 'lucide-react';

export const WelcomeBackBanner: React.FC = () => {
  const navigate = useNavigate();
  const { profile, getCompletionPercentage } = useStudy();

  if (!profile?.generatedPlan) return null;

  const percentage = getCompletionPercentage();
  const streak = profile.progress.streak || 1;
  const completedCount = profile.progress.completedTasks.length;
  const totalTasks = profile.generatedPlan.days.reduce((acc, d) => acc + d.tasks.length, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="container mx-auto px-4 mb-8"
    >
      <motion.button
        onClick={() => navigate('/plan')}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full max-w-4xl mx-auto block"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5 border border-primary/30 p-5 sm:p-6">
          {/* Animated shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />

          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm text-primary font-semibold">Welcome back! Continue learning</p>
                <p className="text-lg font-serif font-bold text-foreground">{profile.topicLabel}</p>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span>{percentage}% complete</span>
                  <span>•</span>
                  <span>{completedCount}/{totalTasks} tasks</span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    {streak}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-primary flex-shrink-0">
              <span className="hidden sm:inline text-sm font-medium">Continue</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative mt-4 w-full h-1.5 bg-muted/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-amber-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
};
