import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import HeroScene from './HeroScene';
import SafeCanvas from './SafeCanvas';
import MagneticButton from './MagneticButton';

const tile = (delay = 0) => ({
  initial: { opacity: 0, y: 24, scale: 0.96, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const NAME = 'Sharoon';
const STACK = ['Node.js', 'NestJS', 'TypeScript', 'MongoDB', 'Redis', 'BullMQ', 'AWS', 'GCP', 'Docker', 'Kubernetes', 'React', 'Angular'];

export default function Hero() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const sceneVisible = useInView(sceneRef, { margin: '100px' });
  return (
    <section className="hero bento" id="home">
      {/* Intro — large tile */}
      <motion.div className="tile tile-intro" {...tile(0)}>
        <div className="hero-eyebrow">
          <span className="pill"><span className="dot" /> Available for work</span>
        </div>

        <h1 className="hero-name" aria-label={NAME}>
          {NAME.split('').map((ch, i) => (
            <motion.span
              key={i}
              className="letter"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.045, ease: [0.22, 1, 0.36, 1] as const }}
            >
              {ch}
            </motion.span>
          ))}
        </h1>

        <h2 className="hero-role">
          Full stack engineer building backend systems <span className="grad">that scale.</span>
        </h2>

        <p className="hero-tagline">
          APIs, data pipelines and infrastructure on Node.js, NestJS, MongoDB and GCP / AWS —
          with frontends in Angular and React.
        </p>

        <div className="hero-actions">
          <MagneticButton href="#projects" className="btn btn-primary">
            View work <span className="arrow">→</span>
          </MagneticButton>
          <MagneticButton href="/Sharoon-Resume.pdf" download="Sharoon-Resume.pdf" className="btn">
            Download CV <span className="arrow">↓</span>
          </MagneticButton>
        </div>
      </motion.div>

      {/* 3D scene */}
      <motion.div className="tile tile-scene" {...tile(0.1)}>
        <div className="hero-canvas" ref={sceneRef}>
          <SafeCanvas><HeroScene active={sceneVisible} /></SafeCanvas>
        </div>
        <span className="tile-label mono">/ systems in motion</span>
      </motion.div>

      {/* Current role */}
      <motion.div className="tile tile-now" {...tile(0.18)}>
        <span className="tile-label mono">/ currently</span>
        <div className="tile-big">Recotap</div>
        <p className="tile-sub">ABM marketing on LinkedIn · AI agents, serverless & event-driven infra</p>
      </motion.div>

      {/* Headline metric */}
      <motion.div className="tile tile-metric" {...tile(0.24)}>
        <span className="tile-label mono">/ latency</span>
        <div className="tile-big grad">~20×</div>
        <p className="tile-sub">faster Sales Activity API · 50s → 2–3s over 7.5M records</p>
      </motion.div>

      {/* Stack ticker */}
      <motion.div className="tile tile-stack" {...tile(0.3)}>
        <span className="tile-label mono">/ stack</span>
        <div className="stack-ticker">
          <div className="stack-track">
            {[...STACK, ...STACK].map((s, i) => (
              <span className="skill-chip" key={i}>{s}</span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Contact CTA */}
      <motion.a href="#contact" className="tile tile-cta" {...tile(0.36)}>
        <span className="tile-label mono">/ say hi</span>
        <div className="tile-cta-row">
          <span>Let's talk</span>
          <span className="tile-cta-arrow">↗</span>
        </div>
      </motion.a>
    </section>
  );
}
