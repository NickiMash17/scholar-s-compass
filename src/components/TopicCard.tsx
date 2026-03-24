import React from 'react';
import { motion } from 'framer-motion';
import { Topic } from '@/types/study';
import { ChevronRight, Cpu } from 'lucide-react';

import topicCsharpOop from '@/assets/topic-csharp-oop.png';
import topicSqlDatabases from '@/assets/topic-sql-databases.png';
import topicAspnetApis from '@/assets/topic-aspnet-apis.png';
import topicTesting from '@/assets/topic-testing.png';
import topicDataStructures from '@/assets/topic-data-structures.png';
import topicDesignPatterns from '@/assets/topic-design-patterns.png';

const TOPIC_IMAGES: Record<string, string> = {
  'csharp-oop': topicCsharpOop,
  'sql-databases': topicSqlDatabases,
  'aspnet-apis': topicAspnetApis,
  'testing': topicTesting,
  'data-structures': topicDataStructures,
  'design-patterns': topicDesignPatterns,
};

interface TopicCardProps {
  topic: Topic;
  index: number;
  onSelect: (topic: Topic) => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic, index, onSelect }) => {
  const topicImage = TOPIC_IMAGES[topic.id];

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(topic)}
      className="group relative w-full overflow-hidden rounded-2xl text-left transition-all duration-500 ease-out bg-card border border-border/50 hover:border-primary/40 hover:shadow-glow focus-ring"
    >
      {/* Glow overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Top image section */}
      <div className="relative h-32 overflow-hidden bg-muted/30">
        <img 
          src={topicImage} 
          alt={topic.label}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
        {/* HUD badge */}
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-background/60 border border-primary/20 backdrop-blur-sm">
          <span className="font-mono text-[9px] text-primary uppercase tracking-wider flex items-center gap-1">
            <Cpu className="w-2.5 h-2.5" />
            Protocol
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-5">
        <h3 className="text-lg font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors duration-300">
          {topic.label}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
          {topic.description}
        </p>
        
        <div className="flex flex-wrap gap-1.5 mb-4">
          {topic.subtopics.slice(0, 3).map((subtopic, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded bg-primary/8 text-primary/70 border border-primary/10"
            >
              {subtopic}
            </span>
          ))}
          {topic.subtopics.length > 3 && (
            <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-muted text-muted-foreground">
              +{topic.subtopics.length - 3}
            </span>
          )}
        </div>
        
        <div className="flex items-center text-sm text-primary font-semibold opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
          <span>Initialize</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </div>
      </div>
    </motion.button>
  );
};
