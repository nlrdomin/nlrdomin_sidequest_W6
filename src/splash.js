// ─── Splash screen ────────────────────────────────────────────────────────────
// Drawn on top of the canvas each frame while gameState === 'splash'.
// Clicking the "PLAY" button transitions to 'playing' and starts audio.

let splashWave   = 0;       // used for animated water strip
let splashBobble = 0;       // title float animation
let splashFish   = [];      // decorative swimming fish on the splash

function initSplash(p) {
  splashFish = [];
  for (let i = 0; i < 6; i++) {
    const dir = i % 2 === 0 ? 1 : -1;
    splashFish.push({
      x:      dir > 0 ? p.random(-200, -40) : p.random(W + 40, W + 200),
      y:      p.random(310, 430),
      dir,
      speed:  p.random(0.8, 1.8),
      wobble: p.random(p.TWO_PI),
      type:   p.random(FISH_TYPES),
      scale:  p.random(0.9, 1.3),
    });
  }
}

// Returns true if the play button was just clicked
function drawSplash(p, sheet, mx, my, clicked) {
  splashWave   += 0.025;
  splashBobble += 0.04;

  // ── Sky gradient ────────────────────────────────────────────────────────────
  const sky = p.drawingContext.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0,    '#0d2b6b');
  sky.addColorStop(0.45, '#1e6fa8');
  sky.addColorStop(0.55, '#2a9fd6');
  sky.addColorStop(1,    '#06243d');
  p.drawingContext.fillStyle = sky;
  p.noStroke();
  p.rect(0, 0, W, H);

  // ── Stars ───────────────────────────────────────────────────────────────────
  p.noStroke();
  for (let s = 0; s < 60; s++) {
    // deterministic positions via seeded math
    const sx = ((s * 137.5) % W);
    const sy = ((s * 73.1)  % 200);
    const a  = 120 + 80 * Math.sin(splashWave * 0.7 + s);
    p.fill(255, 255, 255, a);
    p.ellipse(sx, sy, 2, 2);
  }

  // ── Animated water strip (bottom half) ──────────────────────────────────────
  const waterGrad = p.drawingContext.createLinearGradient(0, 270, 0, H);
  waterGrad.addColorStop(0,   '#1e7eb5');
  waterGrad.addColorStop(0.5, '#0e5580');
  waterGrad.addColorStop(1,   '#06243d');
  p.drawingContext.fillStyle = waterGrad;

  p.beginShape();
  p.vertex(0, 280);
  for (let wx = 0; wx <= W; wx += 8) {
    const wy = 280
      + 5 * Math.sin(wx * 0.03 + splashWave * 2)
      + 3 * Math.sin(wx * 0.07 - splashWave * 1.5);
    p.vertex(wx, wy);
  }
  p.vertex(W, H);
  p.vertex(0, H);
  p.endShape(p.CLOSE);

  // ── Light rays underwater ───────────────────────────────────────────────────
  for (let i = 0; i < 4; i++) {
    const rx = ((i * 200 + splashWave * 20) % (W + 80)) - 40;
    const a  = 6 + 4 * Math.sin(splashWave + i * 1.5);
    p.stroke(200, 230, 255, a);
    p.strokeWeight(28);
    p.line(rx, 280, rx + 70, H);
  }
  p.noStroke();

  // ── Seafloor ────────────────────────────────────────────────────────────────
  p.fill(110, 80, 30);
  p.rect(0, H - 52, W, 52);
  p.fill(130, 100, 50, 80);
  for (let sx = 20; sx < W; sx += 40) p.ellipse(sx, H - 48, 35, 10);

  // ── Decorative fish swimming behind panel ───────────────────────────────────
  for (const f of splashFish) {
    f.x      += f.dir * f.speed;
    f.wobble += 0.05;
    const wy  = f.y + Math.sin(f.wobble) * 4;
    if (f.dir > 0 && f.x > W + 100) f.x = -80;
    if (f.dir < 0 && f.x < -100)    f.x = W + 80;
    const sz = 44 * f.scale;
    drawSprite(p, sheet, f.type.sprite, f.x, wy, sz, sz, f.dir < 0);
  }

  // ── Panel ───────────────────────────────────────────────────────────────────
  // Drop shadow
  p.fill(0, 0, 0, 60);
  p.rect(W / 2 - 248, 28, 500, 390, 18);

  // Panel body
  const panelGrad = p.drawingContext.createLinearGradient(0, 30, 0, 420);
  panelGrad.addColorStop(0, 'rgba(8,28,68,0.93)');
  panelGrad.addColorStop(1, 'rgba(4,16,44,0.97)');
  p.drawingContext.fillStyle = panelGrad;
  p.rect(W / 2 - 245, 30, 490, 385, 16);

  // Panel border
  p.noFill();
  p.stroke(74, 158, 255, 180);
  p.strokeWeight(2);
  p.rect(W / 2 - 245, 30, 490, 385, 16);
  p.noStroke();

  // ── Title ───────────────────────────────────────────────────────────────────
  const bob = Math.sin(splashBobble) * 4;

  // Glow
  p.drawingContext.shadowColor = 'rgba(74,158,255,0.7)';
  p.drawingContext.shadowBlur  = 20;
  p.textAlign(p.CENTER);
  p.textSize(52);
  p.fill(74, 200, 255);
  p.text('🎣', W / 2, 88 + bob);

  p.drawingContext.shadowBlur = 14;
  p.textSize(38);
  p.fill(255, 255, 255);
  p.text('FISHING GAME', W / 2, 135 + bob);

  p.textSize(13);
  p.fill(140, 200, 255);
  p.text('by Kenney Fish Pack', W / 2, 158 + bob);
  p.drawingContext.shadowBlur = 0;

  // ── Divider ─────────────────────────────────────────────────────────────────
  p.stroke(74, 158, 255, 80);
  p.strokeWeight(1);
  p.line(W / 2 - 190, 172, W / 2 + 190, 172);
  p.noStroke();

  // ── Instructions ────────────────────────────────────────────────────────────
  const instructions = [
    { icon: '🖱️',  text: 'Click the water to cast your line'         },
    { icon: '🐟',  text: 'Fish swim toward your hook automatically'   },
    { icon: '🎣',  text: 'Click to reel in once a fish bites'         },
    { icon: '⚠️',  text: 'Watch the tension bar — don\'t let it snap!' },
    { icon: '🏆',  text: 'Rare fish glow gold & score big points'     },
  ];

  p.textAlign(p.LEFT);
  instructions.forEach((ins, i) => {
    const iy = 200 + i * 34;
    p.textSize(18);
    p.fill(255, 255, 255, 220);
    p.text(ins.icon, W / 2 - 190, iy);
    p.textSize(13);
    p.fill(180, 220, 255, 220);
    p.text(ins.text, W / 2 - 158, iy);
  });

  // ── Rarity legend ───────────────────────────────────────────────────────────
  p.stroke(74, 158, 255, 50);
  p.strokeWeight(1);
  p.line(W / 2 - 190, 374, W / 2 + 190, 374);
  p.noStroke();

  const rarities = [
    { label: 'Common',    col: [180, 220, 255] },
    { label: 'Uncommon',  col: [100, 255, 160] },
    { label: 'Rare',      col: [200, 100, 255] },
    { label: 'Legendary', col: [255, 215,   0] },
  ];
  p.textAlign(p.CENTER);
  p.textSize(11);
  rarities.forEach((r, i) => {
    const rx = W / 2 - 165 + i * 110;
    p.fill(...r.col, 200);
    p.ellipse(rx - 14, 388, 8, 8);
    p.fill(...r.col);
    p.text(r.label, rx, 392);
  });

  // ── Play button ─────────────────────────────────────────────────────────────
  const btnX = W / 2 - 80;
  const btnY = 408;
  const btnW = 160;
  const btnH = 42;
  const hovered = mx > btnX && mx < btnX + btnW && my > btnY && my < btnY + btnH;

  // Button glow when hovered
  if (hovered) {
    p.drawingContext.shadowColor = 'rgba(74,200,255,0.6)';
    p.drawingContext.shadowBlur  = 18;
  }

  const btnGrad = p.drawingContext.createLinearGradient(0, btnY, 0, btnY + btnH);
  btnGrad.addColorStop(0, hovered ? '#3ab8ff' : '#2a8fd6');
  btnGrad.addColorStop(1, hovered ? '#1a7fcc' : '#0d5a9e');
  p.drawingContext.fillStyle = btnGrad;
  p.rect(btnX, btnY, btnW, btnH, 10);

  p.drawingContext.shadowBlur = 0;
  p.noFill();
  p.stroke(hovered ? 180 : 100, 220, 255, 200);
  p.strokeWeight(1.5);
  p.rect(btnX, btnY, btnW, btnH, 10);
  p.noStroke();

  p.textAlign(p.CENTER);
  p.textSize(18);
  p.fill(255);
  p.text('▶  PLAY', W / 2, btnY + 27);

  // Return true if clicked inside button
  return clicked && hovered;
}
