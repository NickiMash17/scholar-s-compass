import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      className={cn(
        "relative w-14 h-8 rounded-full p-1 transition-colors duration-300",
        isDark ? "bg-muted" : "bg-amber-100"
      )}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2">
        <Sun className={cn(
          "w-4 h-4 transition-opacity duration-300",
          isDark ? "opacity-30 text-muted-foreground" : "opacity-100 text-amber-500"
        )} />
        <Moon className={cn(
          "w-4 h-4 transition-opacity duration-300",
          isDark ? "opacity-100 text-primary" : "opacity-30 text-muted-foreground"
        )} />
      </div>

      {/* Slider */}
      <motion.div
        className={cn(
          "w-6 h-6 rounded-full shadow-md relative z-10",
          isDark ? "bg-primary" : "bg-background"
        )}
        animate={{ x: isDark ? 24 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );
};
