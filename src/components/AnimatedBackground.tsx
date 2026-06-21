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

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseSize: number;
      opacity: number;
      hue: number;
      phase: number;
      trail: { x: number; y: number }[];
    }

    let particles: Particle[] = [];
    let mouse = { x: -9999, y: -9999 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const count = Math.min(50, Math.floor((window.innerWidth * window.innerHeight) / 28000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      baseSize: 1.2 + Math.random() * 2.2,
      size: 1.2 + Math.random() * 2.2,
      opacity: 0.2 + Math.random() * 0.4,
      hue: 150 + Math.random() * 30, // emerald-to-teal range
      phase: Math.random() * Math.PI * 2,
      trail: [],
    }));

    const draw = () => {
      // Fade for motion trails
      ctx.fillStyle = 'rgba(6, 22, 16, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.001;

      for (const p of particles) {
        // Mouse repulsion (subtle)
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 180 && mDist > 0) {
          const force = (180 - mDist) / 180 * 0.015;
          p.vx += (mdx / mDist) * force;
          p.vy += (mdy / mDist) * force;
        }

        // Gentle friction + drift
        p.vx *= 0.995;
        p.vy *= 0.995;

        // Breathing size
        p.size = p.baseSize + Math.sin(time * 1.5 + p.phase) * 0.6;

        // Trail
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 6) p.trail.shift();

        p.x += p.vx;
        p.y += p.vy;

        // Soft wrap-around
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;
      }

      // Draw connections with occasional "pulse packet"
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            const alpha = (1 - dist / 160) * 0.06;
            ctx.strokeStyle = `hsla(160, 84%, 45%, ${alpha})`;
            ctx.lineWidth = 0.4;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw trails
      for (const p of particles) {
        if (p.trail.length < 2) continue;
        for (let t = 0; t < p.trail.length - 1; t++) {
          const a = (t / p.trail.length) * p.opacity * 0.3;
          ctx.beginPath();
          ctx.moveTo(p.trail[t].x, p.trail[t].y);
          ctx.lineTo(p.trail[t + 1].x, p.trail[t + 1].y);
          ctx.strokeStyle = `hsla(${p.hue}, 80%, 55%, ${a})`;
          ctx.lineWidth = p.size * 0.4;
          ctx.stroke();
        }
      }

      // Draw particles (glowing core)
      for (const p of particles) {
        // Glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        glow.addColorStop(0, `hsla(${p.hue}, 80%, 60%, ${p.opacity * 0.5})`);
        glow.addColorStop(1, `hsla(${p.hue}, 80%, 60%, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 70%, ${p.opacity})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
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
