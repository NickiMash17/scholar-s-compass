import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { StudyProfile } from '@/types/study';
import { GamificationState } from '@/hooks/useGamification';

const STUDY_STORAGE_KEY = 'ai-study-coach-profile';
const GAMIFICATION_STORAGE_KEY = 'ai-study-coach-gamification';
const POMODORO_STORAGE_KEY = 'ai-study-coach-pomodoro';

export function useCloudSync() {
  const { user } = useAuth();
  const syncInProgress = useRef(false);

  // Save study profile to cloud
  const saveStudyToCloud = useCallback(async (profile: StudyProfile) => {
    if (!user) return;
    const { data: existing } = await supabase
      .from('study_data')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (existing) {
      await supabase
        .from('study_data')
        .update({ study_profile: profile as any })
        .eq('user_id', user.id);
    } else {
      await supabase
        .from('study_data')
        .insert({ user_id: user.id, study_profile: profile as any });
    }
  }, [user]);

  // Save gamification to cloud
  const saveGamificationToCloud = useCallback(async (state: GamificationState) => {
    if (!user) return;
    await supabase
      .from('gamification_data')
      .update({
        xp: state.xp,
        level: state.level,
        badges: state.badges as any,
        activity_log: state.activityLog as any,
      })
      .eq('user_id', user.id);
  }, [user]);

  // Save pomodoro to cloud
  const savePomodoroToCloud = useCallback(async (settings: any, stats: any) => {
    if (!user) return;
    await supabase
      .from('pomodoro_data')
      .update({ settings, stats })
      .eq('user_id', user.id);
  }, [user]);

  // Load from cloud and merge with localStorage
  const syncFromCloud = useCallback(async () => {
    if (!user || syncInProgress.current) return;
    syncInProgress.current = true;

    try {
      // Load study data
      const { data: studyData } = await supabase
        .from('study_data')
        .select('study_profile, updated_at')
        .eq('user_id', user.id)
        .single();

      if (studyData?.study_profile && Object.keys(studyData.study_profile).length > 0) {
        const cloudProfile = studyData.study_profile as unknown as StudyProfile;
        const localRaw = localStorage.getItem(STUDY_STORAGE_KEY);
        const localProfile = localRaw ? JSON.parse(localRaw) : null;

        // Use cloud data if it's newer or local is empty
        if (!localProfile || (cloudProfile.updatedAt && (!localProfile.updatedAt || cloudProfile.updatedAt > localProfile.updatedAt))) {
          localStorage.setItem(STUDY_STORAGE_KEY, JSON.stringify(cloudProfile));
        } else if (localProfile.updatedAt > (cloudProfile.updatedAt || '')) {
          // Local is newer, push to cloud
          await saveStudyToCloud(localProfile);
        }
      } else {
        // No cloud data, push local if exists
        const localRaw = localStorage.getItem(STUDY_STORAGE_KEY);
        if (localRaw) {
          const localProfile = JSON.parse(localRaw);
          await saveStudyToCloud(localProfile);
        }
      }

      // Load gamification
      const { data: gamData } = await supabase
        .from('gamification_data')
        .select('xp, level, badges, activity_log')
        .eq('user_id', user.id)
        .single();

      if (gamData) {
        const localRaw = localStorage.getItem(GAMIFICATION_STORAGE_KEY);
        const localGam = localRaw ? JSON.parse(localRaw) : null;

        if (gamData.xp > 0 || (gamData.badges as any[])?.some((b: any) => b.unlockedAt)) {
          // Cloud has data
          if (!localGam || gamData.xp > (localGam.xp || 0)) {
            localStorage.setItem(GAMIFICATION_STORAGE_KEY, JSON.stringify({
              xp: gamData.xp,
              level: gamData.level,
              badges: gamData.badges,
              activityLog: gamData.activity_log,
            }));
          } else if (localGam && localGam.xp > gamData.xp) {
            await saveGamificationToCloud(localGam);
          }
        } else if (localGam && localGam.xp > 0) {
          await saveGamificationToCloud(localGam);
        }
      }

      // Load pomodoro
      const { data: pomData } = await supabase
        .from('pomodoro_data')
        .select('settings, stats')
        .eq('user_id', user.id)
        .single();

      if (pomData) {
        const localRaw = localStorage.getItem(POMODORO_STORAGE_KEY);
        const localPom = localRaw ? JSON.parse(localRaw) : null;
        const cloudStats = pomData.stats as any;

        if (cloudStats?.totalSessions > 0) {
          if (!localPom || cloudStats.totalSessions > (localPom.stats?.totalSessions || 0)) {
            localStorage.setItem(POMODORO_STORAGE_KEY, JSON.stringify({
              settings: pomData.settings,
              stats: pomData.stats,
            }));
          } else if (localPom?.stats?.totalSessions > cloudStats.totalSessions) {
            await savePomodoroToCloud(localPom.settings, localPom.stats);
          }
        } else if (localPom?.stats?.totalSessions > 0) {
          await savePomodoroToCloud(localPom.settings, localPom.stats);
        }
      }
    } catch (err) {
      console.error('Cloud sync error:', err);
    } finally {
      syncInProgress.current = false;
    }
  }, [user, saveStudyToCloud, saveGamificationToCloud, savePomodoroToCloud]);

  // Auto-sync on login
  useEffect(() => {
    if (user) {
      syncFromCloud();
    }
  }, [user, syncFromCloud]);

  // Periodic save to cloud (every 30 seconds)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      const studyRaw = localStorage.getItem(STUDY_STORAGE_KEY);
      if (studyRaw) saveStudyToCloud(JSON.parse(studyRaw));

      const gamRaw = localStorage.getItem(GAMIFICATION_STORAGE_KEY);
      if (gamRaw) saveGamificationToCloud(JSON.parse(gamRaw));

      const pomRaw = localStorage.getItem(POMODORO_STORAGE_KEY);
      if (pomRaw) {
        const pom = JSON.parse(pomRaw);
        savePomodoroToCloud(pom.settings || pom, pom.stats || {});
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [user, saveStudyToCloud, saveGamificationToCloud, savePomodoroToCloud]);

  return { syncFromCloud, saveStudyToCloud, saveGamificationToCloud, savePomodoroToCloud };
}
