// create a full‑screen canvas
const canvas = document.createElement('canvas');
canvas.id = 'noiseCanvas';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

// resize canvas to fill screen
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// on each mouse move, draw random grayscale dots and fade old ones
document.addEventListener('mousemove', e => {
  const { clientX: x, clientY: y } = e;

  // draw 30 random dots around the pointer
  for (let i = 0; i < 30; i++) {
    const offsetX = x + (Math.random() - 0.5) * 30;
    const offsetY = y + (Math.random() - 0.5) * 30;
    const gray = Math.floor(Math.random() * 256);
    ctx.fillStyle = `rgb(${gray},${gray},${gray})`;
    ctx.fillRect(offsetX, offsetY, 2, 2);
  }

  // fade the canvas slightly to let the trail dissipate
  ctx.fillStyle = 'rgba(0,0,0,0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
});
