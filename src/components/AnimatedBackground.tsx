import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface FloatingOrb {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  opacity: number;
}

export const AnimatedBackground: React.FC = () => {
  // Generate floating orbs
  const orbs = useMemo<FloatingOrb[]>(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      size: 200 + Math.random() * 400,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 20 + Math.random() * 15,
      delay: Math.random() * 5,
      opacity: 0.03 + Math.random() * 0.04,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />
      
      {/* Animated gradient orbs */}
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            background: orb.id % 2 === 0 
              ? 'radial-gradient(circle, hsl(38 92% 50% / var(--opacity)) 0%, transparent 70%)'
              : 'radial-gradient(circle, hsl(222 47% 40% / var(--opacity)) 0%, transparent 70%)',
            '--opacity': orb.opacity,
          } as React.CSSProperties}
          animate={{
            x: [0, 50, -30, 20, 0],
            y: [0, -40, 30, -20, 0],
            scale: [1, 1.1, 0.9, 1.05, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(48 96% 89% / 0.15) 1px, transparent 1px),
            linear-gradient(90deg, hsl(48 96% 89% / 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Radial gradient from center */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, hsl(38 92% 50% / 0.08) 0%, transparent 50%)',
        }}
      />

      {/* Animated light rays */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px]"
        style={{
          background: 'conic-gradient(from 90deg at 50% 0%, transparent 0deg, hsl(38 92% 50% / 0.03) 45deg, transparent 90deg, transparent 180deg, hsl(38 92% 50% / 0.02) 225deg, transparent 270deg)',
        }}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full bg-primary/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Bottom gradient fade */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-40"
        style={{
          background: 'linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)',
        }}
      />
    </div>
  );
};
