import { useState, useEffect, useCallback } from 'react';

interface PomodoroSettings {
  workDuration: number;
  breakDuration: number;
  soundEnabled: boolean;
}

interface PomodoroStats {
  totalSessions: number;
  totalFocusMinutes: number;
  lastSessionDate: string | null;
  dailySessions: Record<string, number>;
}

interface UsePomodoroStorageReturn {
  settings: PomodoroSettings;
  stats: PomodoroStats;
  updateSettings: (settings: PomodoroSettings) => void;
  recordSession: (durationMinutes: number) => void;
  getTodaySessions: () => number;
  getWeeklyStats: () => { day: string; sessions: number }[];
}

const SETTINGS_KEY = 'pomodoro-settings';
const STATS_KEY = 'pomodoro-stats';

const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  breakDuration: 5,
  soundEnabled: true,
};

const DEFAULT_STATS: PomodoroStats = {
  totalSessions: 0,
  totalFocusMinutes: 0,
  lastSessionDate: null,
  dailySessions: {},
};

export const usePomodoroStorage = (): UsePomodoroStorageReturn => {
  const [settings, setSettings] = useState<PomodoroSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [stats, setStats] = useState<PomodoroStats>(() => {
    try {
      const stored = localStorage.getItem(STATS_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  }, [stats]);

  const updateSettings = useCallback((newSettings: PomodoroSettings) => {
    setSettings(newSettings);
  }, []);

  const recordSession = useCallback((durationMinutes: number) => {
    const today = new Date().toISOString().split('T')[0];
    
    setStats((prev) => ({
      totalSessions: prev.totalSessions + 1,
      totalFocusMinutes: prev.totalFocusMinutes + durationMinutes,
      lastSessionDate: today,
      dailySessions: {
        ...prev.dailySessions,
        [today]: (prev.dailySessions[today] || 0) + 1,
      },
    }));
  }, []);

  const getTodaySessions = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return stats.dailySessions[today] || 0;
  }, [stats.dailySessions]);

  const getWeeklyStats = useCallback(() => {
    const days: { day: string; sessions: number }[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      days.push({
        day: dayName,
        sessions: stats.dailySessions[dateStr] || 0,
      });
    }
    
    return days;
  }, [stats.dailySessions]);

  return {
    settings,
    stats,
    updateSettings,
    recordSession,
    getTodaySessions,
    getWeeklyStats,
  };
};
