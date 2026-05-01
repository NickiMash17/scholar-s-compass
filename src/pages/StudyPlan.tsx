import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStudy } from '@/context/StudyContext';
import { useAuth } from '@/context/AuthContext';
import { DayAccordion } from '@/components/DayAccordion';
import { ProgressRing } from '@/components/ProgressRing';
import { StreakCounter } from '@/components/StreakCounter';
import { ActivityCalendar } from '@/components/ActivityCalendar';
import { GamificationPanel, BadgeUnlockToast } from '@/components/GamificationPanel';
import { HeroButton } from '@/components/ui/HeroButton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useGamification } from '@/hooks/useGamification';
import { usePomodoroStorage } from '@/hooks/usePomodoroStorage';
import { ShareProgressCard } from '@/components/ShareProgressCard';
import { DailyTip } from '@/components/DailyTip';
import { DayCompletionModal } from '@/components/DayCompletionModal';
import { WeeklyRecapModal } from '@/components/WeeklyRecapModal';
import { StudyPlanSkeleton } from '@/components/SkeletonLoaders';
import { useTopicProgress } from '@/hooks/useTopicProgress';
import { SEO } from '@/components/SEO';
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  Clock, 
  Target,
  Cpu,
  BookOpen,
  RotateCcw
} from 'lucide-react';

const XP_PER_TASK = 25;

const StudyPlan: React.FC = () => {
  const navigate = useNavigate();
  const { profile: authProfile } = useAuth();
  const { profile, isLoading, toggleTask, getCompletionPercentage, resetProfile } = useStudy();
  const [openDays, setOpenDays] = useState<number[]>([1]);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [completedDay, setCompletedDay] = useState<number | null>(null);
  const [showWeeklyRecap, setShowWeeklyRecap] = useState(false);
  const recapShownRef = React.useRef(false);
  const celebratedDaysRef = React.useRef<Set<number>>(new Set());
  const gamification = useGamification();
  const { stats } = usePomodoroStorage();
  const { updateTopicProgress } = useTopicProgress();

  React.useEffect(() => {
    if (!isLoading && !profile?.generatedPlan) {
      navigate('/');
    }
  }, [profile, isLoading, navigate]);

  // Brief skeleton on mount + seed already-completed days so we don't re-celebrate
  useEffect(() => {
    const t = setTimeout(() => setShowSkeleton(false), 450);
    if (profile?.generatedPlan) {
      const completedSet = new Set(profile.progress.completedTasks);
      profile.generatedPlan.days.forEach((day) => {
        if (day.tasks.length > 0 && day.tasks.every((t) => completedSet.has(t.id))) {
          celebratedDaysRef.current.add(day.day);
        }
      });
    }
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!profile) return;
    const completed = profile.progress.completedTasks.length;
    const pct = getCompletionPercentage();
    const streak = profile.progress.streak || 0;
    gamification.checkBadges(completed, streak, pct, stats.totalFocusMinutes);

    // Track topic-level progress for roadmap
    if (profile.generatedPlan) {
      const totalTasks = profile.generatedPlan.days.reduce((acc, d) => acc + d.tasks.length, 0);
      updateTopicProgress(profile.topic, completed, totalTasks);
    }
  }, [profile?.progress.completedTasks.length, profile?.progress.streak]);

  // Detect day completion → trigger celebration modal
  useEffect(() => {
    if (!profile?.generatedPlan) return;
    const completedSet = new Set(profile.progress.completedTasks);
    for (const day of profile.generatedPlan.days) {
      if (day.tasks.length === 0) continue;
      const allDone = day.tasks.every((t) => completedSet.has(t.id));
      if (allDone && !celebratedDaysRef.current.has(day.day)) {
        celebratedDaysRef.current.add(day.day);
        // Slight delay to let the per-task confetti settle first
        setTimeout(() => setCompletedDay(day.day), 700);
        break;
      }
    }

    // Detect full plan completion → weekly recap
    const total = profile.generatedPlan.days.reduce((acc, d) => acc + d.tasks.length, 0);
    if (total > 0 && completedSet.size >= total && !recapShownRef.current) {
      recapShownRef.current = true;
      setTimeout(() => setShowWeeklyRecap(true), 2200);
    }
  }, [profile?.progress.completedTasks, profile?.generatedPlan]);

  if (isLoading || showSkeleton) {
    return (
      <div className="min-h-screen bg-background pb-20 sm:pb-0">
        <StudyPlanSkeleton />
      </div>
    );
  }

  if (!profile?.generatedPlan) return null;

  const plan = profile.generatedPlan;
  const completedTasks = profile.progress.completedTasks;
  const percentage = getCompletionPercentage();

  const handleTaskToggle = (taskId: string) => {
    const wasCompleted = completedTasks.includes(taskId);
    toggleTask(taskId);
    if (!wasCompleted) {
      const task = plan.days.flatMap(d => d.tasks).find(t => t.id === taskId);
      if (task) {
        gamification.addXp(task.type);
        gamification.logActivity();
      }
    }
  };

  const toggleDay = (day: number) => {
    setOpenDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const totalTime = plan.days.reduce((acc, day) => acc + day.estimatedTime, 0);

  const handleStartOver = () => {
    if (confirm('Are you sure you want to reset all progress?')) {
      resetProfile();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
      <SEO title="Your 7-Day Study Plan" description="Your personalized AI-generated 7-day software engineering curriculum. Track tasks, earn XP, and level up." />
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, hsl(160 84% 39% / 0.05) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, hsl(152 68% 50% / 0.03) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `linear-gradient(hsl(160 84% 39% / 0.12) 1px, transparent 1px), linear-gradient(90deg, hsl(160 84% 39% / 0.12) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-4 sm:py-6">
          <nav className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Home</span>
            </button>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="text-sm sm:text-base font-bold text-foreground">
                AI Study Coach
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ShareProgressCard
                topicLabel={profile.topicLabel}
                percentage={percentage}
                streak={profile.progress.streak || 1}
                xp={gamification.xp}
                level={gamification.level}
                levelTitle={gamification.getLevelTitle()}
                completedTasks={completedTasks.length}
                totalTasks={plan.days.reduce((acc, d) => acc + d.tasks.length, 0)}
                badges={gamification.badges}
              />
              <ThemeToggle />
              <button
                onClick={handleStartOver}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline text-xs font-mono">Reset</span>
              </button>
            </div>
          </nav>
        </header>

        {/* Dashboard */}
        <section className="container mx-auto px-4 py-4 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Overview card */}
            <DailyTip />

            <div className="rounded-2xl bg-card border border-border/50 p-5 sm:p-8 mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-8">
                <div className="flex-shrink-0">
                  <ProgressRing percentage={percentage} size={100} strokeWidth={8} />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-primary/15 text-primary text-[10px] font-mono uppercase tracking-wider border border-primary/20">
                      {plan.targetLevel}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-3">
                    {profile.topicLabel}
                  </h1>
                  <p className="text-sm text-muted-foreground mb-4 sm:mb-5 line-clamp-2">{plan.overview}</p>
                  
                  <div className="flex flex-wrap justify-center sm:justify-start gap-5">
                    <div className="flex items-center gap-1.5 text-sm">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span className="font-mono text-muted-foreground">7 Days</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span className="font-mono text-muted-foreground">{Math.round(totalTime / 60)}h</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      <Target className="w-3.5 h-3.5 text-primary" />
                      <span className="font-mono text-muted-foreground">{plan.days.reduce((acc, d) => acc + d.tasks.length, 0)} tasks</span>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <StreakCounter streak={profile.progress.streak || 1} />
                </div>
              </div>
            </div>

            {/* Gamification + Calendar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <GamificationPanel
                xp={gamification.xp}
                level={gamification.level}
                levelTitle={gamification.getLevelTitle()}
                levelProgress={gamification.getLevelProgress()}
                currentLevelXp={gamification.getCurrentLevelXp()}
                xpForNextLevel={gamification.getXpForNextLevel()}
                badges={gamification.badges}
              />
              <ActivityCalendar data={gamification.getActivityData()} />
            </div>

            {/* Timeline */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="hud-label block mb-1">Execution Timeline</span>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  Your 7-Day Protocol
                </h2>
              </div>
              <button
                onClick={() => setOpenDays(openDays.length === 7 ? [] : [1, 2, 3, 4, 5, 6, 7])}
                className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider"
              >
                {openDays.length === 7 ? 'Collapse' : 'Expand All'}
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-12">
              {plan.days.map((day, index) => (
                <DayAccordion
                  key={day.day}
                  day={day}
                  isOpen={openDays.includes(day.day)}
                  onToggle={() => toggleDay(day.day)}
                  completedTasks={completedTasks}
                  onTaskToggle={handleTaskToggle}
                  index={index}
                />
              ))}
            </div>

            {/* Capstone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl bg-card border border-primary/20 p-5 sm:p-8 glow-neon"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <span className="hud-label block mb-1">Capstone Project</span>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                    Week Capstone
                  </h3>
                  <p className="text-sm text-muted-foreground">{plan.weekProject}</p>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <div className="text-center mt-8 sm:mt-12 pb-8">
              <p className="text-xs font-mono text-muted-foreground mb-4 uppercase tracking-wider">
                Ready to begin? Expand Day 1 above to start
              </p>
              <HeroButton
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                onClick={() => {
                  setOpenDays([1]);
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
              >
                Execute Day 1
              </HeroButton>
            </div>
          </motion.div>
        </section>
      </div>

      <BadgeUnlockToast badge={gamification.newBadge} />

      {completedDay !== null && (() => {
        const day = plan.days.find((d) => d.day === completedDay);
        if (!day) return null;
        return (
          <DayCompletionModal
            isOpen={true}
            onClose={() => setCompletedDay(null)}
            onContinue={() => {
              const next = completedDay + 1;
              if (plan.days.find((d) => d.day === next)) {
                setOpenDays((prev) => [...new Set([...prev, next])]);
                setTimeout(() => {
                  const el = document.getElementById(`day-${next}`);
                  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 200);
              }
            }}
            dayNumber={day.day}
            dayFocus={day.focus}
            tasksCompleted={day.tasks.length}
            estimatedMinutes={day.estimatedTime}
            xpEarned={day.tasks.length * XP_PER_TASK}
            hasNextDay={!!plan.days.find((d) => d.day === completedDay + 1)}
          />
        );
      })()}

      <WeeklyRecapModal
        isOpen={showWeeklyRecap}
        onClose={() => setShowWeeklyRecap(false)}
        userName={authProfile?.display_name || 'Learner'}
        topicLabel={profile.topicLabel}
        totalTasks={completedTasks.length}
        totalXp={gamification.xp}
        level={gamification.level}
        levelTitle={gamification.getLevelTitle()}
        streak={profile.progress.streak || 0}
        focusMinutes={stats.totalFocusMinutes}
        badges={gamification.badges}
        onContinue={() => navigate('/')}
      />
    </div>
  );
};

export default StudyPlan;
