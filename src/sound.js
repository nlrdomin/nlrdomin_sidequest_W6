// ─── Sound ────────────────────────────────────────────────────────────────────
// Uses the plain Web Audio API — no p5.sound required.

let audioCtx    = null;
let bufMusic    = null;
let bufWhoosh   = null;
let bufBonus    = null;
let musicSource = null;
let soundReady  = false;

// ── Fetch + decode a single file into an AudioBuffer ─────────────────────────
async function loadBuffer(url) {
  console.log(`[Sound] Fetching: ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const data = await res.arrayBuffer();
  console.log(`[Sound] Decoding: ${url} (${data.byteLength} bytes)`);
  const buf = await audioCtx.decodeAudioData(data);
  console.log(`[Sound] Ready: ${url} — duration ${buf.duration.toFixed(1)}s`);
  return buf;
}

// ── Holds the promise so initSound can await it if buffers aren't ready yet ───
let buffersPromise = null;

// ── Load all three files ──────────────────────────────────────────────────────
function preloadSounds() {
  console.log('[Sound] Creating AudioContext...');
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  console.log(`[Sound] AudioContext state: ${audioCtx.state}`);

  buffersPromise = Promise.all([
    loadBuffer('assets/sfx/mindmist-fishing-on-the-lake-310740.mp3'),
    loadBuffer('assets/sfx/spinopel-fishing-rod-whoosh-411640.mp3'),
    loadBuffer('assets/sfx/universfield-game-bonus-144751.mp3'),
  ]).then(([music, whoosh, bonus]) => {
    bufMusic  = music;
    bufWhoosh = whoosh;
    bufBonus  = bonus;
    console.log('[Sound] All buffers loaded ✓');
  }).catch(err => {
    console.error('[Sound] Load failed:', err);
  });
}

// ── Play a buffer ─────────────────────────────────────────────────────────────
function playBuffer(buffer, volume = 1.0, loop = false) {
  if (!audioCtx) { console.warn('[Sound] playBuffer: no audioCtx'); return null; }
  if (!buffer)   { console.warn('[Sound] playBuffer: buffer is null'); return null; }
  console.log(`[Sound] Playing buffer — ctx state: ${audioCtx.state}, loop: ${loop}, vol: ${volume}`);

  const gain = audioCtx.createGain();
  gain.gain.value = volume;
  gain.connect(audioCtx.destination);

  const src = audioCtx.createBufferSource();
  src.buffer = buffer;
  src.loop   = loop;
  src.connect(gain);
  src.start(0);
  return src;
}

// ── Called on Play button click ───────────────────────────────────────────────
// Awaits buffersPromise so it works even if files are still loading.
async function initSound() {
  if (soundReady) return;
  soundReady = true;
  console.log(`[Sound] initSound called — ctx state before resume: ${audioCtx.state}`);

  // Resume must be called synchronously inside the user gesture handler
  await audioCtx.resume();
  console.log(`[Sound] AudioContext resumed — state: ${audioCtx.state}`);

  // Now wait for any still-in-flight buffer loads
  await buffersPromise;
  console.log(`[Sound] Buffers ready? music=${!!bufMusic} whoosh=${!!bufWhoosh} bonus=${!!bufBonus}`);

  musicSource = playBuffer(bufMusic, 0.35, true);
  playBuffer(bufBonus, 0.7);
}

// ── Cast whoosh ───────────────────────────────────────────────────────────────
function playCast() {
  if (!soundReady) { console.warn('[Sound] playCast: soundReady=false'); return; }
  playBuffer(bufWhoosh, 0.6);
}

function stopMusic() {
  if (musicSource) { musicSource.stop(); musicSource = null; }
}
