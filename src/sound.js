// ─── Sound ────────────────────────────────────────────────────────────────────
// Uses the plain Web Audio API — no p5.sound required.
// Audio context + buffers are created lazily on the first user gesture
// (the Play button click), which is the only way browsers allow audio to start.

let audioCtx    = null;
let bufMusic    = null;
let bufWhoosh   = null;
let bufBonus    = null;
let musicSource = null;   // keep ref so we can stop/restart the loop
let soundReady  = false;

// ── Fetch + decode a single file into an AudioBuffer ─────────────────────────
async function loadBuffer(url) {
  const res  = await fetch(url);
  const data = await res.arrayBuffer();
  return audioCtx.decodeAudioData(data);
}

// ── Kick off all three loads in parallel ─────────────────────────────────────
// Called from sketch.js preload (fire-and-forget; buffers will be ready
// well before the player clicks Play).
function preloadSounds() {
  // Create the context immediately — it starts in 'suspended' state in most
  // browsers until resumed inside a user-gesture handler, which is fine.
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  Promise.all([
    loadBuffer('assets/sfx/mindmist-fishing-on-the-lake-310740.mp3'),
    loadBuffer('assets/sfx/spinopel-fishing-rod-whoosh-411640.mp3'),
    loadBuffer('assets/sfx/universfield-game-bonus-144751.mp3'),
  ]).then(([music, whoosh, bonus]) => {
    bufMusic   = music;
    bufWhoosh  = whoosh;
    bufBonus   = bonus;
  }).catch(err => console.warn('Sound load error:', err));
}

// ── Helper: play a buffer once at a given volume ──────────────────────────────
function playBuffer(buffer, volume = 1.0, loop = false) {
  if (!audioCtx || !buffer) return null;
  const gain   = audioCtx.createGain();
  gain.gain.value = volume;
  gain.connect(audioCtx.destination);

  const src  = audioCtx.createBufferSource();
  src.buffer = buffer;
  src.loop   = loop;
  src.connect(gain);
  src.start(0);
  return src;   // caller can call .stop() on this
}

// ── Called once when the player clicks Play ───────────────────────────────────
// Browsers require audioCtx.resume() inside a user-gesture handler.
function initSound() {
  if (soundReady) return;
  soundReady = true;

  audioCtx.resume().then(() => {
    // Looping background music
    musicSource = playBuffer(bufMusic, 0.35, true);
    // One-shot welcome jingle
    playBuffer(bufBonus, 0.7);
  });
}

// ── Cast whoosh — stops any previous instance so overlapping clicks are clean ─
function playCast() {
  if (!soundReady) return;
  playBuffer(bufWhoosh, 0.6);
}

function stopMusic() {
  if (musicSource) { musicSource.stop(); musicSource = null; }
}
