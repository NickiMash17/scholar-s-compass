import React from 'react';
import { motion } from 'framer-motion';
import { Topic } from '@/types/study';
import { ChevronRight, Cpu, Check, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTopicProgress } from '@/hooks/useTopicProgress';

import topicProgrammingFundamentals from '@/assets/topic-programming-fundamentals.png';
import topicCsharpOop from '@/assets/topic-csharp-oop.png';
import topicSqlDatabases from '@/assets/topic-sql-databases.png';
import topicAspnetApis from '@/assets/topic-aspnet-apis.png';
import topicTesting from '@/assets/topic-testing.png';
import topicDataStructures from '@/assets/topic-data-structures.png';
import topicDesignPatterns from '@/assets/topic-design-patterns.png';
import topicWebFundamentals from '@/assets/topic-web-fundamentals.png';
import topicFrontendFrameworks from '@/assets/topic-frontend-frameworks.png';
import topicGitVersionControl from '@/assets/topic-git-version-control.png';
import topicDevopsCicd from '@/assets/topic-devops-cicd.png';
import topicSystemDesign from '@/assets/topic-system-design.png';
import topicCloudComputing from '@/assets/topic-cloud-computing.png';
import topicCareerPrep from '@/assets/topic-career-prep.png';

const TOPIC_IMAGES: Record<string, string> = {
  'programming-fundamentals': topicProgrammingFundamentals,
  'csharp-oop': topicCsharpOop,
  'sql-databases': topicSqlDatabases,
  'aspnet-apis': topicAspnetApis,
  'testing': topicTesting,
  'data-structures': topicDataStructures,
  'design-patterns': topicDesignPatterns,
  'web-fundamentals': topicWebFundamentals,
  'frontend-frameworks': topicFrontendFrameworks,
  'git-version-control': topicGitVersionControl,
  'devops-cicd': topicDevopsCicd,
  'system-design': topicSystemDesign,
  'cloud-computing': topicCloudComputing,
  'career-prep': topicCareerPrep,
};

interface TopicCardProps {
  topic: Topic;
  index: number;
  onSelect: (topic: Topic) => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic, index, onSelect }) => {
  const topicImage = TOPIC_IMAGES[topic.id];
  const { getTopicProgress, isTopicCompleted, isTopicStarted } = useTopicProgress();
  const completed = isTopicCompleted(topic.id);
  const started = isTopicStarted(topic.id);
  const progress = getTopicProgress(topic.id);
  const percent = progress?.completionPercent ?? 0;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.04 }}
      whileHover={{ scale: 1.02, y: -6 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(topic)}
      className={cn(
        "group relative w-full overflow-hidden rounded-xl sm:rounded-2xl text-left transition-all duration-500 ease-out bg-card border focus-ring",
        completed
          ? "border-primary/30 shadow-sm shadow-primary/10"
          : started
          ? "border-primary/20 hover:border-primary/40 hover:shadow-glow"
          : "border-border/50 hover:border-primary/30 hover:shadow-glow"
      )}
    >
      {/* Glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Image section */}
      <div className="relative h-20 sm:h-28 overflow-hidden bg-muted/30">
        {topicImage ? (
          <img 
            src={topicImage} 
            alt={topic.label}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <Cpu className="w-8 h-8 sm:w-10 sm:h-10 text-primary/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
        
        {/* Status badge */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
          {completed ? (
            <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-primary/20 border border-primary/30 backdrop-blur-sm flex items-center gap-1">
              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" />
              <span className="font-mono text-[7px] sm:text-[9px] text-primary font-bold uppercase tracking-wider">Done</span>
            </div>
          ) : started ? (
            <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-primary/10 border border-primary/20 backdrop-blur-sm flex items-center gap-1">
              <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary/70" />
              <span className="font-mono text-[7px] sm:text-[9px] text-primary/70 font-bold">{percent}%</span>
            </div>
          ) : (
            <div className="px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg bg-background/60 border border-primary/15 backdrop-blur-sm">
              <span className="font-mono text-[7px] sm:text-[9px] text-primary/50 uppercase tracking-wider flex items-center gap-0.5 sm:gap-1">
                <Cpu className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                <span className="hidden sm:inline">Protocol</span>
              </span>
            </div>
          )}
        </div>

        {/* Progress bar at bottom of image */}
        {started && !completed && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted/30">
            <motion.div
              className="h-full bg-primary/60"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 p-3 sm:p-4">
        <h3 className={cn(
          "text-xs sm:text-base font-bold mb-0.5 sm:mb-1 transition-colors duration-300 line-clamp-1",
          completed ? "text-primary" : "text-foreground group-hover:text-primary"
        )}>
          {topic.label}
        </h3>
        
        <p className="text-muted-foreground text-[10px] sm:text-xs mb-2 sm:mb-3 line-clamp-2 leading-relaxed hidden sm:block">
          {topic.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
          {topic.subtopics.slice(0, 2).map((subtopic, idx) => (
            <span
              key={idx}
              className="px-1 sm:px-1.5 py-0.5 text-[7px] sm:text-[9px] font-mono uppercase tracking-wider rounded bg-primary/8 text-primary/70 border border-primary/10 hidden sm:inline-block"
            >
              {subtopic}
            </span>
          ))}
          {topic.subtopics.length > 2 && (
            <span className="px-1 sm:px-1.5 py-0.5 text-[7px] sm:text-[9px] font-mono rounded bg-muted text-muted-foreground hidden sm:inline-block">
              +{topic.subtopics.length - 2}
            </span>
          )}
        </div>
        
        <div className={cn(
          "flex items-center text-[10px] sm:text-xs font-semibold transition-all duration-300",
          completed
            ? "text-primary/60 opacity-100"
            : "text-primary sm:opacity-0 sm:group-hover:opacity-100 opacity-100 sm:transform sm:translate-x-[-10px] sm:group-hover:translate-x-0"
        )}>
          <span>{completed ? 'Review' : started ? 'Continue' : 'Initialize'}</span>
          <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-0.5 sm:ml-1" />
        </div>
      </div>
    </motion.button>
  );
};
