import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DayPlan } from '@/types/study';
import { TaskCard } from './TaskCard';
import { ChevronDown, Clock, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const completedCount = day.tasks.filter((t) => completedTasks.includes(t.id)).length;
  const isComplete = completedCount === day.tasks.length;
  const progress = day.tasks.length > 0 ? (completedCount / day.tasks.length) * 100 : 0;

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
            <div className="p-5 pt-0 space-y-4 border-t border-border">
              {/* Tasks */}
              <div className="space-y-3 pt-5">
                {day.tasks.map((task, idx) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isCompleted={completedTasks.includes(task.id)}
                    onToggle={() => onTaskToggle(task.id)}
                    index={idx}
                  />
                ))}
              </div>

              {/* Practice Challenge */}
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-semibold text-amber-400 uppercase tracking-wider">
                    Practice Challenge
                  </span>
                </div>
                <p className="text-sm text-foreground/90">{day.practiceChallenge}</p>
              </div>

              {/* Success Criteria */}
              <div className="p-4 rounded-xl bg-muted/30 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-semibold text-green-400 uppercase tracking-wider">
                    Success Criteria
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{day.successCriteria}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
