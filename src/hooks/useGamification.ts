import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'ai-study-coach-gamification';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
}

export interface GamificationState {
  xp: number;
  level: number;
  badges: Badge[];
  activityLog: Record<string, number>; // date string -> task count
}

const XP_PER_LEVEL = 200;

const XP_REWARDS: Record<string, number> = {
  reading: 15,
  coding: 30,
  quiz: 20,
  project: 50,
  day_complete: 100,
  streak_3: 75,
  streak_7: 200,
};

const DEFAULT_BADGES: Badge[] = [
  { id: 'first_task', name: 'First Step', description: 'Complete your first task', icon: '🌱', unlockedAt: null },
  { id: 'five_tasks', name: 'Getting Started', description: 'Complete 5 tasks', icon: '⚡', unlockedAt: null },
  { id: 'twenty_tasks', name: 'Dedicated Learner', description: 'Complete 20 tasks', icon: '📚', unlockedAt: null },
  { id: 'first_day', name: 'Day One Done', description: 'Complete all tasks for a day', icon: '🎯', unlockedAt: null },
  { id: 'streak_3', name: 'On Fire', description: 'Reach a 3-day streak', icon: '🔥', unlockedAt: null },
  { id: 'streak_7', name: 'Unstoppable', description: 'Reach a 7-day streak', icon: '💎', unlockedAt: null },
  { id: 'half_plan', name: 'Halfway There', description: 'Complete 50% of your plan', icon: '🏔️', unlockedAt: null },
  { id: 'full_plan', name: 'Master Scholar', description: 'Complete your entire plan', icon: '🏆', unlockedAt: null },
  { id: 'focus_hour', name: 'Deep Focus', description: 'Log 60 minutes of focus time', icon: '🧠', unlockedAt: null },
  { id: 'focus_five', name: 'Focus Champion', description: 'Log 5 hours of focus time', icon: '⏱️', unlockedAt: null },
];

const getInitialState = (): GamificationState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with any new badges
      const existingIds = new Set(parsed.badges?.map((b: Badge) => b.id) || []);
      const mergedBadges = [
        ...(parsed.badges || []),
        ...DEFAULT_BADGES.filter(b => !existingIds.has(b.id)),
      ];
      return { ...parsed, badges: mergedBadges };
    }
  } catch {}
  return { xp: 0, level: 1, badges: [...DEFAULT_BADGES], activityLog: {} };
};

export function useGamification() {
  const [state, setState] = useState<GamificationState>(getInitialState);
  const [newBadge, setNewBadge] = useState<Badge | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const getLevel = (xp: number) => Math.max(1, Math.floor(xp / XP_PER_LEVEL) + 1);
  const getXpForNextLevel = () => (state.level) * XP_PER_LEVEL;
  const getCurrentLevelXp = () => state.xp - (state.level - 1) * XP_PER_LEVEL;
  const getLevelProgress = () => (getCurrentLevelXp() / XP_PER_LEVEL) * 100;

  const getLevelTitle = () => {
    if (state.level >= 10) return 'Grand Master';
    if (state.level >= 8) return 'Expert';
    if (state.level >= 6) return 'Advanced';
    if (state.level >= 4) return 'Intermediate';
    if (state.level >= 2) return 'Apprentice';
    return 'Novice';
  };

  const unlockBadge = useCallback((badgeId: string) => {
    setState(prev => {
      const badge = prev.badges.find(b => b.id === badgeId);
      if (!badge || badge.unlockedAt) return prev;
      const updated = prev.badges.map(b =>
        b.id === badgeId ? { ...b, unlockedAt: new Date().toISOString() } : b
      );
      const unlockedBadge = updated.find(b => b.id === badgeId)!;
      setNewBadge(unlockedBadge);
      setTimeout(() => setNewBadge(null), 4000);
      return { ...prev, badges: updated };
    });
  }, []);

  const addXp = useCallback((taskType: string) => {
    const xpGain = XP_REWARDS[taskType] || 10;
    setState(prev => {
      const newXp = prev.xp + xpGain;
      const newLevel = getLevel(newXp);
      return { ...prev, xp: newXp, level: newLevel };
    });
    return XP_REWARDS[taskType] || 10;
  }, []);

  const logActivity = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    setState(prev => ({
      ...prev,
      activityLog: {
        ...prev.activityLog,
        [today]: (prev.activityLog[today] || 0) + 1,
      },
    }));
  }, []);

  const checkBadges = useCallback((completedCount: number, streak: number, percentage: number, focusMinutes: number) => {
    if (completedCount >= 1) unlockBadge('first_task');
    if (completedCount >= 5) unlockBadge('five_tasks');
    if (completedCount >= 20) unlockBadge('twenty_tasks');
    if (streak >= 3) unlockBadge('streak_3');
    if (streak >= 7) unlockBadge('streak_7');
    if (percentage >= 50) unlockBadge('half_plan');
    if (percentage >= 100) unlockBadge('full_plan');
    if (focusMinutes >= 60) unlockBadge('focus_hour');
    if (focusMinutes >= 300) unlockBadge('focus_five');
  }, [unlockBadge]);

  const unlockDayBadge = useCallback(() => {
    unlockBadge('first_day');
    addXp('day_complete');
  }, [unlockBadge, addXp]);

  const getActivityData = useCallback(() => {
    const days: { date: string; count: number }[] = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      days.push({ date: key, count: state.activityLog[key] || 0 });
    }
    return days;
  }, [state.activityLog]);

  return {
    ...state,
    newBadge,
    addXp,
    logActivity,
    checkBadges,
    unlockDayBadge,
    getActivityData,
    getLevelProgress,
    getLevelTitle,
    getCurrentLevelXp,
    getXpForNextLevel,
  };
}
