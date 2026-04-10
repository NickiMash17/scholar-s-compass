import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const codeLines = [
  { text: 'const student = new AICoach({', color: 'text-primary' },
  { text: '  topic: "System Design",', color: 'text-accent' },
  { text: '  level: "intermediate",', color: 'text-accent' },
  { text: '  goal: "job-ready"', color: 'text-accent' },
  { text: '});', color: 'text-primary' },
  { text: '', color: '' },
  { text: 'await student.runDiagnostic();', color: 'text-foreground/80' },
  { text: '// ✓ Skill gaps identified', color: 'text-muted-foreground' },
  { text: '', color: '' },
  { text: 'const plan = await student.generate({', color: 'text-primary' },
  { text: '  days: 7,', color: 'text-accent' },
  { text: '  practiceRatio: 0.7,', color: 'text-accent' },
  { text: '  adaptiveDifficulty: true', color: 'text-accent' },
  { text: '});', color: 'text-primary' },
];

const terminalOutput = [
  { text: '$ ai-coach init --adaptive', delay: 0 },
  { text: '⚡ Neural engine initialized', delay: 400 },
  { text: '📊 Analyzing skill profile...', delay: 800 },
  { text: '✓ 14 domains mapped', delay: 1200 },
  { text: '✓ Custom protocol generated', delay: 1600 },
  { text: '🚀 Ready to learn!', delay: 2000 },
];

export const CodeTerminal: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [visibleLines, setVisibleLines] = useState(0);
  const [terminalLines, setTerminalLines] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= codeLines.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [isInView]);

  useEffect(() => {
    if (!isInView) return;
    terminalOutput.forEach((line, i) => {
      setTimeout(() => setTerminalLines(i + 1), line.delay + 1500);
    });
  }, [isInView]);

  useEffect(() => {
    const blink = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(blink);
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, rotateX: 8 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative perspective-1000"
    >
      {/* Glow behind */}
      <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl" />

      <div className="relative rounded-2xl border border-border/60 overflow-hidden bg-card/80 backdrop-blur-xl shadow-2xl">
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-card/60">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-warning/60" />
            <div className="w-3 h-3 rounded-full bg-primary/60" />
          </div>
          <div className="flex-1 text-center">
            <span className="font-mono text-[10px] text-muted-foreground/60 tracking-wider">study-protocol.ts</span>
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 font-mono text-[9px] text-primary">TypeScript</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-border/30">
          {/* Code editor */}
          <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm leading-6 min-h-[280px]">
            {codeLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={i < visibleLines ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.15 }}
                className="flex"
              >
                <span className="w-6 sm:w-8 text-right text-muted-foreground/30 select-none mr-4 shrink-0">
                  {i + 1}
                </span>
                <span className={line.color}>
                  {line.text}
                  {i === visibleLines - 1 && cursorVisible && (
                    <span className="inline-block w-[2px] h-4 bg-primary ml-0.5 align-middle" />
                  )}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Terminal output */}
          <div className="p-4 sm:p-5 bg-background/40 font-mono text-xs sm:text-sm leading-7 min-h-[280px]">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/20">
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground/50">Terminal</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            </div>
            {terminalOutput.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={i < terminalLines ? { opacity: 1 } : {}}
                transition={{ duration: 0.2 }}
                className={`${
                  line.text.startsWith('✓') || line.text.startsWith('🚀')
                    ? 'text-primary'
                    : line.text.startsWith('$')
                    ? 'text-foreground/70'
                    : 'text-muted-foreground'
                }`}
              >
                {line.text}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom status bar */}
        <div className="flex items-center justify-between px-4 py-1.5 border-t border-border/30 bg-card/40">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[9px] text-muted-foreground/50 tracking-wider">AI Engine Active</span>
          </div>
          <span className="font-mono text-[9px] text-muted-foreground/30">UTF-8 · LF</span>
        </div>
      </div>
    </motion.div>
  );
};
