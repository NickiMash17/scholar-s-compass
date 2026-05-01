import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Download, Linkedin, X, Award, Sparkles } from 'lucide-react';
import { jsPDF } from 'jspdf';
import type { Badge } from '@/hooks/useGamification';

interface CertificateGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  topicLabel: string;
  totalXp: number;
  level: number;
  levelTitle: string;
  badges: Badge[];
  completionDate?: Date;
}

const generateCertificatePDF = (
  userName: string,
  topicLabel: string,
  totalXp: number,
  levelTitle: string,
  badges: Badge[],
  completionDate: Date
): jsPDF => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const w = 297;
  const h = 210;
  const unlockedBadges = badges.filter(b => b.unlockedAt);

  // Background
  doc.setFillColor(8, 20, 12);
  doc.rect(0, 0, w, h, 'F');

  // Outer border
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(1.5);
  doc.roundedRect(8, 8, w - 16, h - 16, 3, 3, 'S');

  // Inner border
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.3);
  doc.setLineDashPattern([2, 2], 0);
  doc.roundedRect(12, 12, w - 24, h - 24, 2, 2, 'S');
  doc.setLineDashPattern([], 0);

  // Corner decorations
  const corners = [
    [16, 16], [w - 16, 16], [16, h - 16], [w - 16, h - 16]
  ];
  doc.setFillColor(16, 185, 129);
  corners.forEach(([cx, cy]) => {
    doc.circle(cx, cy, 2, 'F');
  });

  // Top accent line
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.8);
  doc.line(w / 2 - 60, 28, w / 2 + 60, 28);

  // "CERTIFICATE OF COMPLETION" label
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(16, 185, 129);
  doc.text('CERTIFICATE OF COMPLETION', w / 2, 36, { align: 'center' });

  // Trophy icon text
  doc.setFontSize(28);
  doc.text('\u2605', w / 2, 50, { align: 'center' });

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(200, 220, 210);
  doc.text('This certifies that', w / 2, 62, { align: 'center' });

  // User name
  doc.setFontSize(28);
  doc.setTextColor(16, 185, 129);
  doc.text(userName || 'Learner', w / 2, 78, { align: 'center' });

  // Underline under name
  const nameWidth = doc.getTextWidth(userName || 'Learner');
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.4);
  doc.line(w / 2 - nameWidth / 2, 81, w / 2 + nameWidth / 2, 81);

  // Description
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(180, 200, 190);
  doc.text('has successfully completed the 7-Day Intensive Protocol', w / 2, 92, { align: 'center' });

  // Topic
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text(`"${topicLabel}"`, w / 2, 104, { align: 'center' });

  // Stats row
  const statsY = 120;
  const statsSpacing = 55;
  const statsStart = w / 2 - statsSpacing;

  // XP stat
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(16, 185, 129);
  doc.text('TOTAL XP', statsStart, statsY, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(String(totalXp), statsStart, statsY + 8, { align: 'center' });

  // Rank stat
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(16, 185, 129);
  doc.text('RANK ACHIEVED', w / 2, statsY, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(levelTitle, w / 2, statsY + 8, { align: 'center' });

  // Badges stat
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(16, 185, 129);
  doc.text('BADGES', statsStart + statsSpacing * 2, statsY, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(`${unlockedBadges.length}/${badges.length}`, statsStart + statsSpacing * 2, statsY + 8, { align: 'center' });

  // Divider
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.3);
  doc.line(w / 2 - 80, 138, w / 2 + 80, 138);

  // Badge names
  if (unlockedBadges.length > 0) {
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(140, 170, 155);
    const badgeNames = unlockedBadges.map(b => b.name).join('  •  ');
    doc.text(badgeNames, w / 2, 145, { align: 'center', maxWidth: w - 60 });
  }

  // Date & Platform
  const dateStr = completionDate.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 150, 135);
  doc.text(`Completed on ${dateStr}`, w / 2, 160, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(80, 110, 95);
  doc.text('Issued by AI Study Coach • 7-Day Intensive Protocol', w / 2, 168, { align: 'center' });

  // Bottom accent
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.8);
  doc.line(w / 2 - 60, h - 28, w / 2 + 60, h - 28);

  // Credential ID
  const credentialId = `AISC-${Date.now().toString(36).toUpperCase()}`;
  doc.setFontSize(6);
  doc.setTextColor(60, 80, 70);
  doc.text(`Credential ID: ${credentialId}`, w / 2, h - 20, { align: 'center' });

  return doc;
};

export const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({
  isOpen,
  onClose,
  userName,
  topicLabel,
  totalXp,
  level,
  levelTitle,
  badges,
  completionDate = new Date(),
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const doc = generateCertificatePDF(userName, topicLabel, totalXp, levelTitle, badges, completionDate);
      doc.save(`AI-Study-Coach-Certificate-${topicLabel.replace(/\s+/g, '-')}.pdf`);
    } catch (e) {
      console.error('Certificate generation failed:', e);
    }
    setIsGenerating(false);
  };

  const handleLinkedInShare = () => {
    const text = encodeURIComponent(
      `🎓 I just completed the "${topicLabel}" 7-Day Intensive Protocol on AI Study Coach!\n\n` +
      `📊 ${totalXp} XP earned | ${levelTitle} rank achieved | ${badges.filter(b => b.unlockedAt).length} badges unlocked\n\n` +
      `#AIStudyCoach #Learning #SelfImprovement`
    );
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${text}`, '_blank');
  };

  const unlockedBadges = badges.filter(b => b.unlockedAt);

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg p-0 overflow-hidden border-primary/30 bg-transparent shadow-none">
        <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-card via-card to-background border border-primary/20">
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, hsl(160 84% 39% / 0.4), transparent 60%)' }}
            />
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-background/60 backdrop-blur border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative z-10 p-6 sm:p-8">
            {/* Hero */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="flex justify-center mb-4"
            >
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-neon">
                <Award className="w-8 h-8 text-primary-foreground" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-6"
            >
              <span className="hud-label flex items-center justify-center gap-1.5 mb-2">
                <Sparkles className="w-3 h-3" />
                Certificate Ready
                <Sparkles className="w-3 h-3" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-gradient-primary mb-2">
                Your Achievement Certificate
              </h2>
              <p className="text-sm text-muted-foreground">
                Download your personalized certificate for completing the{' '}
                <span className="text-foreground font-semibold">{topicLabel}</span> protocol.
              </p>
            </motion.div>

            {/* Certificate preview card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl border border-primary/20 bg-[hsl(160_10%_6%)] p-4 mb-6"
            >
              <div className="text-center space-y-1">
                <p className="text-[10px] tracking-[0.2em] text-primary font-mono">CERTIFICATE OF COMPLETION</p>
                <p className="text-lg font-bold text-foreground">{userName || 'Learner'}</p>
                <p className="text-xs text-muted-foreground">"{topicLabel}" • {totalXp} XP • {levelTitle}</p>
                <div className="flex items-center justify-center gap-1 pt-1">
                  {unlockedBadges.slice(0, 6).map(b => (
                    <span key={b.id} className="text-sm" title={b.name}>{b.icon}</span>
                  ))}
                  {unlockedBadges.length > 6 && (
                    <span className="text-[10px] text-muted-foreground font-mono">+{unlockedBadges.length - 6}</span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <button
                onClick={handleDownload}
                disabled={isGenerating}
                className="flex-1 h-11 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-mono text-sm font-semibold flex items-center justify-center gap-2 shadow-neon magnetic-hover disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {isGenerating ? 'Generating...' : 'Download PDF'}
              </button>
              <button
                onClick={handleLinkedInShare}
                className="flex-1 h-11 rounded-lg border border-border bg-secondary/50 hover:bg-secondary text-foreground font-mono text-sm flex items-center justify-center gap-2 transition-all magnetic-hover"
              >
                <Linkedin className="w-4 h-4" />
                Share on LinkedIn
              </button>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
