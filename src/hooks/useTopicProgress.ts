import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'ai-study-coach-topic-progress';

export interface TopicProgressEntry {
  topicId: string;
  completionPercent: number;
  completedTasks: number;
  totalTasks: number;
  lastUpdated: string;
}

export const useTopicProgress = () => {
  const [progressMap, setProgressMap] = useState<Record<string, TopicProgressEntry>>(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progressMap));
  }, [progressMap]);

  const updateTopicProgress = useCallback((
    topicId: string,
    completedTasks: number,
    totalTasks: number
  ) => {
    const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    setProgressMap(prev => ({
      ...prev,
      [topicId]: {
        topicId,
        completionPercent: percent,
        completedTasks,
        totalTasks,
        lastUpdated: new Date().toISOString(),
      },
    }));
  }, []);

  const getTopicProgress = useCallback((topicId: string): TopicProgressEntry | null => {
    return progressMap[topicId] || null;
  }, [progressMap]);

  const isTopicCompleted = useCallback((topicId: string): boolean => {
    return (progressMap[topicId]?.completionPercent ?? 0) >= 100;
  }, [progressMap]);

  const isTopicStarted = useCallback((topicId: string): boolean => {
    return (progressMap[topicId]?.completionPercent ?? 0) > 0;
  }, [progressMap]);

  const getOverallProgress = useCallback((): number => {
    const entries = Object.values(progressMap);
    if (entries.length === 0) return 0;
    const total = entries.reduce((sum, e) => sum + e.completionPercent, 0);
    return Math.round(total / 14); // 14 total domains
  }, [progressMap]);

  return {
    progressMap,
    updateTopicProgress,
    getTopicProgress,
    isTopicCompleted,
    isTopicStarted,
    getOverallProgress,
  };
};
