// src/SoundManager.js
// Audio playback (SYSTEM layer) — Ocean Game Edition.
//
// Responsibilities:
// - Load sound assets during preload() (via loadSound)
// - Play sounds by key (SFX/music)
// - Loop background music
// - Provide a simple abstraction so gameplay code never touches audio directly
//
// Sound folder layout (you drop files here):
//   assets/sfx/attack/attack.wav         — player attacks
//   assets/sfx/damage/hurt.wav           — player takes damage
//   assets/sfx/damage/die.wav            — player dies
//   assets/sfx/collect/collect.wav       — collectable picked up
//   assets/sfx/fish_eat/fishEat.wav      — fish enemy eats food
//   assets/sfx/background/music.wav      — looping background track

export class SoundManager {
  constructor() {
    this.sfx = {};
    this.music = null;
    this._musicStarted = false;
  }

  /**
   * Load all game sounds.
   * Called once from main.js boot() after audio context is available.
   * Uses p5.sound's loadSound (available via p5.sound.min.js).
   * If a file is missing the game still runs — sounds are optional.
   */
  loadAll() {
    this._tryLoad("attack",  "assets/sfx/attack/attack.wav");
    this._tryLoad("hurt",    "assets/sfx/damage/hurt.wav");
    this._tryLoad("die",     "assets/sfx/damage/die.wav");
    this._tryLoad("collect", "assets/sfx/collect/collect.wav");
    this._tryLoad("fishEat", "assets/sfx/fish_eat/fishEat.wav");
    this._tryLoadMusic("assets/sfx/background/music.wav");
  }

  /** Load a single named SFX. */
  _tryLoad(name, path) {
    try {
      this.sfx[name] = loadSound(path);
    } catch (e) {
      console.warn(`[SoundManager] Could not load "${name}" from ${path}:`, e);
    }
  }

  /** Load the looping background track separately. */
  _tryLoadMusic(path) {
    try {
      this.music = loadSound(path, () => {
        if (this.music) {
          this.music.setLoop(true);
        }
      });
    } catch (e) {
      console.warn(`[SoundManager] Could not load background music from ${path}:`, e);
    }
  }

  /** Play a one-shot sound effect by name. */
  play(name) {
    const s = this.sfx[name];
    if (s && s.isLoaded()) {
      s.play();
    }
  }

  /**
   * Start the looping background music.
   * Safe to call multiple times — only starts once.
   * Must be called after a user gesture (browser autoplay policy).
   */
  startMusic() {
    if (this._musicStarted) return;
    if (this.music && this.music.isLoaded()) {
      this.music.setLoop(true);
      this.music.play();
      this._musicStarted = true;
    }
  }

  /** Stop background music (e.g. on game over). */
  stopMusic() {
    if (this.music && this.music.isPlaying()) {
      this.music.stop();
      this._musicStarted = false;
    }
  }

  /** Pause/resume music (e.g. on win screen). */
  pauseMusic() {
    if (this.music && this.music.isPlaying()) this.music.pause();
  }

  resumeMusic() {
    if (this.music && !this.music.isPlaying() && this._musicStarted) this.music.play();
  }
}