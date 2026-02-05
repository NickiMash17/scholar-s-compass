import { useCallback, useRef } from 'react';

// Web Audio API-based sound effects
const createAudioContext = (): AudioContext | null => {
  try {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  } catch {
    return null;
  }
};

export const useSoundEffects = (enabled: boolean = true) => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = createAudioContext();
    }
    return audioContextRef.current;
  }, []);

  // Timer complete sound - gentle chime
  const playTimerComplete = useCallback(() => {
    if (!enabled) return;
    
    const ctx = getAudioContext();
    if (!ctx) return;

    // Resume context if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5
    oscillator.frequency.setValueAtTime(1047, ctx.currentTime + 0.15); // C6
    oscillator.frequency.setValueAtTime(1319, ctx.currentTime + 0.3); // E6

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.6);
  }, [enabled, getAudioContext]);

  // Break complete sound - lower, calming tone
  const playBreakComplete = useCallback(() => {
    if (!enabled) return;
    
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(523, ctx.currentTime); // C5
    oscillator.frequency.setValueAtTime(659, ctx.currentTime + 0.2); // E5

    gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  }, [enabled, getAudioContext]);

  // Confetti/celebration sound - ascending triumphant melody
  const playConfetti = useCallback(() => {
    if (!enabled) return;
    
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    const duration = 0.15;

    notes.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + index * duration);

      gainNode.gain.setValueAtTime(0, ctx.currentTime + index * duration);
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + index * duration + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + index * duration + duration);

      oscillator.start(ctx.currentTime + index * duration);
      oscillator.stop(ctx.currentTime + index * duration + duration);
    });
  }, [enabled, getAudioContext]);

  // Task complete sound - short click
  const playTaskComplete = useCallback(() => {
    if (!enabled) return;
    
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(1200, ctx.currentTime);

    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  }, [enabled, getAudioContext]);

  return {
    playTimerComplete,
    playBreakComplete,
    playConfetti,
    playTaskComplete,
  };
};
