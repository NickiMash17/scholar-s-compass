import React, { useMemo, useEffect, useRef } from 'react';
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

const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const count = Math.min(60, Math.floor((window.innerWidth * window.innerHeight) / 25000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: 1 + Math.random() * 1.5,
      opacity: 0.15 + Math.random() * 0.35,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.08;
            ctx.strokeStyle = `hsla(160, 84%, 39%, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(160, 84%, 50%, ${p.opacity})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

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

      {/* Neural particle network */}
      <ParticleCanvas />

      {/* Grid pattern — circuit board style */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(160 84% 39% / 0.15) 1px, transparent 1px),
            linear-gradient(90deg, hsl(160 84% 39% / 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Top radial glow */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -10%, hsl(160 84% 39% / 0.08) 0%, transparent 60%)',
        }}
      />

      {/* Vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 40%, hsl(160 10% 3% / 0.6) 100%)',
        }}
      />
    </div>
  );
};
