import type { DifficultyConfig, PegColor } from '@/types/game';

/** Ordered list of all available peg colors */
export const PEG_COLORS: PegColor[] = [
  'red',
  'blue',
  'green',
  'yellow',
  'purple',
  'orange',
  'pink',
  'cyan',
];

/** Visual styles for each peg color (dynamic values, used in inline style props) */
export const PEG_COLOR_STYLES: Record<
  PegColor,
  { bg: string; glow: string; label: string; ring: string }
> = {
  red:    { bg: '#ff2d55', glow: 'rgba(255,45,85,0.7)',    ring: 'rgba(255,45,85,0.4)',    label: 'Red'    },
  blue:   { bg: '#0a84ff', glow: 'rgba(10,132,255,0.7)',   ring: 'rgba(10,132,255,0.4)',   label: 'Blue'   },
  green:  { bg: '#30d158', glow: 'rgba(48,209,88,0.7)',    ring: 'rgba(48,209,88,0.4)',    label: 'Green'  },
  yellow: { bg: '#ffd60a', glow: 'rgba(255,214,10,0.7)',   ring: 'rgba(255,214,10,0.4)',   label: 'Yellow' },
  purple: { bg: '#bf5af2', glow: 'rgba(191,90,242,0.7)',   ring: 'rgba(191,90,242,0.4)',   label: 'Purple' },
  orange: { bg: '#ff9f0a', glow: 'rgba(255,159,10,0.7)',   ring: 'rgba(255,159,10,0.4)',   label: 'Orange' },
  pink:   { bg: '#ff375f', glow: 'rgba(255,55,95,0.7)',    ring: 'rgba(255,55,95,0.4)',    label: 'Pink'   },
  cyan:   { bg: '#64d2ff', glow: 'rgba(100,210,255,0.7)',  ring: 'rgba(100,210,255,0.4)',  label: 'Cyan'   },
};

/** Game configuration per difficulty */
export const DIFFICULTY_CONFIGS: Record<string, DifficultyConfig> = {
  easy: {
    codeLength: 4,
    numColors: 6,
    maxGuesses: 12,
    label: 'Easy',
    description: '4 pegs · 6 colors · 12 guesses',
    scoreMultiplier: 1,
  },
  medium: {
    codeLength: 4,
    numColors: 8,
    maxGuesses: 10,
    label: 'Medium',
    description: '4 pegs · 8 colors · 10 guesses',
    scoreMultiplier: 1.5,
  },
  hard: {
    codeLength: 5,
    numColors: 8,
    maxGuesses: 8,
    label: 'Hard',
    description: '5 pegs · 8 colors · 8 guesses',
    scoreMultiplier: 2.5,
  },
};
