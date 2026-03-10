/**
 * SoundManager — generates all sounds procedurally via the Web Audio API.
 * No external audio files are required, so the game deploys with zero assets.
 */
class SoundManager {
  private ctx: AudioContext | null = null;
  private enabled = true;
  private musicPlaying = false;
  private musicTimeout: ReturnType<typeof setTimeout> | null = null;

  private getCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      try {
        this.ctx = new AudioContext();
      } catch {
        return null;
      }
    }
    // Resume if suspended (browsers require a user gesture first)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /** Play a single oscillator tone */
  private tone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume = 0.25,
    delay = 0
  ) {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.01);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + delay + duration);

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration + 0.02);
    } catch {
      // Silently ignore any Web Audio API errors
    }
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    if (!on) this.stopMusic();
  }

  isEnabled() {
    return this.enabled;
  }

  // ── Game sounds ────────────────────────────────────────────────────────────

  placePeg() {
    this.tone(500, 0.08, 'sine', 0.2);
  }

  removePeg() {
    this.tone(330, 0.07, 'sine', 0.15);
  }

  selectColor() {
    this.tone(520, 0.05, 'sine', 0.12);
  }

  click() {
    this.tone(380, 0.05, 'square', 0.1);
  }

  submitGuess() {
    this.tone(550, 0.09, 'square', 0.2);
    this.tone(700, 0.09, 'square', 0.2, 0.1);
  }

  win() {
    [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.3, 'sine', 0.4, i * 0.14));
  }

  lose() {
    [440, 392, 349, 294].forEach((f, i) => this.tone(f, 0.3, 'sawtooth', 0.3, i * 0.14));
  }

  // ── Ambient background music ───────────────────────────────────────────────

  startMusic() {
    if (!this.enabled || this.musicPlaying) return;
    this.musicPlaying = true;
    this.scheduleLoop();
  }

  stopMusic() {
    this.musicPlaying = false;
    if (this.musicTimeout !== null) {
      clearTimeout(this.musicTimeout);
      this.musicTimeout = null;
    }
  }

  private scheduleLoop() {
    if (!this.musicPlaying || !this.enabled) return;
    const ctx = this.getCtx();
    if (!ctx) return;

    // Simple arpeggio over a Cm–Bb–B–Cm progression
    const chords = [
      [130.81, 164.81, 196.0], // Cm
      [116.54, 146.83, 174.61], // Bbm
      [123.47, 155.56, 185.0], // Bm
      [130.81, 164.81, 196.0], // Cm
    ];

    const noteDur = 0.45;
    const chordDur = 2.0;

    chords.forEach((chord, ci) => {
      chord.forEach((freq, ni) => {
        for (let beat = 0; beat < 4; beat++) {
          try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filt = ctx.createBiquadFilter();
            filt.type = 'lowpass';
            filt.frequency.value = 900;

            osc.connect(filt);
            filt.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'triangle';
            osc.frequency.value = freq * (beat % 2 === 0 ? 1 : 2);

            const t = ctx.currentTime + ci * chordDur + beat * noteDur + ni * 0.04;
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.025, t + 0.05);
            gain.gain.linearRampToValueAtTime(0, t + noteDur * 0.85);

            osc.start(t);
            osc.stop(t + noteDur);
          } catch {
            // ignore
          }
        }
      });
    });

    const loopMs = chords.length * chordDur * 1000;
    this.musicTimeout = setTimeout(() => this.scheduleLoop(), loopMs - 80);
  }
}

export const soundManager = new SoundManager();
