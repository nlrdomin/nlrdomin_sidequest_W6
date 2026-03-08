// ─── Fish state ───────────────────────────────────────────────────────────────
let fish = [];

// ─── Rarity helper ────────────────────────────────────────────────────────────
function chooseFishType(p) {
  const r = p.random(100);
  const { common, uncommon, rare } = RARITY_WEIGHTS;
  if (r < common)                    return p.random(FISH_TYPES.filter(f => f.rarity === 'common'));
  if (r < common + uncommon)         return p.random(FISH_TYPES.filter(f => f.rarity === 'uncommon'));
  if (r < common + uncommon + rare)  return p.random(FISH_TYPES.filter(f => f.rarity === 'rare'));
  return p.random(FISH_TYPES.filter(f => f.rarity === 'legendary'));
}

// ─── Spawn a single fish ──────────────────────────────────────────────────────
function spawnFish(p) {
  const type = chooseFishType(p);
  const dir  = p.random() > 0.5 ? 1 : -1;
  fish.push({
    type,
    x:            dir > 0 ? -80 : W + 80,
    y:            p.random(WATER_Y + 40, FLOOR_Y - 50),
    dir,
    speed:        type.speed * (0.7 + p.random(0.6)),
    wobble:       p.random(p.TWO_PI),
    wobbleSpeed:  p.random(0.03, 0.08),
    wobbleAmt:    p.random(3, 10),
    scale:        type.size * (0.9 + p.random(0.2)),
    attracted:    false,
    attractTimer: 0,
  });
}

function spawnFishSchool(p) {
  fish = [];
  const count = p.floor(p.random(6, 12));
  for (let i = 0; i < count; i++) spawnFish(p);
}

// ─── Update + draw all fish ───────────────────────────────────────────────────
// Returns a fish type if one just bit the hook, otherwise null.
function updateFish(p, sheet, hook, onEscape, onBite) {
  if (fish.length < FISH_MIN_ON_SCREEN) spawnFish(p);

  for (let i = fish.length - 1; i >= 0; i--) {
    const f = fish[i];
    f.wobble += f.wobbleSpeed;

    // ── Attraction logic ──────────────────────────────────────────────────────
    if (hook.state === 'waiting') {
      const dist = p.dist(f.x, f.y, hook.x, hook.y);
      if (dist < FISH_ATTRACT_RADIUS && !f.attracted) {
        f.attracted    = true;
        f.attractTimer = p.floor(p.random(FISH_ATTRACT_TIMER_MIN, FISH_ATTRACT_TIMER_MAX));
      }
    } else {
      f.attracted = false;
    }

    if (f.attracted && f.attractTimer > 0) {
      f.attractTimer--;
      const angle = p.atan2(hook.y - f.y, hook.x - f.x);
      f.x += p.cos(angle) * f.speed * 0.7;
      f.y += p.sin(angle) * f.speed * 0.7;
      f.dir = hook.x > f.x ? 1 : -1;

      const dist = p.dist(f.x, f.y, hook.x, hook.y);
      if (dist < FISH_BITE_RADIUS && hook.state === 'waiting') {
        fish.splice(i, 1);
        onBite(f.type);
        continue;
      }
      if (f.attractTimer <= 0) {
        f.attracted = false;
        onEscape();
      }
    } else {
      // ── Normal patrol ───────────────────────────────────────────────────────
      f.x += f.dir * f.speed;
      f.y += p.sin(f.wobble) * f.wobbleAmt * 0.1;
      f.y = p.constrain(f.y, WATER_Y + 30, FLOOR_Y - 30);

      if ((f.dir > 0 && f.x > W + 80) || (f.dir < 0 && f.x < -80)) {
        fish.splice(i, 1);
        continue;
      }
    }

    // ── Draw ─────────────────────────────────────────────────────────────────
    const sw  = 48 * f.scale;
    const sh  = 48 * f.scale;
    const wy  = p.sin(f.wobble) * 2;

    // Rarity glow
    if (f.type.rarity === 'legendary') {
      p.noFill();
      p.stroke(255, 215, 0, 60 + 40 * p.sin(p.frameCount * 0.1));
      p.strokeWeight(8);
      p.ellipse(f.x, f.y + wy, sw + 16, sh + 16);
      p.noStroke();
    } else if (f.type.rarity === 'rare') {
      p.noFill();
      p.stroke(180, 100, 255, 50 + 30 * p.sin(p.frameCount * 0.08));
      p.strokeWeight(5);
      p.ellipse(f.x, f.y + wy, sw + 10, sh + 10);
      p.noStroke();
    }

    drawSprite(p, sheet, f.type.sprite, f.x, f.y + wy, sw, sh, f.dir < 0);
  }
}
