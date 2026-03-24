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
    return Array.from({ length: 4 }, (_, i) => ({
      id: i,
      size: 400 + Math.random() * 600,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 30 + Math.random() * 25,
      delay: Math.random() * 5,
      opacity: 0.012 + Math.random() * 0.02,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      
      {/* Gradient orbs */}
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            background: orb.id % 3 === 0 
              ? `radial-gradient(circle, hsl(160 84% 39% / ${orb.opacity}) 0%, transparent 70%)`
              : orb.id % 3 === 1
              ? `radial-gradient(circle, hsl(152 68% 50% / ${orb.opacity}) 0%, transparent 70%)`
              : `radial-gradient(circle, hsl(175 70% 40% / ${orb.opacity}) 0%, transparent 70%)`,
            filter: 'blur(80px)',
          }}
          animate={{
            x: [0, 50, -40, 30, 0],
            y: [0, -40, 30, -20, 0],
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

      {/* Grid pattern — circuit board style */}
      <div 
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(160 84% 39% / 0.15) 1px, transparent 1px),
            linear-gradient(90deg, hsl(160 84% 39% / 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Dot grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(160 84% 39% / 0.3) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Top radial glow — enhanced */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -10%, hsl(160 84% 39% / 0.08) 0%, transparent 60%)',
        }}
      />

      {/* Bottom radial glow */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 110%, hsl(160 84% 39% / 0.04) 0%, transparent 60%)',
        }}
      />

      {/* Vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 40%, hsl(160 10% 3% / 0.6) 100%)',
        }}
      />

      {/* Noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.012]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};
