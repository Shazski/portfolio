export const scrollState = {
  progress: 0,
  velocity: 0,
};

let raf = 0;
let last = window.scrollY;

function tick() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const y = window.scrollY;
  scrollState.progress = max > 0 ? y / max : 0;
  scrollState.velocity = (y - last) * 0.1 + scrollState.velocity * 0.85;
  last = y;
  raf = requestAnimationFrame(tick);
}

export function startScrollState() {
  if (raf) return;
  raf = requestAnimationFrame(tick);
}

export function stopScrollState() {
  if (raf) {
    cancelAnimationFrame(raf);
    raf = 0;
  }
}
