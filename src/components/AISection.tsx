import { motion } from 'framer-motion';
import { useState } from 'react';
import SplitText from './SplitText';
import { matchJobDescription, type JobMatch } from '../lib/portfolioBrain';

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
      transition={{ duration: 0.6 }}
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
  return (
    <section id="ai">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <div className="section-eyebrow"><span className="eyebrow-line" /> 02b / job-description match</div>
        <SplitText as="h2" className="section-title">
          Test the fit for your role.
        </SplitText>
      </motion.div>

      <div className="ai-grid">
        <JobMatcherCard />
      </div>
    </section>
  );
}
