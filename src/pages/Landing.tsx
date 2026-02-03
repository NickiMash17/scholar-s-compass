import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TOPICS, Topic } from '@/types/study';
import { TopicCard } from '@/components/TopicCard';
import { HeroButton } from '@/components/ui/HeroButton';
import { useStudy } from '@/context/StudyContext';
import { ArrowRight, BookOpen, Brain, Target, Sparkles } from 'lucide-react';
import heroIllustration from '@/assets/hero-illustration.png';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { setTopic, profile } = useStudy();

  const handleTopicSelect = (topic: Topic) => {
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
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/3 blur-3xl" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(48 96% 89% / 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, hsl(48 96% 89% / 0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-navy-950" />
              </div>
              <span className="font-serif text-xl font-semibold text-foreground">
                AI Study Coach
              </span>
            </motion.div>

            {profile?.generatedPlan && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <HeroButton
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                >
                  Continue Learning
                </HeroButton>
              </motion.div>
            )}
          </nav>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-16 pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4" />
                Your AI-powered study companion
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6"
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
              className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12"
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
              className="mt-12 max-w-3xl mx-auto"
            >
              <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-glow">
                <img 
                  src={heroIllustration} 
                  alt="AI assistant helping a student study"
                  className="w-full h-auto"
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
            className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-20"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                className="flex flex-col items-center text-center p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Topics Section */}
        <section id="topics" className="container mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Choose your learning path
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Select a topic to begin your personalized 7-day study plan
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {TOPICS.map((topic, index) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                index={index}
                onSelect={handleTopicSelect}
              />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <span>© 2025 AI Study Coach. Built for learners.</span>
            <div className="flex items-center gap-6">
              <span className="link-underline cursor-pointer">Documentation</span>
              <span className="link-underline cursor-pointer">GitHub</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
