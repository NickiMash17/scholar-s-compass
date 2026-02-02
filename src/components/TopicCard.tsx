import React from 'react';
import { motion } from 'framer-motion';
import { Topic } from '@/types/study';
import { ChevronRight } from 'lucide-react';

// Import topic images
import topicCsharpOop from '@/assets/topic-csharp-oop.png';
import topicSqlDatabases from '@/assets/topic-sql-databases.png';
import topicAspnetApis from '@/assets/topic-aspnet-apis.png';
import topicTesting from '@/assets/topic-testing.png';
import topicDataStructures from '@/assets/topic-data-structures.png';

// Map topic IDs to their images
const TOPIC_IMAGES: Record<string, string> = {
  'csharp-oop': topicCsharpOop,
  'sql-databases': topicSqlDatabases,
  'aspnet-apis': topicAspnetApis,
  'testing': topicTesting,
  'data-structures': topicDataStructures,
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
      className="group relative w-full overflow-hidden rounded-2xl p-6 text-left transition-all duration-500 ease-out bg-gradient-to-br from-card to-background border border-border/50 hover:border-amber-500/50 hover:shadow-glow focus-ring"
    >
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${topic.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-amber-500/5 to-transparent rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      </div>

      <div className="relative z-10">
        {/* Image */}
        <motion.div 
          className="mb-4 w-16 h-16 rounded-xl overflow-hidden bg-background/50 backdrop-blur-sm border border-border/30"
          whileHover={{ scale: 1.1, rotate: 3 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <img 
            src={topicImage} 
            alt={topic.label}
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        {/* Title */}
        <h3 className="font-serif text-xl font-semibold text-foreground mb-2 group-hover:text-amber-400 transition-colors duration-300">
          {topic.label}
        </h3>
        
        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {topic.description}
        </p>
        
        {/* Subtopics */}
        <div className="flex flex-wrap gap-2 mb-4">
          {topic.subtopics.slice(0, 3).map((subtopic, idx) => (
            <span
              key={idx}
              className="px-2 py-1 text-xs rounded-md bg-muted/50 text-muted-foreground"
            >
              {subtopic}
            </span>
          ))}
          {topic.subtopics.length > 3 && (
            <span className="px-2 py-1 text-xs rounded-md bg-muted/50 text-muted-foreground">
              +{topic.subtopics.length - 3}
            </span>
          )}
        </div>
        
        {/* CTA */}
        <div className="flex items-center text-sm text-amber-500 font-medium opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
          <span>Start Learning</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </div>
      </div>
    </motion.button>
  );
};
