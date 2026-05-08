import { motion } from 'framer-motion';

export default function Contact() {
  return (
    <section id="contact" className="contact">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <div className="section-eyebrow">05 / contact</div>
        <h2 className="contact-title">
          Let's build something <span className="dim">that scales.</span>
        </h2>
        <p className="contact-body">
          Open to backend roles, freelance work, and interesting MongoDB / API
          architecture problems. The fastest way to reach me is email.
        </p>
        <a className="contact-email" href="mailto:sharoonkp267@gmail.com">
          sharoonkp267@gmail.com <span>→</span>
        </a>

        <div className="contact-links">
          <a href="https://github.com/" target="_blank" rel="noreferrer">github ↗</a>
          <a href="https://linkedin.com/" target="_blank" rel="noreferrer">linkedin ↗</a>
          <a href="https://twitter.com/" target="_blank" rel="noreferrer">twitter ↗</a>
        </div>
      </motion.div>
    </section>
  );
}
