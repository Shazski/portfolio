import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t) return;
      const interactive = t.closest('a, button, .project-row, .skill-row, .stat-row, .nav-link, .btn');
      if (interactive) {
        dotRef.current?.classList.add('large');
        if (ringRef.current) {
          ringRef.current.style.width = '64px';
          ringRef.current.style.height = '64px';
          ringRef.current.style.opacity = '0.7';
        }
      } else {
        dotRef.current?.classList.remove('large');
        if (ringRef.current) {
          ringRef.current.style.width = '36px';
          ringRef.current.style.height = '36px';
          ringRef.current.style.opacity = '1';
        }
      }
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
    };
  }, []);

  return (
    <>
      <div className="cursor-ring" ref={ringRef} />
      <div className="cursor" ref={dotRef} />
    </>
  );
}
