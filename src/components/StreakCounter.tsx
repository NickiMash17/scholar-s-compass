import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface StreakCounterProps {
  streak: number;
  className?: string;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({ streak, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center gap-2 ${className}`}
    >
      <motion.div
        className="relative"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Flame className="w-8 h-8 text-orange-500" />
        <div className="absolute inset-0 blur-md">
          <Flame className="w-8 h-8 text-orange-500/50" />
        </div>
      </motion.div>
      
      <div className="flex flex-col">
        <motion.span
          key={streak}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-foreground"
        >
          {streak}
        </motion.span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">
          Day Streak
        </span>
      </div>
    </motion.div>
  );
};
