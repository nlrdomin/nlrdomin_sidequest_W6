// ─── HUD ─────────────────────────────────────────────────────────────────────
function drawHUD(p, hook, tension, score, catchCount, escapeCount) {
  // Panel background
  p.fill(0, 0, 0, 160);
  p.noStroke();
  p.rect(8, 8, 200, 90, 8);

  p.fill(255);
  p.noStroke();
  p.textAlign(p.LEFT);
  p.textSize(14);
  p.text('🐟 Score: '    + score,       18, 28);
  p.text('✅ Caught: '   + catchCount,   18, 46);
  p.text('💨 Escaped: '  + escapeCount,  18, 64);

  const stateLabel = {
    idle:    'Cast your line!',
    falling: '...',
    waiting: 'Waiting for a bite...',
    reeling: 'Reel it in! (click)',
  }[hook.state] ?? '';

  p.textSize(11);
  p.fill(180, 220, 255);
  p.text(stateLabel, 18, 82);

  // Tension bar (only while reeling)
  if (hook.state === 'reeling') {
    p.fill(0, 0, 0, 160);
    p.rect(8, 105, 200, 24, 6);

    const tensionColor = p.lerpColor(
      p.color(0, 255, 100),
      p.color(255, 50, 50),
      tension / TENSION_MAX
    );
    p.fill(tensionColor);
    p.rect(12, 109, p.map(tension, 0, TENSION_MAX, 0, 190), 15, 4);

    p.fill(255);
    p.textSize(10);
    p.text('LINE TENSION', 18, 120);
  }

  // Bottom-right hint
  p.fill(255, 255, 255, 80);
  p.textAlign(p.RIGHT);
  p.textSize(11);
  p.text('Click to cast / reel', W - 10, H - 10);
}

// ─── Transient message overlay ────────────────────────────────────────────────
let msgText  = '';
let msgTimer = 0;

function showMessage(text, frames = 120) {
  msgText  = text;
  msgTimer = frames;
}

function drawMessage(p) {
  if (msgTimer <= 0) return;
  msgTimer--;
  const a = p.min(255, msgTimer * 4);
  p.textAlign(p.CENTER);
  p.textSize(20);
  p.stroke(0, a);
  p.strokeWeight(3);
  p.fill(255, 255, 100, a);
  p.text(msgText, W / 2, H / 2 - 20);
  p.noStroke();
}
