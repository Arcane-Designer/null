// ——— grab canvases & contexts ———
const dotCanvas    = document.getElementById('dotCanvas');
const noiseCanvas  = document.getElementById('noiseCanvas');
const staticCanvas = document.getElementById('staticCanvas');

const dctx = dotCanvas.getContext('2d');
const nctx = noiseCanvas.getContext('2d');
const sctx = staticCanvas.getContext('2d');

// ——— resize all canvases & build particles ———
let particles = [];
function initParticles() {
  particles = [];
  const spacing = 80;
  for (let x = spacing/2; x < dotCanvas.width; x += spacing) {
    for (let y = spacing/2; y < dotCanvas.height; y += spacing) {
      particles.push({ x0: x, y0: y, x: x, y: y, vx: 0, vy: 0 });
    }
  }
}

function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  dotCanvas.width   = w; dotCanvas.height   = h;
  noiseCanvas.width = w; noiseCanvas.height = h;
  staticCanvas.width= w; staticCanvas.height= h;
  initParticles();
}

window.addEventListener('resize', resize);
resize();

// ——— animate dot grid ———
let mouse = { x: -9999, y: -9999 };
window.addEventListener('mousemove', e => {
  mouse.x = e.clientX; mouse.y = e.clientY;
});

function animateParticles() {
  dctx.clearRect(0, 0, dotCanvas.width, dotCanvas.height);
  for (const p of particles) {
    // drift + return home
    p.vx += (Math.random() - 0.5) * 0.1 + (p.x0 - p.x) * 0.001;
    p.vy += (Math.random() - 0.5) * 0.1 + (p.y0 - p.y) * 0.001;
    p.x += p.vx; p.y += p.vy;
    // repel near cursor
    const dx = p.x - mouse.x, dy = p.y - mouse.y;
    if (Math.hypot(dx, dy) < 100) {
      const ang = Math.atan2(dy, dx);
      p.vx += Math.cos(ang) * 2; p.vy += Math.sin(ang) * 2;
    }
    dctx.fillStyle = 'rgba(200,200,200,0.5)';
    dctx.beginPath();
    dctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    dctx.fill();
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ——— static‑trail cursor ———
window.addEventListener('mousemove', e => {
  const x = e.clientX, y = e.clientY;
  for (let i = 0; i < 30; i++) {
    const ox = x + (Math.random()-0.5)*30;
    const oy = y + (Math.random()-0.5)*30;
    const g  = Math.floor(Math.random() * 256);
    nctx.fillStyle = `rgb(${g},${g},${g})`;
    nctx.fillRect(ox, oy, 2, 2);
  }
  nctx.fillStyle = 'rgba(0,0,0,0.05)';
  nctx.fillRect(0,0,noiseCanvas.width, noiseCanvas.height);
});

// ——— glitchy tagline ———
const taglineEl  = document.getElementById('tagline');
const originalTag= taglineEl.innerText;

function glitchText() {
  let out = '';
  for (const ch of originalTag) {
    out += (ch !== ' ' && Math.random() < 0.2)
      ? String.fromCharCode(33 + Math.floor(Math.random()*94))
      : ch;
  }
  taglineEl.innerText = out;
  setTimeout(() => taglineEl.innerText = originalTag, 250);
}

setInterval(glitchText, 4000 + Math.random()*4000);

// ——— overlay + manifesto ———
const overlay     = document.getElementById('overlay');
const overlayText = document.getElementById('overlay-text');
const titleEl     = document.getElementById('title');
let staticInterval;

function drawStatic() {
  const w = staticCanvas.width, h = staticCanvas.height;
  sctx.clearRect(0,0,w,h);
  for (let i = 0; i < 5000; i++) {
    const x = Math.random()*w, y = Math.random()*h;
    const g = Math.floor(Math.random()*256);
    sctx.fillStyle = `rgb(${g},${g},${g})`;
    sctx.fillRect(x, y, 1, 1);
  }
}

titleEl.addEventListener('click', () => {
  if (overlay.style.display === 'flex') return;
  overlay.style.display      = 'flex';
  staticCanvas.style.display = 'block';
  overlayText.style.display  = 'none';

  staticInterval = setInterval(drawStatic, 50);
  setTimeout(() => {
    clearInterval(staticInterval);
    staticCanvas.style.display = 'none';
    overlayText.style.display  = 'block';
  }, 800);
});

overlay.addEventListener('click', () => {
  overlay.style.display = 'none';
});

// ——— terminal input (placeholder for your future code) ———
// const input = document.getElementById('terminal-input');
// ...add key handlers here later...
