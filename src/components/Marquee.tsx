const tokens = [
  'Node.js', 'NestJS', 'TypeScript', 'MongoDB', 'AWS Lambda', 'Step Functions',
  'GCP Pub/Sub', 'Kubernetes', 'Docker', 'Angular', 'React', 'Kafka',
  'RabbitMQ', 'CI/CD', 'System Design', 'Event-driven', 'Aggregation Pipeline',
];

export default function Marquee() {
  const row = [...tokens, ...tokens];
  return (
    <div className="marquee" aria-hidden>
      <div className="marquee-track">
        {row.map((t, i) => (
          <span className="marquee-item" key={i}>
            {t}
            <i className="marquee-dot" />
          </span>
        ))}
      </div>
    </div>
  );
}
