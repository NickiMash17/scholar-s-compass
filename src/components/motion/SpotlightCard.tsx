import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Tailwind color token used in the radial highlight, e.g. 'primary'. */
  glow?: string;
  size?: number;
}

/**
 * Pointer-follow radial highlight on hover. Apple-calm:
 * the spotlight fades in/out over 600ms; no scale or jitter on the card itself.
 */
export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className,
  glow = '160 84% 45%',
  size = 320,
  ...rest
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -9999, y: -9999 });
  const [active, setActive] = useState(false);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className={cn('relative overflow-hidden', className)}
      {...rest}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-[600ms] ease-out"
        style={{
          opacity: active ? 1 : 0,
          background: `radial-gradient(${size}px circle at ${pos.x}px ${pos.y}px, hsl(${glow} / 0.18), transparent 60%)`,
        }}
      />
      {children}
    </div>
  );
};
