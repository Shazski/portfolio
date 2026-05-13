import { motion } from 'framer-motion';
import { MouseEvent, useRef } from 'react';
import SplitText from './SplitText';

const groups = [
  { title: 'Languages', items: ['TypeScript', 'JavaScript', 'SQL'] },
  { title: 'Backend', items: ['Node.js', 'NestJS', 'Express.js', 'REST APIs', 'API Gateway', 'Microservices'] },
  { title: 'Frontend', items: ['Angular', 'React', 'HTML / CSS', 'Bootstrap'] },
  { title: 'Databases', items: ['MongoDB', 'Aggregation Pipeline', 'Indexing', 'Bulk Ops', 'Airtable'] },
  { title: 'Messaging / Streaming', items: ['Kafka', 'RabbitMQ', 'GCP Pub/Sub'] },
  { title: 'Cloud / Serverless', items: ['AWS Lambda', 'Step Functions', 'Vercel'] },
  { title: 'DevOps', items: ['Docker', 'Kubernetes', 'CI/CD', 'Production Debugging'] },
  { title: 'Architecture', items: ['Event-driven', 'State Machines', 'API Optimization', 'SSO / Auth'] },
  { title: 'Problem Solving', items: ['Algorithmic Thinking', 'Performance Reasoning', 'System Debugging'] },
  { title: 'Engineering Leadership', items: ['Code Review', 'Mentoring', 'Tech Specs', 'Architecture Reviews', 'Observability', 'Cross-team Collaboration'] },
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
      <h3>{g.title}</h3>
      <ul>
        {g.items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
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
