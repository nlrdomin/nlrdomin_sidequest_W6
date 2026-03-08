// ─── Decoration state ─────────────────────────────────────────────────────────
let decorations = [];

function initDecorations(p) {
  decorations = [];

  // Foreground seaweed
  const seaweedSprites = [
    'seaweed_green_a', 'seaweed_green_b', 'seaweed_green_c',
    'seaweed_pink_a', 'seaweed_orange_a',
  ];
  for (let i = 0; i < 12; i++) {
    decorations.push({
      type:        'seaweed',
      sprite:      p.random(seaweedSprites),
      x:           p.random(30, W - 30),
      y:           FLOOR_Y - 20,
      scale:       p.random(0.7, 1.2),
      wobble:      p.random(p.TWO_PI),
      wobbleSpeed: p.random(0.02, 0.05),
    });
  }

  // Rocks
  for (let i = 0; i < 5; i++) {
    decorations.push({
      type:   'rock',
      sprite: p.random(['rock_a', 'rock_b']),
      x:      p.random(40, W - 40),
      y:      FLOOR_Y + 15,
      scale:  p.random(0.8, 1.4),
    });
  }

  // Background seaweed (dim, mid-water)
  for (let i = 0; i < 8; i++) {
    decorations.push({
      type:        'bg_seaweed',
      sprite:      p.random(['bg_seaweed_a', 'bg_seaweed_b']),
      x:           p.random(20, W - 20),
      y:           p.random(WATER_Y + 60, FLOOR_Y - 30),
      scale:       0.6,
      wobble:      p.random(p.TWO_PI),
      wobbleSpeed: p.random(0.01, 0.03),
    });
  }
}

// ─── Draw background decorations (call before fish) ──────────────────────────
function drawBgDecorations(p, sheet) {
  for (const d of decorations) {
    if (d.type !== 'bg_seaweed') continue;
    d.wobble += d.wobbleSpeed;
    p.tint(255, 80);
    drawSprite(p, sheet, d.sprite, d.x + p.sin(d.wobble) * 4, d.y, 44 * d.scale, 44 * d.scale);
    p.noTint();
  }
}

// ─── Draw foreground decorations (call after fish) ───────────────────────────
function drawFgDecorations(p, sheet) {
  for (const d of decorations) {
    if (d.type === 'bg_seaweed') continue;
    if (d.type === 'seaweed') {
      d.wobble += d.wobbleSpeed;
      drawSprite(p, sheet, d.sprite, d.x + p.sin(d.wobble) * 5, d.y, 52 * d.scale, 52 * d.scale);
    } else {
      drawSprite(p, sheet, d.sprite, d.x, d.y, 56 * d.scale, 56 * d.scale);
    }
  }
}
