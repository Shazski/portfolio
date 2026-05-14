import { useEffect, useRef, useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { answer } from '../lib/portfolioBrain';

type Action = {
  id: string;
  label: string;
  hint?: string;
  run: () => void;
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [thinking, setThinking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const ACTIONS: Action[] = [
    { id: 'nav-about', label: 'Go to About', hint: '#about', run: () => scrollTo('about') },
    { id: 'nav-skills', label: 'Go to Skills', hint: '#skills', run: () => scrollTo('skills') },
    { id: 'nav-ai', label: 'Go to AI & Automation', hint: '#ai', run: () => scrollTo('ai') },
    { id: 'nav-projects', label: 'Go to Projects', hint: '#projects', run: () => scrollTo('projects') },
    { id: 'nav-experience', label: 'Go to Experience', hint: '#experience', run: () => scrollTo('experience') },
    { id: 'nav-contact', label: 'Go to Contact', hint: '#contact', run: () => scrollTo('contact') },
    { id: 'download-cv', label: 'Download CV', hint: 'PDF', run: () => downloadResume() },
    { id: 'github', label: 'Open GitHub', hint: 'github.com/Shazski', run: () => window.open('https://github.com/Shazski', '_blank') },
    { id: 'linkedin', label: 'Open LinkedIn', hint: 'linkedin.com', run: () => window.open('https://www.linkedin.com/in/sharoon-kp-264399215/', '_blank') },
    { id: 'email', label: 'Send email', hint: 'sharoonkp267@gmail.com', run: () => (window.location.href = 'mailto:sharoonkp267@gmail.com') },
  ];

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setOpen(false);
  }

  function downloadResume() {
    const a = document.createElement('a');
    a.href = '/Sharoon-Resume.pdf';
    a.download = 'Sharoon-Resume.pdf';
    a.click();
    setOpen(false);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Cmd+J / Ctrl+J for the command palette (Cmd+K is reserved for the AI chat)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    } else {
      setResult(null);
      setQ('');
      setThinking(false);
    }
  }, [open]);

  const filteredActions = q
    ? ACTIONS.filter((a) => a.label.toLowerCase().includes(q.toLowerCase()))
    : ACTIONS;

  function ask(e: FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setThinking(true);
    setTimeout(() => {
      const r = answer(q);
      setResult(r.text);
      setThinking(false);
    }, 400);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cmdk-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="cmdk-panel"
            initial={{ y: -20, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
          >
            <form onSubmit={ask}>
              <div className="cmdk-search">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={q}
                  onChange={(e) => { setQ(e.target.value); setResult(null); }}
                  placeholder="Type a command or ask Sharoon AI..."
                  aria-label="Command"
                />
                <kbd>ESC</kbd>
              </div>
            </form>

            <div className="cmdk-body">
              {filteredActions.length > 0 && (
                <div className="cmdk-group">
                  <div className="cmdk-group-title mono">jump to</div>
                  {filteredActions.map((a) => (
                    <button key={a.id} className="cmdk-item" onClick={a.run}>
                      <span>{a.label}</span>
                      {a.hint && <span className="cmdk-hint mono">{a.hint}</span>}
                    </button>
                  ))}
                </div>
              )}

              {q.trim() && (
                <div className="cmdk-group">
                  <div className="cmdk-group-title mono">ask sharoon ai</div>
                  <button className="cmdk-item cmdk-item--ai" onClick={ask}>
                    <span>↵  Ask: <em>"{q}"</em></span>
                    <span className="cmdk-hint mono">enter</span>
                  </button>
                  {thinking && (
                    <div className="cmdk-result cmdk-thinking">
                      <span /><span /><span />
                    </div>
                  )}
                  {result && (
                    <motion.div
                      className="cmdk-result"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {result}
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            <div className="cmdk-foot mono">
              <span><kbd>↑↓</kbd> navigate</span>
              <span><kbd>↵</kbd> select</span>
              <span><kbd>⌘K</kbd> toggle</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
