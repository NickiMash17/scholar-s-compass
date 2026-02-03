import { useCallback } from 'react';
import confetti from 'canvas-confetti';

export const useConfetti = () => {
  const fireConfetti = useCallback(() => {
    // First burst from the left
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.2, y: 0.6 },
      colors: ['#f59e0b', '#fbbf24', '#fcd34d', '#10b981', '#34d399'],
    });

    // Second burst from the right
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.8, y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#fcd34d', '#10b981', '#34d399'],
      });
    }, 150);

    // Center celebration
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#f59e0b', '#fbbf24', '#fcd34d', '#10b981', '#34d399'],
      });
    }, 300);
  }, []);

  const fireStars = useCallback(() => {
    const defaults = {
      spread: 360,
      ticks: 100,
      gravity: 0,
      decay: 0.94,
      startVelocity: 20,
      colors: ['#f59e0b', '#fbbf24', '#10b981'],
    };

    const shoot = () => {
      confetti({
        ...defaults,
        particleCount: 30,
        scalar: 1.2,
        shapes: ['star'],
      });

      confetti({
        ...defaults,
        particleCount: 10,
        scalar: 0.75,
        shapes: ['circle'],
      });
    };

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
  }, []);

  return { fireConfetti, fireStars };
};
