import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface CountUpProps {
  end: string;
  duration?: number;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({ end, duration = 2, className }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!isInView) return;

    // Extract numeric part and suffix
    const match = end.match(/^([\d.]+)(.*)$/);
    if (!match) { setDisplay(end); return; }

    const target = parseFloat(match[1]);
    const suffix = match[2];
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = target * eased;

      if (target >= 100) {
        setDisplay(Math.round(current).toLocaleString() + suffix);
      } else if (target >= 1) {
        setDisplay(current.toFixed(1).replace(/\.0$/, '') + suffix);
      } else {
        setDisplay(current.toFixed(2) + suffix);
      }

      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, end, duration]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
    >
      {display}
    </motion.span>
  );
};
