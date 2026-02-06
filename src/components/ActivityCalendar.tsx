import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityCalendarProps {
  data: { date: string; count: number }[];
}

const getIntensity = (count: number): string => {
  if (count === 0) return 'bg-muted/30';
  if (count <= 2) return 'bg-primary/25';
  if (count <= 5) return 'bg-primary/50';
  if (count <= 8) return 'bg-primary/75';
  return 'bg-primary';
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getDayLabel = (dateStr: string) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short' });
};

export const ActivityCalendar: React.FC<ActivityCalendarProps> = ({ data }) => {
  const totalTasks = data.reduce((sum, d) => sum + d.count, 0);
  const activeDays = data.filter(d => d.count > 0).length;

  return (
    <div className="rounded-2xl bg-card border border-border p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-primary" />
          <h3 className="font-serif text-lg font-semibold text-foreground">Activity</h3>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{activeDays} active days</span>
          <span>{totalTasks} tasks</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-10 sm:grid-cols-15 gap-1 sm:gap-1.5 mb-4">
        {data.map((day, idx) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: idx * 0.02 }}
            className="group relative"
          >
            <div
              className={cn(
                "w-full aspect-square rounded-sm sm:rounded-md transition-all duration-200",
                getIntensity(day.count),
                day.count > 0 && "hover:ring-2 hover:ring-primary/50 hover:scale-110 cursor-pointer"
              )}
            />
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-md bg-popover border border-border text-[10px] text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 shadow-lg">
              <span className="font-medium">{day.count} tasks</span>
              <br />
              <span className="text-muted-foreground">{formatDate(day.date)}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-muted/30" />
        <div className="w-3 h-3 rounded-sm bg-primary/25" />
        <div className="w-3 h-3 rounded-sm bg-primary/50" />
        <div className="w-3 h-3 rounded-sm bg-primary/75" />
        <div className="w-3 h-3 rounded-sm bg-primary" />
        <span>More</span>
      </div>
    </div>
  );
};
