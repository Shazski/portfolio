import { motion } from 'framer-motion';
import HeroScene from './HeroScene';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div>
        <motion.div className="hero-eyebrow" {...fade(0)}>
          Full Stack Engineer · Backend-focused
        </motion.div>

        <motion.h1 className="hero-name" {...fade(0.08)}>
          Sharoon<span className="dim"></span>
        </motion.h1>

        <motion.h2 className="hero-role" {...fade(0.18)}>
          Building backend systems <span className="dim">that scale.</span>
        </motion.h2>

        <motion.p className="hero-tagline" {...fade(0.28)}>
          I build production systems end-to-end — APIs, data pipelines, and infrastructure
          on Node.js, NestJS, MongoDB, and GCP / AWS, with frontends in Angular and React.
          Most of my time goes to backend performance and architecture.
        </motion.p>

        <motion.div className="hero-actions" {...fade(0.36)}>
          <a className="btn btn-primary" href="#projects">View work</a>
          <a className="btn" href="#contact">Get in touch</a>
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
