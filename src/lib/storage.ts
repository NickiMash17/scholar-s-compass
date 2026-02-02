import { StudyProfile } from '@/types/study';

const STORAGE_KEY = 'ai-study-coach-profile';

export const saveProfile = (profile: StudyProfile): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Failed to save profile:', error);
  }
};

export const loadProfile = (): StudyProfile | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data) as StudyProfile;
  } catch (error) {
    console.error('Failed to load profile:', error);
    return null;
  }
};

export const clearProfile = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear profile:', error);
  }
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const updateProgress = (
  profile: StudyProfile,
  taskId: string,
  completed: boolean
): StudyProfile => {
  const completedTasks = completed
    ? [...profile.progress.completedTasks, taskId]
    : profile.progress.completedTasks.filter((id) => id !== taskId);

  const today = new Date().toDateString();
  const lastActive = new Date(profile.progress.lastActive).toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  let streak = profile.progress.streak;
  if (lastActive !== today) {
    if (lastActive === yesterday) {
      streak += 1;
    } else if (lastActive !== today) {
      streak = 1;
    }
  }

  return {
    ...profile,
    progress: {
      ...profile.progress,
      completedTasks,
      streak,
      lastActive: new Date().toISOString(),
    },
    updatedAt: new Date().toISOString(),
  };
};
