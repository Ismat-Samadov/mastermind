'use client';

/**
 * Game — the top-level game orchestrator.
 * Wires together state (useGame), timer, sound, high score, and keyboard input,
 * then renders the appropriate screen (menu → setup → playing → paused / end).
 */

import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import { useGame } from '@/hooks/useGame';
import { useSound } from '@/hooks/useSound';
import { useHighScore } from '@/hooks/useHighScore';
import { useTimer } from '@/hooks/useTimer';
import { useKeyboard } from '@/hooks/useKeyboard';

import { DIFFICULTY_CONFIGS } from '@/lib/constants';
import { isGuessComplete } from '@/lib/gameLogic';

import Header from './Header';
import Board from './Board';
import ColorPicker from './ColorPicker';
import DifficultyModal from './DifficultyModal';
import EndScreen from './EndScreen';
import PauseScreen from './PauseScreen';
import SetupCode from './SetupCode';
import AiBreaker from './AiBreaker';

export default function Game() {
  const {
    state,
    startGame,
    confirmPlayerCode,
    selectColor,
    setPlayerCodePeg,
    placePeg,
    removePeg,
    submitGuess,
    stepAiGuess,
    pauseGame,
    resumeGame,
    setTimeElapsed,
    setActiveSlot,
    resetToMenu,
  } = useGame();

  const { soundEnabled, musicEnabled, toggleSound, toggleMusic } = useSound();
  const { highScore, updateHighScore } = useHighScore();

  const timerRunning = state.status === 'playing';
  const { time, reset: resetTimer } = useTimer(timerRunning);

  const cfg = DIFFICULTY_CONFIGS[state.difficulty];

  // Sync elapsed time into game state (used for score calculation)
  useEffect(() => {
    setTimeElapsed(time);
  }, [time, setTimeElapsed]);

  // Persist a new high score on win
  useEffect(() => {
    if (state.status === 'won' && state.score > 0) {
      updateHighScore(state.score);
    }
  }, [state.status, state.score, updateHighScore]);

  // Reset timer whenever a fresh game starts
  useEffect(() => {
    const fresh = state.guesses.length === 0 && state.aiGuesses.length === 0;
    if (state.status === 'playing' && fresh) resetTimer();
  }, [state.status, state.guesses.length, state.aiGuesses.length, resetTimer]);

  // ── Interaction helpers ──────────────────────────────────────────────────

  /** Click on a slot: remove its peg if filled, otherwise place the selected color */
  const handleSlotClick = (i: number) => {
    setActiveSlot(i);
    if (state.currentGuess[i] !== null) {
      removePeg(i);
    } else {
      placePeg(i);
    }
  };

  const handleSubmit = () => {
    if (isGuessComplete(state.currentGuess, cfg.codeLength)) submitGuess();
  };

  /** Remove the rightmost filled peg */
  const handleClear = () => {
    for (let i = cfg.codeLength - 1; i >= 0; i--) {
      if (state.currentGuess[i] !== null) {
        removePeg(i);
        return;
      }
    }
  };

  // Keyboard shortcuts
  useKeyboard({
    status: state.status,
    currentGuess: state.currentGuess,
    difficulty: state.difficulty,
    onSelectColor: selectColor,
    onPlacePeg: () => placePeg(),
    onRemovePeg: removePeg,
    onSubmit: handleSubmit,
    onPause: pauseGame,
    onResume: resumeGame,
  });

  const canSubmit =
    state.mode === 'player-breaks' && isGuessComplete(state.currentGuess, cfg.codeLength);

  const isNewHighScore =
    state.status === 'won' && state.score > 0 && state.score >= highScore;

  const guessCount =
    state.mode === 'ai-breaks' ? state.aiGuesses.length : state.guesses.length;

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen h-screen bg-[#050010] text-white flex flex-col overflow-hidden relative">
      {/* Dark neon background gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 15% 15%, rgba(0,255,255,0.07) 0%, transparent 55%), ' +
            'radial-gradient(ellipse at 85% 85%, rgba(191,90,242,0.07) 0%, transparent 55%)',
        }}
      />
      {/* Subtle grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,255,255,0.4) 1px, transparent 1px), ' +
            'linear-gradient(90deg, rgba(0,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* ── Main content ── */}
      {state.status === 'menu' ? (
        <DifficultyModal onStart={startGame} highScore={highScore} />
      ) : state.status === 'setup' ? (
        <>
          <Header
            score={0}
            highScore={highScore}
            guessCount={0}
            maxGuesses={cfg.maxGuesses}
            time={0}
            status={state.status}
            soundEnabled={soundEnabled}
            musicEnabled={musicEnabled}
            onToggleSound={toggleSound}
            onToggleMusic={toggleMusic}
            onPause={pauseGame}
            onMenu={resetToMenu}
          />
          <SetupCode
            playerCode={state.playerCode}
            difficulty={state.difficulty}
            selectedColor={state.selectedColor}
            onSelectColor={selectColor}
            onSetPeg={setPlayerCodePeg}
            onConfirm={confirmPlayerCode}
          />
        </>
      ) : (
        <div className="flex flex-col h-full relative z-10 min-h-0">
          <Header
            score={state.score}
            highScore={highScore}
            guessCount={guessCount}
            maxGuesses={cfg.maxGuesses}
            time={time}
            status={state.status}
            soundEnabled={soundEnabled}
            musicEnabled={musicEnabled}
            onToggleSound={toggleSound}
            onToggleMusic={toggleMusic}
            onPause={pauseGame}
            onMenu={resetToMenu}
          />

          {/* Scrollable game area */}
          <main className="flex-1 overflow-y-auto overscroll-contain p-4 min-h-0">
            <div className="max-w-sm mx-auto">
              {state.mode === 'player-breaks' ? (
                <Board
                  guesses={state.guesses}
                  currentGuess={state.currentGuess}
                  activeSlot={state.activeSlot}
                  selectedColor={state.selectedColor}
                  difficulty={state.difficulty}
                  status={state.status}
                  onSlotClick={handleSlotClick}
                />
              ) : (
                <AiBreaker
                  aiGuesses={state.aiGuesses}
                  playerCode={state.playerCode}
                  difficulty={state.difficulty}
                  status={state.status}
                  onStep={stepAiGuess}
                />
              )}
            </div>
          </main>

          {/* Bottom color picker (player-breaks mode only) */}
          {state.mode === 'player-breaks' &&
            (state.status === 'playing' || state.status === 'paused') && (
              <div className="flex-shrink-0 p-3 sm:p-4 bg-black/65 backdrop-blur-md border-t border-cyan-500/15 z-20">
                <ColorPicker
                  selectedColor={state.selectedColor}
                  difficulty={state.difficulty}
                  onSelectColor={selectColor}
                  onSubmit={handleSubmit}
                  onClear={handleClear}
                  canSubmit={canSubmit}
                />
              </div>
            )}
        </div>
      )}

      {/* ── Overlays ── */}
      <AnimatePresence>
        {state.status === 'paused' && (
          <PauseScreen key="pause" onResume={resumeGame} onMenu={resetToMenu} />
        )}
        {(state.status === 'won' || state.status === 'lost') && (
          <EndScreen
            key="end"
            status={state.status}
            score={state.score}
            highScore={highScore}
            isNewHighScore={isNewHighScore}
            guessCount={guessCount}
            secretCode={state.secretCode}
            mode={state.mode}
            onPlayAgain={() => startGame(state.difficulty, state.mode)}
            onMenu={resetToMenu}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
