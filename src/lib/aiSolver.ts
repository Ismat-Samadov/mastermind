import type { Feedback, PegColor } from '@/types/game';
import { PEG_COLORS } from './constants';
import { calculateFeedback } from './gameLogic';

type Code = PegColor[];
type History = { guess: Code; feedback: Feedback }[];

/** Generate all possible codes for given parameters */
function generateAllCodes(numColors: number, codeLength: number): Code[] {
  const colors = PEG_COLORS.slice(0, numColors);
  const result: Code[] = [];

  function build(current: Code) {
    if (current.length === codeLength) {
      result.push([...current]);
      return;
    }
    for (const c of colors) {
      current.push(c);
      build(current);
      current.pop();
    }
  }

  build([]);
  return result;
}

/** Remove codes from the pool that are inconsistent with a known guess+feedback */
function filterPossible(possible: Code[], guess: Code, feedback: Feedback): Code[] {
  return possible.filter((code) => {
    const f = calculateFeedback(guess, code);
    return f.blacks === feedback.blacks && f.whites === feedback.whites;
  });
}

/**
 * Returns the strategic opening guess — an AABB pattern that covers the most ground.
 */
function firstGuess(numColors: number, codeLength: number): Code {
  const colors = PEG_COLORS.slice(0, numColors);
  return Array.from({ length: codeLength }, (_, i) => colors[Math.floor(i / 2) % colors.length]);
}

/**
 * Easy AI: picks a random remaining possible code after filtering.
 */
export function easyAiGuess(
  history: History,
  numColors: number,
  codeLength: number
): Code {
  if (history.length === 0) return firstGuess(numColors, codeLength);

  let possible = generateAllCodes(numColors, codeLength);
  for (const { guess, feedback } of history) {
    possible = filterPossible(possible, guess, feedback);
  }

  if (possible.length === 0) return firstGuess(numColors, codeLength);
  return possible[Math.floor(Math.random() * possible.length)];
}

/**
 * Hard AI: uses Knuth's minimax strategy to minimise worst-case remaining possibilities.
 * For performance we cap the candidate pool and evaluate against remaining possible codes.
 */
export function hardAiGuess(
  history: History,
  numColors: number,
  codeLength: number
): Code {
  if (history.length === 0) return firstGuess(numColors, codeLength);

  const allCodes = generateAllCodes(numColors, codeLength);
  let possible = [...allCodes];

  for (const { guess, feedback } of history) {
    possible = filterPossible(possible, guess, feedback);
  }

  if (possible.length === 0) return firstGuess(numColors, codeLength);
  if (possible.length <= 2) return possible[0];

  // Evaluate a capped set of candidates to avoid O(n^2) blowup on large search spaces
  const candidates = allCodes.length <= 1296 ? allCodes : possible.slice(0, 60);

  let bestGuess = possible[0];
  let bestWorstCase = Infinity;

  for (const candidate of candidates) {
    // Score = size of the largest bucket of remaining codes this guess would leave
    const buckets = new Map<string, number>();
    for (const code of possible) {
      const f = calculateFeedback(candidate, code);
      const key = `${f.blacks},${f.whites}`;
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
    const worstCase = Math.max(...buckets.values());

    // Prefer smaller worst-case; break ties by favouring a guess that's still possible
    if (
      worstCase < bestWorstCase ||
      (worstCase === bestWorstCase && possible.includes(candidate) && !possible.includes(bestGuess))
    ) {
      bestWorstCase = worstCase;
      bestGuess = candidate;
    }
  }

  return bestGuess;
}
