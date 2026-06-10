import { motion } from 'framer-motion';

type Props = { num: string; title: string };

const ease = [0.22, 1, 0.36, 1] as const;

export default function ProjectVisual({ num, title }: Props) {
  return (
    <div className="modal-visual">
      <div className="modal-visual-bg" />
      <svg className="modal-visual-svg" viewBox="0 0 600 320" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="strokeGrad" x1="0" x2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
          </linearGradient>
          <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.05)" />
          </pattern>
        </defs>
        <rect width="600" height="320" fill="url(#dots)" />
        {renderVisual(num)}
      </svg>
      <div className="modal-visual-label mono">{title.toUpperCase()}</div>
      <div className="modal-visual-chip mono">{visualKind(num)}</div>
    </div>
  );
}

function visualKind(num: string) {
  switch (num) {
    case '01': return 'agents · classification';
    case '02': return 'step functions · state machine';
    case '03': return 'pub/sub · fan-out';
    case '04': return 'roi · aggregation';
    case '05': return 'bullmq · async queue';
    case '06': return 'index + cache · 50s → 2–3s';
    case '07': return 'redis · connection pool';
    case '08': return 'pagination · deterministic sort';
    case '09': return 'etl · migration';
    case '10': return 'query · composable api';
    case '11': return 'sso · cross-domain';
    default: return 'system';
  }
}

function renderVisual(num: string) {
  switch (num) {
    case '01': return <AgentsViz />;
    case '02': return <StateMachineViz />;
    case '03': return <PubSubViz />;
    case '04': return <RoiViz />;
    case '05': return <QueueViz />;
    case '06': return <QueryPerfViz />;
    case '07': return <PoolViz />;
    case '08': return <PaginationViz />;
    case '09': return <MigrationViz />;
    case '10': return <QueryViz />;
    case '11': return <SsoViz />;
    default: return null;
  }
}

const drawPath = (d: string, delay = 0) => (
  <motion.path
    d={d}
    fill="none"
    stroke="url(#strokeGrad)"
    strokeWidth="1.2"
    initial={{ pathLength: 0, opacity: 0 }}
    animate={{ pathLength: 1, opacity: 1 }}
    transition={{ duration: 1.2, delay, ease }}
  />
);

const node = (cx: number, cy: number, label: string, delay = 0, r = 22) => (
  <motion.g
    initial={{ opacity: 0, scale: 0.6 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay, ease }}
    style={{ transformOrigin: `${cx}px ${cy}px` }}
  >
    <circle cx={cx} cy={cy} r={r} fill="#0d0d0f" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
    <text x={cx} y={cy + 3} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="rgba(255,255,255,0.85)">{label}</text>
  </motion.g>
);

function AgentsViz() {
  const inputs = ['Acme', 'BankCo', 'TitleX', 'TitleY'];
  return (
    <g>
      <text x="40" y="50" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="rgba(255,255,255,0.5)">INPUT</text>
      {inputs.map((t, i) => (
        <motion.g
          key={t}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 + i * 0.1, ease }}
        >
          <rect x="40" y={70 + i * 42} width="110" height="30" rx="4" fill="none" stroke="rgba(255,255,255,0.18)" />
          <text x="55" y={89 + i * 42} fontFamily="JetBrains Mono, monospace" fontSize="11" fill="rgba(255,255,255,0.8)">{t}</text>
        </motion.g>
      ))}

      {drawPath('M 150 85 Q 220 85 280 130', 0.6)}
      {drawPath('M 150 127 Q 220 127 280 145', 0.7)}
      {drawPath('M 150 169 Q 220 169 280 160', 0.8)}
      {drawPath('M 150 211 Q 220 211 280 175', 0.9)}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.5 }}>
        <rect x="280" y="120" width="100" height="80" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.3)" />
        <text x="330" y="148" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="rgba(255,255,255,0.85)">AI AGENT</text>
        <text x="330" y="166" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="rgba(255,255,255,0.5)">classify</text>
        <motion.circle
          cx="330" cy="183" r="3" fill="#4ade80"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
      </motion.g>

      {drawPath('M 380 145 L 460 110', 1.1)}
      {drawPath('M 380 175 L 460 215', 1.2)}

      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.3, duration: 0.5 }}>
        <rect x="460" y="90" width="100" height="40" rx="4" fill="rgba(74,222,128,0.06)" stroke="rgba(74,222,128,0.4)" />
        <text x="510" y="115" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="rgba(74,222,128,0.9)">ALLOW</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.4, duration: 0.5 }}>
        <rect x="460" y="195" width="100" height="40" rx="4" fill="rgba(239,68,68,0.06)" stroke="rgba(239,68,68,0.4)" />
        <text x="510" y="220" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="rgba(239,68,68,0.9)">BLOCK</text>
      </motion.g>
    </g>
  );
}

function StateMachineViz() {
  return (
    <g>
      {node(70, 160, 'START', 0.1, 24)}
      {drawPath('M 94 160 L 156 160', 0.4)}
      {node(180, 160, 'FETCH', 0.4, 26)}
      {drawPath('M 206 160 L 268 100', 0.7)}
      {drawPath('M 206 160 L 268 220', 0.75)}
      {node(296, 90, 'MAP', 0.9, 24)}
      {node(296, 230, 'ENRICH', 0.95, 28)}
      {drawPath('M 320 90 L 388 160', 1.15)}
      {drawPath('M 324 230 L 388 160', 1.2)}
      {node(412, 160, 'WRITE', 1.35, 26)}
      {drawPath('M 438 160 L 510 160', 1.55)}
      {node(534, 160, 'DONE', 1.7, 24)}

      <motion.circle
        cx={70} cy={160} r="3" fill="#4ade80"
        animate={{ cx: [70, 180, 296, 412, 534, 534], cy: [160, 160, 90, 160, 160, 160] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
      />
    </g>
  );
}

function PubSubViz() {
  const consumers = [
    { x: 480, y: 60 },
    { x: 510, y: 130 },
    { x: 510, y: 200 },
    { x: 480, y: 270 },
  ];
  return (
    <g>
      {node(120, 160, 'PROD', 0.1, 28)}
      {drawPath('M 148 160 L 260 160', 0.4)}

      <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 0.5 }} style={{ transformOrigin: '300px 160px' }}>
        <rect x="260" y="130" width="90" height="60" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.3)" />
        <text x="305" y="156" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="rgba(255,255,255,0.85)">TOPIC</text>
        <text x="305" y="172" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="rgba(255,255,255,0.5)">events.x</text>
      </motion.g>

      {consumers.map((c, i) => (
        <g key={i}>
          {drawPath(`M 350 160 Q ${(350 + c.x) / 2} ${c.y} ${c.x - 24} ${c.y}`, 0.9 + i * 0.1)}
          {node(c.x, c.y, `C${i + 1}`, 1.1 + i * 0.1, 22)}
        </g>
      ))}

      {consumers.map((c, i) => (
        <motion.circle
          key={i}
          r="3"
          fill="#4ade80"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0], cx: [350, c.x - 24], cy: [160, c.y] }}
          transition={{ duration: 1.6, delay: 1.5 + i * 0.25, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
        />
      ))}
    </g>
  );
}

function RoiViz() {
  const bars = [60, 92, 75, 130, 118, 165, 148, 195, 210, 178, 235, 250];
  const max = 260;
  const w = 32;
  const gap = 12;
  const startX = 60;
  const baseY = 270;
  return (
    <g>
      <line x1="55" y1={baseY} x2="555" y2={baseY} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <line x1="55" y1="50" x2="55" y2={baseY} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

      {bars.map((h, i) => {
        const x = startX + i * (w + gap);
        return (
          <motion.rect
            key={i}
            x={x}
            y={baseY - h}
            width={w}
            height={h}
            fill="rgba(255,255,255,0.15)"
            stroke="rgba(255,255,255,0.5)"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 + i * 0.05, ease }}
            style={{ transformOrigin: `${x}px ${baseY}px` }}
          />
        );
      })}

      <motion.path
        d={bars.map((h, i) => `${i === 0 ? 'M' : 'L'} ${startX + i * (w + gap) + w / 2} ${baseY - h - 6}`).join(' ')}
        fill="none"
        stroke="#4ade80"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, delay: 1, ease }}
      />

      <text x="60" y="42" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="rgba(255,255,255,0.4)">ROI · 12 WEEKS</text>
      <text x="500" y="42" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#4ade80">+312%</text>
    </g>
  );
}

// 05 — High-volume CRM sync offloaded to a BullMQ queue.
// Burst of requests → API returns 202 instantly → buffered in the queue →
// drained by a bounded pool of workers at a steady rate → DB load stays flat.
function QueueViz() {
  const reqs = [0, 1, 2, 3, 4];
  const workers = [110, 160, 210];
  const jobs = [0, 1, 2, 3];
  return (
    <g>
      {/* incoming burst */}
      <text x="34" y="44" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="rgba(255,255,255,0.45)">CRM SYNC · ~2000/s</text>
      {reqs.map((i) => (
        <motion.rect
          key={i}
          x="34" y={62 + i * 36} width="58" height="24" rx="3"
          fill="none" stroke="rgba(239,68,68,0.35)"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: [0, 1, 1], x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease }}
        />
      ))}

      {drawPath('M 92 150 L 138 150', 0.5)}

      {/* API returns 202 immediately */}
      <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 0.5 }} style={{ transformOrigin: '178px 150px' }}>
        <rect x="138" y="118" width="80" height="64" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.3)" />
        <text x="178" y="144" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="rgba(255,255,255,0.85)">API</text>
        <text x="178" y="162" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="rgba(74,222,128,0.9)">202</text>
      </motion.g>

      {drawPath('M 218 150 L 268 150', 0.8)}

      {/* BullMQ queue buffer */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.5 }}>
        <rect x="268" y="120" width="96" height="60" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.28)" />
        <text x="316" y="112" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="rgba(255,255,255,0.5)">BULLMQ</text>
        {jobs.map((j) => (
          <motion.rect
            key={j}
            x={278 + j * 20} y="138" width="14" height="24" rx="2"
            fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.35)"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: j * 0.25 }}
          />
        ))}
      </motion.g>

      {/* bounded workers (concurrency 3) */}
      {workers.map((y, i) => (
        <g key={i}>
          {drawPath(`M 364 150 Q 400 ${y} 436 ${y}`, 1.1 + i * 0.1)}
          {node(458, y, `W${i + 1}`, 1.3 + i * 0.1, 18)}
        </g>
      ))}
      <text x="458" y="248" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="8" fill="rgba(255,255,255,0.4)">concurrency 3</text>

      {/* DB — flat load */}
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5, duration: 0.5 }}>
        <rect x="510" y="120" width="74" height="60" rx="6" fill="rgba(74,222,128,0.05)" stroke="rgba(74,222,128,0.35)" />
        <text x="547" y="146" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="rgba(74,222,128,0.9)">DB</text>
        <text x="547" y="164" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="8" fill="rgba(255,255,255,0.5)">flat load</text>
      </motion.g>
      {workers.map((y, i) => drawPath(`M 476 ${y} Q 500 ${y} 510 150`, 1.6 + i * 0.1))}

      {/* steady drain pulse from queue → workers */}
      {workers.map((y, i) => (
        <motion.circle
          key={i}
          r="3" fill="#4ade80"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0], cx: [364, 458], cy: [150, y] }}
          transition={{ duration: 1.4, delay: 2 + i * 0.4, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }}
        />
      ))}
    </g>
  );
}

// 06 — A 50s+ list API over ~7.5M records cut to 2–3s.
// Before: full-collection-scan $regex + 504. After: index + cache → fast.
function QueryPerfViz() {
  return (
    <g>
      <text x="40" y="44" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="rgba(255,255,255,0.45)">SALES ACTIVITY · ~7.5M DOCS</text>

      {/* BEFORE */}
      <text x="40" y="92" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="rgba(255,255,255,0.5)">BEFORE</text>
      <text x="40" y="110" fontFamily="JetBrains Mono, monospace" fontSize="8" fill="rgba(239,68,68,0.7)">$regex · COLLSCAN</text>
      <rect x="150" y="80" width="410" height="28" rx="4" fill="rgba(239,68,68,0.04)" stroke="rgba(239,68,68,0.18)" />
      <motion.rect
        x="150" y="80" height="28" rx="4"
        fill="rgba(239,68,68,0.18)" stroke="rgba(239,68,68,0.5)"
        initial={{ width: 0 }} animate={{ width: 410 }}
        transition={{ duration: 1.6, delay: 0.2, ease }}
      />
      <motion.text
        x="370" y="99" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="rgba(255,68,68,0.95)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
      >
        50s+  ·  504 TIMEOUT
      </motion.text>

      {/* pipeline applied */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9, duration: 0.5 }}>
        {['INDEX', 'CACHE', '∥ COUNT'].map((t, i) => (
          <g key={t}>
            <rect x={150 + i * 110} y="150" width="92" height="34" rx="4" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.3)" />
            <text x={196 + i * 110} y="171" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="rgba(255,255,255,0.85)">{t}</text>
          </g>
        ))}
        <text x="490" y="171" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="rgba(255,255,255,0.45)">SWR · TTL</text>
      </motion.g>

      {/* AFTER */}
      <text x="40" y="236" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="rgba(255,255,255,0.5)">AFTER</text>
      <text x="40" y="254" fontFamily="JetBrains Mono, monospace" fontSize="8" fill="rgba(74,222,128,0.75)">IXSCAN · cached</text>
      <rect x="150" y="224" width="410" height="28" rx="4" fill="rgba(74,222,128,0.04)" stroke="rgba(74,222,128,0.18)" />
      <motion.rect
        x="150" y="224" height="28" rx="4"
        fill="rgba(74,222,128,0.18)" stroke="rgba(74,222,128,0.5)"
        initial={{ width: 0 }} animate={{ width: 36 }}
        transition={{ duration: 0.6, delay: 2.4, ease }}
      />
      <motion.text
        x="200" y="243" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="rgba(74,222,128,0.95)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.9 }}
      >
        2–3s  ·  ~20× faster
      </motion.text>
    </g>
  );
}

// 07 — Shared Redis connection pool (generic-pool + ioredis).
// Workers acquire/release bounded connections instead of leaking per-op clients.
function PoolViz() {
  const workers = [80, 140, 200, 260];
  const slots = [0, 1, 2, 3, 4];
  return (
    <g>
      {/* worker fleet */}
      <text x="34" y="44" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="rgba(255,255,255,0.45)">WORKER FLEET</text>
      {workers.map((y, i) => (
        <g key={i}>
          {node(70, y, `W${i + 1}`, 0.1 + i * 0.08, 20)}
          {drawPath(`M 92 ${y} Q 160 ${y} 224 160`, 0.5 + i * 0.08)}
        </g>
      ))}

      {/* the pool */}
      <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, duration: 0.5 }} style={{ transformOrigin: '300px 160px' }}>
        <rect x="224" y="96" width="152" height="128" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.3)" />
        <text x="300" y="120" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="rgba(255,255,255,0.85)">REDIS POOL</text>
        <text x="300" y="136" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="8" fill="rgba(255,255,255,0.45)">generic-pool · ioredis</text>
        {slots.map((s) => (
          <motion.circle
            key={s}
            cx={252 + s * 24} cy="170" r="8"
            fill="rgba(74,222,128,0.12)" stroke="rgba(74,222,128,0.5)"
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 2, repeat: Infinity, delay: s * 0.3 }}
          />
        ))}
        <text x="300" y="208" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="rgba(255,255,255,0.55)">min 10 · max 500</text>
      </motion.g>

      {drawPath('M 376 160 L 470 160', 1)}

      {/* redis */}
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1, duration: 0.5 }}>
        <rect x="470" y="128" width="96" height="64" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.3)" />
        <text x="518" y="156" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="rgba(255,255,255,0.85)">REDIS</text>
        <text x="518" y="173" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="8" fill="rgba(255,255,255,0.45)">bounded · no leaks</text>
      </motion.g>

      {/* acquire → release cycle */}
      {workers.map((y, i) => (
        <motion.circle
          key={i}
          r="3" fill="#4ade80"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0], cx: [92, 224], cy: [y, 160] }}
          transition={{ duration: 1.3, delay: 1.4 + i * 0.3, repeat: Infinity, repeatDelay: 1.4, ease: 'easeInOut' }}
        />
      ))}
    </g>
  );
}

// 08 — Deterministic pagination: stable sort with an _id tiebreaker on a
// non-unique timestamp, plus idempotent upserts → no missing/duplicate rows.
function PaginationViz() {
  const before = [
    { t: 'ts:10', tag: '', bad: false },
    { t: 'ts:10', tag: 'dup', bad: true },
    { t: 'ts:09', tag: '', bad: false },
    { t: 'ts:09', tag: 'lost', bad: true },
  ];
  const after = [
    { t: 'ts:10  _id:a2', bad: false },
    { t: 'ts:10  _id:b7', bad: false },
    { t: 'ts:09  _id:c1', bad: false },
    { t: 'ts:09  _id:d4', bad: false },
  ];
  return (
    <g>
      {/* BEFORE: non-deterministic sort on a non-unique timestamp */}
      <text x="40" y="44" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="rgba(255,255,255,0.45)">SORT: timestamp</text>
      <text x="40" y="60" fontFamily="JetBrains Mono, monospace" fontSize="8" fill="rgba(239,68,68,0.7)">non-deterministic</text>
      {before.map((r, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 + i * 0.1, ease }}
        >
          <rect x="40" y={78 + i * 38} width="200" height="30" rx="4"
            fill={r.bad ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.03)'}
            stroke={r.bad ? 'rgba(239,68,68,0.45)' : 'rgba(255,255,255,0.2)'} />
          <text x="56" y={97 + i * 38} fontFamily="JetBrains Mono, monospace" fontSize="11" fill="rgba(255,255,255,0.8)">{r.t}</text>
          {r.tag && (
            <text x="224" y={97 + i * 38} textAnchor="end" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="rgba(239,68,68,0.9)">{r.tag}</text>
          )}
        </motion.g>
      ))}

      {/* arrow: add _id tiebreaker */}
      {drawPath('M 250 160 L 332 160', 0.8)}
      <motion.text
        x="291" y="150" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="rgba(74,222,128,0.9)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
      >
        + _id
      </motion.text>

      {/* AFTER: deterministic, stable, complete */}
      <text x="346" y="44" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="rgba(255,255,255,0.45)">SORT: timestamp, _id</text>
      <text x="346" y="60" fontFamily="JetBrains Mono, monospace" fontSize="8" fill="rgba(74,222,128,0.75)">deterministic · idempotent</text>
      {after.map((r, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 1.1 + i * 0.1, ease }}
        >
          <rect x="346" y={78 + i * 38} width="214" height="30" rx="4"
            fill="rgba(74,222,128,0.05)" stroke="rgba(74,222,128,0.4)" />
          <text x="362" y={97 + i * 38} fontFamily="JetBrains Mono, monospace" fontSize="11" fill="rgba(255,255,255,0.85)">{r.t}</text>
        </motion.g>
      ))}
    </g>
  );
}

function MigrationViz() {
  return (
    <g>
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
        <rect x="50" y="110" width="140" height="100" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.25)" />
        <text x="120" y="138" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="rgba(255,255,255,0.8)">AIRTABLE</text>
        {[0, 1, 2, 3].map(i => (
          <rect key={i} x="66" y={150 + i * 12} width="108" height="6" fill="rgba(255,255,255,0.08)" />
        ))}
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x="245" y="140" width="110" height="40" rx="4" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.3)" />
        <text x="300" y="158" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="rgba(255,255,255,0.85)">ETL</text>
        <text x="300" y="172" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="rgba(255,255,255,0.5)">batched · checkpointed</text>
      </motion.g>

      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7, duration: 0.5 }}>
        <rect x="410" y="110" width="140" height="100" rx="6" fill="rgba(74,222,128,0.04)" stroke="rgba(74,222,128,0.35)" />
        <text x="480" y="138" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="rgba(74,222,128,0.85)">MONGODB</text>
        {[0, 1, 2, 3].map(i => (
          <rect key={i} x="426" y={150 + i * 12} width="108" height="6" fill="rgba(74,222,128,0.15)" />
        ))}
      </motion.g>

      {drawPath('M 190 160 L 245 160', 0.4)}
      {drawPath('M 355 160 L 410 160', 0.6)}

      {[0, 1, 2].map(i => (
        <motion.circle
          key={i}
          r="3.5"
          fill="#4ade80"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0], cx: [190, 410], cy: 160 }}
          transition={{ duration: 1.8, delay: 1 + i * 0.5, repeat: Infinity, repeatDelay: 0.6, ease: 'linear' }}
        />
      ))}
    </g>
  );
}

function QueryViz() {
  const lines = [
    'const q = builder',
    '  .from("users")',
    '  .where({ active: true })',
    '  .project(["id","name"])',
    '  .paginate({ page, size })',
    '  .build();',
  ];
  return (
    <g>
      <rect x="40" y="40" width="520" height="240" rx="8" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.12)" />
      <circle cx="60" cy="58" r="4" fill="rgba(239,68,68,0.6)" />
      <circle cx="76" cy="58" r="4" fill="rgba(234,179,8,0.6)" />
      <circle cx="92" cy="58" r="4" fill="rgba(74,222,128,0.6)" />
      <text x="540" y="62" textAnchor="end" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="rgba(255,255,255,0.4)">query-builder.ts</text>

      {lines.map((l, i) => (
        <motion.text
          key={i}
          x="60"
          y={100 + i * 26}
          fontFamily="JetBrains Mono, monospace"
          fontSize="13"
          fill="rgba(255,255,255,0.82)"
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + i * 0.12, duration: 0.4, ease }}
        >
          {l}
        </motion.text>
      ))}

      <motion.rect
        x="60" y={100 + lines.length * 26 - 12}
        width="9" height="16"
        fill="rgba(255,255,255,0.7)"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </g>
  );
}

function SsoViz() {
  return (
    <g>
      {node(120, 100, 'A.app', 0.1, 30)}
      {node(120, 220, 'B.app', 0.2, 30)}
      {node(480, 160, 'AUTH', 0.3, 32)}

      {drawPath('M 150 100 Q 300 100 450 145', 0.5)}
      {drawPath('M 150 220 Q 300 220 450 175', 0.6)}
      {drawPath('M 450 152 Q 300 60 150 90', 0.9)}
      {drawPath('M 450 170 Q 300 260 150 230', 1.0)}

      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <rect x="270" y="148" width="60" height="24" rx="4" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.3)" />
        <text x="300" y="164" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="rgba(255,255,255,0.85)">JWT</text>
      </motion.g>

      <motion.circle
        r="3" fill="#4ade80"
        animate={{ cx: [150, 480, 150], cy: [100, 160, 220] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />
    </g>
  );
}
