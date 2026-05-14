import { motion } from 'framer-motion';
import { useState } from 'react';
import SplitText from './SplitText';
import { generatePitch, matchJobDescription, type JobMatch } from '../lib/portfolioBrain';

const CAPABILITIES = [
  'LLM-backed classification agents',
  'Prompt engineering and evaluation',
  'Confidence routing + human-in-the-loop',
  'Structured decision logging and audit trails',
  'AI integrated into real-time delivery pipelines',
  'Retrieval-augmented context for chat assistants',
];

const STATS = [
  { num: '2', label: 'LLM agents in production' },
  { num: '10M+', label: 'classifications scored' },
  { num: '99.9%', label: 'service uptime maintained' },
  { num: '<200ms', label: 'AI-augmented dashboard P95' },
];

const ease = [0.22, 1, 0.36, 1] as const;

function AgentDiagram() {
  return (
    <svg viewBox="0 0 320 180" className="ai-diagram" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="aigrad" x1="0" x2="1">
          <stop offset="0%" stopColor="rgba(127,255,223,0.9)" />
          <stop offset="100%" stopColor="rgba(92,223,255,0.4)" />
        </linearGradient>
      </defs>
      {/* input nodes */}
      {['acme', 'bankco', 'pretargets'].map((label, i) => (
        <g key={label}>
          <rect x="14" y={28 + i * 42} width="74" height="26" rx="4" fill="none" stroke="rgba(255,255,255,0.2)" />
          <text x="51" y={45 + i * 42} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="rgba(255,255,255,0.75)">{label}</text>
          <motion.path
            d={`M 88 ${41 + i * 42} Q 130 ${41 + i * 42} 160 90`}
            stroke="url(#aigrad)"
            strokeWidth="1.2"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: 0.2 + i * 0.12, ease }}
          />
        </g>
      ))}

      {/* agent */}
      <motion.g initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.5 }}>
        <rect x="138" y="62" width="64" height="56" rx="8" fill="rgba(127,255,223,0.06)" stroke="rgba(127,255,223,0.5)" />
        <text x="170" y="86" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="rgba(255,255,255,0.95)">LLM</text>
        <text x="170" y="102" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="rgba(255,255,255,0.6)">classify</text>
        <motion.circle
          cx="170" cy="113" r="3" fill="#7fffdf"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
      </motion.g>

      {/* output paths */}
      <motion.path d="M 202 80 L 250 50" stroke="url(#aigrad)" strokeWidth="1.2" fill="none" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 1.1, ease }} />
      <motion.path d="M 202 100 L 250 130" stroke="url(#aigrad)" strokeWidth="1.2" fill="none" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 1.2, ease }} />

      {/* outputs */}
      <motion.g initial={{ opacity: 0, x: 8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1.3 }}>
        <rect x="250" y="36" width="60" height="26" rx="4" fill="rgba(127,255,223,0.06)" stroke="rgba(127,255,223,0.45)" />
        <text x="280" y="53" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="rgba(127,255,223,0.95)">ALLOW</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, x: 8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1.4 }}>
        <rect x="250" y="116" width="60" height="26" rx="4" fill="rgba(255,93,93,0.07)" stroke="rgba(255,93,93,0.45)" />
        <text x="280" y="133" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="rgba(255,170,170,0.95)">BLOCK</text>
      </motion.g>
    </svg>
  );
}

function JobMatcherCard() {
  const [jd, setJd] = useState('');
  const [result, setResult] = useState<JobMatch | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  function analyze() {
    const text = jd.trim();
    if (!text) return;
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      setResult(matchJobDescription(text));
      setAnalyzing(false);
    }, 800);
  }

  return (
    <motion.div
      className="ai-card ai-card--wide"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="ai-card-tag mono">/ live demo · job-description match</div>
      <h3>Paste a job description, get a fit score.</h3>
      <p>The AI scans the description for the skills, stack, and architecture this role wants — then scores the overlap with Sharoon's profile.</p>
      <div className="ai-jd-group">
        <textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste the role's responsibilities and requirements here..."
          aria-label="Job description"
          rows={4}
        />
        <button onClick={analyze} disabled={!jd.trim() || analyzing}>
          {analyzing ? 'analyzing…' : 'analyze fit'}
          <span className="arrow">→</span>
        </button>
      </div>

      {(result || analyzing) && (
        <motion.div
          className="ai-jd-result"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {analyzing ? (
            <div className="ai-output-typing"><span /><span /><span /></div>
          ) : result ? (
            <>
              <div className="ai-match-top">
                <div className="ai-match-gauge">
                  <svg viewBox="0 0 100 100" width="84" height="84">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                    <motion.circle
                      cx="50" cy="50" r="42"
                      fill="none"
                      stroke={result.score >= 70 ? '#7fffdf' : result.score >= 40 ? '#5cdfff' : '#ffb84a'}
                      strokeWidth="6"
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                      strokeDasharray={2 * Math.PI * 42}
                      initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - result.score / 100) }}
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </svg>
                  <div className="ai-match-num">{result.score}<small>%</small></div>
                </div>
                <div className="ai-match-meta">
                  <div className="ai-match-label mono">overall fit</div>
                  <div className="ai-match-count">
                    <strong>{result.matched.length}</strong> skills matched
                    {result.missing.length > 0 && <> · <strong>{result.missing.length}</strong> gap{result.missing.length > 1 ? 's' : ''}</>}
                  </div>
                </div>
              </div>

              {result.matched.length > 0 && (
                <div className="ai-chip-row">
                  <div className="ai-chip-row-label mono">strong overlap</div>
                  <div className="ai-chips">
                    {result.matched.map((s) => (
                      <span key={s} className="ai-chip ai-chip--hit">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {result.missing.length > 0 && (
                <div className="ai-chip-row">
                  <div className="ai-chip-row-label mono">jd mentions (not core stack)</div>
                  <div className="ai-chips">
                    {result.missing.map((s) => (
                      <span key={s} className="ai-chip ai-chip--miss">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              <p className="ai-jd-pitch">{result.pitch}</p>
            </>
          ) : null}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function AISection() {
  const [role, setRole] = useState('');
  const [pitch, setPitch] = useState('');
  const [generating, setGenerating] = useState(false);

  function generate() {
    const r = role.trim();
    if (!r) return;
    setGenerating(true);
    setPitch('');
    const result = generatePitch(r);
    const delay = 600 + Math.min(1400, result.length * 4);
    setTimeout(() => {
      setPitch(result);
      setGenerating(false);
    }, delay);
  }

  return (
    <section id="ai">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <div className="section-eyebrow"><span className="eyebrow-line" /> 02b / ai &amp; automation</div>
        <SplitText as="h2" className="section-title">
          AI assistants &amp; agents I've shipped.
        </SplitText>
      </motion.div>

      <div className="ai-grid">
        {/* Card 1: tailored pitch generator */}
        <motion.div
          className="ai-card ai-card--wide"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div className="ai-card-tag mono">/ live demo · tailored pitch</div>
          <h3>Tailor a pitch for your role.</h3>
          <p>Type your role or context — get a custom summary highlighting the projects, stack, and impact that fit best.</p>
          <div className="ai-input-group">
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. AI engineer, backend lead, platform engineer..."
              onKeyDown={(e) => e.key === 'Enter' && generate()}
              aria-label="Role"
            />
            <button onClick={generate} disabled={!role.trim() || generating}>
              {generating ? 'thinking…' : 'generate'}
              <span className="arrow">→</span>
            </button>
          </div>
          {(pitch || generating) && (
            <motion.div
              className="ai-output"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="ai-output-head mono">
                <span className="ai-output-dot" />
                generated by sharoon-ai (heuristic, runs locally)
              </div>
              {generating ? (
                <div className="ai-output-typing"><span /><span /><span /></div>
              ) : (
                <p>{pitch}</p>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Card 2: agent diagram */}
        <motion.div
          className="ai-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.08 }}
        >
          <div className="ai-card-tag mono">/ system · agent flow</div>
          <h3>How the auto-blocking agents work.</h3>
          <AgentDiagram />
          <p className="ai-card-foot">
            Entities are scored by an LLM-backed agent with auditable reasoning. Confidence
            thresholds route uncertain cases for human review; decisions take effect on the next
            ad-serving cycle.
          </p>
        </motion.div>

        {/* Card 3: capabilities */}
        <motion.div
          className="ai-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.16 }}
        >
          <div className="ai-card-tag mono">/ capabilities</div>
          <h3>What I do with AI.</h3>
          <ul className="ai-capabilities">
            {CAPABILITIES.map((c) => (
              <li key={c}>
                <span className="ai-bullet" />
                {c}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Card 3b: job description matcher */}
        <JobMatcherCard />

        {/* Card 4: stats */}
        <motion.div
          className="ai-card ai-card--stats"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.22 }}
        >
          <div className="ai-card-tag mono">/ ai · by the numbers</div>
          <div className="ai-stats">
            {STATS.map((s) => (
              <div key={s.label} className="ai-stat">
                <div className="ai-stat-num">{s.num}</div>
                <div className="ai-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
