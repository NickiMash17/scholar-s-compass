import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TOPICS, Topic } from '@/types/study';
import { TopicCard } from '@/components/TopicCard';
import { CustomTopicModal } from '@/components/CustomTopicModal';
import { HeroButton } from '@/components/ui/HeroButton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { useStudy } from '@/context/StudyContext';
import { ArrowRight, BookOpen, Brain, Target, Sparkles, Plus } from 'lucide-react';
import heroIllustration from '@/assets/hero-illustration.png';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { setTopic, profile } = useStudy();
  const [showCustomModal, setShowCustomModal] = useState(false);

  const handleTopicSelect = (topic: Topic) => {
    setTopic(topic.id, topic.label);
    navigate('/diagnostic');
  };

  const handleCustomTopicCreate = (topic: Topic) => {
    setTopic(topic.id, topic.label);
    navigate('/diagnostic');
  };

  // If user has an existing plan, offer to continue
  React.useEffect(() => {
    if (profile?.generatedPlan) {
      // User has a plan, could show continue option
    }
  }, [profile]);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered',
      description: 'Personalized curriculum based on your skill level and goals',
    },
    {
      icon: Target,
      title: '7-Day Focus',
      description: 'Structured learning path from basics to mastery',
    },
    {
      icon: BookOpen,
      title: 'Hands-On',
      description: '70% practice, 30% theory for real skill development',
    },
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
              className="flex items-center gap-2"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-navy-950" />
              </div>
              <span className="font-serif text-lg sm:text-xl font-semibold text-foreground">
                AI Study Coach
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 sm:gap-3"
            >
              <ThemeToggle />
              {profile?.generatedPlan && (
                <HeroButton
                  variant="ghost"
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

        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-8 sm:pt-16 pb-16 sm:pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs sm:text-sm font-medium mb-6 sm:mb-8">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Your AI-powered study companion
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground leading-tight mb-4 sm:mb-6"
            >
              From confused to{' '}
              <span className="text-gradient-amber">confident</span>
              <br />
              in 7 days
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-12 px-2"
            >
              Transform your software engineering learning with personalized AI-powered 
              study plans. Master concepts with adaptive curricula designed for your pace.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <HeroButton
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                onClick={() => {
                  document.getElementById('topics')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Start Your Journey
              </HeroButton>
            </motion.div>

            {/* Hero Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 sm:mt-12 max-w-3xl mx-auto"
            >
              <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-glow">
                <img 
                  src={heroIllustration} 
                  alt="AI assistant helping a student study"
                  className="w-full h-auto"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              </div>
            </motion.div>
          </div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto mt-12 sm:mt-20"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                className="flex flex-col items-center text-center p-4 sm:p-6"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3 sm:mb-4">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                </div>
                <h3 className="font-serif text-base sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{feature.description}</p>
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
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Choose your learning path
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Select a topic to begin your personalized 7-day study plan, or create your own
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
              className="group relative w-full overflow-hidden rounded-2xl p-6 text-left transition-all duration-500 ease-out border-2 border-dashed border-border/60 hover:border-primary/50 hover:shadow-glow focus-ring bg-card/30 backdrop-blur-sm"
            >
              <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Plus className="w-8 h-8 text-primary" />
                </motion.div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  Custom Topic
                </h3>
                <p className="text-sm text-muted-foreground">
                  Create your own study plan for any subject
                </p>
              </div>
            </motion.button>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-6 sm:py-8 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <span>© 2025 AI Study Coach. Built for learners.</span>
            <div className="flex items-center gap-4 sm:gap-6">
              <span className="link-underline cursor-pointer">Documentation</span>
              <span className="link-underline cursor-pointer">GitHub</span>
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
