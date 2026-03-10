import type { Feedback, PegColor } from '@/types/game';
import { PEG_COLORS, DIFFICULTY_CONFIGS } from './constants';

/**
 * Generates a random secret code of the given length from the available colors.
 */
export function generateSecretCode(numColors: number, codeLength: number): PegColor[] {
  const available = PEG_COLORS.slice(0, numColors);
  return Array.from(
    { length: codeLength },
    () => available[Math.floor(Math.random() * available.length)]
  );
}

/**
 * Calculates the Mastermind feedback for a guess against the secret code.
 * blacks = correct color AND correct position
 * whites = correct color but wrong position
 */
export function calculateFeedback(
  guess: (PegColor | null)[],
  secret: (PegColor | null)[]
): Feedback {
  const secretCopy = [...secret];
  const guessCopy = [...guess];
  let blacks = 0;
  let whites = 0;

  // Pass 1: count exact matches (black pegs)
  for (let i = 0; i < guessCopy.length; i++) {
    if (guessCopy[i] !== null && guessCopy[i] === secretCopy[i]) {
      blacks++;
      secretCopy[i] = null;
      guessCopy[i] = null;
    }
  }

  // Pass 2: count color-only matches (white pegs)
  for (let i = 0; i < guessCopy.length; i++) {
    if (guessCopy[i] !== null) {
      const idx = secretCopy.indexOf(guessCopy[i]);
      if (idx !== -1) {
        whites++;
        secretCopy[idx] = null;
      }
    }
  }

  return { blacks, whites };
}

/**
 * Calculates the player's score based on speed, efficiency, and difficulty.
 */
export function calculateScore(
  difficulty: string,
  guessesUsed: number,
  maxGuesses: number,
  timeElapsed: number
): number {
  const config = DIFFICULTY_CONFIGS[difficulty];
  if (!config) return 0;

  const base = 1000;
  const guessBonus = Math.max(0, maxGuesses - guessesUsed) * 120;
  const timeBonus = Math.max(0, 300 - timeElapsed) * 2;

  return Math.floor((base + guessBonus + timeBonus) * config.scoreMultiplier);
}

/**
 * Returns true when all codeLength slots in a guess are filled.
 */
export function isGuessComplete(
  guess: (PegColor | null)[],
  codeLength: number
): boolean {
  return guess.slice(0, codeLength).every((peg) => peg !== null);
}
