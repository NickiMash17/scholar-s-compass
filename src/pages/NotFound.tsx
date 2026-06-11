import React, { useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, LayoutDashboard, BookOpen, ArrowLeft, Sparkles, Compass } from 'lucide-react';
import { SEO } from '@/components/SEO';

const NotFound: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  // Pre-compute particle positions
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 4,
        duration: 6 + Math.random() * 6,
      })),
    []
  );

  const quickLinks = [
    { to: '/', label: 'Home', icon: Home, desc: 'Start a new protocol' },
    { to: '/plan', label: 'Study Plan', icon: BookOpen, desc: 'Continue your 7-day intensive' },
    { to: '/progress', label: 'Dashboard', icon: LayoutDashboard, desc: 'View your mastery analytics' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background flex items-center justify-center px-4">
      <SEO title="Page Not Found" description="The page you're looking for doesn't exist. Return home or continue your study protocol." noindex />

      {/* Ambient gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, hsl(160 84% 39% / 0.10) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, hsl(152 68% 50% / 0.08) 0%, transparent 70%)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(hsl(160 84% 39% / 0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(160 84% 39% / 0.4) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Floating neural particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute rounded-full bg-primary/60"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.9, 0.2] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* Glitchy 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative inline-block mb-6"
        >
          <h1
            className="font-mono text-[120px] sm:text-[180px] leading-none font-black tracking-tighter text-transparent bg-clip-text"
            style={{
              backgroundImage:
                'linear-gradient(135deg, hsl(160 84% 39%), hsl(152 68% 50%), hsl(160 84% 39%))',
            }}
            aria-label="404"
          >
            404
          </h1>
          <motion.div
            className="absolute inset-0 font-mono text-[120px] sm:text-[180px] leading-none font-black tracking-tighter text-primary/30 select-none"
            animate={{ x: [0, 2, -2, 0], opacity: [0, 0.4, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            aria-hidden
          >
            404
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4"
        >
          <Sparkles className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-primary">Signal lost</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl sm:text-3xl font-bold text-foreground mb-3"
        >
          This route isn't on the map
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-sm sm:text-base text-muted-foreground mb-2 font-mono"
        >
          <Compass className="inline w-4 h-4 mr-1 text-primary/70" />
          <code className="text-primary/80">{location.pathname}</code>
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-muted-foreground mb-8"
        >
          The neural net couldn't resolve that page. Jump back to a known coordinate.
        </motion.p>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8"
        >
          {quickLinks.map((q) => (
            <Link
              key={q.to}
              to={q.to}
              className="group rounded-xl bg-card border border-border/50 p-4 text-left hover:border-primary/40 hover:bg-card/80 transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <q.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {q.label}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">{q.desc}</p>
            </Link>
          ))}
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Go back
        </motion.button>
      </div>
    </div>
  );
};

export default NotFound;
