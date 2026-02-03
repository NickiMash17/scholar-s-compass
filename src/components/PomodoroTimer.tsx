import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PomodoroTimerProps {
  onSessionComplete?: () => void;
}

type TimerMode = 'work' | 'break';

const WORK_DURATION = 25 * 60; // 25 minutes in seconds
const BREAK_DURATION = 5 * 60; // 5 minutes in seconds

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onSessionComplete }) => {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);

  const totalTime = mode === 'work' ? WORK_DURATION : BREAK_DURATION;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleComplete = useCallback(() => {
    if (mode === 'work') {
      setSessions((prev) => prev + 1);
      setMode('break');
      setTimeLeft(BREAK_DURATION);
      onSessionComplete?.();
    } else {
      setMode('work');
      setTimeLeft(WORK_DURATION);
    }
    setIsRunning(false);
  }, [mode, onSessionComplete]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, handleComplete]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? WORK_DURATION : BREAK_DURATION);
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(newMode === 'work' ? WORK_DURATION : BREAK_DURATION);
    setIsRunning(false);
  };

  return (
    <div className="rounded-xl bg-card border border-border p-4">
      {/* Mode Toggle */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => switchMode('work')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all",
            mode === 'work'
              ? "bg-primary/20 text-primary"
              : "bg-muted/50 text-muted-foreground hover:text-foreground"
          )}
        >
          <Brain className="w-4 h-4" />
          Focus
        </button>
        <button
          onClick={() => switchMode('break')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all",
            mode === 'break'
              ? "bg-green-500/20 text-green-400"
              : "bg-muted/50 text-muted-foreground hover:text-foreground"
          )}
        >
          <Coffee className="w-4 h-4" />
          Break
        </button>
      </div>

      {/* Timer Display */}
      <div className="relative flex items-center justify-center mb-4">
        {/* Progress Ring */}
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-muted/30"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            className={cn(mode === 'work' ? "text-primary" : "text-green-400")}
            strokeDasharray={283}
            initial={{ strokeDashoffset: 283 }}
            animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
            transition={{ duration: 0.5 }}
          />
        </svg>

        {/* Time */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-3xl font-bold text-foreground">
            {formatTime(timeLeft)}
          </span>
          <span className={cn(
            "text-xs font-medium uppercase tracking-wider mt-1",
            mode === 'work' ? "text-primary" : "text-green-400"
          )}>
            {mode === 'work' ? 'Focus Time' : 'Break Time'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={resetTimer}
          className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        
        <motion.button
          onClick={toggleTimer}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center text-background transition-colors",
            mode === 'work' 
              ? "bg-primary hover:bg-primary/90" 
              : "bg-green-500 hover:bg-green-500/90"
          )}
        >
          <AnimatePresence mode="wait">
            {isRunning ? (
              <motion.div
                key="pause"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Pause className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="play"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Play className="w-6 h-6 ml-0.5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
          <span className="text-sm font-semibold text-foreground">{sessions}</span>
        </div>
      </div>

      {/* Sessions Label */}
      <p className="text-center text-xs text-muted-foreground mt-2">
        {sessions} {sessions === 1 ? 'session' : 'sessions'} completed
      </p>
    </div>
  );
};
