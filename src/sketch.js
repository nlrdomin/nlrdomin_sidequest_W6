// ─── Game state ───────────────────────────────────────────────────────────────
let sheet;
let hook        = { x: W / 2, y: WATER_Y - 20, vy: 0, state: 'idle' };
let lineX       = W / 2;
let fishOnHook  = null;   // fish type currently hooked
let fishWiggle  = 0;
let tension     = 0;
let score       = 0;
let catchCount  = 0;
let escapeCount = 0;
let waveOffset  = 0;
let clouds      = [];
let gameState   = 'splash';   // 'splash' | 'playing'

// ─── p5 instance ─────────────────────────────────────────────────────────────
new p5(function (p) {

  p.preload = function () {
    sheet = p.loadImage('assets/spritesheet/spritesheet.png');
    preloadSounds();   // fire-and-forget fetch, no p5.sound needed
  };

  p.setup = function () {
    const canvas = p.createCanvas(W, H);
    canvas.parent('game-container');
    p.imageMode(p.CORNER);
    p.textFont('Courier New');

    initDecorations(p);
    spawnFishSchool(p);
    initSplash(p);

    for (let i = 0; i < 5; i++) {
      clouds.push({
        x:     p.random(W),
        y:     p.random(20, 80),
        speed: p.random(0.2, 0.5),
        w:     p.random(60, 120),
      });
    }
  };

  // ── Main loop ──────────────────────────────────────────────────────────────
  p.draw = function () {
    if (gameState === 'splash') {
      waveOffset += 0.02;
      drawWorld(p);
      drawSplash(p, sheet, p.mouseX, p.mouseY);
    } else {
      waveOffset += 0.02;
      updateHookPhysics(p);
      drawWorld(p);
    }
  };

  // ── Input ──────────────────────────────────────────────────────────────────
  p.mousePressed = function () {
    if (gameState === 'splash') {
      // Check if click landed on the Play button (same bounds as drawSplash)
      const btnX = W / 2 - 80, btnY = 408, btnW = 160, btnH = 42;
      if (p.mouseX > btnX && p.mouseX < btnX + btnW &&
          p.mouseY > btnY && p.mouseY < btnY + btnH) {
        initSound();          // MUST be called directly inside a user gesture
        gameState = 'playing';
      }
      return;
    }
    if (p.mouseX < 0 || p.mouseX > W || p.mouseY < 0 || p.mouseY > H) return;

    if (hook.state === 'idle') {
      // Cast
      lineX   = p.constrain(p.mouseX, 80, W - 80);
      hook.x  = lineX;
      hook.y  = WATER_Y - 20;
      hook.vy = 3;
      hook.state = 'falling';
      fishOnHook = null;
      tension    = 0;
      playCast();
      for (let b = 0; b < 3; b++) addBubble(p, hook.x + p.random(-10, 10), WATER_Y + 10);

    } else if (hook.state === 'waiting') {
      // Reel in with nothing
      hook.state = 'reeling';
      hook.vy    = -HOOK_REEL_SPEED;
      fishOnHook = null;

    } else if (hook.state === 'reeling') {
      // Tug
      tension += TENSION_PER_CLICK;
      if (tension >= TENSION_MAX) {
        showMessage('💥 Line snapped!', 90);
        fishOnHook = null;
        resetHook();
        for (let b = 0; b < 8; b++) addBubble(p, hook.x + p.random(-30, 30), hook.y + p.random(-20, 20));
        return;
      }
      hook.vy = HOOK_REEL_CLICK_VY;
    }
  };
});

// ─── Hook physics (called each frame) ────────────────────────────────────────
function updateHookPhysics(p) {
  if (hook.state === 'falling') {
    hook.y  += hook.vy;
    hook.vy += HOOK_FALL_GRAVITY;
    if (hook.y >= FLOOR_Y - 20) {
      hook.y     = FLOOR_Y - 20;
      hook.vy    = 0;
      hook.state = 'waiting';
      addBubble(p, hook.x, hook.y);
    }

  } else if (hook.state === 'reeling') {
    // Constant upward pull + any click burst bleeds off each frame
    hook.vy  = p.min(hook.vy + 0.4, -HOOK_REEL_SPEED); // bleed click burst back to cruise speed
    hook.y  += hook.vy;
    tension  = p.max(0, tension - TENSION_DECAY);

    if (hook.y < WATER_Y - 10) {
      if (fishOnHook) {
        score      += fishOnHook.value;
        catchCount++;
        const emoji = { common:'🐟', uncommon:'🐠', rare:'🐡', legendary:'🏆' }[fishOnHook.rarity];
        showMessage(`${emoji} Caught ${fishOnHook.name}! +${fishOnHook.value}`, 120);
        addCatchEffect(hook.x, hook.y, `+${fishOnHook.value}!`, true);
        for (let b = 0; b < 10; b++) addBubble(p, hook.x + p.random(-40, 40), WATER_Y + p.random(0, 20));
        if (fish.length < 5) spawnFish(p);
      }
      fishOnHook = null;
      resetHook();
    }
  }
}

function resetHook() {
  hook.state = 'idle';
  hook.y     = WATER_Y - 20;
  hook.vy    = 0;
  tension    = 0;
}

// ─── World rendering ──────────────────────────────────────────────────────────
function drawWorld(p) {
  drawBackground(p);
  drawBgDecorations(p, sheet);
  updateBubbles(p, sheet);
  updateFish(p, sheet, hook,
    () => { escapeCount++; showMessage('Fish got away...', 60); },
    (type) => {
      fishOnHook = type;
      hook.state = 'reeling';
      hook.vy    = -HOOK_REEL_SPEED;
      tension    = 0;
      showMessage('🎣 Fish on the line!', 90);
      addCatchEffect(hook.x, hook.y, 'BITE!');
      for (let b = 0; b < 5; b++) addBubble(p, hook.x + p.random(-20, 20), hook.y + p.random(-10, 10));
    }
  );
  drawFgDecorations(p, sheet);
  drawRod(p);
  drawLineAndHook(p);
  updateCatchEffects(p);
  drawHUD(p, hook, tension, score, catchCount, escapeCount);
  drawMessage(p);
}

// ─── Background (sky, water, floor, clouds, waves) ───────────────────────────
function drawBackground(p) {
  // Sky
  const skyGrad = p.drawingContext.createLinearGradient(0, 0, 0, WATER_Y);
  skyGrad.addColorStop(0, '#4a90d9');
  skyGrad.addColorStop(1, '#87ceeb');
  p.drawingContext.fillStyle = skyGrad;
  p.noStroke();
  p.rect(0, 0, W, WATER_Y);

  // Clouds
  p.noStroke();
  for (const c of clouds) {
    c.x += c.speed;
    if (c.x > W + 80) c.x = -80;
    p.fill(255, 255, 255, 180);
    p.ellipse(c.x, c.y, c.w, 28);
    p.fill(255, 255, 255, 160);
    p.ellipse(c.x - c.w * 0.25, c.y + 6, c.w * 0.65, 20);
    p.ellipse(c.x + c.w * 0.30, c.y + 4, c.w * 0.55, 22);
  }

  // Water body
  const waterGrad = p.drawingContext.createLinearGradient(0, WATER_Y, 0, H);
  waterGrad.addColorStop(0,   '#1e7eb5');
  waterGrad.addColorStop(0.5, '#0e5580');
  waterGrad.addColorStop(1,   '#06243d');
  p.drawingContext.fillStyle = waterGrad;
  p.rect(0, WATER_Y, W, H - WATER_Y);

  // Light rays
  for (let i = 0; i < 5; i++) {
    const rx = ((i * 170 + waveOffset * 25) % (W + 100)) - 50;
    const a  = 8 + 5 * p.sin(waveOffset * 1.3 + i * 1.2);
    p.stroke(200, 230, 255, a);
    p.strokeWeight(30);
    p.line(rx, WATER_Y, rx + 80, FLOOR_Y);
  }
  p.noStroke();

  // Seafloor
  p.fill(110, 80, 30);
  p.rect(0, FLOOR_Y - 8, W, H - FLOOR_Y + 8);
  p.fill(130, 100, 50, 100);
  for (let sx = 20; sx < W; sx += 40) p.ellipse(sx, FLOOR_Y - 4, 35, 10);

  // Wave shimmer
  p.fill(150, 210, 255, 50);
  p.beginShape();
  p.vertex(0, WATER_Y);
  for (let wx = 0; wx <= W; wx += 8) {
    const wy = WATER_Y
      + 3 * p.sin(wx * 0.04 + waveOffset * 2)
      + 2 * p.sin(wx * 0.09 - waveOffset * 1.5);
    p.vertex(wx, wy);
  }
  p.vertex(W, WATER_Y);
  p.endShape(p.CLOSE);
}

// ─── Rod ─────────────────────────────────────────────────────────────────────
function drawRod(p) {
  // Dock post
  p.fill(139, 90, 43);
  p.noStroke();
  p.rect(lineX - 30, 0, 60, WATER_Y - 10, 5);
  p.fill(160, 110, 60);
  p.rect(lineX - 35, WATER_Y - 30, 70, 20, 3);

  // Rod shaft
  const tipX  = lineX + 60;
  const bendY = hook.state !== 'idle' ? p.map(tension, 0, TENSION_MAX, -5, -30) : -5;
  p.stroke(120, 70, 30);
  p.strokeWeight(5);
  p.line(lineX, WATER_Y - 10, tipX, bendY + 20);
  p.strokeWeight(3);
  p.line(tipX, bendY + 20, tipX + 10, bendY);

  // Tip ring
  p.fill(200, 180, 100);
  p.noStroke();
  p.ellipse(tipX + 10, bendY, 8, 8);
  p.fill(150, 120, 60);
  p.ellipse(tipX + 10, bendY, 4, 4);
}

// ─── Line + hook ─────────────────────────────────────────────────────────────
function drawLineAndHook(p) {
  const tipX = lineX + 70;
  const tipY = 20;

  if (hook.state === 'idle') {
    p.stroke(200, 200, 200, 150);
    p.strokeWeight(1);
    p.line(tipX, tipY, lineX, WATER_Y - 20);
    return;
  }

  // Catenary line
  p.stroke(220, 220, 220, 200);
  p.strokeWeight(1.5);
  p.noFill();
  p.beginShape();
  for (let i = 0; i <= 20; i++) {
    const t   = i / 20;
    const lx  = p.lerp(tipX, hook.x, t);
    const sag = p.sin(t * p.PI) * (hook.state === 'reeling' ? 5 : 15);
    const ly  = p.lerp(tipY, hook.y, t) + sag;
    p.curveVertex(lx, ly);
  }
  p.endShape();

  // Hook shape
  p.noFill();
  p.stroke(200, 200, 200);
  p.strokeWeight(2);
  p.arc(hook.x, hook.y + 8, 14, 14, 0, p.PI + 0.5);
  p.line(hook.x, hook.y, hook.x, hook.y + 8);
  p.line(hook.x + 7, hook.y + 8, hook.x + 3, hook.y + 4);

  // Hooked fish wiggling as it's reeled up
  if (fishOnHook && hook.state === 'reeling') {
    fishWiggle += 0.3;
    const wag = p.sin(fishWiggle) * 10;
    drawSprite(p, sheet, fishOnHook.sprite,
      hook.x + wag, hook.y - 20,
      48 * fishOnHook.size, 48 * fishOnHook.size,
      fishOnHook.dir < 0
    );
  }

  // Idle bubbles while waiting
  if (hook.state === 'waiting' && p.frameCount % 60 < 3) {
    addBubble(p, hook.x + p.random(-10, 10), hook.y);
  }
}
