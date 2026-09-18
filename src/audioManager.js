/**
 * AudioManager — Global Singleton
 * 
 * Reutiliza um único AudioContext para todo o app.
 * Evita lag, travamentos e o limite de ~6 AudioContexts simultâneos do Chrome.
 */

let _ctx = null;
let _initialized = false;

function getContext() {
  if (_ctx && _ctx.state !== 'closed') return _ctx;
  
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    _ctx = new AC();
  } catch {
    return null;
  }
  return _ctx;
}

/** Must be called from a user gesture (click/touch) to unlock audio */
export function initAudio() {
  if (_initialized) return;
  const ctx = getContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }
  _initialized = true;
}

/** Resume if suspended (e.g. after tab switch) */
function ensureRunning() {
  const ctx = getContext();
  if (!ctx) return null;
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

/**
 * Play a synthesized tone. All params are optional with sane defaults.
 * @param {Object} opts
 * @param {'sine'|'square'|'triangle'|'sawtooth'} opts.type - Oscillator waveform
 * @param {number} opts.freq - Starting frequency in Hz
 * @param {number} opts.freqEnd - End frequency (ramp)
 * @param {number} opts.duration - Duration in seconds
 * @param {number} opts.volume - Peak gain (0–1)
 * @param {number} opts.delay - Delay before start in seconds
 * @param {'linear'|'exponential'} opts.ramp - Frequency ramp type
 */
export function playTone({
  type = 'sine',
  freq = 440,
  freqEnd = null,
  duration = 0.15,
  volume = 0.1,
  delay = 0,
  ramp = 'linear',
} = {}) {
  const ctx = ensureRunning();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const t = ctx.currentTime + delay;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);

    if (freqEnd !== null) {
      if (ramp === 'exponential') {
        osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 1), t + duration);
      } else {
        osc.frequency.linearRampToValueAtTime(freqEnd, t + duration);
      }
    }

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.005); // Tiny attack to avoid click
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.start(t);
    osc.stop(t + duration + 0.01);
  } catch {
    // Silently fail — audio is non-critical
  }
}

/**
 * Play multiple tones at once (chord/arpeggio).
 * @param {Array<Object>} tones - Array of playTone option objects
 */
export function playChord(tones) {
  tones.forEach(t => playTone(t));
}

// ─── Preset sound library ───────────────────────────────────────────

export function playSuccess() {
  playTone({ type: 'sine', freq: 800, freqEnd: 1200, duration: 0.15, volume: 0.15 });
  playTone({ type: 'sine', freq: 1200, freqEnd: 1600, duration: 0.2, volume: 0.1, delay: 0.1 });
}

export function playFail() {
  playTone({ type: 'sawtooth', freq: 150, freqEnd: 50, duration: 0.3, volume: 0.15 });
}

export function playTick() {
  playTone({ type: 'triangle', freq: 600, duration: 0.04, volume: 0.04 });
}

export function playSellSound() {
  playTone({ type: 'square', freq: 300, freqEnd: 800, duration: 0.1, volume: 0.08, ramp: 'linear' });
}

export function playWinSmall() {
  playTone({ type: 'sine', freq: 800, freqEnd: 1200, duration: 0.2, volume: 0.2, ramp: 'linear' });
}

export function playWinBig() {
  playTone({ type: 'square', freq: 600, duration: 0.15, volume: 0.15 });
  playTone({ type: 'square', freq: 800, duration: 0.15, volume: 0.15, delay: 0.1 });
  playTone({ type: 'square', freq: 1000, duration: 0.15, volume: 0.15, delay: 0.2 });
  playTone({ type: 'square', freq: 1200, duration: 0.3, volume: 0.15, delay: 0.3 });
}

export function playLose() {
  playTone({ type: 'sawtooth', freq: 200, freqEnd: 100, duration: 0.5, volume: 0.08, ramp: 'linear' });
}

export function playCrash() {
  playTone({ type: 'sawtooth', freq: 100, freqEnd: 30, duration: 0.5, volume: 0.2, ramp: 'linear' });
}

export function playCashout() {
  playTone({ type: 'square', freq: 800, freqEnd: 1200, duration: 0.2, volume: 0.12, ramp: 'linear' });
}

export function playCrashTick(multiplier = 1) {
  playTone({ type: 'sine', freq: 400 + (multiplier * 10), duration: 0.08, volume: 0.04 });
}

export function playHover() {
  playTone({ type: 'sine', freq: 800, duration: 0.04, volume: 0.015 });
}

export function playClick() {
  playTone({ type: 'triangle', freq: 1200, freqEnd: 200, duration: 0.1, volume: 0.04, ramp: 'exponential' });
}

export function playNotificationPop() {
  playTone({ type: 'triangle', freq: 700, duration: 0.05, volume: 0.05 });
  playTone({ type: 'triangle', freq: 1100, duration: 0.1, volume: 0.05, delay: 0.06 });
}

// Farm sounds
export function playFarmSpin() {
  playTone({ type: 'square', freq: 400, freqEnd: 800, duration: 0.1, volume: 0.08, ramp: 'exponential' });
}

export function playFarmStop() {
  playTone({ type: 'triangle', freq: 600, freqEnd: 300, duration: 0.1, volume: 0.12, ramp: 'exponential' });
}

export function playFarmHold() {
  playTone({ type: 'sine', freq: 500, duration: 0.1, volume: 0.12 });
}

/** Tick da roleta — click mecânico curto e crocante */
export function playRouletteTickCS() {
  const ctx = ensureRunning();
  if (!ctx) return;
  try {
    const t = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.012;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 8);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3500;
    filter.Q.value = 2;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(t);
    noise.stop(t + 0.03);

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2800, t);
    osc.frequency.exponentialRampToValueAtTime(1800, t + 0.02);
    oscGain.gain.setValueAtTime(0.08, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.035);
  } catch {}
}

/** Som de início do spin — swoosh ascendente */
export function playRouletteStart() {
  playTone({ type: 'sine', freq: 200, freqEnd: 900, duration: 0.4, volume: 0.12, ramp: 'exponential' });
  playTone({ type: 'triangle', freq: 150, freqEnd: 600, duration: 0.3, volume: 0.06, delay: 0.05, ramp: 'exponential' });
}

/** Som de revelação do resultado (chime suave) */
export function playRouletteReveal() {
  playTone({ type: 'sine', freq: 1047, duration: 0.25, volume: 0.1 });
  playTone({ type: 'sine', freq: 1568, duration: 0.2, volume: 0.05, delay: 0.08 });
}

/** Som de aceitar/guardar item */
export function playAcceptCS() {
  playTone({ type: 'sine', freq: 600, freqEnd: 900, duration: 0.12, volume: 0.1 });
  playTone({ type: 'sine', freq: 900, freqEnd: 1200, duration: 0.15, volume: 0.08, delay: 0.08 });
}

export function playCSWinSynth(rarity) {
  const ctx = ensureRunning();
  if (!ctx) return;

  switch (rarity) {
    case 'milspec':
      // Blue - Simple positive chime
      playTone({ type: 'sine', freq: 440, freqEnd: 880, duration: 0.15, volume: 0.1, ramp: 'exponential' });
      playTone({ type: 'triangle', freq: 880, duration: 0.4, volume: 0.08, delay: 0.1 });
      playTone({ type: 'sine', freq: 1320, duration: 0.3, volume: 0.05, delay: 0.15 });
      break;

    case 'restricted':
      // Purple - Nice major chord arpeggio
      playTone({ type: 'triangle', freq: 523.25, duration: 0.3, volume: 0.08 }); // C5
      playTone({ type: 'triangle', freq: 659.25, duration: 0.3, volume: 0.08, delay: 0.1 }); // E5
      playTone({ type: 'sine', freq: 783.99, duration: 0.6, volume: 0.1, delay: 0.2 }); // G5
      playTone({ type: 'sine', freq: 1046.50, duration: 0.5, volume: 0.06, delay: 0.25 }); // C6
      break;

    case 'classified':
      // Pink - Epic ascending chord with bass
      playTone({ type: 'square', freq: 261.63, duration: 0.6, volume: 0.06 }); // C4 bass
      playTone({ type: 'triangle', freq: 523.25, duration: 0.2, volume: 0.1 }); // C5
      playTone({ type: 'triangle', freq: 659.25, duration: 0.2, volume: 0.1, delay: 0.1 }); // E5
      playTone({ type: 'triangle', freq: 783.99, duration: 0.2, volume: 0.1, delay: 0.2 }); // G5
      playTone({ type: 'sine', freq: 1046.50, duration: 0.8, volume: 0.12, delay: 0.3 }); // C6
      playTone({ type: 'sine', freq: 1567.98, duration: 0.6, volume: 0.08, delay: 0.35 }); // G6
      playTone({ type: 'sine', freq: 2093.00, duration: 0.5, volume: 0.04, delay: 0.4 }); // C7 sparkle
      break;

    case 'covert':
      // Red - Massive triumphant blast
      playTone({ type: 'sawtooth', freq: 130.81, duration: 1.0, volume: 0.15, ramp: 'exponential' }); // Sub bass
      playTone({ type: 'sawtooth', freq: 261.63, duration: 0.8, volume: 0.08, delay: 0.1 }); // C4
      playTone({ type: 'sawtooth', freq: 329.63, duration: 0.8, volume: 0.08, delay: 0.1 }); // E4
      playTone({ type: 'sawtooth', freq: 392.00, duration: 0.8, volume: 0.08, delay: 0.1 }); // G4
      // Main melody stab
      playTone({ type: 'square', freq: 523.25, duration: 0.15, volume: 0.1, delay: 0.1 });
      playTone({ type: 'square', freq: 783.99, duration: 0.15, volume: 0.1, delay: 0.25 });
      playTone({ type: 'sine', freq: 1046.50, duration: 1.2, volume: 0.15, delay: 0.4 }); // High C hold
      playTone({ type: 'sine', freq: 1318.51, duration: 1.0, volume: 0.1, delay: 0.45 }); // High E hold
      playTone({ type: 'triangle', freq: 2093.00, duration: 0.8, volume: 0.05, delay: 0.5 }); // Sparkle
      break;

    case 'gold':
      // Gold - Mythical, evolving, godly chime
      // Deep bass rumble
      playTone({ type: 'sine', freq: 65.41, freqEnd: 130.81, duration: 2.5, volume: 0.18, ramp: 'linear' }); 
      // Majestic chord build-up
      playTone({ type: 'sawtooth', freq: 261.63, duration: 2.0, volume: 0.06, delay: 0.1 });
      playTone({ type: 'sawtooth', freq: 329.63, duration: 2.0, volume: 0.06, delay: 0.2 });
      playTone({ type: 'sawtooth', freq: 392.00, duration: 2.0, volume: 0.06, delay: 0.3 });
      playTone({ type: 'sawtooth', freq: 523.25, duration: 2.0, volume: 0.08, delay: 0.4 });
      
      // Angelic arpeggio
      playTone({ type: 'sine', freq: 1046.50, duration: 0.4, volume: 0.08, delay: 0.4 });
      playTone({ type: 'sine', freq: 1318.51, duration: 0.4, volume: 0.08, delay: 0.55 });
      playTone({ type: 'sine', freq: 1567.98, duration: 0.4, volume: 0.08, delay: 0.7 });
      
      // Godly peak
      playTone({ type: 'sine', freq: 2093.00, duration: 1.5, volume: 0.12, delay: 0.85 }); // C7
      playTone({ type: 'sine', freq: 2637.02, duration: 1.2, volume: 0.08, delay: 0.95 }); // E7
      playTone({ type: 'triangle', freq: 3135.96, duration: 1.0, volume: 0.04, delay: 1.05 }); // G7
      playTone({ type: 'triangle', freq: 4186.01, duration: 0.8, volume: 0.02, delay: 1.15 }); // C8 Air
      break;
  }
}

/** Upgrade WIN — Triumphant ascending fanfare with shimmer */
export function playUpgradeWin() {
  const ctx = ensureRunning();
  if (!ctx) return;
  
  // Bass impact
  playTone({ type: 'sine', freq: 130, duration: 0.8, volume: 0.15 });
  
  // Rising chord (C-E-G-C)
  playTone({ type: 'triangle', freq: 523, duration: 0.2, volume: 0.12 });
  playTone({ type: 'triangle', freq: 659, duration: 0.2, volume: 0.12, delay: 0.08 });
  playTone({ type: 'triangle', freq: 784, duration: 0.2, volume: 0.12, delay: 0.16 });
  playTone({ type: 'sine', freq: 1047, duration: 0.6, volume: 0.15, delay: 0.24 });
  
  // High shimmer
  playTone({ type: 'sine', freq: 1568, duration: 0.5, volume: 0.08, delay: 0.3 });
  playTone({ type: 'sine', freq: 2093, duration: 0.4, volume: 0.05, delay: 0.4 });
  
  // Sparkle tail
  playTone({ type: 'triangle', freq: 3136, duration: 0.3, volume: 0.03, delay: 0.5 });
  playTone({ type: 'triangle', freq: 4186, duration: 0.2, volume: 0.02, delay: 0.6 });
}

/** Upgrade FAIL — Descending buzz with sad resolution */
export function playUpgradeFail() {
  const ctx = ensureRunning();
  if (!ctx) return;
  
  // Descending buzz
  playTone({ type: 'sawtooth', freq: 300, freqEnd: 80, duration: 0.5, volume: 0.12, ramp: 'exponential' });
  
  // Low thud
  playTone({ type: 'sine', freq: 80, freqEnd: 40, duration: 0.4, volume: 0.18, delay: 0.1, ramp: 'linear' });
  
  // Minor chord (sad)
  playTone({ type: 'triangle', freq: 220, duration: 0.6, volume: 0.06, delay: 0.3 });
  playTone({ type: 'triangle', freq: 262, duration: 0.6, volume: 0.06, delay: 0.35 }); // Minor third
}

/** Upgrade roulette tick — satisfying mechanical click with slight pitch variation */
export function playUpgradeTick(progress = 0) {
  const ctx = ensureRunning();
  if (!ctx) return;
  try {
    const t = ctx.currentTime;
    // Pitch increases slightly as spin progresses for tension
    const basePitch = 2500 + (progress * 1500);
    const bufferSize = Math.floor(ctx.sampleRate * 0.015);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 12);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = basePitch;
    filter.Q.value = 3;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(t);
    noise.stop(t + 0.025);

    // Crisp tonal click
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(basePitch, t);
    osc.frequency.exponentialRampToValueAtTime(basePitch * 0.6, t + 0.015);
    oscGain.gain.setValueAtTime(0.12, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.03);
  } catch {}
}

export function playEasterEggSplashSound() {
  const ctx = ensureRunning();
  if (!ctx) return;

  try {
    const t = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51, 1567.98];
    notes.forEach((freq, idx) => {
      playTone({
        type: 'triangle',
        freq: freq,
        freqEnd: freq * 1.25,
        duration: 0.25,
        volume: 0.18,
        delay: idx * 0.04,
        ramp: 'exponential'
      });
    });

    playTone({
      type: 'sine',
      freq: 600,
      freqEnd: 2800,
      duration: 0.7,
      volume: 0.25,
      delay: 0.1,
      ramp: 'exponential'
    });

    playTone({
      type: 'sine',
      freq: 130,
      freqEnd: 35,
      duration: 0.6,
      volume: 0.35,
      delay: 0.02,
      ramp: 'linear'
    });
  } catch {}
}

// Auto-init on first user gesture
if (typeof window !== 'undefined') {
  const autoInit = () => {
    initAudio();
    window.removeEventListener('click', autoInit);
    window.removeEventListener('touchstart', autoInit);
    window.removeEventListener('keydown', autoInit);
  };
  window.addEventListener('click', autoInit, { once: true });
  window.addEventListener('touchstart', autoInit, { once: true });
  window.addEventListener('keydown', autoInit, { once: true });
}
