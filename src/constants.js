// ─── Layout ───────────────────────────────────────────────────────────────────
const W        = 700;
const H        = 550;
const WATER_Y  = 130;   // y where water surface starts
const FLOOR_Y  = H - 60; // y of the seafloor

// ─── Hook physics ─────────────────────────────────────────────────────────────
const HOOK_FALL_GRAVITY  = 0.25;  // downward acceleration while sinking
const HOOK_REEL_SPEED    = 4.5;   // constant upward speed while reeling (replaces accel model)
const HOOK_REEL_CLICK_VY = -6;    // extra velocity burst on each click

// ─── Tension ──────────────────────────────────────────────────────────────────
const TENSION_MAX       = 100;
const TENSION_PER_CLICK = 12;
const TENSION_DECAY     = 0.5;   // tension lost per frame automatically

// ─── Fish ─────────────────────────────────────────────────────────────────────
const FISH_ATTRACT_RADIUS    = 120;  // px — fish start swimming to hook within this range
const FISH_ATTRACT_TIMER_MIN = 60;   // frames before giving up (min)
const FISH_ATTRACT_TIMER_MAX = 180;  // frames before giving up (max)
const FISH_MIN_ON_SCREEN     = 4;    // respawn when fewer than this many fish exist
const FISH_BITE_RADIUS       = 20;   // px — how close before "bite" triggers

// ─── Rarity spawn weights (must sum to 100) ───────────────────────────────────
const RARITY_WEIGHTS = {
  common:    40,
  uncommon:  30,
  rare:      20,
  legendary: 10,
};

// ─── Fish catalogue ───────────────────────────────────────────────────────────
const FISH_TYPES = [
  { sprite: 'fish_blue',       value: 10,  speed: 1.2, size: 1.0, name: 'Blue Fish',   rarity: 'common'    },
  { sprite: 'fish_green',      value: 15,  speed: 1.5, size: 1.0, name: 'Green Fish',  rarity: 'common'    },
  { sprite: 'fish_brown',      value: 20,  speed: 1.0, size: 1.1, name: 'Brown Fish',  rarity: 'common'    },
  { sprite: 'fish_grey',       value: 25,  speed: 1.8, size: 0.9, name: 'Grey Fish',   rarity: 'uncommon'  },
  { sprite: 'fish_orange',     value: 35,  speed: 2.0, size: 1.0, name: 'Orange Fish', rarity: 'uncommon'  },
  { sprite: 'fish_pink',       value: 50,  speed: 2.5, size: 0.9, name: 'Pink Fish',   rarity: 'rare'      },
  { sprite: 'fish_red',        value: 75,  speed: 3.0, size: 1.0, name: 'Red Fish',    rarity: 'rare'      },
  { sprite: 'fish_grey_long_a',value: 100, speed: 1.0, size: 1.3, name: 'Giant Fish',  rarity: 'legendary' },
];
