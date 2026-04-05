import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TOPICS, Topic } from '@/types/study';
import { LearningRoadmap } from '@/components/LearningRoadmap';
import { TopicCard } from '@/components/TopicCard';
import { CustomTopicModal } from '@/components/CustomTopicModal';
import { WelcomeBackBanner } from '@/components/WelcomeBackBanner';
import { HeroButton } from '@/components/ui/HeroButton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { CountUp } from '@/components/CountUp';
import { useStudy } from '@/context/StudyContext';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, Plus, LogIn, LogOut, User, Cpu, Zap, BarChart3, LayoutDashboard, Brain, Shield, Clock, CheckCircle2, GraduationCap, Rocket, Code2, Users, Star, ChevronRight, Globe, BookOpen, Award, Layers } from 'lucide-react';
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

  const howItWorks = [
    {
      step: '01',
      icon: Brain,
      title: 'Take the Diagnostic',
      description: 'Our AI assesses your current skill level with precision diagnostic tests calibrated by industry experts.',
    },
    {
      step: '02',
      icon: Layers,
      title: 'Get Your Custom Plan',
      description: 'Receive a personalized 7-day intensive study protocol with curated resources, coding challenges, and projects.',
    },
    {
      step: '03',
      icon: Code2,
      title: 'Learn by Building',
      description: '70% hands-on coding practice with real-world projects. Track your progress with XP, badges, and streaks.',
    },
    {
      step: '04',
      icon: Rocket,
      title: 'Become Job-Ready',
      description: 'Complete all 14 domains and graduate with a portfolio that proves your engineering competency.',
    },
  ];

  const testimonials = [
    {
      quote: "I went from zero coding knowledge to landing a junior developer role in 4 months. The structured approach made all the difference.",
      name: "Alex Chen",
      role: "Junior Developer at Stripe",
      avatar: "AC",
    },
    {
      quote: "The AI-adaptive curriculum is incredible. It knew exactly where my gaps were and adjusted the difficulty perfectly.",
      name: "Sarah Kim",
      role: "Full-Stack Engineer at Vercel",
      avatar: "SK",
    },
    {
      quote: "Best learning platform I've used. The Pomodoro integration and gamification kept me motivated through the hardest topics.",
      name: "Marcus Johnson",
      role: "Software Engineer at Figma",
      avatar: "MJ",
    },
  ];

  const trustLogos = ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Netflix'];

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
              <button
                onClick={() => navigate('/progress')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all"
                title="Progress Dashboard"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
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
                  A comprehensive, AI-powered curriculum covering 14 core domains — from programming basics to system design. 
                  No CS degree required. Just you, a plan, and focused execution.
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

                {/* Animated stats */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-center lg:justify-start gap-8"
                >
                  {stats.map((stat, i) => (
                    <div key={i} className="text-center lg:text-left">
                      <CountUp end={stat.value} className="font-mono text-xl sm:text-2xl font-bold text-foreground" />
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
                  <div className="absolute top-4 left-4 px-2 py-1 rounded bg-background/60 border border-primary/20 backdrop-blur-sm">
                    <span className="font-mono text-[10px] text-primary uppercase tracking-wider">Neural Map Active</span>
                  </div>
                  <div className="absolute bottom-4 right-4 px-2 py-1 rounded bg-background/60 border border-primary/20 backdrop-blur-sm">
                    <span className="font-mono text-[10px] text-primary/70">SYS.OK ● 100%</span>
                  </div>
                </div>

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

        {/* Trusted By / Social Proof Bar */}
        <section className="border-y border-border/30 bg-card/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-8 sm:py-10">
            <p className="text-center font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
              Our graduates work at
            </p>
            <div className="flex items-center justify-center gap-8 sm:gap-12 flex-wrap">
              {trustLogos.map((name) => (
                <motion.span
                  key={name}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-sm sm:text-base font-semibold text-muted-foreground/40 tracking-wide select-none"
                >
                  {name}
                </motion.span>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-4 py-20 sm:py-32">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-14 sm:mb-20"
          >
            <span className="hud-label mb-3 block">Process Protocol</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              How it <span className="text-gradient-primary">works</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Four steps from zero knowledge to job-ready software engineer. Our AI handles the complexity — you focus on learning.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {howItWorks.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative p-6 sm:p-8 rounded-2xl bg-card/40 border border-border/40 hover:border-primary/30 transition-all duration-500 hover:shadow-glow"
              >
                <div className="absolute top-6 right-6 sm:top-8 sm:right-8">
                  <span className="font-mono text-3xl sm:text-4xl font-black text-primary/10 group-hover:text-primary/20 transition-colors">
                    {item.step}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/15 group-hover:shadow-glow transition-all">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
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
            <span className="hud-label mb-3 block">Full Curriculum — 14 Domains</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Your complete <span className="text-gradient-primary">engineering roadmap</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              From absolute beginner to job-ready software engineer. Each protocol generates a personalized 7-day intensive with AI-adaptive learning.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 max-w-7xl mx-auto">
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

        {/* Testimonials */}
        <section className="container mx-auto px-4 py-20 sm:py-32">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-14 sm:mb-20"
          >
            <span className="hud-label mb-3 block">Success Stories</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Engineers we've <span className="text-gradient-primary">launched</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative p-6 sm:p-8 rounded-2xl bg-card/40 border border-border/40 hover:border-primary/20 transition-all duration-500"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="w-3.5 h-3.5 text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-foreground/90 leading-relaxed mb-6 italic">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center font-mono text-sm font-bold text-primary">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Learning Roadmap Section */}
        <section className="container mx-auto px-4 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-14"
          >
            <span className="hud-label mb-3 block">Recommended Sequence</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Your <span className="text-gradient-primary">learning path</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Follow this recommended order from absolute beginner to job-ready software engineer. Each phase builds on the previous one.
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <LearningRoadmap
              onTopicSelect={(topicId) => {
                const topic = TOPICS.find(t => t.id === topicId);
                if (topic) handleTopicSelect(topic);
              }}
            />
          </div>
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-4 py-20 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative max-w-4xl mx-auto text-center p-10 sm:p-16 rounded-3xl border border-primary/20 bg-card/30 backdrop-blur-sm overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3" />
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-primary/3 blur-3xl" />
            
            <div className="relative z-10">
              <motion.div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center mx-auto mb-6 glow-neon"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </motion.div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Ready to start your <span className="text-gradient-primary">engineering journey</span>?
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-8">
                Join thousands of learners who have transformed their careers with AI-powered, structured learning. No prior experience needed.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <HeroButton
                  size="lg"
                  icon={<ArrowRight className="w-5 h-5" />}
                  onClick={() => {
                    document.getElementById('topics')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Start Learning Now
                </HeroButton>
                <HeroButton
                  variant="ghost"
                  size="lg"
                  onClick={() => navigate('/auth')}
                >
                  Create Free Account
                </HeroButton>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/30 bg-card/10">
          <div className="container mx-auto px-4 py-12 sm:py-16">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12 mb-10 sm:mb-14">
              {/* Brand */}
              <div className="col-span-2 sm:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <Cpu className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-bold text-foreground">AI Study Coach</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The AI-powered platform to become a software engineer without a degree.
                </p>
              </div>

              {/* Product */}
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.15em] text-primary/70 mb-4">Product</h4>
                <ul className="space-y-2.5">
                  {['Curriculum', 'Dashboard', 'Roadmap', 'Pricing'].map(item => (
                    <li key={item}>
                      <span className="text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.15em] text-primary/70 mb-4">Resources</h4>
                <ul className="space-y-2.5">
                  {['Documentation', 'Blog', 'Community', 'Support'].map(item => (
                    <li key={item}>
                      <span className="text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.15em] text-primary/70 mb-4">Company</h4>
                <ul className="space-y-2.5">
                  {['About', 'Careers', 'Privacy', 'Terms'].map(item => (
                    <li key={item}>
                      <span className="text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-border/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground font-mono">
              <span>© 2025 AI Study Coach — Neural Learning System</span>
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
