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
  const orbs = useMemo<FloatingOrb[]>(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      size: 300 + Math.random() * 500,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 25 + Math.random() * 20,
      delay: Math.random() * 5,
      opacity: 0.015 + Math.random() * 0.025,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      
      {/* Subtle gradient orbs */}
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            background: orb.id % 3 === 0 
              ? `radial-gradient(circle, hsl(160 84% 39% / ${orb.opacity}) 0%, transparent 70%)`
              : orb.id % 3 === 1
              ? `radial-gradient(circle, hsl(142 71% 45% / ${orb.opacity}) 0%, transparent 70%)`
              : `radial-gradient(circle, hsl(175 70% 40% / ${orb.opacity}) 0%, transparent 70%)`,
          }}
          animate={{
            x: [0, 40, -30, 20, 0],
            y: [0, -30, 25, -15, 0],
            scale: [1, 1.05, 0.95, 1.02, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}

      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(160 84% 39% / 0.12) 1px, transparent 1px),
            linear-gradient(90deg, hsl(160 84% 39% / 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
      />

      {/* Top radial glow */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 70% 40% at 50% 0%, hsl(160 84% 39% / 0.06) 0%, transparent 60%)',
        }}
      />

      {/* Noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Bottom fade */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-40"
        style={{
          background: 'linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)',
        }}
      />
    </div>
  );
};
