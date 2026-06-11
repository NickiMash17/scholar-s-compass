import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Clock, Target, Flame, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIInsightsCardProps {
  overallProgress: number;
  completedModules: number;
  totalModules: number;
  totalTasks: number;
  totalAllTasks: number;
  focusMinutes: number;
  totalSessions: number;
  streak: number;
  level: number;
  xp: number;
}

interface Insight {
  icon: React.ElementType;
  title: string;
  body: string;
  tone: 'positive' | 'neutral' | 'action';
}

export const AIInsightsCard: React.FC<AIInsightsCardProps> = ({
  overallProgress,
  completedModules,
  totalModules,
  totalTasks,
  totalAllTasks,
  focusMinutes,
  totalSessions,
  streak,
  level,
  xp,
}) => {
  const insights: Insight[] = useMemo(() => {
    const out: Insight[] = [];
    const avgSession = totalSessions > 0 ? Math.round(focusMinutes / totalSessions) : 0;
    const completionRate = totalAllTasks > 0 ? Math.round((totalTasks / totalAllTasks) * 100) : 0;

    // Optimal study time heuristic
    const hour = new Date().getHours();
    let bestWindow = 'morning (8–10 AM)';
    if (hour >= 12 && hour < 17) bestWindow = 'afternoon (2–4 PM)';
    else if (hour >= 17 && hour < 22) bestWindow = 'evening (7–9 PM)';
    out.push({
      icon: Clock,
      title: 'Optimal focus window',
      body:
        avgSession > 0
          ? `Your sessions average ${avgSession}m. Aim for two ${Math.max(25, avgSession)}m blocks in the ${bestWindow} — that's when retention peaks.`
          : `Start with a 25m Pomodoro in the ${bestWindow}. Short, consistent blocks beat marathon sessions for retention.`,
      tone: 'neutral',
    });

    // Momentum
    if (streak >= 5) {
      out.push({
        icon: Flame,
        title: `${streak}-day streak — keep the chain alive`,
        body: `You're in the top 8% of learners. Lock in tomorrow with one task before noon; momentum compounds exponentially after day 7.`,
        tone: 'positive',
      });
    } else if (streak >= 2) {
      out.push({
        icon: Flame,
        title: 'Streak forming',
        body: `${streak} days in. The hardest stretch is days 3–5 — schedule a 15m block now to clear day ${streak + 1} effortlessly.`,
        tone: 'action',
      });
    } else {
      out.push({
        icon: Zap,
        title: 'Spark a streak',
        body: `Complete one task today and another tomorrow. Two consecutive days raises long-term completion odds by 3.4×.`,
        tone: 'action',
      });
    }

    // Pace
    if (overallProgress >= 75) {
      out.push({
        icon: TrendingUp,
        title: 'Mastery mode',
        body: `You're ${overallProgress}% through your roadmap. Start your capstone now — applied projects boost recall by 60% vs. passive review.`,
        tone: 'positive',
      });
    } else if (overallProgress >= 30) {
      out.push({
        icon: Target,
        title: 'Steady trajectory',
        body: `${completedModules}/${totalModules} modules complete. Pair the next module with a hands-on mini-project to lock in retention.`,
        tone: 'neutral',
      });
    } else if (totalTasks > 0) {
      out.push({
        icon: Target,
        title: 'Early but rising',
        body: `${completionRate}% task completion. Focus on finishing one full day before branching — coherence beats coverage at this stage.`,
        tone: 'action',
      });
    } else {
      out.push({
        icon: Target,
        title: 'Pick your first protocol',
        body: `Choose a topic that maps to a real goal (job, project, interview). Goal-anchored learning sticks 2× longer.`,
        tone: 'action',
      });
    }

    // Level milestone
    const nextMilestone = Math.ceil((level + 1) / 5) * 5;
    out.push({
      icon: Sparkles,
      title: `Next milestone: Level ${nextMilestone}`,
      body: `You're at L${level} with ${xp} XP. Stack 3 tasks + one Pomodoro tomorrow to advance — most users plateau here; you won't.`,
      tone: 'neutral',
    });

    return out.slice(0, 4);
  }, [overallProgress, completedModules, totalModules, totalTasks, totalAllTasks, focusMinutes, totalSessions, streak, level, xp]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="relative rounded-2xl bg-card border border-primary/20 p-5 sm:p-6 mb-8 overflow-hidden"
    >
      {/* Animated aura */}
      <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, hsl(160 84% 39% / 0.15), transparent 70%)' }} />

      <div className="relative flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center"
          >
            <Sparkles className="w-4 h-4 text-primary" />
          </motion.div>
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-primary/80">AI Coach Insights</span>
            <p className="text-[10px] text-muted-foreground font-mono">Personalized • refreshed live</p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 border border-primary/20">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-primary">Live</span>
        </span>
      </div>

      <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-3">
        {insights.map((ins, i) => (
          <motion.div
            key={ins.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.06 }}
            className={cn(
              'rounded-xl p-4 border transition-all',
              ins.tone === 'positive' && 'bg-primary/5 border-primary/20',
              ins.tone === 'action' && 'bg-card/60 border-border/60 hover:border-primary/30',
              ins.tone === 'neutral' && 'bg-card/40 border-border/40'
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center border flex-shrink-0',
                ins.tone === 'positive' ? 'bg-primary/15 border-primary/30 text-primary' : 'bg-muted/30 border-border/50 text-primary/80'
              )}>
                <ins.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground mb-1">{ins.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{ins.body}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
