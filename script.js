// — grab all canvases & relevant elements —
const dotCanvas    = document.getElementById('dotCanvas');
const noiseCanvas  = document.getElementById('noiseCanvas');
const staticCanvas = document.getElementById('staticCanvas');
const titleEl      = document.getElementById('title');
const overlay      = document.getElementById('overlay');
const overlayText  = document.getElementById('overlay-text');
const taglineEl    = document.getElementById('tagline');

const dctx = dotCanvas.getContext('2d');
const nctx = noiseCanvas.getContext('2d');
const sctx = staticCanvas.getContext('2d');

let particles = [];
let staticInterval;

// — resize canvases & init particle grid —
function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  [dotCanvas, noiseCanvas, staticCanvas].forEach(c => {
    c.width = w; c.height = h;
  });
  initParticles();
}
window.addEventListener('resize', resize);
resize();

// — build grid of dots —
function initParticles() {
  particles = [];
  const spacing = 80;
  for (let x = spacing/2; x < dotCanvas.width; x += spacing) {
    for (let y = spacing/2; y < dotCanvas.height; y += spacing) {
      particles.push({ x0: x, y0: y, x: x, y: y, vx: 0, vy: 0 });
    }
  }
}

// — animate dot grid, repel near cursor —
let mouse = { x: -Infinity, y: -Infinity };
window.addEventListener('mousemove', e => {
  mouse.x = e.clientX; mouse.y = e.clientY;
  drawStaticTrail(e.clientX, e.clientY);
});

function animateParticles() {
  dctx.clearRect(0, 0, dotCanvas.width, dotCanvas.height);
  for (const p of particles) {
    // gentle drift + spring back
    p.vx += (Math.random() - 0.5) * 0.1 + (p.x0 - p.x) * 0.001;
    p.vy += (Math.random() - 0.5) * 0.1 + (p.y0 - p.y) * 0.001;
    p.x += p.vx; p.y += p.vy;

    // repel on proximity
    const dx = p.x - mouse.x, dy = p.y - mouse.y;
    if (Math.hypot(dx, dy) < 100) {
      const ang = Math.atan2(dy, dx);
      p.vx += Math.cos(ang) * 2;
      p.vy += Math.sin(ang) * 2;
    }

    dctx.fillStyle = 'rgba(200,200,200,0.5)';
    dctx.beginPath();
    dctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    dctx.fill();
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

// — draw static trail on the noise canvas —
function drawStaticTrail(x, y) {
  for (let i = 0; i < 30; i++) {
    const ox = x + (Math.random() - 0.5) * 30;
    const oy = y + (Math.random() - 0.5) * 30;
    const grey = Math.floor(Math.random() * 256);
    nctx.fillStyle = `rgb(${grey},${grey},${grey})`;
    nctx.fillRect(ox, oy, 2, 2);
  }
  // fade old trail
  nctx.fillStyle = 'rgba(0,0,0,0.05)';
  nctx.fillRect(0, 0, noiseCanvas.width, noiseCanvas.height);
}

// — occasional glitch on the tagline —
const originalTag = taglineEl.innerText;
function glitchTagline() {
  let txt = '';
  for (const ch of originalTag) {
    txt += (ch !== ' ' && Math.random() < 0.2)
      ? String.fromCharCode(33 + Math.floor(Math.random() * 94))
      : ch;
  }
  taglineEl.innerText = txt;
  setTimeout(() => taglineEl.innerText = originalTag, 250);
}
setInterval(glitchTagline, 4000 + Math.random() * 2000);

// — click title to show static‑to‑manifesto overlay —
function drawStaticFrame() {
  const w = staticCanvas.width, h = staticCanvas.height;
  sctx.clearRect(0, 0, w, h);
  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const g = Math.floor(Math.random() * 256);
    sctx.fillStyle = `rgb(${g},${g},${g})`;
    sctx.fillRect(x, y, 1, 1);
  }
}
titleEl.addEventListener('click', () => {
  if (overlay.style.display === 'flex') return;
  overlay.style.display = 'flex';
  overlayText.style.display = 'none';
  staticInterval = setInterval(drawStaticFrame, 50);
  setTimeout(() => {
    clearInterval(staticInterval);
    overlayText.style.display = 'block';
  }, 800);
});
overlay.addEventListener('click', () => {
  overlay.style.display = 'none';
  sctx.clearRect(0, 0, staticCanvas.width, staticCanvas.height);
});

// — terminal input is in place; add JS later as needed —
