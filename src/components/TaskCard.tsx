import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '@/types/study';
import { Check, BookOpen, Code, HelpCircle, Rocket, Clock, ExternalLink, Zap } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  isCompleted: boolean;
  onToggle: () => void;
  index: number;
}

const taskTypeConfig = {
  reading: { icon: BookOpen, label: 'Read', color: 'text-primary', xp: 10 },
  coding: { icon: Code, label: 'Code', color: 'text-accent', xp: 25 },
  quiz: { icon: HelpCircle, label: 'Quiz', color: 'text-primary', xp: 15 },
  project: { icon: Rocket, label: 'Build', color: 'text-accent', xp: 30 },
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, isCompleted, onToggle, index }) => {
  const config = taskTypeConfig[task.type] || taskTypeConfig.reading;
  const Icon = config.icon;
  const [showXp, setShowXp] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  const handleToggle = () => {
    if (!isCompleted) {
      setShowXp(true);
      setJustCompleted(true);
      setTimeout(() => setShowXp(false), 1200);
      setTimeout(() => setJustCompleted(false), 600);
    }
    onToggle();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        "group relative flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 overflow-hidden",
        isCompleted
          ? "bg-primary/[0.03] border-primary/15"
          : "bg-card border-border/50 hover:border-primary/30 hover:shadow-md"
      )}
    >
      {/* Completion flash overlay */}
      <AnimatePresence>
        {justCompleted && (
          <motion.div
            initial={{ opacity: 0.4, scaleX: 0 }}
            animate={{ opacity: 0, scaleX: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute inset-0 bg-primary/10 origin-left z-0 rounded-xl"
          />
        )}
      </AnimatePresence>

      {/* XP popup */}
      <AnimatePresence>
        {showXp && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -28, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute top-2 right-4 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30"
          >
            <Zap className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-mono font-bold text-primary">+{config.xp} XP</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-shrink-0 pt-0.5 relative z-10">
        <motion.div
          animate={justCompleted ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Checkbox
            checked={isCompleted}
            onCheckedChange={handleToggle}
            className="w-5 h-5 rounded-md border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all"
          />
        </motion.div>
      </div>

      <div className="flex-1 min-w-0 relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <Icon className={cn("w-3.5 h-3.5 transition-all", config.color, isCompleted && "opacity-50")} />
          <span className={cn("text-[10px] font-mono uppercase tracking-[0.15em] transition-all", config.color, isCompleted && "opacity-50")}>
            {config.label}
          </span>
          <span className="flex items-center text-[10px] font-mono text-muted-foreground">
            <Clock className="w-3 h-3 mr-0.5" />
            {task.estimatedMinutes}m
          </span>
        </div>
        
        <p className={cn(
          "text-sm transition-all duration-500",
          isCompleted ? "text-muted-foreground/60 line-through decoration-primary/30" : "text-foreground"
        )}>
          {task.description}
        </p>

        {task.resources && task.resources.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {task.resources.map((resource, idx) => (
              <a
                key={idx}
                href={resource}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono rounded-md bg-primary/8 text-primary border border-primary/15 hover:bg-primary/15 transition-colors"
              >
                <ExternalLink className="w-2.5 h-2.5" />
                Resource {idx + 1}
              </a>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="flex-shrink-0 relative z-10"
          >
            <div className="w-6 h-6 rounded-md bg-primary/15 border border-primary/30 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-primary" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
