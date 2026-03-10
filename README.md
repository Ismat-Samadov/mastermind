# 🧠 Mastermind — Crack the Code

A fully-featured, neon-cyberpunk **Mastermind** code-breaking game built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, and **Framer Motion**.

---

## Features

- **Two game modes**
  - 🕵️ **You Crack It** — The AI generates a secret code; you have limited guesses to break it
  - 🤖 **AI Cracks It** — You set a secret code; watch the AI deduce it step-by-step

- **Three difficulty tiers**
  | Difficulty | Pegs | Colors | Guesses | Score multiplier |
  |-----------|------|--------|---------|-----------------|
  | Easy      | 4    | 6      | 12      | ×1              |
  | Medium    | 4    | 8      | 10      | ×1.5            |
  | Hard      | 5    | 8      | 8       | ×2.5            |

- **Smart AI** — Easy AI uses random filtering; Hard AI uses Knuth's minimax algorithm
- **Live score** with time bonus, guess-efficiency bonus, and difficulty multiplier
- **High score** persisted in `localStorage`
- **Procedural sound effects & ambient music** via Web Audio API (zero external assets)
- **Sound & music toggles** with localStorage persistence
- **Pause / resume** (keyboard or button)
- **Animated end screen** with secret code reveal, score display, and new-high-score celebration
- **Neon-cyberpunk theme** with radial gradients, grid overlay, and glow effects on every peg
- **Framer Motion** animations on every interaction (entry, scale, slide)
- **Fully responsive** — works on desktop, tablet, and mobile
- **Touch controls** — tap a color then tap a slot; on-screen Submit / Clear buttons
- **Keyboard controls** — full game control without mouse

---

## Controls

| Input | Action |
|-------|--------|
| `1` – `8` | Select color |
| `Space` | Place selected color in next empty slot |
| `Enter` | Submit current guess |
| `Backspace` | Remove rightmost filled peg |
| `P` / `Escape` | Pause / Resume |
| **Tap color** | Select it on mobile |
| **Tap slot** | Place selected color (or remove existing) |

---

## Tech Stack

- [Next.js 16](https://nextjs.org/) — App Router, server components
- [TypeScript](https://www.typescriptlang.org/) — strict mode throughout
- [Tailwind CSS v4](https://tailwindcss.com/) — utility-first, `@theme` config
- [Framer Motion](https://www.framer.com/motion/) — spring animations & AnimatePresence
- **Web Audio API** — procedural sound effects & ambient music (no external files)
- `localStorage` — high score and sound settings persistence

---

## Project Structure

```
src/
├── app/
│   ├── globals.css       # Tailwind v4 + custom neon utilities
│   ├── layout.tsx        # Root layout with metadata + viewport
│   └── page.tsx          # Entry point → <Game />
├── components/
│   ├── Game.tsx          # Top-level orchestrator (wires all hooks + screens)
│   ├── Board.tsx         # Guess history + active input row + empty rows
│   ├── GuessRow.tsx      # Single completed guess with feedback pegs
│   ├── FeedbackPegs.tsx  # Black/white peg 2×N grid
│   ├── ColorPicker.tsx   # Bottom color palette + Submit / Clear buttons
│   ├── Header.tsx        # Live stats bar + sound/music/pause controls
│   ├── DifficultyModal   # Full-screen start menu
│   ├── EndScreen.tsx     # Animated win/lose overlay
│   ├── PauseScreen.tsx   # Pause overlay
│   ├── SetupCode.tsx     # Player code setup screen (AI-breaks mode)
│   └── AiBreaker.tsx     # Step-by-step AI view (AI-breaks mode)
├── hooks/
│   ├── useGame.ts        # All game state, transitions, and actions
│   ├── useSound.ts       # Sound/music toggles with localStorage
│   ├── useHighScore.ts   # localStorage high score persistence
│   ├── useTimer.ts       # Elapsed-time counter (starts/stops with game)
│   └── useKeyboard.ts    # Global keyboard shortcuts
├── lib/
│   ├── constants.ts      # PEG_COLORS, PEG_COLOR_STYLES, DIFFICULTY_CONFIGS
│   ├── gameLogic.ts      # Feedback calculation, score, code generation
│   ├── aiSolver.ts       # Easy (random) + Hard (Knuth minimax) AI
│   └── soundManager.ts   # Web Audio API procedural sound engine
└── types/
    └── game.ts           # All TypeScript interfaces and type aliases
```

---

## Run Locally

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd mastermind

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deploy to Vercel

```bash
# Option A — Vercel CLI
npm i -g vercel
vercel

# Option B — GitHub integration
# Push to GitHub, then import at vercel.com/new
# No extra configuration required.
```

The project is deploy-ready with zero additional Vercel configuration.

---

## How to Play

1. Select a **difficulty** and **game mode** on the start screen
2. **You Crack It mode**: pick colors from the bottom palette, fill the slots, then **Submit**
   - 🟡 **Gold peg** = correct color AND correct position (black peg in classic Mastermind)
   - ⬜ **White peg** = correct color but wrong position
   - Crack the code before your guesses run out to win!
3. **AI Cracks It mode**: build your secret code on the setup screen, then press **Next Guess** to advance the AI one step at a time
   - Survive all the AI's guesses without it cracking your code to win!
