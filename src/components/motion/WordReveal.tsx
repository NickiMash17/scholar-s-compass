import React from 'react';
import { motion } from 'framer-motion';

interface WordRevealProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  /** Optional renderer to style specific words (e.g. gradient highlight). */
  renderWord?: (word: string, index: number) => React.ReactNode;
}

/**
 * Apple-calm word-by-word reveal.
 * Each word fades up with a soft 0.9s cubic-out, stagger 60ms.
 * Once visible, no further motion — quiet and confident.
 */
export const WordReveal: React.FC<WordRevealProps> = ({
  text,
  className,
  delay = 0,
  stagger = 0.06,
  as = 'span',
  renderWord,
}) => {
  const words = text.split(' ');
  const MotionTag = motion[as] as typeof motion.span;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-baseline">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: '110%', opacity: 0 },
              visible: {
                y: '0%',
                opacity: 1,
                transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
              },
            }}
          >
            {renderWord ? renderWord(word, i) : word}
            {i < words.length - 1 && '\u00A0'}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
};
