import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
import { CodeTerminal } from '@/components/CodeTerminal';
import { SectionReveal, StaggerContainer, StaggerItem } from '@/components/SectionReveal';
import { useStudy } from '@/context/StudyContext';
import { useAuth } from '@/context/AuthContext';
import {
  ArrowRight, Plus, LogIn, LogOut, User, Cpu, Zap, BarChart3, LayoutDashboard,
  Brain, Shield, Clock, CheckCircle2, GraduationCap, Rocket, Code2, Users,
  Star, ChevronRight, Globe, BookOpen, Award, Layers, Menu, X, Target, Sparkles,
} from 'lucide-react';
import heroIllustration from '@/assets/hero-illustration.png';
import { SEO, defaultJsonLd } from '@/components/SEO';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { setTopic, profile } = useStudy();
  const { user, signOut, profile: authProfile } = useAuth();
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

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
    { value: '10K+', label: 'Study Plans' },
    { value: '95%', label: 'Completion' },
    { value: '4.9', label: 'Rating' },
  ];

  const howItWorks = [
    {
      step: '01',
      icon: Brain,
      title: 'Take the Diagnostic',
      description: 'Our AI assesses your current skill level with precision tests calibrated by industry experts.',
    },
    {
      step: '02',
      icon: Layers,
      title: 'Get Your Custom Plan',
      description: 'Receive a personalized 7-day intensive protocol with curated resources and coding challenges.',
    },
    {
      step: '03',
      icon: Code2,
      title: 'Learn by Building',
      description: '70% hands-on coding practice with real-world projects. Track progress with XP and badges.',
    },
    {
      step: '04',
      icon: Rocket,
      title: 'Become Job-Ready',
      description: 'Complete all 14 domains and graduate with a portfolio that proves your competency.',
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
    <div className="min-h-screen bg-background overflow-hidden pb-20 sm:pb-0">
      <SEO jsonLd={defaultJsonLd} />
      <AnimatedBackground />

      <div className="relative z-10">
        {/* ─── HEADER ─── */}
        <header className="sticky top-0 z-50">
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-xl border-b border-border/30"
            style={{ opacity: headerOpacity }}
          />
          <div className="relative container mx-auto px-4 py-3 sm:py-4">
            <nav className="flex items-center justify-between">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2.5"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center glow-neon">
                  <Cpu className="w-4 h-4 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm sm:text-base font-bold text-foreground tracking-tight leading-none">
                    AI Study Coach
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-primary/60 hidden sm:block">
                    Neural Learning v2.0
                  </span>
                </div>
              </motion.div>

              {/* Desktop nav */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden sm:flex items-center gap-2"
              >
                <button
                  onClick={() => navigate('/progress')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all magnetic-hover"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <ThemeToggle />
                {user ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate('/profile')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all magnetic-hover"
                    >
                      <User className="w-4 h-4" />
                      <span>{authProfile?.display_name || user.email?.split('@')[0]}</span>
                    </button>
                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <HeroButton variant="ghost" size="sm" onClick={() => navigate('/auth')}>
                    <LogIn className="w-4 h-4 mr-1" />
                    Sign In
                  </HeroButton>
                )}
                {profile?.generatedPlan && (
                  <HeroButton variant="secondary" size="sm" onClick={() => navigate('/dashboard')}>
                    Continue Learning
                  </HeroButton>
                )}
              </motion.div>

              {/* Mobile nav buttons */}
              <div className="flex sm:hidden items-center gap-1.5">
                <ThemeToggle />
                {profile?.generatedPlan && (
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="p-2 rounded-lg bg-primary/10 border border-primary/30 text-primary"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </nav>

            {/* Mobile menu */}
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="sm:hidden mt-3 pb-3 border-t border-border/30 pt-3 space-y-1"
              >
                <button
                  onClick={() => { navigate('/progress'); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Progress Dashboard
                </button>
                {user ? (
                  <>
                    <button
                      onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
                    >
                      <User className="w-4 h-4" />
                      {authProfile?.display_name || 'Profile'}
                    </button>
                    <button
                      onClick={() => { signOut(); setMobileMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-primary hover:bg-primary/5 transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </header>

        <WelcomeBackBanner />

        {/* ─── HERO ─── */}
        <section className="container mx-auto px-4 pt-6 sm:pt-12 lg:pt-16 pb-12 sm:pb-20 lg:pb-24 section-divider">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left – copy */}
              <div className="text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/20 text-primary text-[10px] sm:text-xs font-mono uppercase tracking-[0.15em] mb-5 sm:mb-8">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Learn → Build → Practice → Get Hired
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-foreground leading-[1.05] mb-4 sm:mb-6 tracking-tight"
                >
                  Be that{' '}
                  <span className="text-gradient-primary text-neon">impactful engineer</span>{' '}
                  every company needs.
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="flex items-center gap-2 sm:gap-3 justify-center lg:justify-start mb-4 sm:mb-5 flex-wrap"
                >
                  {['Project-Based', 'Interview-Ready', 'Industry-Aligned'].map((tag) => (
                    <span key={tag} className="flex items-center gap-1 text-[11px] sm:text-sm font-medium text-primary/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                      {tag}
                    </span>
                  ))}
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-6 sm:mb-10 leading-relaxed"
                >
                  Build real systems, not watch tutorials. AI-powered curriculum across 14 core domains — 
                  from programming basics to system design. No CS degree required.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-8 sm:mb-10"
                >
                  <HeroButton
                    size="lg"
                    icon={<ArrowRight className="w-5 h-5" />}
                    onClick={() => document.getElementById('topics')?.scrollIntoView({ behavior: 'smooth' })}
                    className="magnetic-hover w-full sm:w-auto"
                  >
                    Start Learning
                  </HeroButton>
                  <HeroButton variant="ghost" size="lg" onClick={() => navigate('/auth')} className="magnetic-hover w-full sm:w-auto">
                    Access Terminal
                  </HeroButton>
                </motion.div>

                {/* Animated stats */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-center lg:justify-start gap-6 sm:gap-8"
                >
                  {stats.map((stat, i) => (
                    <div key={i} className="text-center lg:text-left">
                      <CountUp end={stat.value} className="font-mono text-lg sm:text-2xl font-bold text-foreground" />
                      <div className="text-[9px] sm:text-xs text-muted-foreground font-mono uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Right – code terminal */}
              <div className="hidden lg:block">
                <CodeTerminal />
              </div>
            </div>

            {/* Mobile code terminal - compact version */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 lg:hidden"
            >
              <div className="relative rounded-xl overflow-hidden border border-border/60 bg-card/80 backdrop-blur-xl">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-border/40 bg-card/60">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-destructive/60" />
                    <div className="w-2 h-2 rounded-full bg-warning/60" />
                    <div className="w-2 h-2 rounded-full bg-primary/60" />
                  </div>
                  <span className="font-mono text-[9px] text-muted-foreground/60 flex-1 text-center">study-protocol.ts</span>
                  <span className="px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20 font-mono text-[8px] text-primary">TS</span>
                </div>
                <div className="p-3 font-mono text-[11px] leading-5 text-muted-foreground">
                  <div><span className="text-primary">const</span> student = <span className="text-primary">new</span> <span className="text-accent">AICoach</span>({'{'}</div>
                  <div className="pl-3"><span className="text-accent">topic</span>: <span className="text-primary/70">"System Design"</span>,</div>
                  <div className="pl-3"><span className="text-accent">goal</span>: <span className="text-primary/70">"job-ready"</span></div>
                  <div>{'}'});</div>
                  <div className="mt-1 text-primary/50">// ✓ 14 domains mapped • Ready to learn!</div>
                </div>
                <div className="flex items-center justify-between px-3 py-1 border-t border-border/30 bg-card/40">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="font-mono text-[8px] text-muted-foreground/50">AI Engine Active</span>
                  </div>
                  <span className="font-mono text-[8px] text-muted-foreground/30">UTF-8</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Features row */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 max-w-5xl mx-auto mt-12 sm:mt-24" staggerDelay={0.12}>
            {features.map((feature) => (
              <StaggerItem key={feature.title}>
                <div className="group relative p-4 sm:p-6 rounded-2xl bg-card/60 border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-glow magnetic-hover frosted-glass">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-lg sm:text-xl font-bold text-primary">{feature.stat}</div>
                        <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{feature.statLabel}</div>
                      </div>
                    </div>
                    <h3 className="text-sm sm:text-lg font-bold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* ─── SOCIAL PROOF ─── */}
        <section className="border-y border-border/30 bg-card/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6 sm:py-10">
            <SectionReveal>
              <p className="text-center font-mono text-[9px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 sm:mb-6">
                Our graduates work at
              </p>
            </SectionReveal>
            <div className="flex items-center justify-center gap-5 sm:gap-12 flex-wrap">
              {trustLogos.map((name, i) => (
                <motion.span
                  key={name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="text-xs sm:text-base font-semibold text-muted-foreground/40 tracking-wide select-none hover:text-primary/50 transition-colors duration-300"
                >
                  {name}
                </motion.span>
              ))}
            </div>
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section className="container mx-auto px-4 py-14 sm:py-32 section-divider">
          <SectionReveal className="text-center mb-10 sm:mb-20">
            <span className="hud-label mb-3 block">Process Protocol</span>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
              Your complete <span className="text-gradient-primary">developer journey</span>
            </h2>
            <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Four steps from zero knowledge to job-ready software engineer. Our AI handles the complexity.
            </p>
          </SectionReveal>

          <StaggerContainer className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8" staggerDelay={0.1}>
            {howItWorks.map((item, idx) => (
              <StaggerItem key={item.step}>
                <div className="group relative p-5 sm:p-8 rounded-2xl bg-card/40 border border-border/40 hover:border-primary/30 transition-all duration-500 hover:shadow-glow magnetic-hover h-full">
                  {/* Step number connector */}
                  <div className="absolute top-5 right-5 sm:top-8 sm:right-8">
                    <span className="font-mono text-2xl sm:text-4xl font-black text-primary/10 group-hover:text-primary/25 transition-colors duration-500">
                      {item.step}
                    </span>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/15 group-hover:scale-110 group-hover:shadow-glow transition-all duration-300">
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* ─── TOPICS ─── */}
        <section id="topics" className="container mx-auto px-4 py-12 sm:py-24 section-divider">
          <SectionReveal className="text-center mb-8 sm:mb-14">
            <span className="hud-label mb-3 block">Full Curriculum — 14 Domains</span>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
              Your complete <span className="text-gradient-primary">engineering roadmap</span>
            </h2>
            <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto">
              From absolute beginner to job-ready software engineer. Each protocol generates a personalized 7-day intensive with AI-adaptive learning.
            </p>
          </SectionReveal>

          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 max-w-7xl mx-auto" staggerDelay={0.06}>
            {TOPICS.map((topic, index) => (
              <StaggerItem key={topic.id}>
                <TopicCard topic={topic} index={index} onSelect={handleTopicSelect} />
              </StaggerItem>
            ))}

            <StaggerItem>
              <motion.button
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCustomModal(true)}
                className="group relative w-full overflow-hidden rounded-2xl p-4 sm:p-6 text-left transition-all duration-500 ease-out border border-dashed border-primary/20 hover:border-primary/50 hover:shadow-glow focus-ring bg-card/30 backdrop-blur-sm magnetic-hover"
              >
                <div className="flex flex-col items-center justify-center py-4 sm:py-8 text-center">
                  <motion.div
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-primary/8 border border-primary/20 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary/15 group-hover:border-primary/40 transition-all"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                  </motion.div>
                  <h3 className="text-sm sm:text-xl font-bold text-foreground mb-1 sm:mb-2 group-hover:text-primary transition-colors">Custom Protocol</h3>
                  <p className="text-[10px] sm:text-sm text-muted-foreground">Define your own study vector</p>
                </div>
              </motion.button>
            </StaggerItem>
          </StaggerContainer>
        </section>

        {/* ─── TESTIMONIALS ─── */}
        <section className="container mx-auto px-4 py-14 sm:py-32 section-divider">
          <SectionReveal className="text-center mb-10 sm:mb-20">
            <span className="hud-label mb-3 block">Success Stories</span>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
              Engineers we've <span className="text-gradient-primary">launched</span>
            </h2>
          </SectionReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto" staggerDelay={0.12}>
            {testimonials.map((t) => (
              <StaggerItem key={t.name}>
                <div className="relative p-5 sm:p-8 rounded-2xl frosted-glass hover:border-primary/20 transition-all duration-500 magnetic-hover h-full">
                  <div className="flex items-center gap-1 mb-3 sm:mb-4">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary fill-primary" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-base text-foreground/90 leading-relaxed mb-4 sm:mb-6 italic">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center font-mono text-xs sm:text-sm font-bold text-primary">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-foreground">{t.name}</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* ─── LEARNING ROADMAP ─── */}
        <section className="container mx-auto px-4 py-12 sm:py-24 section-divider">
          <SectionReveal className="text-center mb-8 sm:mb-14">
            <span className="hud-label mb-3 block">Recommended Sequence</span>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
              Your <span className="text-gradient-primary">learning path</span>
            </h2>
            <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Follow this recommended order from absolute beginner to job-ready software engineer.
            </p>
          </SectionReveal>

          <SectionReveal delay={0.15}>
            <div className="max-w-2xl mx-auto">
              <LearningRoadmap
                onTopicSelect={(topicId) => {
                  const topic = TOPICS.find(t => t.id === topicId);
                  if (topic) handleTopicSelect(topic);
                }}
              />
            </div>
          </SectionReveal>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section className="container mx-auto px-4 py-14 sm:py-32">
          <SectionReveal>
            <div className="relative max-w-4xl mx-auto text-center p-8 sm:p-16 rounded-3xl border border-primary/20 bg-card/30 backdrop-blur-sm overflow-hidden shimmer-border">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3" />
              <div className="absolute -top-20 -right-20 w-40 sm:w-60 h-40 sm:h-60 rounded-full bg-primary/5 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-40 sm:w-60 h-40 sm:h-60 rounded-full bg-primary/3 blur-3xl" />

              <div className="relative z-10">
                <motion.div
                  className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center mx-auto mb-5 sm:mb-6 glow-neon"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <GraduationCap className="w-7 h-7 sm:w-10 sm:h-10 text-primary" />
                </motion.div>

                <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
                  Ready to start your <span className="text-gradient-primary">engineering journey</span>?
                </h2>
                <p className="text-xs sm:text-base text-muted-foreground max-w-xl mx-auto mb-6 sm:mb-8">
                  Join thousands of learners who have transformed their careers with AI-powered, structured learning.
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
                  <HeroButton
                    size="lg"
                    icon={<ArrowRight className="w-5 h-5" />}
                    onClick={() => document.getElementById('topics')?.scrollIntoView({ behavior: 'smooth' })}
                    className="magnetic-hover w-full sm:w-auto"
                  >
                    Start Learning Now
                  </HeroButton>
                  <HeroButton variant="ghost" size="lg" onClick={() => navigate('/auth')} className="magnetic-hover w-full sm:w-auto">
                    Create Free Account
                  </HeroButton>
                </div>
              </div>
            </div>
          </SectionReveal>
        </section>

        {/* ─── FOOTER ─── */}
        <footer className="border-t border-border/30 bg-card/10">
          <div className="container mx-auto px-4 py-10 sm:py-16">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-12 mb-8 sm:mb-14">
              <div className="col-span-2 sm:col-span-1">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <Cpu className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-bold text-foreground">AI Study Coach</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The AI-powered platform to become a software engineer without a degree.
                </p>
              </div>
              {[
                { title: 'Product', items: ['Curriculum', 'Dashboard', 'Roadmap', 'Pricing'] },
                { title: 'Resources', items: ['Documentation', 'Blog', 'Community', 'Support'] },
                { title: 'Company', items: ['About', 'Careers', 'Privacy', 'Terms'] },
              ].map((col) => (
                <div key={col.title}>
                  <h4 className="font-mono text-[10px] uppercase tracking-[0.15em] text-primary/70 mb-3 sm:mb-4">{col.title}</h4>
                  <ul className="space-y-2">
                    {col.items.map((item) => (
                      <li key={item}>
                        <span className="text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="border-t border-border/30 pt-5 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-xs text-muted-foreground font-mono">
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
