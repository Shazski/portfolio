import { motion } from 'framer-motion';

const stats = [
  { num: '40%', label: 'dev effort cut by internal tooling' },
  { num: '10M+', label: 'records migrated & processed' },
  { num: '2', label: 'AI auto-blocking agents shipped' },
  { num: '99.9%', label: 'service uptime maintained' },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function About() {
  return (
    <section id="about">
      <motion.div {...fade(0)}>
        <div className="section-eyebrow">01 / about</div>
        <h2 className="section-title">
          Full stack engineer with a backend lean. <span className="dim">I work across the stack but spend most of my time where the data, queries and infrastructure live.</span>
        </h2>
      </motion.div>

      <div className="about-grid">
        <motion.div className="about-text" {...fade(0.1)}>
          <p>
            My core stack is <strong>Node.js, TypeScript, NestJS</strong> and <strong>MongoDB</strong>,
            with <strong>Angular</strong> and <strong>React</strong> on the frontend when a feature needs it.
            On the platform side I work with <strong>Docker, Kubernetes, CI/CD pipelines, AWS Lambda,
            Step Functions</strong> and <strong>GCP Pub/Sub</strong>.
          </p>
          <p>
            I'm currently at <strong>Recotap</strong>, a product company doing <strong>ABM marketing
            on LinkedIn</strong>. I work across both the Recotap and AdRadar products — AI-powered
            auto-blocking agents (company &amp; title), serverless orchestration with state machines
            and Lambda, the LinkedIn integration, ROI analytics, and the internal event-driven
            notification system on Pub/Sub.
          </p>
          <p>
            Before Recotap I was at <strong>Skills Outsource Think Pvt Ltd</strong>, a service
            company running ad operations for French advertisers across Meta, TikTok and other
            social platforms. There I led a full <strong>Airtable → MongoDB</strong> migration,
            built seamless cross-domain auto-login, and shipped an internal <strong>MongoDB
            query-builder plugin</strong> that cut other developers' effort by ~40%.
          </p>
        </motion.div>

        <motion.div className="stats" {...fade(0.2)}>
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <span className="num">{s.num}</span>
              <span className="label">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
