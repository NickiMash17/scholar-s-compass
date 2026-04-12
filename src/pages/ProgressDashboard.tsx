import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TOPICS } from '@/types/study';
import { useTopicProgress } from '@/hooks/useTopicProgress';
import { useGamification } from '@/hooks/useGamification';
import { usePomodoroStorage } from '@/hooks/usePomodoroStorage';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { ProgressRing } from '@/components/ProgressRing';
import {
  ArrowLeft,
  Cpu,
  Trophy,
  Flame,
  Clock,
  CheckCircle2,
  BookOpen,
  TrendingUp,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

const PHASE_MAP: Record<string, { phase: string; phaseNum: number }> = {
  'programming-fundamentals': { phase: 'Foundation', phaseNum: 1 },
  'csharp-oop': { phase: 'Foundation', phaseNum: 1 },
  'data-structures': { phase: 'Foundation', phaseNum: 1 },
  'web-fundamentals': { phase: 'Core Skills', phaseNum: 2 },
  'frontend-frameworks': { phase: 'Core Skills', phaseNum: 2 },
  'sql-databases': { phase: 'Core Skills', phaseNum: 2 },
  'aspnet-apis': { phase: 'Backend', phaseNum: 3 },
  'testing': { phase: 'Backend', phaseNum: 3 },
  'git-version-control': { phase: 'Backend', phaseNum: 3 },
  'design-patterns': { phase: 'Architecture', phaseNum: 4 },
  'devops-cicd': { phase: 'Architecture', phaseNum: 4 },
  'system-design': { phase: 'Mastery', phaseNum: 5 },
  'cloud-computing': { phase: 'Mastery', phaseNum: 5 },
  'career-prep': { phase: 'Launch', phaseNum: 6 },
};

const phaseColors: Record<number, string> = {
  1: 'text-emerald-400',
  2: 'text-cyan-400',
  3: 'text-blue-400',
  4: 'text-violet-400',
  5: 'text-amber-400',
  6: 'text-primary',
};

const barColors: Record<number, string> = {
  1: 'hsl(160, 84%, 39%)',
  2: 'hsl(187, 85%, 53%)',
  3: 'hsl(217, 91%, 60%)',
  4: 'hsl(263, 70%, 50%)',
  5: 'hsl(38, 92%, 50%)',
  6: 'hsl(160, 84%, 39%)',
};

const ProgressDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { progressMap, getOverallProgress, isTopicCompleted, isTopicStarted } = useTopicProgress();
  const gamification = useGamification();
  const { stats } = usePomodoroStorage();

  const overall = getOverallProgress();
  const completedCount = TOPICS.filter(t => isTopicCompleted(t.id)).length;
  const startedCount = TOPICS.filter(t => isTopicStarted(t.id) && !isTopicCompleted(t.id)).length;
  const totalTasks = Object.values(progressMap).reduce((s, e) => s + e.completedTasks, 0);
  const totalAllTasks = Object.values(progressMap).reduce((s, e) => s + e.totalTasks, 0);

  // Radar chart data
  const radarData = TOPICS.map(t => ({
    subject: t.label.length > 12 ? t.label.slice(0, 12) + '…' : t.label,
    value: progressMap[t.id]?.completionPercent ?? 0,
    fullMark: 100,
  }));

  // Bar chart data
  const barData = TOPICS.map(t => ({
    name: t.label.length > 10 ? t.label.slice(0, 10) + '…' : t.label,
    fullName: t.label,
    percent: progressMap[t.id]?.completionPercent ?? 0,
    phaseNum: PHASE_MAP[t.id]?.phaseNum ?? 1,
    id: t.id,
  }));

  // Phase summary
  const phases = [1, 2, 3, 4, 5, 6].map(num => {
    const phaseTopics = TOPICS.filter(t => PHASE_MAP[t.id]?.phaseNum === num);
    const phaseName = Object.values(PHASE_MAP).find(p => p.phaseNum === num)?.phase ?? '';
    const completed = phaseTopics.filter(t => isTopicCompleted(t.id)).length;
    const avg = phaseTopics.length > 0
      ? Math.round(phaseTopics.reduce((s, t) => s + (progressMap[t.id]?.completionPercent ?? 0), 0) / phaseTopics.length)
      : 0;
    return { num, name: phaseName, total: phaseTopics.length, completed, avg };
  });

  const statCards = [
    { icon: CheckCircle2, label: 'Modules Completed', value: `${completedCount}/14`, sub: `${startedCount} in progress` },
    { icon: BookOpen, label: 'Tasks Finished', value: totalTasks.toString(), sub: `of ${totalAllTasks || '—'} total` },
    { icon: Clock, label: 'Focus Time', value: `${Math.round(stats.totalFocusMinutes)}m`, sub: `${stats.totalSessions} sessions` },
    { icon: Trophy, label: 'Level', value: gamification.level.toString(), sub: `${gamification.xp} XP` },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
      <AnimatedBackground />

      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-4 sm:py-6">
          <nav className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Home</span>
            </button>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="text-sm sm:text-base font-bold text-foreground">Progress Dashboard</span>
            </div>
            <ThemeToggle />
          </nav>
        </header>

        <section className="container mx-auto px-4 py-4 sm:py-8">
          <div className="max-w-6xl mx-auto">
            {/* Hero stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
            >
              {/* Overall ring */}
              <div className="sm:col-span-2 lg:col-span-1 flex justify-center">
                <div className="rounded-2xl bg-card border border-border/50 p-6 flex flex-col items-center w-full">
                  <ProgressRing percentage={overall} size={110} strokeWidth={8} />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mt-2">Overall Progress</span>
                </div>
              </div>

              {statCards.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="rounded-2xl bg-card border border-border/50 p-5 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <s.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{s.label}</span>
                  </div>
                  <div className="font-mono text-2xl font-bold text-foreground">{s.value}</div>
                  <span className="text-[11px] text-muted-foreground mt-1">{s.sub}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
              {/* Radar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl bg-card border border-border/50 p-5 sm:p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-xs font-mono uppercase tracking-wider text-primary/70">Skill Radar</span>
                </div>
                <div className="w-full h-[300px] sm:h-[340px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="hsl(160, 10%, 15%)" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: 'hsl(160, 8%, 48%)', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                      />
                      <Radar
                        name="Progress"
                        dataKey="value"
                        stroke="hsl(160, 84%, 39%)"
                        fill="hsl(160, 84%, 39%)"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Bar chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl bg-card border border-border/50 p-5 sm:p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-xs font-mono uppercase tracking-wider text-primary/70">Domain Completion</span>
                </div>
                <div className="w-full h-[300px] sm:h-[340px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} layout="vertical" margin={{ left: 0, right: 16 }}>
                      <XAxis type="number" domain={[0, 100]} tick={{ fill: 'hsl(160, 8%, 48%)', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={90}
                        tick={{ fill: 'hsl(160, 8%, 48%)', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        formatter={(value: number, _name: string, props: any) => [`${value}%`, props.payload.fullName]}
                        contentStyle={{
                          background: 'hsl(160, 12%, 6%)',
                          border: '1px solid hsl(160, 10%, 15%)',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontFamily: 'JetBrains Mono',
                        }}
                        labelStyle={{ color: 'hsl(150, 15%, 93%)' }}
                      />
                      <Bar dataKey="percent" radius={[0, 4, 4, 0]} barSize={14}>
                        {barData.map((entry, idx) => (
                          <Cell key={idx} fill={barColors[entry.phaseNum]} fillOpacity={entry.percent > 0 ? 0.8 : 0.15} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Phase breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-5">
                <Flame className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono uppercase tracking-wider text-primary/70">Phase Breakdown</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {phases.map((p, i) => (
                  <motion.div
                    key={p.num}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="rounded-xl bg-card border border-border/50 p-4 text-center hover:border-primary/20 transition-all"
                  >
                    <span className={cn("text-[10px] font-mono uppercase tracking-wider font-bold", phaseColors[p.num])}>
                      {p.name}
                    </span>
                    <div className="font-mono text-2xl font-bold text-foreground mt-1">{p.avg}%</div>
                    <div className="w-full h-1 rounded-full bg-muted mt-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-700"
                        style={{ width: `${p.avg}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1 block">{p.completed}/{p.total} done</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* All modules list */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="text-xs font-mono uppercase tracking-wider text-primary/70">All Modules</span>
                </div>
              </div>
              <div className="space-y-2">
                {TOPICS.map((topic, i) => {
                  const prog = progressMap[topic.id];
                  const pct = prog?.completionPercent ?? 0;
                  const completed = pct >= 100;
                  const started = pct > 0;
                  const pm = PHASE_MAP[topic.id];

                  return (
                    <motion.button
                      key={topic.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.03 }}
                      onClick={() => {
                        navigate('/');
                        setTimeout(() => {
                          document.getElementById('topics')?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all duration-300 group",
                        completed
                          ? "bg-primary/5 border-primary/20"
                          : "bg-card/60 border-border/40 hover:border-primary/20 hover:bg-card/80"
                      )}
                    >
                      {/* Phase number */}
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold border",
                        completed ? "bg-primary/15 text-primary border-primary/20" : "bg-muted/50 text-muted-foreground border-border/50"
                      )}>
                        {pm?.phaseNum}
                      </div>

                      <div className="flex-1 text-left min-w-0">
                        <h4 className={cn(
                          "text-sm font-semibold truncate transition-colors",
                          completed ? "text-primary" : "text-foreground group-hover:text-primary"
                        )}>
                          {topic.label}
                        </h4>
                        <span className={cn("text-[10px] font-mono uppercase tracking-wider", phaseColors[pm?.phaseNum ?? 1])}>
                          {pm?.phase}
                        </span>
                      </div>

                      {/* Progress */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="hidden sm:flex items-center gap-2">
                          <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary/70 transition-all duration-700"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="font-mono text-xs text-muted-foreground w-8 text-right">{pct}%</span>
                        </div>
                        {completed ? (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* CTA */}
            <div className="text-center mt-10 pb-8">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors glow-neon"
              >
                Continue Learning
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProgressDashboard;
