import { motion } from 'framer-motion';
import HeroScene from './HeroScene';
import MagneticButton from './MagneticButton';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const NAME = 'Sharoon';

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div>
        <motion.div className="hero-eyebrow" {...fade(0)}>
          <span className="eyebrow-line" /> Full Stack Engineer · Backend-focused
        </motion.div>

        <h1 className="hero-name" aria-label={NAME}>
          {NAME.split('').map((ch, i) => (
            <motion.span
              key={i}
              className="letter"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.7,
                delay: 0.1 + i * 0.045,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
            >
              {ch}
            </motion.span>
          ))}
        </h1>

        <motion.h2 className="hero-role" {...fade(0.45)}>
          Building backend systems <span className="dim">that scale.</span>
        </motion.h2>

        <motion.p className="hero-tagline" {...fade(0.55)}>
          I build production systems end-to-end — APIs, data pipelines, and infrastructure
          on Node.js, NestJS, MongoDB, and GCP / AWS, with frontends in Angular and React.
          Most of my time goes to backend performance and architecture.
        </motion.p>

        <motion.div className="hero-actions" {...fade(0.65)}>
          <MagneticButton href="#projects" className="btn btn-primary">
            View work <span className="arrow">→</span>
          </MagneticButton>
          <MagneticButton href="#contact" className="btn">
            Get in touch
          </MagneticButton>
        </motion.div>

        <motion.div className="hero-scroll-hint" {...fade(0.9)}>
          <span className="scroll-bar"><span /></span>
          <span className="scroll-label">scroll</span>
        </motion.div>
      </div>

      <motion.div
        className="hero-canvas"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      >
        <HeroScene />
      </motion.div>
    </section>
  );
}
