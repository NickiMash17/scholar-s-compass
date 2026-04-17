import React from 'react';
import { cn } from '@/lib/utils';

interface ShimmerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Shimmer: React.FC<ShimmerProps> = ({ className, ...props }) => (
  <div
    className={cn('skeleton-shimmer rounded-md', className)}
    {...props}
  />
);

export const StudyPlanSkeleton: React.FC = () => (
  <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6 animate-fade-in">
    {/* Tip banner */}
    <Shimmer className="h-14 w-full rounded-xl" />

    {/* Overview card */}
    <div className="rounded-2xl bg-card border border-border/50 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        <Shimmer className="h-24 w-24 rounded-full flex-shrink-0" />
        <div className="flex-1 w-full space-y-3">
          <Shimmer className="h-4 w-20 rounded" />
          <Shimmer className="h-8 w-3/4 rounded" />
          <Shimmer className="h-3 w-full rounded" />
          <Shimmer className="h-3 w-5/6 rounded" />
          <div className="flex gap-4 pt-2">
            <Shimmer className="h-3 w-16 rounded" />
            <Shimmer className="h-3 w-16 rounded" />
            <Shimmer className="h-3 w-16 rounded" />
          </div>
        </div>
        <Shimmer className="h-20 w-20 rounded-xl flex-shrink-0" />
      </div>
    </div>

    {/* Two panels */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Shimmer className="h-48 w-full rounded-2xl" />
      <Shimmer className="h-48 w-full rounded-2xl" />
    </div>

    {/* Day accordions */}
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <Shimmer key={i} className="h-20 w-full rounded-2xl" />
      ))}
    </div>
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="container mx-auto px-4 py-8 max-w-6xl space-y-6 animate-fade-in">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[0, 1, 2, 3].map((i) => (
        <Shimmer key={i} className="h-28 rounded-2xl" />
      ))}
    </div>
    <Shimmer className="h-64 w-full rounded-2xl" />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Shimmer className="h-56 rounded-2xl" />
      <Shimmer className="h-56 rounded-2xl" />
    </div>
  </div>
);
