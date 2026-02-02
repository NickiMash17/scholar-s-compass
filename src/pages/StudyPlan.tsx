import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStudy } from '@/context/StudyContext';
import { DayAccordion } from '@/components/DayAccordion';
import { ProgressRing } from '@/components/ProgressRing';
import { StreakCounter } from '@/components/StreakCounter';
import { HeroButton } from '@/components/ui/HeroButton';
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

  React.useEffect(() => {
    if (!profile?.generatedPlan) {
      navigate('/');
    }
  }, [profile, navigate]);

  if (!profile?.generatedPlan) return null;

  const plan = profile.generatedPlan;
  const completedTasks = profile.progress.completedTasks;
  const percentage = getCompletionPercentage();

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
        <header className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-serif text-lg font-semibold text-foreground">
                AI Study Coach
              </span>
            </div>
            <button
              onClick={handleStartOver}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Start Over</span>
            </button>
          </nav>
        </header>

        {/* Hero section */}
        <section className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Overview card */}
            <div className="rounded-3xl bg-gradient-to-br from-card to-background border border-border p-8 mb-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
                {/* Progress ring */}
                <div className="flex-shrink-0">
                  <ProgressRing percentage={percentage} size={140} strokeWidth={10} />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium uppercase tracking-wider">
                      {plan.targetLevel}
                    </span>
                  </div>
                  <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
                    {profile.topicLabel}
                  </h1>
                  <p className="text-muted-foreground mb-6">{plan.overview}</p>
                  
                  {/* Stats */}
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>7 Days</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{Math.round(totalTime / 60)} hours total</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Target className="w-4 h-4 text-primary" />
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

            {/* Timeline header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-foreground">
                Your 7-Day Timeline
              </h2>
              <button
                onClick={() => setOpenDays(openDays.length === 7 ? [] : [1, 2, 3, 4, 5, 6, 7])}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {openDays.length === 7 ? 'Collapse All' : 'Expand All'}
              </button>
            </div>

            {/* Days */}
            <div className="space-y-4 mb-12">
              {plan.days.map((day, index) => (
                <DayAccordion
                  key={day.day}
                  day={day}
                  isOpen={openDays.includes(day.day)}
                  onToggle={() => toggleDay(day.day)}
                  completedTasks={completedTasks}
                  onTaskToggle={toggleTask}
                  index={index}
                />
              ))}
            </div>

            {/* Week Project */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-8"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                    Week Capstone Project
                  </h3>
                  <p className="text-muted-foreground">{plan.weekProject}</p>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">
                Ready to start? Click on Day 1 above to begin your learning journey!
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
    </div>
  );
};

export default StudyPlan;
