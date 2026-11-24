import { useEffect } from 'react';
import { startScrollState, stopScrollState } from '../lib/scrollState';

/** Native browser scrolling — only tracks scroll progress for the 3D scenes. */
export default function SmoothScroll() {
  useEffect(() => {
    startScrollState();
    return () => stopScrollState();
  }, []);

  return null;
}
