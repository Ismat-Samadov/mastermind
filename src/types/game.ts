// All TypeScript types for the Mastermind game

/** Available peg colors */
export type PegColor =
  | 'red'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'purple'
  | 'orange'
  | 'pink'
  | 'cyan';

/** Game modes: player cracks AI code vs AI cracks player's code */
export type GameMode = 'player-breaks' | 'ai-breaks';

/** Difficulty tiers */
export type Difficulty = 'easy' | 'medium' | 'hard';

/** Game lifecycle status */
export type GameStatus = 'menu' | 'setup' | 'playing' | 'paused' | 'won' | 'lost';

/** Feedback after a guess: blacks = right color+position, whites = right color wrong position */
export interface Feedback {
  blacks: number;
  whites: number;
}

/** A submitted guess with its feedback */
export interface GuessEntry {
  pegs: PegColor[];
  feedback: Feedback;
}

/** Config per difficulty */
export interface DifficultyConfig {
  codeLength: number;
  numColors: number;
  maxGuesses: number;
  label: string;
  description: string;
  scoreMultiplier: number;
}

/** Full game state */
export interface GameState {
  secretCode: (PegColor | null)[];
  guesses: GuessEntry[];
  currentGuess: (PegColor | null)[];
  activeSlot: number;
  selectedColor: PegColor | null;
  status: GameStatus;
  difficulty: Difficulty;
  mode: GameMode;
  score: number;
  timeElapsed: number;
  // AI-breaks-player mode
  aiGuesses: GuessEntry[];
  playerCode: (PegColor | null)[];
}
