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
  Clock,
  Cpu
} from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, title: 'Calibration', description: 'Assess baseline' },
  { id: 2, title: 'Verification', description: 'Knowledge check' },
  { id: 3, title: 'Objective', description: 'Set target' },
];

const goals = [
  { id: 'interview', icon: Briefcase, label: 'Ace an Interview', description: 'Prepare for technical interviews' },
  { id: 'project', icon: Target, label: 'Build a Project', description: 'Apply skills to real projects' },
  { id: 'exam', icon: GraduationCap, label: 'Pass an Exam', description: 'Study for certifications or tests' },
  { id: 'mastery', icon: Trophy, label: 'Full Mastery', description: 'Deep understanding & expertise' },
];

const DEFAULT_QUIZ = {
  question: 'What is the most important principle when learning a new topic?',
  options: ['Memorizing everything', 'Practicing regularly', 'Reading only theory', 'Skipping fundamentals'],
  correct: 1,
};

const quizQuestions: Record<string, { question: string; options: string[]; correct: number }> = {
  'programming-fundamentals': { question: 'What does a "for loop" do in programming?', options: ['Declares a variable', 'Repeats code a set number of times', 'Defines a function', 'Imports a library'], correct: 1 },
  'csharp-oop': { question: 'Which keyword is used to prevent a class from being inherited in C#?', options: ['static', 'sealed', 'abstract', 'virtual'], correct: 1 },
  'sql-databases': { question: 'Which type of JOIN returns only matching rows from both tables?', options: ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL OUTER JOIN'], correct: 2 },
  'aspnet-apis': { question: 'Which HTTP status code indicates a successful resource creation?', options: ['200 OK', '201 Created', '204 No Content', '301 Moved'], correct: 1 },
  'testing': { question: 'What is the primary purpose of a mock object in unit testing?', options: ['Speed up tests', 'Simulate dependencies', 'Generate test data', 'Check code coverage'], correct: 1 },
  'data-structures': { question: 'What is the time complexity of searching in a balanced binary search tree?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correct: 2 },
  'design-patterns': { question: 'Which pattern ensures a class has only one instance?', options: ['Factory', 'Singleton', 'Observer', 'Strategy'], correct: 1 },
  'web-fundamentals': { question: 'What does CSS stand for?', options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'Colorful Style Sheets'], correct: 1 },
  'frontend-frameworks': { question: 'In React, what hook is used to manage component state?', options: ['useEffect', 'useState', 'useRef', 'useMemo'], correct: 1 },
  'git-version-control': { question: 'What Git command creates a new branch?', options: ['git merge', 'git branch', 'git clone', 'git pull'], correct: 1 },
  'devops-cicd': { question: 'What does Docker primarily provide?', options: ['Code editing', 'Containerization', 'Database management', 'Version control'], correct: 1 },
  'system-design': { question: 'What is the main purpose of a load balancer?', options: ['Store data', 'Distribute traffic across servers', 'Encrypt data', 'Compile code'], correct: 1 },
  'cloud-computing': { question: 'What does "serverless" mean in cloud computing?', options: ['No servers exist', 'Server management is abstracted', 'Only local servers', 'Free hosting'], correct: 1 },
  'career-prep': { question: 'What is a common first step in a technical interview?', options: ['Negotiate salary', 'Clarify the problem', 'Write code immediately', 'Ask for hints'], correct: 1 },
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

  const [direction, setDirection] = useState(1);

  React.useEffect(() => {
    if (!profile?.topic) navigate('/');
  }, [profile, navigate]);

  if (!profile?.topic) return null;

  const quiz = quizQuestions[profile.topic] || DEFAULT_QUIZ;

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else { setDiagnosticData(data); navigate('/generate'); }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate('/');
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
    enter: (d: number) => ({ x: d > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d < 0 ? 200 : -200, opacity: 0 }),
  };

  const goNext = () => { setDirection(1); handleNext(); };
  const goBack = () => { setDirection(-1); handleBack(); };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20 sm:pb-0">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, hsl(160 84% 39% / 0.06) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, hsl(152 68% 50% / 0.04) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(hsl(160 84% 39% / 0.15) 1px, transparent 1px), linear-gradient(90deg, hsl(160 84% 39% / 0.15) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <header className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <button onClick={goBack} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" />
              <span className="text-sm font-mono uppercase tracking-wider text-foreground">{profile.topicLabel}</span>
            </div>
            <div className="w-16" />
          </nav>
        </header>

        {/* Progress */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
            {steps.map((s, index) => (
              <React.Fragment key={s.id}>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold transition-all duration-300",
                    step >= s.id ? "bg-primary/20 text-primary border border-primary/30 glow-neon" : "bg-muted text-muted-foreground border border-border"
                  )}>{s.id}</div>
                  <span className={cn("hidden sm:block text-xs font-mono uppercase tracking-wider transition-colors", step >= s.id ? "text-primary" : "text-muted-foreground")}>{s.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn("w-8 sm:w-16 h-px transition-colors", step > s.id ? "bg-primary" : "bg-border")} />
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
                <motion.div key="step1" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-8">
                  <div className="text-center">
                    <span className="hud-label mb-2 block">Calibration Phase</span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">How confident are you with {profile.topicLabel}?</h2>
                    <p className="text-sm text-muted-foreground">Honest calibration helps the AI optimize your protocol</p>
                  </div>
                  <div className="flex flex-col items-center gap-6">
                    <div className="flex items-center gap-3 sm:gap-4 w-full max-w-md">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <button key={level} onClick={() => setData({ ...data, confidenceLevel: level as 1|2|3|4|5 })}
                          className={cn(
                            "flex-1 aspect-square rounded-xl border flex items-center justify-center text-xl sm:text-2xl font-mono font-bold transition-all duration-300",
                            data.confidenceLevel === level
                              ? "border-primary bg-primary/15 text-primary scale-110 glow-neon"
                              : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                          )}>{level}</button>
                      ))}
                    </div>
                    <div className="flex justify-between w-full max-w-md text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      <span>Novice</span><span>Expert</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-card border border-border/50">
                    <div className="flex items-center gap-3 mb-4">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-xs font-mono uppercase tracking-wider text-primary">Daily allocation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {[30, 60, 90, 120].map((time) => (
                        <button key={time} onClick={() => setData({ ...data, availableTime: time })}
                          className={cn(
                            "flex-1 py-3 rounded-xl border text-sm font-mono font-medium transition-all duration-300",
                            data.availableTime === time
                              ? "border-primary bg-primary/15 text-primary"
                              : "border-border bg-muted/30 text-muted-foreground hover:border-primary/50"
                          )}>{time}m</button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-8">
                  <div className="text-center">
                    <span className="hud-label mb-2 block">Verification Phase</span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Quick knowledge check</h2>
                    <p className="text-sm text-muted-foreground">Don't worry if unsure — this calibrates your starting point</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-card border border-border/50">
                    <p className="text-base sm:text-lg text-foreground mb-6 font-medium">{quiz.question}</p>
                    <div className="space-y-3">
                      {quiz.options.map((option, index) => (
                        <button key={index} onClick={() => setData({ ...data, quizAnswer: option })}
                          className={cn(
                            "w-full p-4 rounded-xl border text-left transition-all duration-300",
                            data.quizAnswer === option
                              ? "border-primary bg-primary/10 text-foreground"
                              : "border-border bg-muted/20 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                          )}>
                          <span className="font-mono text-primary/60 mr-2">{String.fromCharCode(65 + index)}.</span> {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-8">
                  <div className="text-center">
                    <span className="hud-label mb-2 block">Objective Definition</span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">What's your primary objective?</h2>
                    <p className="text-sm text-muted-foreground">This configures the AI to optimize for your target outcome</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {goals.map((goal) => (
                      <button key={goal.id} onClick={() => setData({ ...data, goal: goal.id as DiagnosticData['goal'] })}
                        className={cn(
                          "p-5 rounded-2xl border text-left transition-all duration-300",
                          data.goal === goal.id ? "border-primary bg-primary/10 glow-neon" : "border-border bg-card hover:border-primary/50"
                        )}>
                        <div className="flex items-start gap-4">
                          <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center transition-colors border", data.goal === goal.id ? "bg-primary/20 border-primary/30" : "bg-muted border-border")}>
                            <goal.icon className={cn("w-5 h-5", data.goal === goal.id ? "text-primary" : "text-muted-foreground")} />
                          </div>
                          <div>
                            <h3 className={cn("font-semibold mb-1 text-sm", data.goal === goal.id ? "text-foreground" : "text-muted-foreground")}>{goal.label}</h3>
                            <p className="text-xs text-muted-foreground">{goal.description}</p>
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

        <footer className="container mx-auto px-4 py-6 pb-8 sm:pb-6 relative z-50">
          <div className="flex justify-center">
            <HeroButton size="lg" onClick={goNext} disabled={!canProceed()} icon={step === 3 ? <Sparkles className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}>
              {step === 3 ? 'Generate Protocol' : 'Continue'}
            </HeroButton>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Diagnostic;
