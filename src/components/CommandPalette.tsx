import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Home, BookOpen, BarChart3, User, Sun, Moon, X, Command } from 'lucide-react';
import { useStudy } from '@/context/StudyContext';

interface CommandItem {
  id: string;
  label: string;
  icon: React.ElementType;
  action: () => void;
  keywords: string;
}

export const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const { profile } = useStudy();

  const items: CommandItem[] = [
    { id: 'home', label: 'Go to Home', icon: Home, action: () => navigate('/'), keywords: 'home landing' },
    { id: 'progress', label: 'Progress Dashboard', icon: BarChart3, action: () => navigate('/progress'), keywords: 'progress dashboard stats' },
    { id: 'profile', label: 'Profile Settings', icon: User, action: () => navigate('/profile'), keywords: 'profile settings account' },
    ...(profile?.generatedPlan ? [
      { id: 'plan', label: 'Study Plan', icon: BookOpen, action: () => navigate('/plan'), keywords: 'plan study learn' },
    ] : []),
    {
      id: 'theme',
      label: 'Toggle Theme',
      icon: Sun,
      action: () => {
        document.documentElement.classList.toggle('light');
        localStorage.setItem('theme', document.documentElement.classList.contains('light') ? 'light' : 'dark');
      },
      keywords: 'theme dark light mode toggle',
    },
  ];

  const filtered = query
    ? items.filter(i => `${i.label} ${i.keywords}`.toLowerCase().includes(query.toLowerCase()))
    : items;

  useEffect(() => setSelectedIndex(0), [query]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setOpen(prev => !prev);
      setQuery('');
    }
    if (e.key === 'Escape') setOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleSelect = (item: CommandItem) => {
    item.action();
    setOpen(false);
    setQuery('');
  };

  const handleInnerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      handleSelect(filtered[selectedIndex]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            onClick={e => e.stopPropagation()}
            className="relative w-[90%] max-w-lg rounded-2xl bg-card border border-border/60 shadow-2xl overflow-hidden"
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40">
              <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleInnerKeyDown}
                placeholder="Type a command or search…"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground border border-border/50">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-64 overflow-y-auto py-2">
              {filtered.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-muted-foreground">No results found.</p>
              )}
              {filtered.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    i === selectedIndex ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted/50'
                  }`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-border/30 text-[10px] font-mono text-muted-foreground">
              <span>Navigate with ↑↓ • Enter to select</span>
              <div className="flex items-center gap-1">
                <Command className="w-3 h-3" />
                <span>K to toggle</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
