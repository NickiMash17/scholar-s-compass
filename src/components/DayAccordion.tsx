import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DayPlan } from '@/types/study';
import { TaskCard } from './TaskCard';
import { PomodoroTimer } from './PomodoroTimer';
import { ChevronDown, Clock, Target, Zap, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useConfetti } from '@/hooks/useConfetti';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { usePomodoroStorage } from '@/hooks/usePomodoroStorage';

interface DayAccordionProps {
  day: DayPlan;
  isOpen: boolean;
  onToggle: () => void;
  completedTasks: string[];
  onTaskToggle: (taskId: string) => void;
  index: number;
}

export const DayAccordion: React.FC<DayAccordionProps> = ({
  day,
  isOpen,
  onToggle,
  completedTasks,
  onTaskToggle,
  index,
}) => {
  const { fireConfetti } = useConfetti();
  const { settings } = usePomodoroStorage();
  const { playConfetti, playTaskComplete } = useSoundEffects(settings.soundEnabled);
  const prevCompletedCount = useRef(0);
  
  const completedCount = day.tasks.filter((t) => completedTasks.includes(t.id)).length;
  const isComplete = completedCount === day.tasks.length && day.tasks.length > 0;
  const progress = day.tasks.length > 0 ? (completedCount / day.tasks.length) * 100 : 0;

  // Fire confetti and sound when all tasks are completed
  useEffect(() => {
    if (isComplete && prevCompletedCount.current < day.tasks.length && day.tasks.length > 0) {
      fireConfetti();
      playConfetti();
    }
    prevCompletedCount.current = completedCount;
  }, [isComplete, completedCount, day.tasks.length, fireConfetti, playConfetti]);

  // Handle task toggle with sound
  const handleTaskToggle = (taskId: string) => {
    const wasCompleted = completedTasks.includes(taskId);
    if (!wasCompleted) {
      playTaskComplete();
    }
    onTaskToggle(taskId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={cn(
        "rounded-2xl border overflow-hidden transition-all duration-300",
        isOpen ? "border-amber-500/50 shadow-glow" : "border-border",
        isComplete && "border-green-500/30"
      )}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 bg-card hover:bg-card/80 transition-colors"
      >
        <div className="flex items-center gap-4">
          {/* Day number badge */}
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center font-serif text-xl font-bold transition-colors",
            isComplete ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"
          )}>
            {day.day}
          </div>
          
          <div className="text-left">
            <h3 className="font-serif text-lg font-semibold text-foreground">
              Day {day.day}: {day.focus}
            </h3>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {day.estimatedTime} min
              </span>
              <span className="flex items-center gap-1">
                <Target className="w-3.5 h-3.5" />
                {completedCount}/{day.tasks.length} tasks
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress bar */}
          <div className="hidden sm:block w-24 h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={cn(
                "h-full rounded-full",
                isComplete ? "bg-green-500" : "bg-amber-500"
              )}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0 border-t border-border">
              {/* Pomodoro Timer */}
              <div className="pt-5 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Timer className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                    Focus Timer
                  </span>
                </div>
                <PomodoroTimer />
              </div>

              {/* Tasks */}
              <div className="space-y-3">
                {day.tasks.map((task, idx) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isCompleted={completedTasks.includes(task.id)}
                    onToggle={() => handleTaskToggle(task.id)}
                    index={idx}
                  />
                ))}
              </div>

              {/* Practice Challenge */}
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                    Practice Challenge
                  </span>
                </div>
                <p className="text-sm text-foreground/90">{day.practiceChallenge}</p>
              </div>

              {/* Success Criteria */}
              <div className="mt-4 p-4 rounded-xl bg-muted/30 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-semibold text-green-400 uppercase tracking-wider">
                    Success Criteria
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{day.successCriteria}</p>
              </div>

              {/* Celebration message when complete */}
              <AnimatePresence>
                {isComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center"
                  >
                    <span className="text-green-400 font-semibold">
                      🎉 All tasks completed! Great work!
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
