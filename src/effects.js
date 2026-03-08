// ─── Bubbles ──────────────────────────────────────────────────────────────────
let bubbles = [];

function addBubble(p, x, y) {
  bubbles.push({
    x,
    y,
    speed:  p.random(0.5, 1.5),
    size:   p.random(6, 16),
    alpha:  200,
    t:      p.random(p.TWO_PI),
    sprite: p.random(BUBBLE_SPRITES),
  });
}

function updateBubbles(p, sheet) {
  for (let i = bubbles.length - 1; i >= 0; i--) {
    const b = bubbles[i];
    b.y     -= b.speed;
    b.x     += p.sin(b.t) * 0.5;
    b.t     += 0.1;
    b.alpha -= 3;

    if (b.alpha <= 0 || b.y < WATER_Y) {
      bubbles.splice(i, 1);
      continue;
    }

    p.tint(255, b.alpha);
    const s = SPRITES[b.sprite];
    p.image(sheet, b.x - b.size / 2, b.y - b.size / 2, b.size, b.size, s.x, s.y, s.w, s.h);
    p.noTint();
  }
}

// ─── Floating score / text effects ───────────────────────────────────────────
let catchEffects = [];

function addCatchEffect(x, y, text, golden = false) {
  catchEffects.push({ x, y, text, golden, life: 80, vy: -2 });
}

function updateCatchEffects(p) {
  for (let i = catchEffects.length - 1; i >= 0; i--) {
    const e = catchEffects[i];
    e.y   += e.vy;
    e.life--;
    if (e.life <= 0) { catchEffects.splice(i, 1); continue; }

    const a = p.map(e.life, 0, 80, 0, 255);
    p.textAlign(p.CENTER);
    p.textSize(18);
    p.stroke(0, a);
    p.strokeWeight(2);
    p.fill(e.golden ? p.color(255, 220, 50, a) : p.color(255, 255, 255, a));
    p.text(e.text, e.x, e.y);
    p.noStroke();
  }
}
