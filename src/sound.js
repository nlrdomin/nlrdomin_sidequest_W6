// ─── Sound ────────────────────────────────────────────────────────────────────
// All audio is managed here via the Web Audio API through p5.sound.
// p5.sound is loaded separately in index.html.

let sndMusic   = null;  // looping background track
let sndWhoosh  = null;  // reel cast whoosh
let sndBonus   = null;  // splash screen jingle
let soundReady = false;

function preloadSounds(p) {
  sndMusic  = p.loadSound('downloads/mindmist-fishing-on-the-lake-310740.mp3');
  sndWhoosh = p.loadSound('downloads/spinopel-fishing-rod-whoosh-411640.mp3');
  sndBonus  = p.loadSound('downloads/universfield-game-bonus-144751.mp3');
}

// Call once after the splash "Play" click — browsers require a user gesture
// before any audio can start.
function initSound() {
  if (soundReady) return;
  soundReady = true;

  if (sndMusic) {
    sndMusic.setVolume(0.35);
    sndMusic.loop();
  }
  if (sndBonus) {
    sndBonus.setVolume(0.7);
    sndBonus.play();
  }
}

function playCast() {
  if (!soundReady || !sndWhoosh) return;
  sndWhoosh.stop();
  sndWhoosh.setVolume(0.6);
  sndWhoosh.play();
}

function stopMusic() {
  if (sndMusic && sndMusic.isPlaying()) sndMusic.stop();
}
