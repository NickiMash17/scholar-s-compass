import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, Check, X, Twitter, Linkedin, Download, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/hooks/useGamification';

interface ShareProgressCardProps {
  topicLabel: string;
  percentage: number;
  streak: number;
  xp: number;
  level: number;
  levelTitle: string;
  completedTasks: number;
  totalTasks: number;
  badges: Badge[];
}

export const ShareProgressCard: React.FC<ShareProgressCardProps> = ({
  topicLabel,
  percentage,
  streak,
  xp,
  level,
  levelTitle,
  completedTasks,
  totalTasks,
  badges,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const unlockedBadges = badges.filter(b => b.unlockedAt);

  const shareText = `🎯 I'm ${percentage}% through my "${topicLabel}" study plan!\n\n📊 Stats:\n⚡ ${xp} XP • Level ${level} ${levelTitle}\n🔥 ${streak}-day streak\n✅ ${completedTasks}/${totalTasks} tasks done\n🏆 ${unlockedBadges.length} badges earned\n\nPowered by AI Study Coach`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = shareText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTwitterShare = () => {
    const url = encodeURIComponent(window.location.origin);
    const text = encodeURIComponent(`🎯 I'm ${percentage}% through my "${topicLabel}" study plan!\n⚡ ${xp} XP • Level ${level} • 🔥 ${streak}-day streak\n✅ ${completedTasks}/${totalTasks} tasks • 🏆 ${unlockedBadges.length} badges\n\n#StudyGoals #AI`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleLinkedInShare = () => {
    const url = encodeURIComponent(window.location.origin);
    const title = encodeURIComponent(`${percentage}% through my ${topicLabel} study plan!`);
    const summary = encodeURIComponent(`Using AI Study Coach to master ${topicLabel}. ${completedTasks}/${totalTasks} tasks completed with ${xp} XP earned!`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const handleDownloadCard = async () => {
    // Create a canvas-based share card
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 450;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 800, 450);
    grad.addColorStop(0, '#0a1210');
    grad.addColorStop(0.5, '#0f1c18');
    grad.addColorStop(1, '#0a1210');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 450);

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 760, 410);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 14px system-ui';
    ctx.fillText('AI STUDY COACH', 50, 60);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 32px system-ui';
    ctx.fillText(topicLabel, 50, 110);

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(50, 140, 700, 24, 12);
    ctx.fill();
    
    const progressGrad = ctx.createLinearGradient(50, 0, 50 + 700 * (percentage / 100), 0);
    progressGrad.addColorStop(0, '#10b981');
    progressGrad.addColorStop(1, '#34d399');
    ctx.fillStyle = progressGrad;
    ctx.beginPath();
    ctx.roundRect(50, 140, Math.max(24, 700 * (percentage / 100)), 24, 12);
    ctx.fill();

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 16px system-ui';
    ctx.fillText(`${percentage}% Complete`, 50, 190);

    const stats = [
      { label: 'XP', value: `${xp}`, icon: '⚡' },
      { label: 'Level', value: `${level} ${levelTitle}`, icon: '⭐' },
      { label: 'Streak', value: `${streak} days`, icon: '🔥' },
      { label: 'Tasks', value: `${completedTasks}/${totalTasks}`, icon: '✅' },
      { label: 'Badges', value: `${unlockedBadges.length}`, icon: '🏆' },
    ];

    stats.forEach((stat, i) => {
      const x = 50 + i * 145;
      const y = 230;

      ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
      ctx.beginPath();
      ctx.roundRect(x, y, 130, 80, 12);
      ctx.fill();

      ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x, y, 130, 80, 12);
      ctx.stroke();

      ctx.font = '24px system-ui';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(stat.icon, x + 12, y + 32);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 16px system-ui';
      ctx.fillText(stat.value, x + 12, y + 56);

      ctx.fillStyle = '#64748b';
      ctx.font = '11px system-ui';
      ctx.fillText(stat.label, x + 12, y + 72);
    });

    // Unlocked badges
    if (unlockedBadges.length > 0) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px system-ui';
      ctx.fillText('BADGES EARNED', 50, 350);

      unlockedBadges.slice(0, 8).forEach((badge, i) => {
        ctx.font = '28px system-ui';
        ctx.fillText(badge.icon, 50 + i * 40, 385);
      });
    }

    // Footer
    ctx.fillStyle = '#475569';
    ctx.font = '12px system-ui';
    ctx.fillText('Powered by AI Study Coach • ai-study-coach.app', 50, 420);

    // Download
    const link = document.createElement('a');
    link.download = `study-progress-${topicLabel.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <>
      {/* Share Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
      >
        <Share2 className="w-4 h-4" />
        <span className="hidden sm:inline">Share Progress</span>
      </motion.button>

      {/* Share Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl bg-card border border-border p-6 shadow-elevated overflow-y-auto max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-primary" />
                  <h2 className="font-serif text-xl font-bold text-foreground">Share Your Progress</h2>
                </div>
                <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Preview Card */}
              <div
                ref={cardRef}
                className="rounded-xl bg-gradient-to-br from-background to-card border border-border p-5 mb-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">AI Study Coach</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-foreground mb-2">{topicLabel}</h3>
                
                {/* Progress bar */}
                <div className="w-full h-3 bg-muted/50 rounded-full overflow-hidden mb-2">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mb-4">{percentage}% Complete</p>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { icon: '⚡', value: `${xp} XP`, label: 'Earned' },
                    { icon: '🔥', value: `${streak}`, label: 'Day Streak' },
                    { icon: '✅', value: `${completedTasks}/${totalTasks}`, label: 'Tasks' },
                  ].map((stat) => (
                    <div key={stat.label} className="p-2 rounded-lg bg-muted/30 border border-border/50 text-center">
                      <span className="text-lg">{stat.icon}</span>
                      <p className="text-sm font-semibold text-foreground">{stat.value}</p>
                      <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Badges */}
                {unlockedBadges.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    {unlockedBadges.slice(0, 6).map((badge) => (
                      <span key={badge.id} className="text-lg" title={badge.name}>{badge.icon}</span>
                    ))}
                    {unlockedBadges.length > 6 && (
                      <span className="text-xs text-muted-foreground">+{unlockedBadges.length - 6}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Share Actions */}
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground font-medium">Share via</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleTwitterShare}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1DA1F2]/10 border border-[#1DA1F2]/20 text-[#1DA1F2] text-sm font-medium hover:bg-[#1DA1F2]/20 transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    Twitter / X
                  </button>
                  <button
                    onClick={handleLinkedInShare}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0A66C2]/10 border border-[#0A66C2]/20 text-[#0A66C2] text-sm font-medium hover:bg-[#0A66C2]/20 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleCopy}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-muted/50 border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Text
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownloadCard}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-muted/50 border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Card
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
