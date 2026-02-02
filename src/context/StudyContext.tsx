import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StudyProfile, DiagnosticData, GeneratedPlan } from '@/types/study';
import { saveProfile, loadProfile, clearProfile, generateId, updateProgress } from '@/lib/storage';

interface StudyContextType {
  profile: StudyProfile | null;
  isLoading: boolean;
  setTopic: (topicId: string, topicLabel: string) => void;
  setDiagnosticData: (data: DiagnosticData) => void;
  setGeneratedPlan: (plan: GeneratedPlan) => void;
  toggleTask: (taskId: string) => void;
  resetProfile: () => void;
  getCompletionPercentage: () => number;
  getTodaysTasks: () => { task: any; dayNumber: number }[];
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const StudyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<StudyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loaded = loadProfile();
    setProfile(loaded);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (profile) {
      saveProfile(profile);
    }
  }, [profile]);

  const setTopic = (topicId: string, topicLabel: string) => {
    const newProfile: StudyProfile = {
      id: generateId(),
      topic: topicId,
      topicLabel,
      diagnosticData: {
        confidenceLevel: 3,
        quizAnswer: '',
        goal: 'mastery',
        availableTime: 60,
      },
      generatedPlan: null,
      progress: {
        completedTasks: [],
        currentDay: 1,
        streak: 0,
        lastActive: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProfile(newProfile);
  };

  const setDiagnosticData = (data: DiagnosticData) => {
    if (!profile) return;
    setProfile({
      ...profile,
      diagnosticData: data,
      updatedAt: new Date().toISOString(),
    });
  };

  const setGeneratedPlan = (plan: GeneratedPlan) => {
    if (!profile) return;
    setProfile({
      ...profile,
      generatedPlan: plan,
      progress: {
        ...profile.progress,
        currentDay: 1,
        lastActive: new Date().toISOString(),
      },
      updatedAt: new Date().toISOString(),
    });
  };

  const toggleTask = (taskId: string) => {
    if (!profile) return;
    const isCompleted = profile.progress.completedTasks.includes(taskId);
    setProfile(updateProgress(profile, taskId, !isCompleted));
  };

  const resetProfile = () => {
    clearProfile();
    setProfile(null);
  };

  const getCompletionPercentage = (): number => {
    if (!profile?.generatedPlan) return 0;
    const totalTasks = profile.generatedPlan.days.reduce(
      (acc, day) => acc + day.tasks.length,
      0
    );
    if (totalTasks === 0) return 0;
    return Math.round((profile.progress.completedTasks.length / totalTasks) * 100);
  };

  const getTodaysTasks = () => {
    if (!profile?.generatedPlan) return [];
    const currentDay = profile.progress.currentDay;
    const dayPlan = profile.generatedPlan.days.find((d) => d.day === currentDay);
    if (!dayPlan) return [];
    return dayPlan.tasks.map((task) => ({ task, dayNumber: currentDay }));
  };

  return (
    <StudyContext.Provider
      value={{
        profile,
        isLoading,
        setTopic,
        setDiagnosticData,
        setGeneratedPlan,
        toggleTask,
        resetProfile,
        getCompletionPercentage,
        getTodaysTasks,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = (): StudyContextType => {
  const context = useContext(StudyContext);
  if (context === undefined) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};
