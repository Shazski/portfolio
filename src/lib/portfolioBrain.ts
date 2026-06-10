// Knowledge-base + intent matcher that simulates a "personal LLM" trained
// on Sharoon's portfolio. Frontend-only — no API keys needed.

export type Intent = {
  id: string;
  patterns: string[];
  responses: string[];
  suggestions?: string[];
};

const INTENTS: Intent[] = [
  {
    id: 'greet',
    patterns: ['hi', 'hello', 'hey', 'yo ', 'sup ', 'howdy', 'good morning', 'good afternoon', 'good evening'],
    responses: [
      "Hey! I'm Sharoon's personal assistant. Ask me anything about his experience, projects, or skills.",
      "Hi there. Want to know about Sharoon's backend work, the projects he's shipped, or the stack he uses?",
    ],
    suggestions: ['What does Sharoon do?', 'Tell me about his projects', 'What is his tech stack?'],
  },
  {
    id: 'who',
    patterns: ['who is sharoon', 'who are you', 'about sharoon', 'introduce', 'tell me about him', 'about him', 'who is he'],
    responses: [
      "Sharoon is a Software Engineer with a strong backend lean. He builds production systems end-to-end on Node.js, NestJS, MongoDB, and AWS/GCP, with Angular and React on the frontend when needed. He's currently at Recotap (Recotap & AdRadar products) and earlier worked at Skills Outsource Think Pvt Ltd on a product called Haiku.",
    ],
    suggestions: ['What does he build at Recotap?', 'What projects has he shipped?', 'What is his stack?'],
  },
  {
    id: 'role',
    patterns: ['what does sharoon do', 'what does he do', 'his role', 'his job', 'job title', 'position'],
    responses: [
      "Sharoon is a Software Engineer focused on backend systems — APIs, data pipelines, serverless orchestration, event-driven services, and cloud infrastructure. He also ships frontend features in Angular and React when a feature needs full-stack reach.",
    ],
    suggestions: ['What is he working on now?', 'What projects has he shipped?'],
  },

  {
    id: 'recotap',
    patterns: ['recotap', 'current company', 'current job', 'where does he work', 'where works now', 'adradar', 'ad radar'],
    responses: [
      "At Recotap (a product company building ABM marketing on LinkedIn — Recotap and AdRadar), Sharoon has: built two AI auto-blocking agents for company and title classification, designed AWS Step Functions + Lambda workflows replacing fragile cron pipelines, owned a GCP Pub/Sub notification system, and built the LinkedIn integration end-to-end with ROI analytics. A lot of his recent work is performance, scalability and reliability ownership — eliminating API crashes from high-volume CRM syncs (~2,000 req/sec) by offloading to a BullMQ + Redis queue, taking a Sales Activity API over ~7.5M records from 50s+ (504 timeouts) down to 2–3s, building a shared Redis connection pool, and fixing a subtle pagination data-integrity bug.",
    ],
    suggestions: ['Tell me about the BullMQ work', 'How did he fix the 50s API?', 'The Redis connection pool?'],
  },
  {
    id: 'previous-job',
    patterns: ['previous company', 'previous job', 'before recotap', 'earlier', 'skills outsource', 'haiku', 'past job'],
    responses: [
      "Before Recotap, Sharoon worked at Skills Outsource Think Pvt Ltd on a product called Haiku — a service company running ad operations for French advertisers across Meta, TikTok and other social platforms. There he led the Airtable→MongoDB migration, built an internal MongoDB query-builder plugin (~40% less query effort across the team), and shipped a cross-domain SSO flow.",
    ],
    suggestions: ['Tell me about the migration', 'Query-builder plugin?', 'Cross-domain SSO?'],
  },

  {
    id: 'projects',
    patterns: ['projects', 'what has he built', 'what has he shipped', 'his work', 'portfolio of work', 'case studies', 'what he made'],
    responses: [
      "Sharoon's selected projects: (1) AI auto-blocking agents at Recotap/AdRadar, (2) State Machine & Lambda Orchestration, (3) GCP Pub/Sub notification system, (4) LinkedIn integration & ROI analytics, (5) Offloading high-volume CRM syncs to a BullMQ queue, (6) Cutting a 50s+ Sales Activity API to 2–3s, (7) Shared Redis connection pool, (8) Pagination data-integrity fix, (9) Airtable→MongoDB migration at Haiku, (10) MongoDB query-builder plugin, (11) Cross-domain SSO. Click any project on the page to see the full case study.",
    ],
    suggestions: ['The BullMQ queue work?', 'How did he fix the 50s API?', 'The Redis connection pool?'],
  },
  {
    id: 'ai-agents',
    patterns: ['ai agents', 'auto blocking', 'auto-blocking', 'classification', 'llm agents', 'targeting agents', 'company title agents'],
    responses: [
      "Sharoon built two production AI agents that auto-block companies and job titles. He designed an LLM-backed classification pipeline that scores candidate entities with auditable reasoning, with confidence thresholds routing uncertain cases for human review. The decisions are integrated into the ad campaign delivery flow so blocks take effect on the next ad cycle. Tech: Node.js, NestJS, TypeScript, MongoDB, LLM APIs, AWS Lambda.",
    ],
  },
  {
    id: 'step-functions',
    patterns: ['step function', 'state machine', 'lambda', 'serverless', 'orchestration', 'workflow', 'cron'],
    responses: [
      "He replaced fragile cron-driven scripts with AWS Step Function state machines. Each long-running job is modeled with explicit success/retry/failure transitions; heavy work runs as parallel Lambda tasks. Dead-letter queues and CloudWatch alarms surface failures immediately. State is durable so jobs survive Lambda timeouts and resume from the last completed step.",
    ],
  },
  {
    id: 'pubsub',
    patterns: ['pubsub', 'pub/sub', 'pub sub', 'notification system', 'event driven', 'event-driven', 'topic'],
    responses: [
      "Sharoon built the internal notification system on GCP Pub/Sub using a topic-per-event model — producers publish without knowing or coupling to consumers. Handlers are idempotent so message redelivery is safe. Dead-letter routing and structured retries handle transient failures. A thin internal SDK lets any service publish or subscribe in a few lines.",
    ],
  },
  {
    id: 'linkedin-roi',
    patterns: ['linkedin', 'roi', 'analytics', 'dashboard', 'aggregation', 'p95'],
    responses: [
      "He owns the LinkedIn Marketing API integration end-to-end — rate-aware sync, data normalization, and resume-from-interrupt logic. He then built the ROI analytics with MongoDB aggregation pipelines and indexes tuned for the dashboard's access pattern, keeping P95 under 200ms. The frontend ROI graph is in Angular with filtering and date-range navigation.",
    ],
  },
  {
    id: 'bullmq-queue',
    patterns: ['bullmq', 'bull mq', 'job queue', 'queue', 'async job', 'crm sync', 'api crash', 'offload', 'backpressure', 'background job', '202', 'ingestion'],
    responses: [
      "A synchronous CRM sales-activity ingestion endpoint was crashing Recotap's API. Third-party syncs hit it at ~2,000 req/sec, each request carrying ~500 records, and every request held a DB connection for the full write — exhausting the tenant connection pool and spiking MongoDB CPU. Sharoon re-architected it to enqueue a job and return HTTP 202 in milliseconds, with a dedicated BullMQ + Redis queue (bounded concurrency of 3, exponential backoff, 3 retries). Now the API responds instantly and database load stays flat regardless of inbound spikes.",
    ],
    suggestions: ['How did he fix the 50s API?', 'The Redis connection pool?'],
  },
  {
    id: 'slow-api',
    patterns: ['sales activity', 'slow api', '50s', '504', 'gateway timeout', 'timeout', 'pagination', 'search filter', 'list api', 'latency', 'regex', 'count', '7.5m', 'cpu', 'mongodb cpu', 'slow query', 'index'],
    responses: [
      "The Sales Activity list API — search, pagination and a total-count over ~7.5M records — took 50+ seconds and routinely threw 504 Gateway Timeouts on large tenants. The culprit was an unindexed $regex doing >20s full-collection scans, plus an expensive count on every request. Sharoon replaced the $regex with index-backed $in lookups resolved from a cached in-memory domain index (stale-while-revalidate), redesigned compound indexes with query hints and maxTimeMS safeguards, and parallelized the count/data queries with short-TTL count caching. Result: 50s+ → 2–3s (~20× faster), zero 504s, and a sharp drop in MongoDB CPU.",
    ],
    suggestions: ['The BullMQ queue work?', 'The pagination bug?'],
  },
  {
    id: 'redis-pool',
    patterns: ['redis', 'connection pool', 'connection pooling', 'ioredis', 'generic-pool', 'connection leak', 'exhaustion', 'resource management'],
    responses: [
      "Across Recotap's worker fleet, Redis clients were being created per operation with no shared lifecycle — leaking connections and risking exhaustion under load. Sharoon built a managed Redis connection pool on generic-pool + ioredis with bounded sizing (min 10 / max 500), acquire timeouts, idle eviction, and a per-environment dedicated-instance option, then replaced the ad-hoc clients fleet-wide. Connections are now bounded and leak-free, removing a recurring instability as tenant volume grows.",
    ],
    suggestions: ['The BullMQ queue work?', 'How did he fix the 50s API?'],
  },
  {
    id: 'data-integrity',
    patterns: ['data integrity', 'data accuracy', 'last data', 'latest record', 'duplicate', 'missing record', 'reporting bug', 'data bug', 'idempotent', 'tiebreaker'],
    responses: [
      "Sharoon tracked down a bug where the most recent sales activities intermittently disappeared or duplicated across paginated results. The root cause was a non-deterministic sort on a non-unique timestamp. He added a deterministic _id tiebreaker to the sort (with supporting indexes) and made CRM ingestion idempotent via externalActivityId-keyed upserts — guaranteeing stable, complete, gap-free pagination and clean re-syncs.",
    ],
    suggestions: ['How did he fix the 50s API?', 'The BullMQ queue work?'],
  },
  {
    id: 'migration',
    patterns: ['migration', 'airtable', 'etl', 'data migration', 'mongo migration'],
    responses: [
      "At Skills Outsource Think (product: Haiku), Sharoon led the production data migration from Airtable to MongoDB. He mapped every Airtable base to a MongoDB schema designed for actual query patterns, built a batched ETL with checkpointing, ran a dual-write phase to validate the new system, and wrote row-level validation scripts comparing counts and field hashes. Result: 100% data parity at cutover.",
    ],
  },
  {
    id: 'query-builder',
    patterns: ['query builder', 'query-builder', 'mongo plugin', 'mongodb plugin', 'internal tool', 'tooling'],
    responses: [
      "He designed and shipped an internal MongoDB query-builder plugin used across the team. It abstracts common filter, projection, and aggregation patterns into a typed, composable API where queries are verified at compile time. Smart defaults keep simple queries one-liners. Roll-out with docs and migration examples — reduced query-writing effort across the team by ~40%.",
    ],
  },
  {
    id: 'sso',
    patterns: ['sso', 'single sign on', 'single-sign-on', 'auto login', 'auto-login', 'cross domain', 'cross-domain', 'auth flow'],
    responses: [
      "Sharoon built a seamless cross-domain auto-login flow: short-lived signed tokens that one domain can exchange for a full session on another, with CSRF-protected handshake and strict origin validation. Silent re-authentication refreshes expired sessions in the background. Graceful fallback to native login if anything fails. Result: zero forced re-logins between products.",
    ],
  },

  {
    id: 'skills',
    patterns: ['skills', 'stack', 'tech stack', 'technologies', 'what does he use', 'languages', 'frameworks'],
    responses: [
      "Languages: TypeScript, JavaScript, SQL. Backend: Node.js, NestJS, Express.js, REST APIs, API Gateway, Microservices. Frontend: Angular, React, HTML/CSS. Databases: MongoDB (deep — aggregation pipeline, indexing, bulk ops, query/CPU optimization), Redis, Airtable. Messaging / Queues: BullMQ, Kafka, RabbitMQ, GCP Pub/Sub. Cloud: AWS Lambda, Step Functions, Vercel. DevOps: Docker, Kubernetes, CI/CD. Architecture: event-driven design, state machines, performance & reliability tuning, SSO/auth.",
    ],
    suggestions: ['Backend stack?', 'Database experience?', 'Cloud / DevOps?'],
  },
  {
    id: 'backend',
    patterns: ['backend', 'node', 'node.js', 'nodejs', 'nestjs', 'express', 'api'],
    responses: [
      "Backend is Sharoon's home — Node.js + NestJS + TypeScript is the daily driver. He's shipped REST APIs, microservices, event-driven services, and serverless workflows. Strong focus on performance, observability, and reliability in production.",
    ],
  },
  {
    id: 'database',
    patterns: ['database', 'mongodb', 'mongo', 'aggregation', 'indexing', 'query', 'sql'],
    responses: [
      "He's gone deep on MongoDB — aggregation pipelines, index intersection, the query planner, execution stats, bulk operations. He took a Sales Activity API over ~7.5M records from 50s+ (504 timeouts) to 2–3s by replacing full-collection-scan $regex with index-backed cached lookups and parallelized counts, kept dashboard P95 < 200ms, and built an internal query-builder plugin used across the team.",
    ],
  },
  {
    id: 'frontend',
    patterns: ['frontend', 'react', 'angular', 'ui', 'html', 'css'],
    responses: [
      "Full-stack reach when needed — Angular at Recotap for the analytics and integration surfaces, React earlier at Haiku for customer-facing and internal products. The portfolio you're looking at right now is built in React + Three.js + Framer Motion.",
    ],
  },
  {
    id: 'cloud',
    patterns: ['cloud', 'aws', 'gcp', 'amazon', 'google cloud', 'devops', 'docker', 'kubernetes', 'k8s', 'ci/cd', 'ci cd'],
    responses: [
      "AWS Lambda + Step Functions for serverless workloads, GCP Pub/Sub for event-driven systems, Docker and Kubernetes for containerization, CI/CD pipelines for deploys. He's comfortable operating services in production — instrumenting for logging, metrics, and alerting.",
    ],
  },
  {
    id: 'leadership',
    patterns: ['leadership', 'mentoring', 'mentor', 'code review', 'senior', 'tech spec', 'collaboration', 'team'],
    responses: [
      "Beyond pure technical chops, Sharoon does code reviews, mentors teammates on MongoDB internals and API design, writes tech specs, runs architecture reviews, and works cross-team. The senior-engineer soft skills, not just the code.",
    ],
  },

  {
    id: 'contact',
    patterns: ['contact', 'email', 'reach', 'get in touch', 'hire', 'connect', 'social'],
    responses: [
      "You can reach Sharoon at sharoonkp267@gmail.com. He's on GitHub at github.com/Shazski and LinkedIn at linkedin.com/in/sharoon-kp-264399215. Portfolio: sharoon.in.",
    ],
    suggestions: ['Is he open to work?', 'Where is he based?'],
  },
  {
    id: 'available',
    patterns: ['open to work', 'available', 'hiring', 'hire him', 'free', 'opportunities', 'opportunity'],
    responses: [
      "Yes — Sharoon is open to backend roles, freelance engagements, and interesting MongoDB / API architecture problems. The fastest way to reach him is sharoonkp267@gmail.com.",
    ],
  },
  {
    id: 'resume',
    patterns: ['resume', 'cv', 'curriculum', 'download'],
    responses: [
      "Click the \"Download CV\" button in the hero section, or grab it directly at /Sharoon-Resume.pdf. It's a 2-page ATS-friendly version covering experience, projects (with tech stacks), and skills.",
    ],
  },
  {
    id: 'github',
    patterns: ['github', 'code repo', 'repository', 'open source'],
    responses: [
      "Sharoon's GitHub is github.com/Shazski — including the source for this portfolio.",
    ],
  },
  {
    id: 'linkedin-profile',
    patterns: ['linkedin profile', 'linkedin url', 'on linkedin'],
    responses: [
      "His LinkedIn is at linkedin.com/in/sharoon-kp-264399215.",
    ],
  },
  {
    id: 'location',
    patterns: ['location', 'where based', 'where is he based', 'country', 'timezone', 'where does he live'],
    responses: [
      "Sharoon is based in India and works remotely / hybrid across timezones.",
    ],
  },

  {
    id: 'metrics',
    patterns: ['impact', 'metrics', 'numbers', 'stats', 'achievements', 'results'],
    responses: [
      "Some numbers from his work: took a Sales Activity API over ~7.5M records from 50s+ (504 timeouts) down to 2–3s (~20× faster), eliminated API crashes under ~2,000 req/sec CRM sync load by offloading to a BullMQ queue (HTTP 202 in milliseconds), built a Redis connection pool bounded at 10–500 connections, 40% less team query-writing effort via the MongoDB query-builder plugin, 10M+ records migrated/processed, 2 AI auto-blocking agents shipped, and ROI dashboard P95 kept under 200ms.",
    ],
  },

  {
    id: 'portfolio-tech',
    patterns: ['this portfolio', 'this site', 'this website', 'built with', 'how is this built', 'what is this built'],
    responses: [
      "This portfolio is built with React 18, Vite, TypeScript, Three.js (via @react-three/fiber and drei) for the 3D hero scene, Framer Motion for animations, and Lenis for smooth scrolling. The 3D developer character, laptop, and animated coding symbols are all procedural.",
    ],
  },

  {
    id: 'thanks',
    patterns: ['thanks', 'thank you', 'thx', 'appreciate'],
    responses: [
      "You're welcome! Anything else you'd like to know about Sharoon?",
      "Glad I could help. Want to hear about a specific project or part of his stack?",
    ],
  },
  {
    id: 'bye',
    patterns: ['bye', 'goodbye', 'see you', 'cya', 'later'],
    responses: ["Catch you later! Don't forget to grab the CV from the hero section."],
  },
];

const FALLBACK_RESPONSES = [
  "I can answer questions about Sharoon's experience, projects, skills, and how to reach him. Try \"What does he build at Recotap?\" or \"What's his stack?\"",
  "Hmm, I don't have a precise answer for that. I'm best at questions about his projects, work history, or tech stack — want to try one of those?",
  "Not sure I caught that. Ask me about his projects (AI agents, ROI analytics, the Airtable→MongoDB migration), his stack, or how to reach him.",
];

export const SUGGESTED_PROMPTS = [
  'Who is Sharoon?',
  'What does he build at Recotap?',
  'Tell me about his AI agents project',
  'What is his tech stack?',
  'Is he open to work?',
];

function normalize(s: string) {
  return s.toLowerCase().replace(/[^\w\s/-]/g, ' ').replace(/\s+/g, ' ').trim();
}

// =================================================================
// Role-tailored pitch generator
// =================================================================
type RoleCat = {
  label: string;
  keywords: string[];
  lead: string;
  projects: string[];
  stack: string[];
};

const ROLE_CATS: Record<string, RoleCat> = {
  ai: {
    label: 'AI / ML',
    keywords: ['ai', 'ml', 'machine learning', 'llm', 'genai', 'data scientist', 'mlops', 'nlp', 'aiml', 'gen ai', 'generative'],
    lead: 'AI / ML',
    projects: [
      'two production LLM-backed classification agents (auto-blocking companies and titles at Recotap and AdRadar)',
      'integrating LLM decisions into a real-time ad-delivery pipeline with confidence-threshold human-in-loop review',
      'structured decision logging and observability so every classification can be audited',
    ],
    stack: ['LLM APIs', 'Node.js', 'NestJS', 'MongoDB', 'AWS Lambda', 'TypeScript'],
  },
  backend: {
    label: 'Backend',
    keywords: ['backend', 'platform', 'systems', 'api', 'microservices', 'server', 'distributed', 'scalable'],
    lead: 'Backend',
    projects: [
      'eliminating API crashes from high-volume CRM syncs (~2,000 req/sec) by offloading ingestion to a BullMQ + Redis queue with bounded concurrency, backoff and retries',
      'taking a Sales Activity API over ~7.5M records from 50s+ (504 timeouts) to 2–3s via index-backed cached queries, plus a shared Redis connection pool to prevent exhaustion',
      'AWS Step Functions + Lambda orchestration and a GCP Pub/Sub event-driven notification system',
    ],
    stack: ['Node.js', 'NestJS', 'MongoDB', 'Redis', 'BullMQ', 'AWS Lambda', 'GCP Pub/Sub', 'TypeScript'],
  },
  cloud: {
    label: 'Cloud / DevOps',
    keywords: ['cloud', 'aws', 'gcp', 'devops', 'infra', 'sre', 'platform engineer', 'infrastructure', 'kubernetes', 'docker'],
    lead: 'Cloud and Platform',
    projects: [
      'AWS Step Functions orchestrating multi-stage serverless workflows with durable state',
      'GCP Pub/Sub topic-per-event architecture with a thin internal SDK',
      'Docker, Kubernetes, CI/CD pipelines, and production debugging on services running at 99.9% uptime',
    ],
    stack: ['AWS Lambda', 'Step Functions', 'GCP Pub/Sub', 'Docker', 'Kubernetes', 'CI/CD'],
  },
  data: {
    label: 'Data',
    keywords: ['data', 'database', 'etl', 'analytics', 'mongo', 'sql', 'pipeline', 'data engineer', 'warehouse'],
    lead: 'Data Engineering',
    projects: [
      'MongoDB query/index/caching redesign that took a 50s+ list API over ~7.5M records (with search, pagination and counts) down to 2–3s and eliminated 504 timeouts',
      'production Airtable to MongoDB migration with 100% data parity (batched ETL, dual-write cutover, validation)',
      'internal MongoDB query-builder plugin used across the team — reduced query-writing effort by ~40%',
    ],
    stack: ['MongoDB', 'Aggregation Pipeline', 'Indexing', 'ETL', 'Redis', 'TypeScript'],
  },
  fullstack: {
    label: 'Full Stack',
    keywords: ['fullstack', 'full stack', 'full-stack', 'product', 'startup', 'product engineer'],
    lead: 'Full Stack',
    projects: [
      'Recotap ABM platform end-to-end — backend APIs and Angular ROI analytics surfaces',
      'Haiku ad-ops product — React frontend + Node.js APIs',
      'Cross-domain SSO across multiple product domains, eliminating forced re-logins',
    ],
    stack: ['Node.js', 'NestJS', 'Angular', 'React', 'MongoDB', 'AWS', 'GCP'],
  },
  frontend: {
    label: 'Frontend',
    keywords: ['frontend', 'front end', 'react', 'angular', 'ui', 'ux engineer', 'web'],
    lead: 'Frontend (with deep backend reach)',
    projects: [
      'Angular ROI analytics dashboard with filtering, drill-down, and date-range navigation',
      'React features across customer-facing and internal products at Haiku',
      'This portfolio: React + Three.js + Framer Motion + Lenis',
    ],
    stack: ['React', 'Angular', 'TypeScript', 'Framer Motion', 'Three.js'],
  },
  senior: {
    label: 'Senior / Staff',
    keywords: ['senior', 'staff', 'tech lead', 'lead engineer', 'principal', 'engineering manager', 'em'],
    lead: 'Senior IC',
    projects: [
      'owned end-to-end systems (LinkedIn integration + ROI analytics, AI agents, Pub/Sub notification system)',
      'led production migration from Airtable to MongoDB and shipped team-wide internal tooling',
      'code reviews, architecture reviews, tech specs, and cross-team collaboration',
    ],
    stack: ['Architecture', 'Mentoring', 'Tech Specs', 'Observability', 'Code Review'],
  },
};

function categorize(role: string): RoleCat {
  const r = role.toLowerCase();
  let bestKey = 'backend';
  let bestScore = 0;
  for (const [k, v] of Object.entries(ROLE_CATS)) {
    let score = 0;
    for (const kw of v.keywords) {
      if (r.includes(kw)) score += kw.length;
    }
    if (score > bestScore) { bestScore = score; bestKey = k; }
  }
  return ROLE_CATS[bestKey];
}

// =================================================================
// Job-description matcher
// =================================================================
type SkillEntry = { keys: string[]; canonical: string };

const ALL_SKILLS: SkillEntry[] = [
  { keys: ['typescript', 'ts'], canonical: 'TypeScript' },
  { keys: ['javascript', 'js'], canonical: 'JavaScript' },
  { keys: ['sql'], canonical: 'SQL' },
  { keys: ['node', 'nodejs', 'node.js'], canonical: 'Node.js' },
  { keys: ['nestjs', 'nest.js'], canonical: 'NestJS' },
  { keys: ['express'], canonical: 'Express.js' },
  { keys: ['rest api', 'restful', 'rest '], canonical: 'REST APIs' },
  { keys: ['microservice'], canonical: 'Microservices' },
  { keys: ['api gateway'], canonical: 'API Gateway' },
  { keys: ['react'], canonical: 'React' },
  { keys: ['angular'], canonical: 'Angular' },
  { keys: ['mongodb', 'mongo'], canonical: 'MongoDB' },
  { keys: ['aggregation'], canonical: 'Aggregation Pipeline' },
  { keys: ['indexing'], canonical: 'Indexing' },
  { keys: ['redis'], canonical: 'Redis' },
  { keys: ['bullmq', 'bull mq'], canonical: 'BullMQ' },
  { keys: ['kafka'], canonical: 'Kafka' },
  { keys: ['rabbitmq'], canonical: 'RabbitMQ' },
  { keys: ['pub/sub', 'pubsub'], canonical: 'Pub/Sub' },
  { keys: ['aws lambda', 'lambda'], canonical: 'AWS Lambda' },
  { keys: ['step function'], canonical: 'Step Functions' },
  { keys: ['gcp', 'google cloud'], canonical: 'GCP' },
  { keys: ['aws'], canonical: 'AWS' },
  { keys: ['docker'], canonical: 'Docker' },
  { keys: ['kubernetes', 'k8s'], canonical: 'Kubernetes' },
  { keys: ['ci/cd', 'cicd', 'continuous integration'], canonical: 'CI/CD' },
  { keys: ['event-driven', 'event driven'], canonical: 'Event-driven' },
  { keys: ['state machine'], canonical: 'State Machines' },
  { keys: ['sso', 'single sign-on'], canonical: 'SSO' },
  { keys: ['jwt'], canonical: 'JWT' },
  { keys: ['llm'], canonical: 'LLM' },
  { keys: ['machine learning', ' ml '], canonical: 'Machine Learning' },
  { keys: ['serverless'], canonical: 'Serverless' },
  { keys: ['observability', 'monitoring', 'logging'], canonical: 'Observability' },
  { keys: ['agile', 'scrum'], canonical: 'Agile' },
];

const COMMON_OTHER_TECH = ['rust', 'go', 'golang', 'python', 'java', 'kotlin', 'swift', 'postgres', 'postgresql', 'mysql', 'azure', 'graphql', 'elasticsearch', 'spark', 'hadoop', 'snowflake'];

export type JobMatch = {
  score: number;
  matched: string[];
  missing: string[];
  pitch: string;
};

export function matchJobDescription(jd: string): JobMatch {
  const j = ' ' + jd.toLowerCase() + ' ';
  const matched: string[] = [];

  for (const skill of ALL_SKILLS) {
    if (skill.keys.some((k) => j.includes(k))) {
      if (!matched.includes(skill.canonical)) matched.push(skill.canonical);
    }
  }

  const missing: string[] = [];
  for (const t of COMMON_OTHER_TECH) {
    if (j.includes(t) && !matched.some((m) => m.toLowerCase().includes(t))) {
      missing.push(t);
    }
  }

  const score = Math.min(100, Math.round((matched.length / 8) * 100));
  const top = matched.slice(0, 6).join(', ');
  const pitch =
    matched.length === 0
      ? `Limited direct keyword overlap with this JD, but Sharoon's strengths in backend systems, cloud orchestration, MongoDB, and AI agents transfer broadly. Reach out at sharoonkp267@gmail.com to discuss.`
      : missing.length === 0
      ? `Strong fit — overlap on ${matched.length} core skills (${top}). Most directly relevant work: AWS Step Functions orchestration, GCP Pub/Sub event system, AI auto-blocking agents, and MongoDB aggregations tuned for sub-200ms dashboards. Reach out at sharoonkp267@gmail.com.`
      : `Good fit on ${matched.length} skills (${top}). The JD also mentions ${missing.join(', ')} — Sharoon can ramp on adjacent tooling quickly given his breadth of language and platform exposure. Reach out at sharoonkp267@gmail.com.`;

  return { score, matched, missing, pitch };
}

export function generatePitch(role: string): string {
  const r = role.trim() || 'engineering';
  const cat = categorize(r);
  const projList = cat.projects.map((p, i) => `(${i + 1}) ${p}`).join('; ');
  return `Hi — I'm Sharoon, a Software Engineer with strong ${cat.lead} experience and a backend lean. For a ${r} role, the most relevant work is: ${projList}. Core stack for this role: ${cat.stack.join(', ')}. I've operated production services at 99.9% uptime, shipped systems used at scale, and currently work at Recotap on the Recotap and AdRadar products. Open to backend, AI, and platform work — reach me at sharoonkp267@gmail.com.`;
}

export type Reply = { text: string; suggestions?: string[] };

export function answer(input: string): Reply {
  const q = normalize(input);
  if (!q) {
    return { text: FALLBACK_RESPONSES[0] };
  }

  let best: { score: number; intent: Intent | null } = { score: 0, intent: null };
  for (const intent of INTENTS) {
    let score = 0;
    for (const pat of intent.patterns) {
      const p = pat.toLowerCase();
      if (q.includes(p)) {
        score += p.length + 1;
      } else {
        // partial match: each word in pattern that appears in q earns points
        const words = p.split(/\s+/);
        let wordHits = 0;
        for (const w of words) {
          if (w.length > 2 && q.includes(w)) wordHits++;
        }
        if (wordHits === words.length && words.length > 0) {
          score += p.length;
        } else if (wordHits > 0) {
          score += wordHits;
        }
      }
    }
    if (score > best.score) best = { score, intent };
  }

  if (best.intent && best.score > 2) {
    const r = best.intent.responses[Math.floor(Math.random() * best.intent.responses.length)];
    return { text: r, suggestions: best.intent.suggestions };
  }
  return { text: FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)] };
}
