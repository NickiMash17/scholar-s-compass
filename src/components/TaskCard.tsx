import React from 'react';
import { motion } from 'framer-motion';
import { Task } from '@/types/study';
import { Check, BookOpen, Code, HelpCircle, Rocket, Clock, ExternalLink } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  isCompleted: boolean;
  onToggle: () => void;
  index: number;
}

const taskTypeConfig = {
  reading: { icon: BookOpen, label: 'Read', color: 'text-primary' },
  coding: { icon: Code, label: 'Code', color: 'text-accent' },
  quiz: { icon: HelpCircle, label: 'Quiz', color: 'text-primary' },
  project: { icon: Rocket, label: 'Build', color: 'text-accent' },
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, isCompleted, onToggle, index }) => {
  const config = taskTypeConfig[task.type] || taskTypeConfig.reading;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        "group relative flex items-start gap-4 p-4 rounded-xl border transition-all duration-300",
        isCompleted
          ? "bg-muted/20 border-border/30"
          : "bg-card border-border/50 hover:border-primary/30 hover:shadow-md"
      )}
    >
      <div className="flex-shrink-0 pt-0.5">
        <Checkbox
          checked={isCompleted}
          onCheckedChange={onToggle}
          className="w-5 h-5 rounded-md border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Icon className={cn("w-3.5 h-3.5", config.color)} />
          <span className={cn("text-[10px] font-mono uppercase tracking-[0.15em]", config.color)}>
            {config.label}
          </span>
          <span className="flex items-center text-[10px] font-mono text-muted-foreground">
            <Clock className="w-3 h-3 mr-0.5" />
            {task.estimatedMinutes}m
          </span>
        </div>
        
        <p className={cn(
          "text-sm transition-colors duration-300",
          isCompleted ? "text-muted-foreground line-through" : "text-foreground"
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

      {isCompleted && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex-shrink-0"
        >
          <div className="w-6 h-6 rounded-md bg-primary/15 border border-primary/30 flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-primary" />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
