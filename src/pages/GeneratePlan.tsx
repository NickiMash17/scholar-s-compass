import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStudy } from '@/context/StudyContext';
import { GeneratedPlan, Task } from '@/types/study';
import { Cpu, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { HeroButton } from '@/components/ui/HeroButton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const loadingMessages = [
  "Analyzing cognitive profile...",
  "Engineering personalized curriculum...",
  "Optimizing neural learning path...",
  "Calibrating practice protocols...",
  "Compiling 7-day execution plan...",
];

const GeneratePlan: React.FC = () => {
  const navigate = useNavigate();
  const { profile, setGeneratedPlan } = useStudy();
  const [messageIndex, setMessageIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasStartedGeneration = useRef(false);

  useEffect(() => {
    if (!profile?.diagnosticData) {
      navigate('/');
      return;
    }

    if (hasStartedGeneration.current) return;
    hasStartedGeneration.current = true;

    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1500);

    const generatePlan = async () => {
      try {
        const diagnosticData = {
          topic: profile.topic,
          topicLabel: profile.topicLabel,
          confidenceLevel: profile.diagnosticData.confidenceLevel,
          quizAnswer: profile.diagnosticData.quizAnswer,
          goal: profile.diagnosticData.goal,
          availableTime: profile.diagnosticData.availableTime,
        };

        const { data, error: fnError } = await supabase.functions.invoke('generate-study-plan', {
          body: { diagnosticData },
        });

        if (fnError) throw new Error(fnError.message || 'Failed to generate study plan');
        if (data?.error) throw new Error(data.error);
        if (!data?.plan) throw new Error('No plan received from AI');

        const aiPlan = data.plan;
        const plan: GeneratedPlan = {
          overview: aiPlan.overview,
          targetLevel: aiPlan.targetLevel,
          weekProject: aiPlan.weekProject,
          days: aiPlan.days.map((day: any) => ({
            day: day.day,
            focus: day.focus,
            estimatedTime: day.tasks.reduce((acc: number, t: any) => acc + (t.estimatedMinutes || 20), 0),
            practiceChallenge: day.practiceChallenge,
            successCriteria: day.successCriteria,
            tasks: day.tasks.map((task: any): Task => ({
              id: task.id,
              description: task.description,
              type: task.type as 'reading' | 'coding' | 'quiz' | 'project',
              completed: false,
              estimatedMinutes: task.estimatedMinutes,
              resources: task.resources,
            })),
          })),
        };

        setGeneratedPlan(plan);
        setIsGenerating(false);
        toast.success('Protocol compiled successfully!');
        setTimeout(() => navigate('/plan'), 1000);
      } catch (e) {
        console.error('Error generating plan:', e);
        const errorMessage = e instanceof Error ? e.message : 'Failed to generate protocol. Please try again.';
        setError(errorMessage);
        setIsGenerating(false);
        toast.error(errorMessage);
      }
    };

    generatePlan();
    return () => clearInterval(messageInterval);
  }, [profile, navigate, setGeneratedPlan]);

  const handleRetry = () => {
    setError(null);
    setIsGenerating(true);
    setMessageIndex(0);
    hasStartedGeneration.current = false;
    window.location.reload();
  };

  if (!profile?.diagnosticData) return null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, hsl(160 84% 39% / 0.06) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, hsl(152 68% 50% / 0.04) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(hsl(160 84% 39% / 0.15) 1px, transparent 1px), linear-gradient(90deg, hsl(160 84% 39% / 0.15) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />
      </div>

      <div className="relative z-10 text-center px-4">
        {error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="w-20 h-20 rounded-2xl bg-destructive/15 border border-destructive/30 flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10 text-destructive" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">System Error</h2>
              <p className="text-sm text-muted-foreground max-w-md">{error}</p>
            </div>
            <HeroButton onClick={handleRetry} icon={<RefreshCw className="w-5 h-5" />}>
              Retry Protocol
            </HeroButton>
          </motion.div>
        ) : isGenerating ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Animated icon */}
            <motion.div
              className="relative w-24 h-24 mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-xl" />
              <div className="relative w-full h-full rounded-2xl bg-card border border-primary/30 flex items-center justify-center glow-neon">
                <Cpu className="w-10 h-10 text-primary" />
              </div>
            </motion.div>

            <div className="space-y-3">
              <span className="hud-label">Protocol Generation</span>
              <h2 className="text-2xl font-bold text-foreground">
                Compiling Your Study Protocol
              </h2>
              <motion.p
                key={messageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-muted-foreground font-mono"
              >
                {loadingMessages[messageIndex]}
              </motion.p>
            </div>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="w-20 h-20 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto glow-neon"
            >
              <Cpu className="w-10 h-10 text-primary" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Protocol Ready
              </h2>
              <p className="text-sm text-muted-foreground font-mono">Initializing dashboard...</p>
            </div>
            <Loader2 className="w-5 h-5 animate-spin mx-auto text-primary" />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GeneratePlan;
