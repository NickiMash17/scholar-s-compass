import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Sparkles, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Topic } from '@/types/study';

interface CustomTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (topic: Topic) => void;
}

const SUGGESTED_COLORS = [
  'from-purple-500/20 to-violet-600/20',
  'from-blue-500/20 to-cyan-600/20',
  'from-green-500/20 to-emerald-600/20',
  'from-orange-500/20 to-amber-600/20',
  'from-rose-500/20 to-pink-600/20',
  'from-teal-500/20 to-green-600/20',
];

export const CustomTopicModal: React.FC<CustomTopicModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [subtopicInput, setSubtopicInput] = useState('');
  const [subtopics, setSubtopics] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState(0);

  const addSubtopic = () => {
    const trimmed = subtopicInput.trim();
    if (trimmed && subtopics.length < 6 && !subtopics.includes(trimmed)) {
      setSubtopics([...subtopics, trimmed]);
      setSubtopicInput('');
    }
  };

  const removeSubtopic = (idx: number) => {
    setSubtopics(subtopics.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    if (!label.trim()) return;
    const id = `custom-${Date.now()}`;
    onSubmit({
      id,
      label: label.trim(),
      description: description.trim() || `Study plan for ${label.trim()}`,
      subtopics: subtopics.length > 0 ? subtopics : [label.trim()],
      color: SUGGESTED_COLORS[selectedColor],
    });
    // Reset
    setLabel('');
    setDescription('');
    setSubtopics([]);
    setSubtopicInput('');
    setSelectedColor(0);
    onClose();
  };

  const canSubmit = label.trim().length >= 2;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-card border border-border p-6 shadow-elevated max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-xl font-bold text-foreground">Create Custom Topic</h2>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Topic Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">Topic Name *</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. React Hooks, Machine Learning Basics..."
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                maxLength={60}
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of what you want to learn..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none"
                maxLength={150}
              />
            </div>

            {/* Subtopics */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Subtopics <span className="text-muted-foreground font-normal">({subtopics.length}/6)</span>
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={subtopicInput}
                  onChange={(e) => setSubtopicInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtopic())}
                  placeholder="Add a subtopic..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
                  maxLength={40}
                />
                <button
                  onClick={addSubtopic}
                  disabled={!subtopicInput.trim() || subtopics.length >= 6}
                  className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center hover:bg-primary/30 disabled:opacity-40 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {subtopics.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {subtopics.map((st, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-muted/50 text-sm text-foreground">
                      <Tag className="w-3 h-3 text-muted-foreground" />
                      {st}
                      <button onClick={() => removeSubtopic(idx)} className="ml-1 text-muted-foreground hover:text-foreground">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Color picker */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">Theme Color</label>
              <div className="flex gap-2">
                {SUGGESTED_COLORS.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(idx)}
                    className={cn(
                      "w-10 h-10 rounded-xl bg-gradient-to-br transition-all",
                      color,
                      selectedColor === idx ? "ring-2 ring-primary ring-offset-2 ring-offset-card scale-110" : "opacity-60 hover:opacity-100"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-40 transition-all"
            >
              Create & Start Learning
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
