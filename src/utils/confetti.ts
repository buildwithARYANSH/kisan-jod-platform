import confetti from 'canvas-confetti';

export function fireConfetti(options?: confetti.Options) {
  try {
    if (typeof confetti === 'function') {
      confetti(options);
    } else if (confetti && typeof (confetti as any).default === 'function') {
      (confetti as any).default(options);
    }
  } catch (err) {
    console.warn('Confetti animation skipped:', err);
  }
}
