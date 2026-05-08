import { motion } from 'framer-motion';

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
];

export default function Skills() {
  return (
    <section id="skills">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <div className="section-eyebrow">02 / skills</div>
        <h2 className="section-title">
          The toolkit I reach for. <span className="dim">Backend &amp; infrastructure first, with full-stack reach.</span>
        </h2>
      </motion.div>

      <div className="skills-grid">
        {groups.map((g, i) => (
          <motion.div
            className="skill-card"
            key={g.title}
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
        ))}
      </div>
    </section>
  );
}
