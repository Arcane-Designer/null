// — grab elements & canvases —
const dotCanvas    = document.getElementById('dotCanvas');
const cursorCanvas = document.getElementById('cursorCanvas');
const staticCanvas = document.getElementById('staticCanvas');
const titleEl      = document.getElementById('title');
const overlay      = document.getElementById('overlay');
const overlayText  = document.getElementById('overlay-text');
const taglineEl    = document.getElementById('tagline');

const dctx = dotCanvas.getContext('2d');
const cctx = cursorCanvas.getContext('2d');
const sctx = staticCanvas.getContext('2d');

let particles = [];
let staticInterval;

// — resize & initialize —
function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  dotCanvas.width    = w; dotCanvas.height    = h;
  staticCanvas.width = w; staticCanvas.height = h;
  cursorCanvas.width = 16; cursorCanvas.height = 16;
  initParticles();
}
window.addEventListener('resize', resize);
resize();

// — build drifting dot grid —
function initParticles() {
  particles = [];
  const spacing = 80;
  for (let x = spacing/2; x < dotCanvas.width; x += spacing) {
    for (let y = spacing/2; y < dotCanvas.height; y += spacing) {
      particles.push({ x0: x, y0: y, x: x, y: y, vx: 0, vy: 0 });
    }
  }
}

// — animate grid & repel on hover —
let mouse = { x: -Infinity, y: -Infinity };
window.addEventListener('mousemove', e => {
  mouse.x = e.clientX; mouse.y = e.clientY;
  drawCursor(mouse.x, mouse.y);
});
function animateParticles() {
  dctx.clearRect(0, 0, dotCanvas.width, dotCanvas.height);
  for (const p of particles) {
    // subtle drift + spring back
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

// — draw static‑noise cursor —
function drawCursor(x, y) {
  // position the canvas centered on pointer
  cursorCanvas.style.left = (x - 8) + 'px';
  cursorCanvas.style.top  = (y - 8) + 'px';

  // generate static noise
  const size = 16;
  const img  = cctx.createImageData(size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255;
    img.data[i]     = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  cctx.putImageData(img, 0, 0);
}

// — glitchy tagline effect —
const originalTag = taglineEl.innerText;
function glitchTagline() {
  let out = '';
  for (const ch of originalTag) {
    out += (ch !== ' ' && Math.random() < 0.2)
      ? String.fromCharCode(33 + Math.floor(Math.random() * 94))
      : ch;
  }
  taglineEl.innerText = out;
  setTimeout(() => (taglineEl.innerText = originalTag), 250);
}
setInterval(glitchTagline, 4000 + Math.random() * 2000);

// — static‑to‑manifesto overlay on title click —
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
  overlay.style.display     = 'flex';
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

// — terminal input is ready for your future code —
