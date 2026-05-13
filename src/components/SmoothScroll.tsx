import { useEffect } from 'react';
import Lenis from 'lenis';
import { startScrollState, stopScrollState } from '../lib/scrollState';

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.85,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 1.0,
      touchMultiplier: 1.4,
      smoothWheel: true,
      lerp: 0.12,
      syncTouch: false,
    });

    let raf = 0;
    const tick = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    startScrollState();

    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      stopScrollState();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return null;
}
