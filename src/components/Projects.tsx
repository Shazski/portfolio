import { motion } from 'framer-motion';

const projects = [
  {
    num: '01',
    type: 'Recotap · AdRadar',
    title: 'AI auto-blocking agents — company & title',
    desc: 'Built two automated AI agents that classify and auto-block companies and job titles for the Recotap and AdRadar platforms. Powers cleaner targeting with no manual list maintenance, integrated into the campaign delivery flow.',
    tags: ['Node.js', 'AI Agents', 'NestJS', 'MongoDB'],
    impact: { num: '2', label: 'agents in production' },
  },
  {
    num: '02',
    type: 'Recotap · Serverless',
    title: 'State machine & Lambda orchestration',
    desc: 'Designed long-running workflows using AWS Step Functions and Lambda — orchestrating multi-stage jobs with retries, parallel branches and durable state. Replaced fragile cron-driven scripts with observable serverless pipelines.',
    tags: ['AWS Lambda', 'Step Functions', 'Serverless'],
    impact: { num: '0', label: 'silent failures' },
  },
  {
    num: '03',
    type: 'Recotap · Event-driven',
    title: 'GCP Pub/Sub notification system',
    desc: 'Built an internal notification system on top of GCP Pub/Sub — decoupled producers and consumers across services, with topic-per-event design and idempotent handlers. Powers ops alerts, customer notifications, and downstream sync jobs.',
    tags: ['GCP Pub/Sub', 'Event-driven', 'Node.js'],
    impact: { num: '∞', label: 'fan-out ready' },
  },
  {
    num: '04',
    type: 'Recotap · Integrations',
    title: 'LinkedIn integration & ROI analytics',
    desc: 'Owned the LinkedIn integration end-to-end — auth, rate-aware sync, and data normalization — and built the ROI graph that surfaces campaign performance with aggregation pipelines tuned for fast dashboard queries.',
    tags: ['LinkedIn API', 'MongoDB', 'Aggregation', 'Angular'],
    impact: { num: '<200ms', label: 'dashboard P95' },
  },
  {
    num: '05',
    type: 'Earlier · Migration',
    title: 'Airtable → MongoDB migration',
    desc: 'Led a complete migration of production data from Airtable to MongoDB — schema mapping, batched ETL, dual-write cutover, and validation. Unblocked the next generation of features that Airtable couldn\'t support.',
    tags: ['MongoDB', 'ETL', 'Migration', 'Node.js'],
    impact: { num: '100%', label: 'data parity' },
  },
  {
    num: '06',
    type: 'Earlier · Developer Tooling',
    title: 'MongoDB query-builder plugin',
    desc: 'Designed and shipped an internal MongoDB query-builder plugin used across the team — abstracted common filter, projection and aggregation patterns into a typed, composable API. Cut query-writing effort for other developers by ~40%.',
    tags: ['MongoDB', 'Node.js', 'Internal Tool', 'TypeScript'],
    impact: { num: '40%', label: 'less dev effort' },
  },
  {
    num: '07',
    type: 'Earlier · Auth',
    title: 'Cross-domain auto-login (SSO)',
    desc: 'Built a seamless auto-login flow across multiple product domains — token issuance, secure cross-domain handshake, and silent re-auth. Users move between properties without ever seeing a login screen.',
    tags: ['Auth', 'SSO', 'Node.js', 'Cookies / JWT'],
    impact: { num: '0', label: 're-logins' },
  },
];

export default function Projects() {
  return (
    <section id="projects">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <div className="section-eyebrow">03 / selected work</div>
        <h2 className="section-title">
          Things I've built &amp; problems I've solved.
        </h2>
      </motion.div>

      <div className="projects">
        {projects.map((p, i) => (
          <motion.div
            className="project"
            key={p.num}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.05 }}
          >
            <div className="p-num">{p.num}</div>
            <div className="p-title">
              <h3>{p.title}</h3>
              <span className="type">{p.type}</span>
            </div>
            <div className="p-desc">
              {p.desc}
              <div className="tags">
                {p.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
            <div className="p-impact">
              <span className="num">{p.impact.num}</span>
              <span className="label">{p.impact.label}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
