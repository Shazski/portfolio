import { useEffect } from 'react';

const SEL = '.tile, .skill-card, .project, .exp-row, .stat, .about-text, .ai-card';

/** One global listener: spotlight glow + border for every card, and 3D tilt for project cards. */
export default function Spotlight() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return;
    let last: HTMLElement | null = null;
    const onMove = (e: PointerEvent) => {
      const el = (e.target as HTMLElement)?.closest?.(SEL) as HTMLElement | null;
      if (last && last !== el) {
        last.style.removeProperty('--rx');
        last.style.removeProperty('--ry');
      }
      last = el;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', `${x * 100}%`);
      el.style.setProperty('--my', `${y * 100}%`);
      if (el.classList.contains('project') || el.classList.contains('tile-cta')) {
        el.style.setProperty('--rx', `${(0.5 - y) * 6}deg`);
        el.style.setProperty('--ry', `${(x - 0.5) * 6}deg`);
      }
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);
  return null;
}
