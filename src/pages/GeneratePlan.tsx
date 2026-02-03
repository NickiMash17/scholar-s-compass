import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStudy } from '@/context/StudyContext';
import { GeneratedPlan, Task } from '@/types/study';
import { Sparkles, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { HeroButton } from '@/components/ui/HeroButton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const loadingMessages = [
  "Analyzing your profile...",
  "Crafting personalized curriculum...",
  "Optimizing learning path...",
  "Adding practice challenges...",
  "Finalizing your 7-day plan...",
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

    // Prevent double execution
    if (hasStartedGeneration.current) return;
    hasStartedGeneration.current = true;

    // Cycle through loading messages
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

        if (fnError) {
          throw new Error(fnError.message || 'Failed to generate study plan');
        }

        if (data?.error) {
          throw new Error(data.error);
        }

        if (!data?.plan) {
          throw new Error('No plan received from AI');
        }

        // Transform the AI response to match our types
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
        
        toast.success('Your personalized study plan is ready!');
        
        // Navigate to plan after brief success state
        setTimeout(() => {
          navigate('/plan');
        }, 1000);
      } catch (e) {
        console.error('Error generating plan:', e);
        const errorMessage = e instanceof Error ? e.message : 'Failed to generate your study plan. Please try again.';
        setError(errorMessage);
        setIsGenerating(false);
        toast.error(errorMessage);
      }
    };

    generatePlan();

    return () => {
      clearInterval(messageInterval);
    };
  }, [profile, navigate, setGeneratedPlan]);

  const handleRetry = () => {
    setError(null);
    setIsGenerating(true);
    setMessageIndex(0);
    hasStartedGeneration.current = false;
    // Force re-render to trigger useEffect
    window.location.reload();
  };

  if (!profile?.diagnosticData) return null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/3 blur-3xl" />
      </div>

      <div className="relative z-10 text-center px-4">
        {error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10 text-destructive" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                Oops, something went wrong
              </h2>
              <p className="text-muted-foreground max-w-md">{error}</p>
            </div>
            <HeroButton onClick={handleRetry} icon={<RefreshCw className="w-5 h-5" />}>
              Try Again
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
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent opacity-20 blur-xl" />
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-primary-foreground" />
              </div>
            </motion.div>

            {/* Loading text */}
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-foreground">
                AI is Creating Your Study Plan
              </h2>
              <motion.p
                key={messageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-muted-foreground"
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
                    opacity: [0.5, 1, 0.5],
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
              className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto"
            >
              <Sparkles className="w-10 h-10 text-accent" />
            </motion.div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                Your plan is ready!
              </h2>
              <p className="text-muted-foreground">Redirecting you now...</p>
            </div>
            <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GeneratePlan;
