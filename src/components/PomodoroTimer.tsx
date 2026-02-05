import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Brain, Settings, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePomodoroStorage } from '@/hooks/usePomodoroStorage';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { PomodoroSettingsModal } from './PomodoroSettingsModal';

interface PomodoroTimerProps {
  onSessionComplete?: () => void;
}

type TimerMode = 'work' | 'break';

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onSessionComplete }) => {
  const { settings, stats, updateSettings, recordSession, getTodaySessions } = usePomodoroStorage();
  const { playTimerComplete, playBreakComplete } = useSoundEffects(settings.soundEnabled);

  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const totalTime = mode === 'work' ? settings.workDuration * 60 : settings.breakDuration * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const todaySessions = getTodaySessions();

  // Update timer when settings change
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(mode === 'work' ? settings.workDuration * 60 : settings.breakDuration * 60);
    }
  }, [settings.workDuration, settings.breakDuration, mode, isRunning]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleComplete = useCallback(() => {
    if (mode === 'work') {
      recordSession(settings.workDuration);
      playTimerComplete();
      setMode('break');
      setTimeLeft(settings.breakDuration * 60);
      onSessionComplete?.();
    } else {
      playBreakComplete();
      setMode('work');
      setTimeLeft(settings.workDuration * 60);
    }
    setIsRunning(false);
  }, [mode, settings.workDuration, settings.breakDuration, onSessionComplete, recordSession, playTimerComplete, playBreakComplete]);

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
    setTimeLeft(mode === 'work' ? settings.workDuration * 60 : settings.breakDuration * 60);
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(newMode === 'work' ? settings.workDuration * 60 : settings.breakDuration * 60);
    setIsRunning(false);
  };

  return (
    <>
      <div className="rounded-xl bg-card border border-border p-4">
        {/* Header with settings */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setShowStats(!showStats)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{stats.totalSessions} total</span>
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="w-7 h-7 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => switchMode('work')}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-all",
              mode === 'work'
                ? "bg-primary/20 text-primary"
                : "bg-muted/50 text-muted-foreground hover:text-foreground"
            )}
          >
            <Brain className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Focus</span>
            <span className="hidden sm:inline text-xs opacity-70">({settings.workDuration}m)</span>
          </button>
          <button
            onClick={() => switchMode('break')}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-all",
              mode === 'break'
                ? "bg-green-500/20 text-green-400"
                : "bg-muted/50 text-muted-foreground hover:text-foreground"
            )}
          >
            <Coffee className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Break</span>
            <span className="hidden sm:inline text-xs opacity-70">({settings.breakDuration}m)</span>
          </button>
        </div>

        {/* Timer Display */}
        <div className="relative flex items-center justify-center mb-4">
          {/* Progress Ring */}
          <svg className="w-28 h-28 sm:w-32 sm:h-32 -rotate-90" viewBox="0 0 100 100">
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
            <span className="font-mono text-2xl sm:text-3xl font-bold text-foreground">
              {formatTime(timeLeft)}
            </span>
            <span className={cn(
              "text-[10px] sm:text-xs font-medium uppercase tracking-wider mt-1",
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
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <motion.button
            onClick={toggleTimer}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-background transition-colors",
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
                  <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="play"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-muted/50 flex items-center justify-center">
            <span className="text-xs sm:text-sm font-semibold text-foreground">{todaySessions}</span>
          </div>
        </div>

        {/* Sessions Label */}
        <p className="text-center text-[10px] sm:text-xs text-muted-foreground mt-2">
          {todaySessions} {todaySessions === 1 ? 'session' : 'sessions'} today • {Math.floor(stats.totalFocusMinutes / 60)}h {stats.totalFocusMinutes % 60}m total
        </p>

        {/* Stats Panel */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">This week</p>
                <div className="flex items-end justify-between gap-1 h-16">
                  {usePomodoroStorage().getWeeklyStats().map((day, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                      <div 
                        className={cn(
                          "w-full rounded-sm transition-all",
                          day.sessions > 0 ? "bg-primary" : "bg-muted/30"
                        )}
                        style={{ height: `${Math.max(4, (day.sessions / 8) * 100)}%` }}
                      />
                      <span className="text-[8px] sm:text-[10px] text-muted-foreground">{day.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Settings Modal */}
      <PomodoroSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSave={updateSettings}
      />
    </>
  );
};
