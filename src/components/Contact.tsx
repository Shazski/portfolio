import { motion } from 'framer-motion';
import MagneticButton from './MagneticButton';
import SplitText from './SplitText';

export default function Contact() {
  return (
    <section id="contact" className="contact">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <div className="section-eyebrow"><span className="eyebrow-line" /> 05 / contact</div>
        <SplitText as="h2" className="contact-title">
          Let's build something that scales.
        </SplitText>
        <p className="contact-body">
          Open to backend roles, freelance work, and interesting MongoDB / API
          architecture problems. The fastest way to reach me is email.
        </p>
        <MagneticButton href="mailto:sharoonkp267@gmail.com" className="contact-email">
          sharoonkp267@gmail.com <span className="arrow">→</span>
        </MagneticButton>

        <div className="contact-links">
          <a href="https://github.com/" target="_blank" rel="noreferrer" className="link-underline">github <span>↗</span></a>
          <a href="https://linkedin.com/" target="_blank" rel="noreferrer" className="link-underline">linkedin <span>↗</span></a>
          <a href="https://twitter.com/" target="_blank" rel="noreferrer" className="link-underline">twitter <span>↗</span></a>
        </div>
      </motion.div>
    </section>
  );
}
