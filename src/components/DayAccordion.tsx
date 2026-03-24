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
  day, isOpen, onToggle, completedTasks, onTaskToggle, index,
}) => {
  const { fireConfetti } = useConfetti();
  const { settings } = usePomodoroStorage();
  const { playConfetti, playTaskComplete } = useSoundEffects(settings.soundEnabled);
  const prevCompletedCount = useRef(0);
  
  const completedCount = day.tasks.filter((t) => completedTasks.includes(t.id)).length;
  const isComplete = completedCount === day.tasks.length && day.tasks.length > 0;
  const progress = day.tasks.length > 0 ? (completedCount / day.tasks.length) * 100 : 0;

  useEffect(() => {
    if (isComplete && prevCompletedCount.current < day.tasks.length && day.tasks.length > 0) {
      fireConfetti();
      playConfetti();
    }
    prevCompletedCount.current = completedCount;
  }, [isComplete, completedCount, day.tasks.length, fireConfetti, playConfetti]);

  const handleTaskToggle = (taskId: string) => {
    const wasCompleted = completedTasks.includes(taskId);
    if (!wasCompleted) playTaskComplete();
    onTaskToggle(taskId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={cn(
        "rounded-2xl border overflow-hidden transition-all duration-300",
        isOpen ? "border-primary/30 glow-neon" : "border-border/50",
        isComplete && "border-primary/20"
      )}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 bg-card hover:bg-card/80 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center font-mono text-xl font-bold transition-all border",
            isComplete ? "bg-primary/15 text-primary border-primary/30" : "bg-muted/50 text-foreground border-border"
          )}>
            {day.day}
          </div>
          <div className="text-left">
            <h3 className="text-base sm:text-lg font-bold text-foreground">Day {day.day}: {day.focus}</h3>
            <div className="flex items-center gap-3 mt-1 text-xs font-mono text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-primary/60" />{day.estimatedTime}m</span>
              <span className="flex items-center gap-1"><Target className="w-3 h-3 text-primary/60" />{completedCount}/{day.tasks.length}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block w-24 h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={cn("h-full rounded-full", isComplete ? "bg-primary" : "bg-primary/70")}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0 border-t border-border/50">
              <div className="pt-5 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Timer className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-primary">Focus Timer</span>
                </div>
                <PomodoroTimer />
              </div>

              <div className="space-y-3">
                {day.tasks.map((task, idx) => (
                  <TaskCard key={task.id} task={task} isCompleted={completedTasks.includes(task.id)} onToggle={() => handleTaskToggle(task.id)} index={idx} />
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-card border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-primary">Practice Challenge</span>
                </div>
                <p className="text-sm text-foreground/90">{day.practiceChallenge}</p>
              </div>

              <div className="mt-4 p-4 rounded-xl bg-muted/20 border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-primary/70">Success Criteria</span>
                </div>
                <p className="text-sm text-muted-foreground">{day.successCriteria}</p>
              </div>

              <AnimatePresence>
                {isComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/20 text-center"
                  >
                    <span className="text-primary font-mono font-semibold text-sm">✓ ALL TASKS COMPLETED — PROTOCOL SUCCESSFUL</span>
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
