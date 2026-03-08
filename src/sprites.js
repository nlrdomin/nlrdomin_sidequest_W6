// ─── Sprite atlas (from spritesheet.xml) ─────────────────────────────────────
// Each entry maps a name to its {x, y, w, h} region in assets/spritesheet/spritesheet.png

const SPRITES = {
  fish_blue:         { x: 576, y: 128, w: 64, h: 64 },
  fish_brown:        { x: 512, y: 640, w: 64, h: 64 },
  fish_green:        { x: 512, y: 512, w: 64, h: 64 },
  fish_grey:         { x: 512, y: 256, w: 64, h: 64 },
  fish_orange:       { x: 448, y: 640, w: 64, h: 64 },
  fish_pink:         { x: 448, y: 384, w: 64, h: 64 },
  fish_red:          { x: 448, y: 128, w: 64, h: 64 },
  fish_grey_long_a:  { x: 512, y: 192, w: 64, h: 64 },

  bubble_a:          { x: 576, y: 320, w: 64, h: 64 },
  bubble_b:          { x: 576, y: 256, w: 64, h: 64 },
  bubble_c:          { x: 576, y: 192, w: 64, h: 64 },

  rock_a:            { x: 320, y: 448, w: 64, h: 64 },
  rock_b:            { x: 320, y: 320, w: 64, h: 64 },

  seaweed_green_a:   { x: 256, y: 704, w: 64, h: 64 },
  seaweed_green_b:   { x: 256, y: 576, w: 64, h: 64 },
  seaweed_green_c:   { x: 256, y: 448, w: 64, h: 64 },
  seaweed_pink_a:    { x: 192, y: 704, w: 64, h: 64 },
  seaweed_orange_a:  { x: 256, y: 192, w: 64, h: 64 },

  bg_seaweed_a:      { x: 640, y: 192, w: 64, h: 64 },
  bg_seaweed_b:      { x: 640, y: 128, w: 64, h: 64 },

  bg_terrain:        { x: 576, y: 448, w: 64, h: 64 },
  bg_terrain_top:    { x: 576, y: 384, w: 64, h: 64 },
  bg_rock_a:         { x: 320, y: 128, w: 64, h: 64 },
};

// ─── Bubble sprite names (for random selection) ───────────────────────────────
const BUBBLE_SPRITES = ['bubble_a', 'bubble_b', 'bubble_c'];

/**
 * Draw a sprite from the atlas.
 * @param {p5}     p      - the p5 instance
 * @param {p5.Image} sheet - the loaded spritesheet image
 * @param {string} name   - key in SPRITES
 * @param {number} x      - centre x
 * @param {number} y      - centre y
 * @param {number} w      - draw width
 * @param {number} h      - draw height
 * @param {boolean} flipX - mirror horizontally
 */
function drawSprite(p, sheet, name, x, y, w, h, flipX = false) {
  const s = SPRITES[name];
  if (!s) return;
  p.push();
  p.translate(x, y);
  if (flipX) p.scale(-1, 1);
  p.image(sheet, -w / 2, -h / 2, w, h, s.x, s.y, s.w, s.h);
  p.pop();
}
