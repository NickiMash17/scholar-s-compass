import React from 'react';
import { motion } from 'framer-motion';
import { TOPICS } from '@/types/study';
import { Check, Lock, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const ROADMAP_ORDER = [
  { id: 'programming-fundamentals', phase: 'Foundation', phaseNum: 1 },
  { id: 'csharp-oop', phase: 'Foundation', phaseNum: 1 },
  { id: 'data-structures', phase: 'Foundation', phaseNum: 1 },
  { id: 'web-fundamentals', phase: 'Core Skills', phaseNum: 2 },
  { id: 'frontend-frameworks', phase: 'Core Skills', phaseNum: 2 },
  { id: 'sql-databases', phase: 'Core Skills', phaseNum: 2 },
  { id: 'aspnet-apis', phase: 'Backend', phaseNum: 3 },
  { id: 'testing', phase: 'Backend', phaseNum: 3 },
  { id: 'git-version-control', phase: 'Backend', phaseNum: 3 },
  { id: 'design-patterns', phase: 'Architecture', phaseNum: 4 },
  { id: 'devops-cicd', phase: 'Architecture', phaseNum: 4 },
  { id: 'system-design', phase: 'Mastery', phaseNum: 5 },
  { id: 'cloud-computing', phase: 'Mastery', phaseNum: 5 },
  { id: 'career-prep', phase: 'Launch', phaseNum: 6 },
];

const phaseColors: Record<number, string> = {
  1: 'border-emerald-500/40 bg-emerald-500/8',
  2: 'border-cyan-500/40 bg-cyan-500/8',
  3: 'border-blue-500/40 bg-blue-500/8',
  4: 'border-violet-500/40 bg-violet-500/8',
  5: 'border-amber-500/40 bg-amber-500/8',
  6: 'border-primary/40 bg-primary/8',
};

const phaseTextColors: Record<number, string> = {
  1: 'text-emerald-400',
  2: 'text-cyan-400',
  3: 'text-blue-400',
  4: 'text-violet-400',
  5: 'text-amber-400',
  6: 'text-primary',
};

const phaseDotColors: Record<number, string> = {
  1: 'bg-emerald-500',
  2: 'bg-cyan-500',
  3: 'bg-blue-500',
  4: 'bg-violet-500',
  5: 'bg-amber-500',
  6: 'bg-primary',
};

interface LearningRoadmapProps {
  onTopicSelect?: (topicId: string) => void;
}

export const LearningRoadmap: React.FC<LearningRoadmapProps> = ({ onTopicSelect }) => {
  // Group by phase
  const phases = ROADMAP_ORDER.reduce((acc, item) => {
    const last = acc[acc.length - 1];
    if (last && last.phase === item.phase) {
      last.items.push(item);
    } else {
      acc.push({ phase: item.phase, phaseNum: item.phaseNum, items: [item] });
    }
    return acc;
  }, [] as { phase: string; phaseNum: number; items: typeof ROADMAP_ORDER }[]);

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[19px] sm:left-[23px] top-8 bottom-8 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent" />

      <div className="space-y-8">
        {phases.map((phase, phaseIdx) => (
          <motion.div
            key={phase.phase}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: phaseIdx * 0.1 }}
          >
            {/* Phase header */}
            <div className="flex items-center gap-3 mb-4">
              <div className={cn(
                "relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-xl border flex items-center justify-center font-mono text-sm font-bold",
                phaseColors[phase.phaseNum],
                phaseTextColors[phase.phaseNum]
              )}>
                {phase.phaseNum}
              </div>
              <div>
                <h3 className={cn("text-sm sm:text-base font-bold", phaseTextColors[phase.phaseNum])}>
                  {phase.phase}
                </h3>
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                  {phase.items.length} {phase.items.length === 1 ? 'module' : 'modules'}
                </p>
              </div>
            </div>

            {/* Phase items */}
            <div className="ml-[19px] sm:ml-[23px] pl-6 sm:pl-8 border-l border-border/30 space-y-2">
              {phase.items.map((item, itemIdx) => {
                const topic = TOPICS.find(t => t.id === item.id);
                if (!topic) return null;

                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: phaseIdx * 0.1 + itemIdx * 0.05 }}
                    onClick={() => onTopicSelect?.(item.id)}
                    className={cn(
                      "w-full group relative flex items-center gap-3 p-3 sm:p-4 rounded-xl border transition-all duration-300",
                      "bg-card/40 border-border/30 hover:border-primary/30 hover:bg-card/80 hover:shadow-md"
                    )}
                  >
                    {/* Connector dot */}
                    <div className={cn(
                      "absolute -left-[31px] sm:-left-[37px] w-2 h-2 rounded-full",
                      phaseDotColors[phase.phaseNum]
                    )} />

                    <div className="flex-1 text-left min-w-0">
                      <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {topic.label}
                      </h4>
                      <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                        {topic.description}
                      </p>
                    </div>

                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ))}

        {/* End marker */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-3"
        >
          <div className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-xl border border-primary/50 bg-primary/15 flex items-center justify-center glow-neon">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-primary">Job Ready</h3>
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              Software Engineer
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};