import { motion } from 'framer-motion';
import { MouseEvent, useRef } from 'react';
import SplitText from './SplitText';

const groups = [
  { title: 'Languages', items: ['TypeScript', 'JavaScript', 'SQL', 'Python', 'Bash / Shell'] },
  { title: 'Backend', items: ['Node.js', 'NestJS', 'Nx Monorepo', 'Express.js', 'REST APIs', 'GraphQL', 'WebSockets', 'API Gateway', 'Microservices', 'Webhooks'] },
  { title: 'Frontend', items: ['Angular', 'React', 'Next.js', 'HTML / CSS', 'Tailwind CSS', 'Sass', 'Bootstrap', 'Vite', 'Webpack'] },
  { title: 'Databases', items: ['MongoDB', 'Aggregation Pipeline', 'Indexing', 'Query Optimization', 'Bulk Ops', 'Schema Design', 'Transactions', 'Migrations', 'Airtable', 'PostgreSQL', 'Redis'] },
  { title: 'Messaging / Queues', items: ['BullMQ', 'ioredis', 'Async Job Queues', 'Kafka', 'RabbitMQ', 'GCP Pub/Sub', 'Event Bus'] },
  { title: 'Cloud / Serverless', items: ['AWS Lambda', 'Step Functions', 'S3', 'CloudWatch', 'IAM', 'GCP', 'Vercel', 'CDN'] },
  { title: 'DevOps', items: ['Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions', 'Linux', 'Production Debugging', 'Logging & Monitoring'] },
  { title: 'Architecture', items: ['Event-driven', 'State Machines', 'API Optimization', 'Performance Tuning', 'Connection Pooling', 'Caching', 'Backpressure', 'Idempotency', 'Rate Limiting', 'SSO / Auth'] },
  { title: 'Testing & QA', items: ['Unit Testing', 'Integration Testing', 'Jest', 'Postman', 'Manual QA', 'TDD'] },
  { title: 'Security', items: ['OAuth 2.0', 'JWT', 'Secure Cookies', 'CSRF Protection', 'OWASP Awareness', 'HTTPS / TLS'] },
  { title: 'AI / LLM', items: ['Anthropic API', 'Gen AI', 'OpenAI'] },
  { title: 'Tools & Process', items: ['Agile', 'Scrum', 'Kanban', 'Jira', 'Confluence', 'Notion', 'Linear', 'Git', 'GitHub'] },
  { title: 'Problem Solving', items: ['Algorithmic Thinking', 'Performance Reasoning', 'System Debugging', 'Root-cause Analysis'] },
  { title: 'Engineering Leadership', items: ['Code Review', 'Mentoring', 'Tech Specs', 'Architecture Reviews', 'Observability', 'Cross-team Collaboration', 'Estimation'] },
];

function SkillCard({ g, i }: { g: typeof groups[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty('--mx', `${x}%`);
    el.style.setProperty('--my', `${y}%`);
  };

  return (
    <motion.div
      className="skill-card"
      ref={ref}
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: i * 0.04 }}
    >
      <div className="skill-card-head">
        <span className="skill-card-index">{String(i + 1).padStart(2, '0')}</span>
        <h3>{g.title}</h3>
      </div>
      <div className="skill-chips">
        {g.items.map((it) => (
          <span className="skill-chip" key={it}>{it}</span>
        ))}
      </div>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <section id="skills">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <div className="section-eyebrow"><span className="eyebrow-line" /> 02 / skills</div>
        <SplitText as="h2" className="section-title">
          The toolkit I reach for. Backend & infrastructure first, with full-stack reach.
        </SplitText>
      </motion.div>

      <div className="skills-grid">
        {groups.map((g, i) => (
          <SkillCard key={g.title} g={g} i={i} />
        ))}
      </div>
    </section>
  );
}
