// ─────────────────────────────────────────────
// BUILT-IN BROWSER GAMES
// ─────────────────────────────────────────────
// Each factory returns a controller the <GamePlayer> runner drives:
//   { score, over, reset(), update(dt), draw(ctx), keydown(code), pointer(type, x, y) }
// All coordinates are in a fixed 640x400 logical space; the canvas is scaled by CSS.
// ─────────────────────────────────────────────
export const W = 640;
export const H = 400;

const BG = "#0e141b";
const BLUE = "#66c0f4";
const GREEN = "#a4d007";
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function glowRect(ctx, x, y, w, h, color, blur = 10) {
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
  ctx.shadowBlur = 0;
}

function text(ctx, str, x, y, { size = 14, color = "#c6d4df", align = "left" } = {}) {
  ctx.fillStyle = color;
  ctx.font = `${size}px Arial, sans-serif`;
  ctx.textAlign = align;
  ctx.fillText(str, x, y);
}

// ─── Snake ───────────────────────────────────
export function createSnake() {
  const CELL = 20, COLS = W / CELL, ROWS = H / CELL, STEP = 0.095;
  const g = { score: 0, over: false };
  let snake, dir, nextDir, food, acc, swipe;

  const placeFood = () => {
    do { food = { x: Math.floor(rand(0, COLS)), y: Math.floor(rand(0, ROWS)) }; }
    while (snake.some((s) => s.x === food.x && s.y === food.y));
  };
  const turn = (dx, dy) => { if (dx !== -dir.x || dy !== -dir.y) nextDir = { x: dx, y: dy }; };

  g.reset = () => {
    snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    dir = { x: 1, y: 0 }; nextDir = dir; acc = 0; g.score = 0; g.over = false; swipe = null;
    placeFood();
  };
  g.keydown = (c, down = true) => {
    if (!down) return;
    if (c === "ArrowUp" || c === "KeyW") turn(0, -1);
    else if (c === "ArrowDown" || c === "KeyS") turn(0, 1);
    else if (c === "ArrowLeft" || c === "KeyA") turn(-1, 0);
    else if (c === "ArrowRight" || c === "KeyD") turn(1, 0);
  };
  g.pointer = (type, x, y) => {
    if (type === "down") swipe = { x, y };
    else if (type === "move" && swipe) {
      const dx = x - swipe.x, dy = y - swipe.y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) > 24) {
        if (Math.abs(dx) > Math.abs(dy)) turn(Math.sign(dx), 0); else turn(0, Math.sign(dy));
        swipe = { x, y };
      }
    } else if (type === "up") swipe = null;
  };
  g.update = (dt) => {
    acc += dt;
    while (acc >= STEP && !g.over) {
      acc -= STEP;
      dir = nextDir;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      const hitWall = head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS;
      const hitSelf = snake.some((s) => s.x === head.x && s.y === head.y);
      if (hitWall || hitSelf) { g.over = true; return; }
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) { g.score += 10; placeFood(); } else snake.pop();
    }
  };
  g.draw = (ctx) => {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(102,192,244,.05)";
    for (let x = 0; x <= W; x += CELL) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y <= H; y += CELL) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    glowRect(ctx, food.x * CELL + 3, food.y * CELL + 3, CELL - 6, CELL - 6, "#ff5c5c", 12);
    snake.forEach((s, i) => glowRect(ctx, s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2, i === 0 ? GREEN : "#6f8f0a", i === 0 ? 12 : 0));
  };
  g.reset();
  return g;
}

// ─── Breakout ────────────────────────────────
export function createBreakout() {
  const g = { score: 0, over: false };
  const PW = 96, PH = 12, PY = H - 30, R = 6, COLS = 10, ROWS = 5, BW = 58, BH = 18, GAP = 5;
  const COLORS = ["#ff5c5c", "#ff9f43", "#feca57", GREEN, BLUE];
  let px, ball, bricks, lives, held, launched, level;

  const buildBricks = () => {
    bricks = [];
    const left = (W - (COLS * (BW + GAP) - GAP)) / 2;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++)
      bricks.push({ x: left + c * (BW + GAP), y: 50 + r * (BH + GAP), alive: true, color: COLORS[r] });
  };
  const serve = () => {
    launched = false;
    ball = { x: px, y: PY - R - 1, vx: 0, vy: 0 };
  };
  g.reset = () => { px = W / 2; lives = 3; level = 1; held = {}; g.score = 0; g.over = false; buildBricks(); serve(); };
  const launch = () => {
    if (launched) return;
    launched = true;
    const speed = 270 + level * 20, a = rand(-0.5, 0.5);
    ball.vx = Math.sin(a) * speed; ball.vy = -Math.cos(a) * speed;
  };
  g.keydown = (c, down = true) => {
    held[c] = down;
    if (down && (c === "Space" || c === "ArrowUp")) launch();
  };
  g.pointer = (type, x) => { if (type !== "up") px = clamp(x, PW / 2, W - PW / 2); if (type === "down") launch(); };
  g.update = (dt) => {
    const move = (held.ArrowRight || held.KeyD ? 1 : 0) - (held.ArrowLeft || held.KeyA ? 1 : 0);
    px = clamp(px + move * 420 * dt, PW / 2, W - PW / 2);
    if (!launched) { ball.x = px; return; }
    ball.x += ball.vx * dt; ball.y += ball.vy * dt;
    if (ball.x < R) { ball.x = R; ball.vx = Math.abs(ball.vx); }
    if (ball.x > W - R) { ball.x = W - R; ball.vx = -Math.abs(ball.vx); }
    if (ball.y < R) { ball.y = R; ball.vy = Math.abs(ball.vy); }
    if (ball.vy > 0 && ball.y + R >= PY && ball.y - R <= PY + PH && Math.abs(ball.x - px) <= PW / 2 + R) {
      const off = (ball.x - px) / (PW / 2), speed = Math.hypot(ball.vx, ball.vy) * 1.015;
      ball.vx = off * speed * 0.8; ball.vy = -Math.sqrt(Math.max(speed * speed - ball.vx * ball.vx, 1));
      ball.y = PY - R;
    }
    for (const b of bricks) {
      if (!b.alive) continue;
      if (ball.x + R > b.x && ball.x - R < b.x + BW && ball.y + R > b.y && ball.y - R < b.y + BH) {
        b.alive = false; g.score += 10; ball.vy *= -1; break;
      }
    }
    if (bricks.every((b) => !b.alive)) { level += 1; g.score += 50; buildBricks(); serve(); }
    if (ball.y > H + R) { lives -= 1; if (lives <= 0) g.over = true; else serve(); }
  };
  g.draw = (ctx) => {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
    bricks.forEach((b) => b.alive && glowRect(ctx, b.x, b.y, BW, BH, b.color, 6));
    glowRect(ctx, px - PW / 2, PY, PW, PH, BLUE, 12);
    ctx.shadowColor = "#fff"; ctx.shadowBlur = 12; ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(ball.x, ball.y, R, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    text(ctx, `Lives ${"♥".repeat(Math.max(lives, 0))}`, 12, 24, { color: "#ff7b7b" });
    text(ctx, `Level ${level}`, W - 12, 24, { align: "right" });
    if (!launched) text(ctx, "Click or press Space to launch", W / 2, H / 2 + 40, { align: "center", size: 16 });
  };
  g.reset();
  return g;
}

// ─── Pong ────────────────────────────────────
export function createPong() {
  const g = { score: 0, over: false };
  const PW = 12, PH = 76, MARGIN = 20, MAX_MISSES = 5;
  let py, ay, ball, held, misses, flash;

  const serve = (dirX) => {
    const a = rand(-0.5, 0.5);
    ball = { x: W / 2, y: H / 2, vx: dirX * 280 * Math.cos(a), vy: 280 * Math.sin(a) };
  };
  g.reset = () => { py = H / 2; ay = H / 2; held = {}; misses = 0; g.score = 0; g.over = false; flash = 0; serve(1); };
  g.keydown = (c, down = true) => { held[c] = down; };
  g.pointer = (type, x, y) => { if (type !== "up") py = clamp(y, PH / 2, H - PH / 2); };
  g.update = (dt) => {
    const move = (held.ArrowDown || held.KeyS ? 1 : 0) - (held.ArrowUp || held.KeyW ? 1 : 0);
    py = clamp(py + move * 380 * dt, PH / 2, H - PH / 2);
    // AI tracks the ball with capped speed so it is beatable
    ay += clamp(ball.y - ay, -250 * dt, 250 * dt);
    ay = clamp(ay, PH / 2, H - PH / 2);
    ball.x += ball.vx * dt; ball.y += ball.vy * dt;
    if (ball.y < 6) { ball.y = 6; ball.vy = Math.abs(ball.vy); }
    if (ball.y > H - 6) { ball.y = H - 6; ball.vy = -Math.abs(ball.vy); }
    const hit = (cx, dirX) => {
      const off = clamp((ball.y - (dirX > 0 ? py : ay)) / (PH / 2), -1, 1);
      const sp = Math.hypot(ball.vx, ball.vy) * 1.06;
      ball.vx = dirX * sp * Math.cos(off * 0.9); ball.vy = sp * Math.sin(off * 0.9);
      ball.x = cx;
    };
    if (ball.vx < 0 && ball.x - 6 <= MARGIN + PW && Math.abs(ball.y - py) <= PH / 2 + 6) hit(MARGIN + PW + 6, 1);
    if (ball.vx > 0 && ball.x + 6 >= W - MARGIN - PW && Math.abs(ball.y - ay) <= PH / 2 + 6) hit(W - MARGIN - PW - 6, -1);
    if (ball.x < -10) { misses += 1; flash = 0.3; if (misses >= MAX_MISSES) g.over = true; else serve(1); }
    if (ball.x > W + 10) { g.score += 10; flash = 0.3; serve(-1); }
    flash = Math.max(0, flash - dt);
  };
  g.draw = (ctx) => {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
    ctx.setLineDash([8, 10]); ctx.strokeStyle = "rgba(255,255,255,.18)";
    ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke(); ctx.setLineDash([]);
    glowRect(ctx, MARGIN, py - PH / 2, PW, PH, BLUE, 12);
    glowRect(ctx, W - MARGIN - PW, ay - PH / 2, PW, PH, "#ff7b7b", 12);
    ctx.shadowColor = "#fff"; ctx.shadowBlur = 12; ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(ball.x, ball.y, 6, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    text(ctx, `Lives ${"♥".repeat(MAX_MISSES - misses)}`, 12, 24, { color: "#ff7b7b" });
    text(ctx, "Beat the CPU — first to miss 5 loses", W / 2, H - 12, { align: "center", size: 12, color: "#67707b" });
  };
  g.reset();
  return g;
}

// ─── Skyhop (flappy-style) ───────────────────
export function createSkyhop() {
  const g = { score: 0, over: false };
  const GRAV = 1500, FLAP = -420, PIPE_W = 56, GAP_H = 120, SPEED = 170, SPAWN = 1.5, BX = 150, BR = 12;
  let by, vy, pipes, timer, t;

  const flap = () => { vy = FLAP; };
  g.reset = () => { by = H / 2; vy = 0; pipes = []; timer = 0.9; t = 0; g.score = 0; g.over = false; };
  g.keydown = (c, down = true) => { if (down && (c === "Space" || c === "ArrowUp" || c === "KeyW")) flap(); };
  g.pointer = (type) => { if (type === "down") flap(); };
  g.update = (dt) => {
    t += dt; vy += GRAV * dt; by += vy * dt;
    timer -= dt;
    if (timer <= 0) { timer = SPAWN; pipes.push({ x: W + 10, gapY: rand(80, H - 80 - GAP_H), passed: false }); }
    for (const p of pipes) {
      p.x -= SPEED * dt;
      if (!p.passed && p.x + PIPE_W < BX - BR) { p.passed = true; g.score += 10; }
      const inX = BX + BR > p.x && BX - BR < p.x + PIPE_W;
      if (inX && (by - BR < p.gapY || by + BR > p.gapY + GAP_H)) g.over = true;
    }
    pipes = pipes.filter((p) => p.x > -PIPE_W - 10);
    if (by + BR > H - 20 || by - BR < 0) g.over = true;
  };
  g.draw = (ctx) => {
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#0b1f33"); sky.addColorStop(1, "#1f4e6b");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
    for (const p of pipes) {
      glowRect(ctx, p.x, 0, PIPE_W, p.gapY, GREEN, 6);
      glowRect(ctx, p.x, p.gapY + GAP_H, PIPE_W, H - p.gapY - GAP_H, GREEN, 6);
    }
    ctx.fillStyle = "#171d25"; ctx.fillRect(0, H - 20, W, 20);
    ctx.save(); ctx.translate(BX, by); ctx.rotate(clamp(vy / 700, -0.5, 0.9));
    ctx.shadowColor = "#feca57"; ctx.shadowBlur = 12; ctx.fillStyle = "#feca57";
    ctx.beginPath(); ctx.arc(0, 0, BR, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = "#1b2838"; ctx.beginPath(); ctx.arc(5, -3, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  };
  g.reset();
  return g;
}

// ─── Star Defender (shoot 'em up) ────────────
export function createDefender() {
  const g = { score: 0, over: false };
  const SW = 30, SH = 22, SY = H - 34;
  let sx, bullets, enemies, stars, lives, held, shoot, spawn, elapsed, invuln;

  g.reset = () => {
    sx = W / 2; bullets = []; enemies = []; lives = 3; held = {}; shoot = 0; spawn = 0.6; elapsed = 0; invuln = 0;
    stars = Array.from({ length: 50 }, () => ({ x: rand(0, W), y: rand(0, H), s: rand(20, 90) }));
    g.score = 0; g.over = false;
  };
  g.keydown = (c, down = true) => { held[c] = down; };
  g.pointer = (type, x) => { if (type !== "up") sx = clamp(x, SW / 2, W - SW / 2); };
  g.update = (dt) => {
    elapsed += dt; invuln = Math.max(0, invuln - dt);
    const move = (held.ArrowRight || held.KeyD ? 1 : 0) - (held.ArrowLeft || held.KeyA ? 1 : 0);
    sx = clamp(sx + move * 360 * dt, SW / 2, W - SW / 2);
    shoot -= dt;
    if (shoot <= 0) { shoot = 0.22; bullets.push({ x: sx, y: SY - 12 }); }
    spawn -= dt;
    if (spawn <= 0) {
      spawn = Math.max(0.28, 0.8 - elapsed * 0.012);
      enemies.push({ x: rand(20, W - 20), y: -20, vy: rand(70, 110) + elapsed * 1.6, r: rand(12, 18), sway: rand(0, 6) });
    }
    bullets.forEach((b) => { b.y -= 520 * dt; });
    enemies.forEach((e) => { e.y += e.vy * dt; e.x += Math.sin(elapsed * 2 + e.sway) * 30 * dt; });
    for (const e of enemies) for (const b of bullets) {
      if (!b.dead && !e.dead && Math.hypot(b.x - e.x, b.y - e.y) < e.r + 3) { b.dead = e.dead = true; g.score += 10; }
    }
    for (const e of enemies) {
      if (e.dead) continue;
      const hitShip = invuln <= 0 && Math.abs(e.x - sx) < e.r + SW / 2 - 4 && Math.abs(e.y - SY) < e.r + SH / 2 - 4;
      if (hitShip || e.y > H + e.r) {
        e.dead = true; lives -= 1; invuln = 1.2;
        if (lives <= 0) g.over = true;
      }
    }
    bullets = bullets.filter((b) => !b.dead && b.y > -10);
    enemies = enemies.filter((e) => !e.dead);
    stars.forEach((s) => { s.y += s.s * dt; if (s.y > H) { s.y = 0; s.x = rand(0, W); } });
  };
  g.draw = (ctx) => {
    ctx.fillStyle = "#070b12"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "rgba(255,255,255,.6)";
    stars.forEach((s) => ctx.fillRect(s.x, s.y, 1.5, 1.5));
    bullets.forEach((b) => glowRect(ctx, b.x - 1.5, b.y - 8, 3, 12, GREEN, 8));
    enemies.forEach((e) => {
      ctx.shadowColor = "#ff5c5c"; ctx.shadowBlur = 12; ctx.fillStyle = "#ff5c5c";
      ctx.beginPath(); ctx.moveTo(e.x, e.y + e.r); ctx.lineTo(e.x - e.r, e.y - e.r * 0.7); ctx.lineTo(e.x + e.r, e.y - e.r * 0.7); ctx.closePath(); ctx.fill();
      ctx.shadowBlur = 0;
    });
    if (invuln <= 0 || Math.floor(elapsed * 12) % 2) {
      ctx.shadowColor = BLUE; ctx.shadowBlur = 14; ctx.fillStyle = BLUE;
      ctx.beginPath(); ctx.moveTo(sx, SY - SH / 2); ctx.lineTo(sx - SW / 2, SY + SH / 2); ctx.lineTo(sx, SY + SH / 4); ctx.lineTo(sx + SW / 2, SY + SH / 2); ctx.closePath(); ctx.fill();
      ctx.shadowBlur = 0;
    }
    text(ctx, `Lives ${"♥".repeat(Math.max(lives, 0))}`, 12, 24, { color: "#ff7b7b" });
  };
  g.reset();
  return g;
}
