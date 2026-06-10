import { motion } from 'framer-motion';
import { MouseEvent, useRef, useState } from 'react';
import ProjectModal, { ProjectDetail } from './ProjectModal';
import SplitText from './SplitText';

const projects: ProjectDetail[] = [
  {
    num: '01',
    type: 'Recotap · AdRadar',
    title: 'AI auto-blocking agents — company & title',
    desc: 'Built two automated AI agents that classify and auto-block companies and job titles for the Recotap and AdRadar platforms. Powers cleaner targeting with no manual list maintenance, integrated into the campaign delivery flow.',
    tags: ['Node.js', 'AI Agents', 'NestJS', 'MongoDB'],
    impact: { num: '2', label: 'agents in production' },
    problem: 'Manual block-list curation for company names and job titles was slow, error-prone, and didn\'t scale across hundreds of active campaigns. Targeting quality degraded over time as new entities appeared faster than humans could classify them.',
    approach: [
      'Designed a classification pipeline that ingests candidate entities and scores them through an LLM-backed agent.',
      'Built a feedback loop — agent decisions are auditable and reviewable, with confidence thresholds that route uncertain cases for human review.',
      'Integrated the agent output directly into the campaign delivery flow so blocks take effect within the next ad serving cycle.',
      'Added observability — every decision is logged with reasoning, so the team can debug why something was (or wasn\'t) blocked.',
    ],
    outcome: 'Two production agents now handle company and title classification with near-zero manual list maintenance. Targeting precision improved measurably and the ops team time freed up shifted to higher-value work.',
    stack: ['Node.js', 'NestJS', 'TypeScript', 'MongoDB', 'LLM APIs', 'AWS Lambda'],
  },
  {
    num: '02',
    type: 'Recotap · Serverless',
    title: 'State machine & Lambda orchestration',
    desc: 'Designed long-running workflows using AWS Step Functions and Lambda — orchestrating multi-stage jobs with retries, parallel branches and durable state. Replaced fragile cron-driven scripts with observable serverless pipelines.',
    tags: ['AWS Lambda', 'Step Functions', 'Serverless'],
    impact: { num: '0', label: 'silent failures' },
    problem: 'Multi-stage jobs were running on cron with no retries, no parallelism, and no visibility. When something failed at step 3 of 5, the only signal was an empty downstream table the next morning.',
    approach: [
      'Modeled each long-running job as a Step Function state machine with explicit success/retry/failure transitions.',
      'Broke heavy steps into Lambda tasks and used parallel branches where the workload allowed.',
      'Wired in dead-letter queues and CloudWatch alarms — failures surface immediately, not 24 hours later.',
      'Made the state durable so a job mid-flight survives Lambda timeouts and resumes from the last completed step.',
    ],
    outcome: 'Silent failures dropped to zero. Jobs that used to take overnight reruns now self-recover, and the team has a single pane to see which workflows are running, paused, or failed.',
    stack: ['AWS Lambda', 'Step Functions', 'CloudWatch', 'Node.js', 'TypeScript'],
  },
  {
    num: '03',
    type: 'Recotap · Event-driven',
    title: 'GCP Pub/Sub notification system',
    desc: 'Built an internal notification system on top of GCP Pub/Sub — decoupled producers and consumers across services, with topic-per-event design and idempotent handlers. Powers ops alerts, customer notifications, and downstream sync jobs.',
    tags: ['GCP Pub/Sub', 'Event-driven', 'Node.js'],
    impact: { num: '∞', label: 'fan-out ready' },
    problem: 'Services were calling each other directly, so adding a new downstream consumer meant touching the producer. A single slow consumer could back-pressure the whole flow.',
    approach: [
      'Designed a topic-per-event model — producers publish, consumers subscribe without producer knowledge.',
      'Built idempotent handlers so message redelivery is safe.',
      'Added dead-letter routing and structured retries so transient failures don\'t lose events.',
      'Wrote a thin SDK so any service can publish or subscribe in a few lines.',
    ],
    outcome: 'Adding a new consumer is now a config change, not a deploy chain. Producers don\'t know or care who\'s listening, and fan-out is effectively free.',
    stack: ['GCP Pub/Sub', 'Node.js', 'NestJS', 'TypeScript'],
  },
  {
    num: '04',
    type: 'Recotap · Integrations',
    title: 'LinkedIn integration & ROI analytics',
    desc: 'Owned the LinkedIn integration end-to-end — auth, rate-aware sync, and data normalization — and built the ROI graph that surfaces campaign performance with aggregation pipelines tuned for fast dashboard queries.',
    tags: ['LinkedIn API', 'MongoDB', 'Aggregation', 'Angular'],
    impact: { num: '<200ms', label: 'dashboard P95' },
    problem: 'Pulling LinkedIn campaign data was rate-limited, paginated, and the raw shape didn\'t match what dashboards needed. ROI queries against raw events were too slow for a live dashboard.',
    approach: [
      'Built a rate-aware sync that respects LinkedIn API quotas and resumes cleanly from interruption.',
      'Normalized campaign + creative + spend + outcome data into a query-friendly shape.',
      'Designed MongoDB aggregation pipelines and indexes specifically for the ROI dashboard\'s access pattern.',
      'Built the Angular frontend for the ROI graph itself — filtering, drill-down, and date-range navigation.',
    ],
    outcome: 'P95 dashboard query stayed under 200ms even as data grew. The ROI graph is now the primary view customers use to judge campaign performance.',
    stack: ['LinkedIn Marketing API', 'MongoDB', 'Aggregation Pipeline', 'Angular', 'Node.js'],
  },
  {
    num: '05',
    type: 'Recotap · Reliability',
    title: 'Eliminated API crashes from CRM syncs with a BullMQ queue',
    desc: 'A synchronous CRM sales-activity ingestion endpoint was saturating tenant DB connections and crashing the API under load — bursts of ~2,000 req/sec, each carrying ~500 records. I offloaded processing to a dedicated BullMQ + Redis queue, so the API now returns HTTP 202 in milliseconds and database load stays flat regardless of inbound spikes.',
    tags: ['BullMQ', 'Redis', 'NestJS', 'System Design'],
    impact: { num: 'HTTP 202', label: 'ms-fast, crash-free ingestion' },
    problem: 'Third-party CRM syncs hit a synchronous ingestion endpoint at ~2,000 req/sec, each request carrying ~500 records. Every request held a DB connection for the full write, exhausting the tenant connection pool, spiking MongoDB CPU, and taking the API down under bursty load.',
    approach: [
      'Re-architected the endpoint to enqueue a job and immediately return HTTP 202 instead of processing inline.',
      'Built a dedicated sales-activities sync queue on BullMQ + Redis with bounded worker concurrency (3) so DB pressure stays predictable.',
      'Added exponential backoff and automatic retries (3 attempts) so transient failures self-heal instead of dropping data.',
      'Capped worker throughput so ingestion drains at a steady rate the database can absorb — decoupling API latency from sync volume.',
    ],
    outcome: 'The API responds in milliseconds and no longer crashes under CRM sync load. Database load stays flat regardless of traffic spikes, and failed jobs retry automatically instead of silently losing data.',
    stack: ['BullMQ', 'Redis', 'NestJS', 'Node.js', 'TypeScript', 'MongoDB'],
  },
  {
    num: '06',
    type: 'Recotap · Performance',
    title: 'Cut a 50s+ Sales Activity API down to 2–3s',
    desc: 'The Sales Activity list API — search, pagination and total-count over ~7.5M records — took 50s+ and routinely threw 504 Gateway Timeouts on large tenants. I redesigned the queries, indexes and caching to bring it down to 2–3 seconds and eliminate the timeouts.',
    tags: ['MongoDB', 'Indexing', 'Caching', 'Query Optimization'],
    impact: { num: '50s → 2–3s', label: '~20× faster · zero 504s' },
    problem: 'Listing sales activity over ~7.5M records with search, pagination and a total-count was taking 50+ seconds and triggering 504 Gateway Timeouts. The root cause was an unindexed $regex search doing >20s full-collection scans, compounded by an expensive count running on every request.',
    approach: [
      'Replaced the full-collection-scan $regex with index-backed $in lookups resolved from a cached in-memory domain index (stale-while-revalidate, refreshed by a background $group).',
      'Redesigned compound indexes for the actual query shape and added query-time hints with maxTimeMS safeguards to bound worst-case work.',
      'Parallelized the count and data queries and added short-TTL count caching so the expensive total-count stops dominating every request.',
      'Validated the wins against production-scale data on the largest tenants, not just small samples.',
    ],
    outcome: 'List latency dropped from 50s+ to 2–3 seconds (~20× faster), the 504 Gateway Timeouts disappeared, and MongoDB CPU fell sharply — restoring headroom across the multi-tenant cluster and lowering infrastructure cost.',
    stack: ['MongoDB', 'Mongoose', 'Aggregation Pipeline', 'Indexing', 'Caching', 'TypeScript'],
  },
  {
    num: '07',
    type: 'Recotap · Reliability',
    title: 'Built a shared Redis connection pool',
    desc: 'Ad-hoc per-operation Redis clients across the worker fleet risked connection leaks and exhaustion. I implemented a managed connection pool (generic-pool + ioredis) with bounded sizing, acquire timeouts and idle eviction — making Redis usage predictable under load.',
    tags: ['Redis', 'ioredis', 'Connection Pooling', 'Node.js'],
    impact: { num: '10–500', label: 'bounded, leak-free connections' },
    problem: 'The worker fleet created Redis clients per operation, with no shared lifecycle. Under load this leaked connections and risked exhausting Redis — an instability that grew with tenant volume.',
    approach: [
      'Implemented a managed Redis connection pool on generic-pool + ioredis with bounded min/max sizing (min 10 / max 500).',
      'Added acquire timeouts and idle eviction so connections are reused, released deterministically, and never pile up.',
      'Added a per-environment dedicated-Redis-instance option to isolate workloads where needed.',
      'Replaced the ad-hoc per-operation clients across the fleet with the pooled accessor.',
    ],
    outcome: 'Redis connections are now bounded and leak-free across the worker fleet, removing a recurring exhaustion risk and keeping the background system stable as tenant volume grows.',
    stack: ['Redis', 'ioredis', 'generic-pool', 'Node.js', 'TypeScript', 'NestJS'],
  },
  {
    num: '08',
    type: 'Recotap · Data Integrity',
    title: 'Fixed missing & duplicated records in pagination',
    desc: 'The most recent sales activities intermittently disappeared or duplicated across paginated results. I traced it to a non-deterministic sort on a non-unique timestamp and made pagination stable and complete — backed by idempotent ingestion.',
    tags: ['MongoDB', 'Debugging', 'Pagination', 'Data Integrity'],
    impact: { num: '100%', label: 'stable, complete pagination' },
    problem: 'Sales activities sharing the same timestamp were ordered non-deterministically, so the latest records would intermittently drop out of — or duplicate across — paginated results, quietly corrupting what users saw.',
    approach: [
      'Traced the bug to a sort on a non-unique timestamp field with no stable tiebreaker.',
      'Added a deterministic _id tiebreaker to the sort, with supporting indexes so it stays fast.',
      'Made CRM ingestion idempotent via externalActivityId-keyed upserts so re-syncs cannot create duplicates.',
      'Confirmed stable, gap-free pagination across page boundaries on real tenant data.',
    ],
    outcome: 'Pagination is now stable and complete — no missing or duplicated records — and idempotent ingestion guarantees re-syncs stay clean.',
    stack: ['MongoDB', 'Mongoose', 'NestJS', 'Node.js', 'TypeScript'],
  },
  {
    num: '09',
    type: 'Earlier · Migration',
    title: 'Airtable → MongoDB migration',
    desc: 'Led a complete migration of production data from Airtable to MongoDB — schema mapping, batched ETL, dual-write cutover, and validation. Unblocked the next generation of features that Airtable couldn\'t support.',
    tags: ['MongoDB', 'ETL', 'Migration', 'Node.js'],
    impact: { num: '100%', label: 'data parity' },
    problem: 'Airtable had become the operational source of truth but couldn\'t handle the volume, query patterns, or relational integrity the next product surface required.',
    approach: [
      'Mapped every Airtable base to a MongoDB schema, designing for actual query patterns instead of mirroring the spreadsheet shape.',
      'Built a batched ETL job with checkpointing so the migration could resume on failure.',
      'Ran a dual-write phase — both stores received writes — to validate the new system against the old before cutover.',
      'Wrote validation scripts that compared row-by-row counts and field hashes between source and target.',
    ],
    outcome: '100% data parity at cutover. Airtable was retired, queries got dramatically faster, and the schema unblocked features that simply couldn\'t exist before.',
    stack: ['MongoDB', 'Airtable API', 'Node.js', 'TypeScript', 'Batched ETL'],
  },
  {
    num: '10',
    type: 'Earlier · Developer Tooling',
    title: 'MongoDB query-builder plugin',
    desc: 'Designed and shipped an internal MongoDB query-builder plugin used across the team — abstracted common filter, projection and aggregation patterns into a typed, composable API. Cut query-writing effort for other developers by ~40%.',
    tags: ['MongoDB', 'Node.js', 'Internal Tool', 'TypeScript'],
    impact: { num: '40%', label: 'less dev effort' },
    problem: 'Every developer was hand-writing similar filter / projection / aggregation logic. Subtle differences led to subtle bugs and inconsistent indexes.',
    approach: [
      'Identified the most common patterns across the codebase — filters, joins, projections, paginated lookups.',
      'Designed a typed, composable API where queries are built declaratively and compile-time-safe.',
      'Added smart defaults so common cases stay one-liners while complex cases are still possible.',
      'Rolled it out gradually with adoption docs and migration examples.',
    ],
    outcome: 'Internal devs reported ~40% less time per query. Bugs from copy-pasted query logic effectively disappeared, and indexes became easier to reason about.',
    stack: ['MongoDB', 'TypeScript', 'Node.js'],
  },
  {
    num: '11',
    type: 'Earlier · Auth',
    title: 'Cross-domain auto-login (SSO)',
    desc: 'Built a seamless auto-login flow across multiple product domains — token issuance, secure cross-domain handshake, and silent re-auth. Users move between properties without ever seeing a login screen.',
    tags: ['Auth', 'SSO', 'Node.js', 'Cookies / JWT'],
    impact: { num: '0', label: 're-logins' },
    problem: 'A user logged into product A still had to log in again at product B, even though both were owned by the same company. Friction was hurting cross-product adoption.',
    approach: [
      'Issued short-lived signed tokens that one domain could exchange for a full session on another domain.',
      'Built the cross-domain handshake with proper CSRF protection and origin validation.',
      'Added silent re-auth so expired sessions refresh in the background where possible.',
      'Made the flow degrade gracefully — if cross-domain fails, the user lands on a normal login.',
    ],
    outcome: 'Zero forced re-logins between products. Cross-product navigation became invisible from the user\'s perspective.',
    stack: ['Node.js', 'JWT', 'Secure Cookies', 'TypeScript'],
  },
];

function ProjectRow({ p, i, onOpen }: { p: ProjectDetail; i: number; onOpen: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    const ind = indicatorRef.current;
    if (!el || !ind) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    ind.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
  };

  return (
    <motion.div
      className="project"
      ref={ref}
      onMouseMove={onMove}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen()}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay: (i % 3) * 0.05 }}
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
      <div className="p-indicator" ref={indicatorRef}>
        view <span>↗</span>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [active, setActive] = useState<ProjectDetail | null>(null);

  return (
    <section id="projects">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <div className="section-eyebrow"><span className="eyebrow-line" /> 03 / selected work</div>
        <SplitText as="h2" className="section-title">
          Things I've built &amp; problems I've solved.
        </SplitText>
      </motion.div>

      <div className="projects">
        {projects.map((p, i) => (
          <ProjectRow key={p.num} p={p} i={i} onOpen={() => setActive(p)} />
        ))}
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
