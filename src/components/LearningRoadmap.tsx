import React from 'react';
import { motion } from 'framer-motion';
import { TOPICS } from '@/types/study';
import { Check, ChevronRight, Sparkles, Lock, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTopicProgress } from '@/hooks/useTopicProgress';

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

const phaseConfig: Record<number, { border: string; bg: string; text: string; dot: string; glow: string }> = {
  1: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/8', text: 'text-emerald-400', dot: 'bg-emerald-500', glow: 'shadow-emerald-500/20' },
  2: { border: 'border-cyan-500/30', bg: 'bg-cyan-500/8', text: 'text-cyan-400', dot: 'bg-cyan-500', glow: 'shadow-cyan-500/20' },
  3: { border: 'border-blue-500/30', bg: 'bg-blue-500/8', text: 'text-blue-400', dot: 'bg-blue-500', glow: 'shadow-blue-500/20' },
  4: { border: 'border-violet-500/30', bg: 'bg-violet-500/8', text: 'text-violet-400', dot: 'bg-violet-500', glow: 'shadow-violet-500/20' },
  5: { border: 'border-amber-500/30', bg: 'bg-amber-500/8', text: 'text-amber-400', dot: 'bg-amber-500', glow: 'shadow-amber-500/20' },
  6: { border: 'border-primary/30', bg: 'bg-primary/8', text: 'text-primary', dot: 'bg-primary', glow: 'shadow-primary/20' },
};

interface LearningRoadmapProps {
  onTopicSelect?: (topicId: string) => void;
}

export const LearningRoadmap: React.FC<LearningRoadmapProps> = ({ onTopicSelect }) => {
  const { getTopicProgress, isTopicCompleted, isTopicStarted } = useTopicProgress();

  const phases = ROADMAP_ORDER.reduce((acc, item) => {
    const last = acc[acc.length - 1];
    if (last && last.phase === item.phase) {
      last.items.push(item);
    } else {
      acc.push({ phase: item.phase, phaseNum: item.phaseNum, items: [item] });
    }
    return acc;
  }, [] as { phase: string; phaseNum: number; items: typeof ROADMAP_ORDER }[]);

  // Calculate phase completion
  const getPhaseCompletion = (items: typeof ROADMAP_ORDER) => {
    const completed = items.filter(i => isTopicCompleted(i.id)).length;
    return Math.round((completed / items.length) * 100);
  };

  return (
    <div className="relative">
      {/* Vertical spine */}
      <div className="absolute left-5 sm:left-6 top-6 bottom-6 w-px">
        <div className="h-full bg-gradient-to-b from-primary/40 via-primary/15 to-transparent" />
      </div>

      <div className="space-y-10">
        {phases.map((phase, phaseIdx) => {
          const cfg = phaseConfig[phase.phaseNum];
          const phaseCompletion = getPhaseCompletion(phase.items);

          return (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: phaseIdx * 0.08 }}
            >
              {/* Phase header */}
              <div className="flex items-center gap-3 mb-5">
                <div className={cn(
                  "relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 flex items-center justify-center font-mono text-sm font-bold transition-all",
                  cfg.border, cfg.bg, cfg.text,
                  phaseCompletion === 100 && "ring-2 ring-offset-2 ring-offset-background ring-primary/30"
                )}>
                  {phaseCompletion === 100 ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    phase.phaseNum
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={cn("text-sm sm:text-base font-bold", cfg.text)}>
                      {phase.phase}
                    </h3>
                    {phaseCompletion > 0 && (
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-mono font-bold",
                        phaseCompletion === 100
                          ? "bg-primary/15 text-primary border border-primary/20"
                          : "bg-muted text-muted-foreground"
                      )}>
                        {phaseCompletion}%
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                    {phase.items.length} {phase.items.length === 1 ? 'module' : 'modules'}
                  </p>
                </div>
                {/* Mini progress bar */}
                {phaseCompletion > 0 && phaseCompletion < 100 && (
                  <div className="hidden sm:block w-20 h-1 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className={cn("h-full rounded-full", cfg.dot)}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${phaseCompletion}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </div>
                )}
              </div>

              {/* Phase items */}
              <div className="ml-5 sm:ml-6 pl-6 sm:pl-8 border-l border-border/20 space-y-2.5">
                {phase.items.map((item, itemIdx) => {
                  const topic = TOPICS.find(t => t.id === item.id);
                  if (!topic) return null;

                  const completed = isTopicCompleted(item.id);
                  const started = isTopicStarted(item.id);
                  const progress = getTopicProgress(item.id);
                  const percent = progress?.completionPercent ?? 0;

                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: phaseIdx * 0.08 + itemIdx * 0.04 }}
                      whileHover={{ x: 4 }}
                      onClick={() => onTopicSelect?.(item.id)}
                      className={cn(
                        "w-full group relative flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border transition-all duration-300",
                        completed
                          ? "bg-primary/5 border-primary/25 hover:border-primary/40"
                          : started
                          ? "bg-card/60 border-primary/15 hover:border-primary/30 hover:bg-card/80"
                          : "bg-card/40 border-border/30 hover:border-border/50 hover:bg-card/60"
                      )}
                    >
                      {/* Connector dot */}
                      <div className={cn(
                        "absolute -left-[29px] sm:-left-[35px] w-2.5 h-2.5 rounded-full transition-all ring-2 ring-background",
                        completed ? "bg-primary shadow-sm shadow-primary/50" : started ? cfg.dot + " opacity-70" : "bg-muted-foreground/30"
                      )} />

                      {/* Status icon */}
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all",
                        completed
                          ? "bg-primary/15 text-primary"
                          : started
                          ? "bg-primary/8 text-primary/60"
                          : "bg-muted/50 text-muted-foreground/40"
                      )}>
                        {completed ? (
                          <Check className="w-4 h-4" />
                        ) : started ? (
                          <Play className="w-3.5 h-3.5" />
                        ) : (
                          <Lock className="w-3.5 h-3.5" />
                        )}
                      </div>

                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className={cn(
                            "text-sm font-semibold transition-colors truncate",
                            completed ? "text-primary" : "text-foreground group-hover:text-primary"
                          )}>
                            {topic.label}
                          </h4>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {topic.description}
                        </p>
                        {/* Progress bar for started topics */}
                        {started && !completed && (
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                              <motion.div
                                className="h-full rounded-full bg-primary/70"
                                initial={{ width: 0 }}
                                whileInView={{ width: `${percent}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                              />
                            </div>
                            <span className="text-[10px] font-mono text-primary/60">{percent}%</span>
                          </div>
                        )}
                      </div>

                      {completed ? (
                        <span className="text-[10px] font-mono text-primary/70 flex-shrink-0">DONE</span>
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}

        {/* End marker */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-3"
        >
          <div className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 border-primary/40 bg-primary/10 flex items-center justify-center animate-pulse-glow">
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
