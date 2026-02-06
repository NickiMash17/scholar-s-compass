import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStudy } from '@/context/StudyContext';
import { DayAccordion } from '@/components/DayAccordion';
import { ProgressRing } from '@/components/ProgressRing';
import { StreakCounter } from '@/components/StreakCounter';
import { ActivityCalendar } from '@/components/ActivityCalendar';
import { GamificationPanel, BadgeUnlockToast } from '@/components/GamificationPanel';
import { HeroButton } from '@/components/ui/HeroButton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useGamification } from '@/hooks/useGamification';
import { usePomodoroStorage } from '@/hooks/usePomodoroStorage';
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  Clock, 
  Target,
  Sparkles,
  BookOpen,
  RotateCcw
} from 'lucide-react';

const StudyPlan: React.FC = () => {
  const navigate = useNavigate();
  const { profile, toggleTask, getCompletionPercentage, resetProfile } = useStudy();
  const [openDays, setOpenDays] = useState<number[]>([1]);
  const gamification = useGamification();
  const { stats } = usePomodoroStorage();

  React.useEffect(() => {
    if (!profile?.generatedPlan) {
      navigate('/');
    }
  }, [profile, navigate]);

  // Check badges whenever progress changes
  useEffect(() => {
    if (!profile) return;
    const completed = profile.progress.completedTasks.length;
    const pct = getCompletionPercentage();
    const streak = profile.progress.streak || 0;
    gamification.checkBadges(completed, streak, pct, stats.totalFocusMinutes);
  }, [profile?.progress.completedTasks.length, profile?.progress.streak]);

  if (!profile?.generatedPlan) return null;

  const plan = profile.generatedPlan;
  const completedTasks = profile.progress.completedTasks;
  const percentage = getCompletionPercentage();

  const handleTaskToggle = (taskId: string) => {
    const wasCompleted = completedTasks.includes(taskId);
    toggleTask(taskId);
    if (!wasCompleted) {
      // Find task type for XP
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
    if (confirm('Are you sure you want to start over? This will reset all your progress.')) {
      resetProfile();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/3 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-4 sm:py-6">
          <nav className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="font-serif text-base sm:text-lg font-semibold text-foreground">
                AI Study Coach
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={handleStartOver}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Reset</span>
              </button>
            </div>
          </nav>
        </header>

        {/* Hero section */}
        <section className="container mx-auto px-4 py-4 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Overview card */}
            <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-card to-background border border-border p-4 sm:p-8 mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8">
                {/* Progress ring */}
                <div className="flex-shrink-0">
                  <ProgressRing percentage={percentage} size={100} strokeWidth={8} />
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium uppercase tracking-wider">
                      {plan.targetLevel}
                    </span>
                  </div>
                  <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-4">
                    {profile.topicLabel}
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 line-clamp-2">{plan.overview}</p>
                  
                  {/* Stats */}
                  <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span>7 Days</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span>{Math.round(totalTime / 60)}h total</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Target className="w-3.5 h-3.5 text-primary" />
                      <span>{plan.days.reduce((acc, d) => acc + d.tasks.length, 0)} tasks</span>
                    </div>
                  </div>
                </div>

                {/* Streak */}
                <div className="flex-shrink-0">
                  <StreakCounter streak={profile.progress.streak || 1} />
                </div>
              </div>
            </div>

            {/* Gamification + Calendar Row */}
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

            {/* Timeline header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                Your 7-Day Timeline
              </h2>
              <button
                onClick={() => setOpenDays(openDays.length === 7 ? [] : [1, 2, 3, 4, 5, 6, 7])}
                className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {openDays.length === 7 ? 'Collapse All' : 'Expand All'}
              </button>
            </div>

            {/* Days */}
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

            {/* Week Project */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-5 sm:p-8"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground mb-2">
                    Week Capstone Project
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{plan.weekProject}</p>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <div className="text-center mt-8 sm:mt-12 pb-8">
              <p className="text-sm text-muted-foreground mb-4">
                Ready to start? Click on Day 1 above to begin!
              </p>
              <HeroButton
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                onClick={() => {
                  setOpenDays([1]);
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
              >
                Start Day 1
              </HeroButton>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Badge unlock toast */}
      <BadgeUnlockToast badge={gamification.newBadge} />
    </div>
  );
};

export default StudyPlan;
