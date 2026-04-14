import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, X } from 'lucide-react';

const tips = [
  { quote: "The only way to learn programming is by programming.", author: "Dennis Ritchie" },
  { quote: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { quote: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { quote: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { quote: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { quote: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
  { quote: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
];

export const DailyTip: React.FC = () => {
  const [dismissed, setDismissed] = React.useState(false);
  const dayIndex = Math.floor(Date.now() / 86400000) % tips.length;
  const tip = tips[dayIndex];

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className="rounded-xl bg-primary/[0.06] border border-primary/15 px-4 py-3 flex items-start gap-3 mb-6"
    >
      <Lightbulb className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground/90 italic">"{tip.quote}"</p>
        <span className="text-[10px] font-mono text-muted-foreground">— {tip.author}</span>
      </div>
      <button onClick={() => setDismissed(true)} className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
};
