import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStudy } from '@/context/StudyContext';
import { HeroButton } from '@/components/ui/HeroButton';
import { DiagnosticData } from '@/types/study';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  GraduationCap, 
  Briefcase, 
  Trophy, 
  Target,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, title: 'Confidence Level', description: 'Rate your current understanding' },
  { id: 2, title: 'Quick Check', description: 'Test your knowledge' },
  { id: 3, title: 'Your Goal', description: 'What do you want to achieve?' },
];

const goals = [
  { id: 'interview', icon: Briefcase, label: 'Ace an Interview', description: 'Prepare for technical interviews' },
  { id: 'project', icon: Target, label: 'Build a Project', description: 'Apply skills to real projects' },
  { id: 'exam', icon: GraduationCap, label: 'Pass an Exam', description: 'Study for certifications or tests' },
  { id: 'mastery', icon: Trophy, label: 'Master the Topic', description: 'Deep understanding & expertise' },
];

const quizQuestions: Record<string, { question: string; options: string[]; correct: number }> = {
  'csharp-oop': {
    question: 'Which keyword is used to prevent a class from being inherited in C#?',
    options: ['static', 'sealed', 'abstract', 'virtual'],
    correct: 1,
  },
  'sql-databases': {
    question: 'Which type of JOIN returns only matching rows from both tables?',
    options: ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL OUTER JOIN'],
    correct: 2,
  },
  'aspnet-apis': {
    question: 'Which HTTP status code indicates a successful resource creation?',
    options: ['200 OK', '201 Created', '204 No Content', '301 Moved'],
    correct: 1,
  },
  'testing': {
    question: 'What is the primary purpose of a mock object in unit testing?',
    options: ['Speed up tests', 'Simulate dependencies', 'Generate test data', 'Check code coverage'],
    correct: 1,
  },
  'data-structures': {
    question: 'What is the time complexity of searching in a balanced binary search tree?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
    correct: 2,
  },
};

const Diagnostic: React.FC = () => {
  const navigate = useNavigate();
  const { profile, setDiagnosticData } = useStudy();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<DiagnosticData>({
    confidenceLevel: 3,
    quizAnswer: '',
    goal: 'mastery',
    availableTime: 60,
  });

  React.useEffect(() => {
    if (!profile?.topic) {
      navigate('/');
    }
  }, [profile, navigate]);

  if (!profile?.topic) return null;

  const quiz = quizQuestions[profile.topic];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setDiagnosticData(data);
      navigate('/generate');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/');
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return true;
      case 2: return data.quizAnswer !== '';
      case 3: return true;
      default: return false;
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 200 : -200,
      opacity: 0,
    }),
  };

  const [direction, setDirection] = useState(1);

  const goNext = () => {
    setDirection(1);
    handleNext();
  };

  const goBack = () => {
    setDirection(-1);
    handleBack();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/3 blur-3xl" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <span className="font-serif text-lg font-semibold text-foreground">
              {profile.topicLabel}
            </span>
            <div className="w-16" /> {/* Spacer */}
          </nav>
        </header>

        {/* Progress indicator */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
            {steps.map((s, index) => (
              <React.Fragment key={s.id}>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                      step >= s.id
                        ? "bg-amber-500 text-navy-950"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {s.id}
                  </div>
                  <span className={cn(
                    "hidden sm:block text-sm transition-colors",
                    step >= s.id ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {s.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-8 sm:w-16 h-0.5 transition-colors",
                    step > s.id ? "bg-amber-500" : "bg-muted"
                  )} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait" custom={direction}>
              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <h2 className="font-serif text-3xl font-bold text-foreground mb-3">
                      How confident are you with {profile.topicLabel}?
                    </h2>
                    <p className="text-muted-foreground">
                      Be honest — this helps us calibrate your study plan
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-6">
                    <div className="flex items-center gap-4 w-full max-w-md">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <button
                          key={level}
                          onClick={() => setData({ ...data, confidenceLevel: level as 1|2|3|4|5 })}
                          className={cn(
                            "flex-1 aspect-square rounded-xl border-2 flex items-center justify-center font-serif text-2xl font-bold transition-all duration-300",
                            data.confidenceLevel === level
                              ? "border-amber-500 bg-amber-500/20 text-amber-400 scale-110"
                              : "border-border bg-card text-muted-foreground hover:border-amber-500/50"
                          )}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between w-full max-w-md text-sm text-muted-foreground">
                      <span>Complete Beginner</span>
                      <span>Expert</span>
                    </div>
                  </div>

                  {/* Time availability */}
                  <div className="p-6 rounded-2xl bg-card border border-border">
                    <div className="flex items-center gap-3 mb-4">
                      <Clock className="w-5 h-5 text-amber-400" />
                      <span className="font-semibold text-foreground">Daily study time</span>
                    </div>
                    <div className="flex items-center gap-4">
                      {[30, 60, 90, 120].map((time) => (
                        <button
                          key={time}
                          onClick={() => setData({ ...data, availableTime: time })}
                          className={cn(
                            "flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-300",
                            data.availableTime === time
                              ? "border-amber-500 bg-amber-500/20 text-amber-400"
                              : "border-border bg-muted/50 text-muted-foreground hover:border-amber-500/50"
                          )}
                        >
                          {time} min
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <h2 className="font-serif text-3xl font-bold text-foreground mb-3">
                      Quick knowledge check
                    </h2>
                    <p className="text-muted-foreground">
                      Don't worry if you're unsure — that's what we're here to fix!
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-card border border-border">
                    <p className="text-lg text-foreground mb-6">{quiz.question}</p>
                    <div className="space-y-3">
                      {quiz.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => setData({ ...data, quizAnswer: option })}
                          className={cn(
                            "w-full p-4 rounded-xl border-2 text-left transition-all duration-300",
                            data.quizAnswer === option
                              ? "border-amber-500 bg-amber-500/10 text-foreground"
                              : "border-border bg-muted/30 text-muted-foreground hover:border-amber-500/50 hover:text-foreground"
                          )}
                        >
                          <span className="font-medium">{String.fromCharCode(65 + index)}.</span>{' '}
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <h2 className="font-serif text-3xl font-bold text-foreground mb-3">
                      What's your primary goal?
                    </h2>
                    <p className="text-muted-foreground">
                      This helps us tailor your study plan to your needs
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {goals.map((goal) => (
                      <button
                        key={goal.id}
                        onClick={() => setData({ ...data, goal: goal.id as DiagnosticData['goal'] })}
                        className={cn(
                          "p-6 rounded-2xl border-2 text-left transition-all duration-300",
                          data.goal === goal.id
                            ? "border-amber-500 bg-amber-500/10"
                            : "border-border bg-card hover:border-amber-500/50"
                        )}
                      >
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                            data.goal === goal.id ? "bg-amber-500/20" : "bg-muted"
                          )}>
                            <goal.icon className={cn(
                              "w-6 h-6",
                              data.goal === goal.id ? "text-amber-400" : "text-muted-foreground"
                            )} />
                          </div>
                          <div>
                            <h3 className={cn(
                              "font-semibold mb-1",
                              data.goal === goal.id ? "text-foreground" : "text-muted-foreground"
                            )}>
                              {goal.label}
                            </h3>
                            <p className="text-sm text-muted-foreground">{goal.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-6">
          <div className="flex justify-center">
            <HeroButton
              size="lg"
              onClick={goNext}
              disabled={!canProceed()}
              icon={step === 3 ? <Sparkles className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            >
              {step === 3 ? 'Generate My Plan' : 'Continue'}
            </HeroButton>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Diagnostic;
