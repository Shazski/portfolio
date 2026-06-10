import { useMemo } from 'react';

type Particle = {
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  violet: boolean;
};

export default function AuroraBackground() {
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        left: Math.random() * 100,
        size: 1.5 + Math.random() * 3,
        duration: 14 + Math.random() * 16,
        delay: -Math.random() * 30,
        drift: (Math.random() - 0.5) * 14,
        violet: i % 4 === 0,
      })),
    []
  );

  return (
    <div className="aurora" aria-hidden>
      <div className="aurora-sheen" />
      <div className="aurora-blob aurora-blob--a" />
      <div className="aurora-blob aurora-blob--b" />
      <div className="aurora-blob aurora-blob--c" />
      <div className="aurora-blob aurora-blob--d" />
      <div className="aurora-blob aurora-blob--e" />
      <div className="aurora-grid" />

      <div className="aurora-beams">
        <span className="aurora-beam aurora-beam--1" />
        <span className="aurora-beam aurora-beam--2" />
        <span className="aurora-beam aurora-beam--3" />
      </div>

      <div className="aurora-particles">
        {particles.map((p, i) => (
          <span
            key={i}
            className={`aurora-particle${p.violet ? ' aurora-particle--violet' : ''}`}
            style={
              {
                left: `${p.left}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                '--drift': `${p.drift}vw`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="aurora-grain" />
      <div className="aurora-vignette" />
    </div>
  );
}
