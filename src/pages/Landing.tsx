import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TOPICS, Topic } from '@/types/study';
import { TopicCard } from '@/components/TopicCard';
import { CustomTopicModal } from '@/components/CustomTopicModal';
import { WelcomeBackBanner } from '@/components/WelcomeBackBanner';
import { HeroButton } from '@/components/ui/HeroButton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { useStudy } from '@/context/StudyContext';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, BookOpen, Brain, Target, Sparkles, Plus, LogIn, LogOut, User, Cpu, Zap, BarChart3 } from 'lucide-react';
import heroIllustration from '@/assets/hero-illustration.png';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { setTopic, profile } = useStudy();
  const { user, signOut, profile: authProfile } = useAuth();
  const [showCustomModal, setShowCustomModal] = useState(false);

  const handleTopicSelect = (topic: Topic) => {
    setTopic(topic.id, topic.label);
    navigate('/diagnostic');
  };

  const handleCustomTopicCreate = (topic: Topic) => {
    setTopic(topic.id, topic.label);
    navigate('/diagnostic');
  };

  const features = [
    {
      icon: Cpu,
      title: 'Neural Engine',
      description: 'AI-driven adaptive curriculum that evolves with your skill level in real-time',
      stat: '99.2%',
      statLabel: 'Accuracy',
    },
    {
      icon: Zap,
      title: '7-Day Protocol',
      description: 'Accelerated learning sprints from fundamentals to production-ready skills',
      stat: '7',
      statLabel: 'Days',
    },
    {
      icon: BarChart3,
      title: 'Deep Analytics',
      description: 'Track progress with precision metrics, streaks, and competency mapping',
      stat: '70/30',
      statLabel: 'Practice/Theory',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Study Plans Generated' },
    { value: '95%', label: 'Completion Rate' },
    { value: '4.9', label: 'User Rating' },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-4 sm:py-6">
          <nav className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2.5"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center glow-neon">
                <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold text-foreground tracking-tight leading-none">
                  AI Study Coach
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-primary/60 hidden sm:block">
                  Neural Learning v2.0
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 sm:gap-3"
            >
              <ThemeToggle />
              {user ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{authProfile?.display_name || user.email?.split('@')[0]}</span>
                  </button>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </div>
              ) : (
                <HeroButton
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/auth')}
                >
                  <LogIn className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Sign In</span>
                  <span className="sm:hidden">Login</span>
                </HeroButton>
              )}
              {profile?.generatedPlan && (
                <HeroButton
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                >
                  <span className="hidden sm:inline">Continue Learning</span>
                  <span className="sm:hidden">Continue</span>
                </HeroButton>
              )}
            </motion.div>
          </nav>
        </header>

        <WelcomeBackBanner />

        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-8 sm:pt-20 pb-16 sm:pb-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Left column — text */}
              <div className="text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/20 text-primary text-xs font-mono uppercase tracking-[0.15em] mb-6 sm:mb-8">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    System Online — Ready to Learn
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-foreground leading-[1.05] mb-5 sm:mb-6 tracking-tight"
                >
                  Become a{' '}
                  <span className="text-gradient-primary text-neon">software engineer</span>
                  <br />
                  without a degree
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 sm:mb-10 leading-relaxed"
                >
                  AI-engineered study protocols that adapt to your cognition in real-time. 
                  Personalized curricula. Precision analytics. Accelerated mastery.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10"
                >
                  <HeroButton
                    size="lg"
                    icon={<ArrowRight className="w-5 h-5" />}
                    onClick={() => {
                      document.getElementById('topics')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Initialize Protocol
                  </HeroButton>
                  <HeroButton
                    variant="ghost"
                    size="lg"
                    onClick={() => navigate('/auth')}
                  >
                    Access Terminal
                  </HeroButton>
                </motion.div>

                {/* Inline stats */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-center lg:justify-start gap-8"
                >
                  {stats.map((stat, i) => (
                    <div key={i} className="text-center lg:text-left">
                      <div className="font-mono text-xl sm:text-2xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground font-mono uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Right column — hero image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 40 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative hidden lg:block"
              >
                <div className="relative rounded-2xl overflow-hidden border border-primary/20 glow-neon">
                  <img 
                    src={heroIllustration} 
                    alt="AI neural network visualization"
                    className="w-full h-auto"
                    width={1280}
                    height={640}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-transparent" />
                  {/* HUD overlay elements */}
                  <div className="absolute top-4 left-4 px-2 py-1 rounded bg-background/60 border border-primary/20 backdrop-blur-sm">
                    <span className="font-mono text-[10px] text-primary uppercase tracking-wider">Neural Map Active</span>
                  </div>
                  <div className="absolute bottom-4 right-4 px-2 py-1 rounded bg-background/60 border border-primary/20 backdrop-blur-sm">
                    <span className="font-mono text-[10px] text-primary/70">SYS.OK ● 100%</span>
                  </div>
                </div>

                {/* Decorative floating elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-24 h-24 rounded-xl border border-primary/15 bg-primary/5"
                  animate={{ y: [0, -8, 0], rotate: [0, 3, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full border border-primary/10 bg-primary/3"
                  animate={{ y: [0, 6, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                />
              </motion.div>
            </div>

            {/* Mobile hero image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 lg:hidden"
            >
              <div className="relative rounded-2xl overflow-hidden border border-primary/20 glow-neon">
                <img 
                  src={heroIllustration} 
                  alt="AI neural network visualization"
                  className="w-full h-auto"
                  width={1280}
                  height={640}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </div>
            </motion.div>
          </div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto mt-16 sm:mt-24"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                className="group relative p-5 sm:p-6 rounded-2xl bg-card/60 border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-glow"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-lg sm:text-xl font-bold text-primary">{feature.stat}</div>
                      <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{feature.statLabel}</div>
                    </div>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Topics Section */}
        <section id="topics" className="container mx-auto px-4 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-14"
          >
            <span className="hud-label mb-3 block">Select Protocol</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Choose your learning <span className="text-gradient-primary">protocol</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Initialize a pre-built curriculum or define your own custom study vector
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {TOPICS.map((topic, index) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                index={index}
                onSelect={handleTopicSelect}
              />
            ))}

            {/* Custom Topic Card */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: TOPICS.length * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCustomModal(true)}
              className="group relative w-full overflow-hidden rounded-2xl p-6 text-left transition-all duration-500 ease-out border border-dashed border-primary/20 hover:border-primary/50 hover:shadow-glow focus-ring bg-card/30 backdrop-blur-sm"
            >
              <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-primary/8 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/15 group-hover:border-primary/40 transition-all"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Plus className="w-8 h-8 text-primary" />
                </motion.div>
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  Custom Protocol
                </h3>
                <p className="text-sm text-muted-foreground">
                  Define your own study vector for any subject
                </p>
              </div>
            </motion.button>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-6 sm:py-8 border-t border-border/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-muted-foreground font-mono">
            <span>© 2025 AI Study Coach — Neural Learning System</span>
            <div className="flex items-center gap-4 sm:gap-6">
              <span className="cursor-pointer hover:text-primary transition-colors">Docs</span>
              <span className="cursor-pointer hover:text-primary transition-colors">GitHub</span>
              <span className="text-primary/40">v2.0.0</span>
            </div>
          </div>
        </footer>
      </div>

      <CustomTopicModal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onSubmit={handleCustomTopicCreate}
      />
    </div>
  );
};

export default Landing;
