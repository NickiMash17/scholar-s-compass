import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Coffee, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface PomodoroSettings {
  workDuration: number;
  breakDuration: number;
  soundEnabled: boolean;
}

interface PomodoroSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PomodoroSettings;
  onSave: (settings: PomodoroSettings) => void;
}

export const PomodoroSettingsModal: React.FC<PomodoroSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [workDuration, setWorkDuration] = useState(settings.workDuration);
  const [breakDuration, setBreakDuration] = useState(settings.breakDuration);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);

  useEffect(() => {
    if (isOpen) {
      setWorkDuration(settings.workDuration);
      setBreakDuration(settings.breakDuration);
      setSoundEnabled(settings.soundEnabled);
    }
  }, [isOpen, settings]);

  const handleSave = () => {
    onSave({
      workDuration,
      breakDuration,
      soundEnabled,
    });
    onClose();
  };

  const presets = [
    { label: 'Classic', work: 25, break: 5 },
    { label: 'Short', work: 15, break: 3 },
    { label: 'Long', work: 50, break: 10 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-[50%] -translate-y-1/2 z-50 mx-auto max-w-md"
          >
            <div className="rounded-2xl bg-card border border-border shadow-elevated p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl font-semibold text-foreground">
                  Timer Settings
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Presets */}
              <div className="mb-6">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Quick Presets
                </label>
                <div className="flex gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        setWorkDuration(preset.work);
                        setBreakDuration(preset.break);
                      }}
                      className={cn(
                        "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                        workDuration === preset.work && breakDuration === preset.break
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Work Duration */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Focus Time</span>
                  </div>
                  <span className="text-sm font-bold text-primary">{workDuration} min</span>
                </div>
                <Slider
                  value={[workDuration]}
                  onValueChange={([value]) => setWorkDuration(value)}
                  min={5}
                  max={60}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>5 min</span>
                  <span>60 min</span>
                </div>
              </div>

              {/* Break Duration */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium text-foreground">Break Time</span>
                  </div>
                  <span className="text-sm font-bold text-green-400">{breakDuration} min</span>
                </div>
                <Slider
                  value={[breakDuration]}
                  onValueChange={([value]) => setBreakDuration(value)}
                  min={1}
                  max={30}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1 min</span>
                  <span>30 min</span>
                </div>
              </div>

              {/* Sound Toggle */}
              <div className="mb-6">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground">Sound Effects</span>
                  <div
                    className={cn(
                      "w-10 h-6 rounded-full transition-colors relative",
                      soundEnabled ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <motion.div
                      className="absolute top-1 w-4 h-4 rounded-full bg-background shadow-md"
                      animate={{ left: soundEnabled ? 20 : 4 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </div>
                </button>
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSave}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
