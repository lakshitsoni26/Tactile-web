"use client";

// Procedural Web Audio API Synthesizer (Zero external audio assets)
// Delivers zero-latency, realistic mechanical keyboard clicks, spatial panning,
// heavy bistable killswitch, rotary detents, and pentatonic celebration chime.

let audioCtx: AudioContext | null = null;
const SOUND_STORAGE_KEY = "tactile_sound_enabled";
const soundListeners = new Set<(enabled: boolean) => void>();

// Safe AudioContext getter with user-gesture resumption
function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioCtxClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// User-gesture listener to unlock audio on first interaction
if (typeof window !== "undefined") {
  const unlockAudio = () => {
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
    window.removeEventListener("pointerdown", unlockAudio);
    window.removeEventListener("keydown", unlockAudio);
  };
  window.addEventListener("pointerdown", unlockAudio, { once: true, passive: true });
  window.addEventListener("keydown", unlockAudio, { once: true, passive: true });
}

export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const val = localStorage.getItem(SOUND_STORAGE_KEY);
    return val === "true";
  } catch {
    return false;
  }
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SOUND_STORAGE_KEY, enabled ? "true" : "false");
    soundListeners.forEach((listener) => {
      try {
        listener(enabled);
      } catch (err) {
        console.error("Sound listener error:", err);
      }
    });
    window.dispatchEvent(new CustomEvent("tactile_sound_toggled", { detail: enabled }));
    if (enabled) {
      getAudioContext();
      playKillswitch(false);
    }
  } catch (e) {
    console.error("Failed to update sound settings", e);
  }
}

export function toggleSound(): boolean {
  const next = !isSoundEnabled();
  setSoundEnabled(next);
  return next;
}

export function subscribeSound(listener: (enabled: boolean) => void): () => void {
  soundListeners.add(listener);
  return () => {
    soundListeners.delete(listener);
  };
}

// Helper to create stereo panner node with bounds clamping [-1, 1]
function createPanner(ctx: AudioContext, pan = 0): StereoPannerNode | GainNode {
  const clampedPan = Math.max(-1, Math.min(1, pan));
  if (typeof ctx.createStereoPanner === "function") {
    const panner = ctx.createStereoPanner();
    panner.pan.setValueAtTime(clampedPan, ctx.currentTime);
    return panner;
  }
  return ctx.createGain();
}

/**
 * 1. Cherry MX Dual-Transient Mechanical Switch Click
 * Layer 1: High-frequency click leaf snap (3800Hz -> 1400Hz in 6ms)
 * Layer 2: Low-frequency bottom-out thud (160Hz -> 50Hz in 28ms)
 * ±12% pitch variance for acoustic realism
 */
export function playKeyClick(volumeMultiplier = 1.0, pan = 0) {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const panner = createPanner(ctx, pan);

  // Pitch variation range [0.94, 1.06] (12% spread)
  const pitchVar = 0.94 + Math.random() * 0.12;

  // Layer 1: High-Frequency Leaf Snap (3800Hz -> 1400Hz in 6ms)
  const oscSnap = ctx.createOscillator();
  const gainSnap = ctx.createGain();
  const filterSnap = ctx.createBiquadFilter();

  oscSnap.type = "sine";
  oscSnap.frequency.setValueAtTime(3800 * pitchVar, now);
  oscSnap.frequency.exponentialRampToValueAtTime(1400 * pitchVar, now + 0.006);

  filterSnap.type = "bandpass";
  filterSnap.frequency.setValueAtTime(3200, now);
  filterSnap.Q.setValueAtTime(4.2, now);

  gainSnap.gain.setValueAtTime(0.001, now);
  gainSnap.gain.linearRampToValueAtTime(0.22 * volumeMultiplier, now + 0.002);
  gainSnap.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);

  oscSnap.connect(filterSnap);
  filterSnap.connect(gainSnap);
  gainSnap.connect(panner);

  // Layer 2: Low-Frequency Bottom-Out Thud (160Hz -> 50Hz in 28ms)
  const oscThud = ctx.createOscillator();
  const gainThud = ctx.createGain();

  oscThud.type = "triangle";
  oscThud.frequency.setValueAtTime(160 * pitchVar, now);
  oscThud.frequency.exponentialRampToValueAtTime(50, now + 0.028);

  gainThud.gain.setValueAtTime(0.001, now);
  gainThud.gain.linearRampToValueAtTime(0.18 * volumeMultiplier, now + 0.003);
  gainThud.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

  oscThud.connect(gainThud);
  gainThud.connect(panner);

  panner.connect(ctx.destination);

  oscSnap.start(now);
  oscSnap.stop(now + 0.025);
  oscThud.start(now);
  oscThud.stop(now + 0.038);
}

/**
 * Spatial stereo panned key click driven by mouse clientX
 */
export function playSpatialKeyClick(e?: React.MouseEvent | MouseEvent, volume = 1.0) {
  let pan = 0;
  if (e && typeof window !== "undefined" && window.innerWidth > 0) {
    pan = Math.max(-1, Math.min(1, (e.clientX / window.innerWidth) * 2 - 1));
  }
  playKeyClick(volume, pan);
}

/**
 * 2. Heavy Bistable Killswitch Toggle
 * Unmute: Snappy rising chirp (180Hz -> 540Hz) with crisp latch
 * Mute: Heavy falling thud (480Hz -> 75Hz) with mechanical reverberant decay
 */
export function playKillswitch(isMuted = false) {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "triangle";
  if (isMuted) {
    // Mute thud: 480Hz -> 75Hz in 70ms
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(75, now + 0.07);
  } else {
    // Unmute chirp: 180Hz -> 540Hz in 70ms
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.07);
  }

  gain.gain.setValueAtTime(0.01, now);
  gain.gain.linearRampToValueAtTime(0.25, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.09);
}

// Alias for backwards compatibility with existing UI components
export function playSwitchClick(isMuted = false) {
  playKillswitch(isMuted);
}

/**
 * 3. High-Tech 2-Way Frequency Sweep (Clipboard beam)
 */
export function playBeamChime() {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(440, now);
  osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
  osc.frequency.exponentialRampToValueAtTime(1320, now + 0.16);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.24);
}

/**
 * 4. Rotary Scroll Detent (Mechanical wheel micro-click)
 * High-pitch micro-click: 2600Hz -> 380Hz in 7ms, gain 0.045
 */
export function playScrollDetent() {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(2600, now);
  osc.frequency.exponentialRampToValueAtTime(380, now + 0.007);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.045, now + 0.001);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.009);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.01);
}

/**
 * 5. Ascending 6-Note Pentatonic Chord Arpeggio Chime
 * C5 (523.25Hz), D5 (587.33Hz), E5 (659.25Hz), G5 (783.99Hz), A5 (880.00Hz), C6 (1046.50Hz)
 * Staggered 52ms intervals with stereo pan sweep from -0.6 to +0.6
 */
export function playCelebrationChime() {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5]; // C5, D5, E5, G5, A5, C6
  notes.forEach((freq, idx) => {
    const t = ctx.currentTime + idx * 0.052;
    const panVal = Math.max(-1, Math.min(1, -0.6 + idx * 0.24));
    const panner = createPanner(ctx, panVal);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(freq, t);
    filter.Q.setValueAtTime(5.5, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.14, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(panner);
    panner.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.42);
  });
}

/**
 * 6. Procedural Apple Taptic Engine Trackpad Click
 * Dual-transient: High leaf snap (1800Hz -> 600Hz in 5ms) + Low unibody resonance (120Hz -> 45Hz in 22ms)
 */
export function playTapticClick(pan = 0) {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const panner = createPanner(ctx, pan);

  // Transient 1: Sharp crisp contact (1800Hz -> 600Hz in 5ms)
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = "sine";
  osc1.frequency.setValueAtTime(1800, now);
  osc1.frequency.exponentialRampToValueAtTime(600, now + 0.005);
  gain1.gain.setValueAtTime(0.001, now);
  gain1.gain.linearRampToValueAtTime(0.2, now + 0.001);
  gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);
  osc1.connect(gain1);
  gain1.connect(panner);

  // Transient 2: Low-frequency unibody resonance (120Hz -> 45Hz in 22ms)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = "triangle";
  osc2.frequency.setValueAtTime(120, now);
  osc2.frequency.exponentialRampToValueAtTime(45, now + 0.022);
  gain2.gain.setValueAtTime(0.001, now);
  gain2.gain.linearRampToValueAtTime(0.22, now + 0.002);
  gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.028);
  osc2.connect(gain2);
  gain2.connect(panner);

  panner.connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 0.015);
  osc2.start(now);
  osc2.stop(now + 0.032);
}

/**
 * 7. Procedural AirDrop Ascending Major Third Harmonic Chime
 * A5 (880Hz) followed by C#6 (1108.73Hz) after 90ms
 */
export function playAirDropChime(pan = 0.4) {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const panner = createPanner(ctx, pan);

  // Note 1: A5 (880Hz)
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = "sine";
  osc1.frequency.setValueAtTime(880, now);
  gain1.gain.setValueAtTime(0.001, now);
  gain1.gain.linearRampToValueAtTime(0.18, now + 0.015);
  gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
  osc1.connect(gain1);
  gain1.connect(panner);

  // Note 2: C#6 (1108.73Hz) entering 90ms later
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(1108.73, now + 0.09);
  gain2.gain.setValueAtTime(0.001, now + 0.09);
  gain2.gain.linearRampToValueAtTime(0.22, now + 0.105);
  gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
  osc2.connect(gain2);
  gain2.connect(panner);

  panner.connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 0.25);
  osc2.start(now + 0.09);
  osc2.stop(now + 0.48);
}

/**
 * 8. macOS Window Snap & Focus Elevation Sound
 */
export function playWindowFocus() {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.exponentialRampToValueAtTime(160, now + 0.02);
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.08, now + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.03);
}

export function playWindowSnap() {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(520, now);
  osc.frequency.exponentialRampToValueAtTime(240, now + 0.015);
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.06, now + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.025);
}

