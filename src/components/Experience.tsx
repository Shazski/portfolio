import { motion } from 'framer-motion';

const items = [
  {
    when: 'Present',
    role: 'Full Stack Engineer',
    company: 'Recotap',
    context: 'Product · ABM marketing on LinkedIn — Recotap & AdRadar',
    bullets: [
      'Built two AI auto-blocking agents (company & title) used across the Recotap and AdRadar products.',
      'Designed serverless workflows on AWS Step Functions + Lambda to replace fragile cron pipelines.',
      'Owned the GCP Pub/Sub-based internal notification system — decoupled producers and consumers across services.',
      'Owned the LinkedIn integration end-to-end and built the ROI graph backed by tuned MongoDB aggregations.',
      'Frontend work in Angular for product surfaces tied to the analytics and integration features I shipped.',
    ],
  },
  {
    when: 'Earlier',
    role: 'Full Stack Engineer',
    company: 'Skills Outsource Think Pvt Ltd',
    context: 'Service · Ad operations outsourced to French advertisers across Meta, TikTok & other social platforms',
    bullets: [
      'Led a complete production data migration from Airtable to MongoDB — schema design, ETL, and cutover.',
      'Built a seamless cross-domain auto-login (SSO) flow across multiple product domains.',
      'Designed and shipped an internal MongoDB query-builder plugin that cut query-writing effort across the team by ~40%.',
      'Built REST APIs and frontend features in React across customer-facing and internal products.',
    ],
  },
  {
    when: 'Continuous',
    role: 'Self-directed Learning',
    company: 'DSA · System Design · Cloud',
    bullets: [
      'Strong problem-solving instincts — comfortable breaking down ambiguous problems and reasoning through performance, edge cases and tradeoffs.',
      'Deep-dive into MongoDB internals — index intersection, query planner, execution stats.',
      'Hands-on with Docker, Kubernetes, and CI/CD — building reproducible, deployable backend environments.',
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <div className="section-eyebrow">04 / experience</div>
        <h2 className="section-title">Where I've spent my engineering hours.</h2>
      </motion.div>

      <div className="exp">
        {items.map((it, i) => (
          <motion.div
            className="exp-row"
            key={it.role + i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
          >
            <div className="when">{it.when}</div>
            <div>
              <h3>{it.role}</h3>
              <div className="company">{it.company}</div>
              {it.context && <div className="company-context">{it.context}</div>}
            </div>
            <ul>
              {it.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
