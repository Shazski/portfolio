import { useEffect, useRef, useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { answer, SUGGESTED_PROMPTS, type Reply } from '../lib/portfolioBrain';

type Msg = {
  id: string;
  who: 'user' | 'bot';
  text: string;
  suggestions?: string[];
};

const seed = (): Msg => ({
  id: 'seed',
  who: 'bot',
  text:
    "Hey, I'm Sharoon's personal AI — trained on his portfolio. Ask me about his projects, experience, stack, or how to reach him.",
  suggestions: SUGGESTED_PROMPTS,
});

export default function PortfolioChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([seed()]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, typing, open]);

  function send(text: string) {
    const userMsg: Msg = { id: `u-${Date.now()}`, who: 'user', text };
    setMsgs((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);

    const reply: Reply = answer(text);
    const delay = 400 + Math.min(1200, reply.text.length * 8);
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        { id: `b-${Date.now()}`, who: 'bot', text: reply.text, suggestions: reply.suggestions },
      ]);
      setTyping(false);
    }, delay);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const t = input.trim();
    if (!t) return;
    send(t);
  }

  function reset() {
    setMsgs([seed()]);
  }

  return (
    <>
      {/* Launcher */}
      <motion.button
        className={`chat-launcher ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        <span className="chat-launcher-pulse" />
        {open ? (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" strokeLinejoin="round" />
            <path d="M19 14l.9 2.6L22.5 17.5l-2.6.9L19 21l-.9-2.6L15.5 17.5l2.6-.9L19 14z" strokeLinejoin="round" />
          </svg>
        )}
        <span className="chat-launcher-label">{open ? 'Close' : 'Ask AI'}</span>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            data-lenis-prevent
          >
            <div className="chat-head">
              <div className="chat-head-id">
                <span className="chat-avatar">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <div className="chat-head-name">Sharoon AI</div>
                  <div className="chat-head-status">
                    <span className="chat-dot" /> online · portfolio-trained
                  </div>
                </div>
              </div>
              <button className="chat-reset" onClick={reset} aria-label="Reset chat">reset</button>
            </div>

            <div className="chat-scroller" ref={scrollerRef}>
              {msgs.map((m) => (
                <div key={m.id} className={`chat-msg chat-msg--${m.who}`}>
                  <div className="chat-bubble">{m.text}</div>
                  {m.suggestions && m.suggestions.length > 0 && (
                    <div className="chat-suggestions">
                      {m.suggestions.map((s) => (
                        <button key={s} className="chat-chip" onClick={() => send(s)} type="button">
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {typing && (
                <div className="chat-msg chat-msg--bot">
                  <div className="chat-bubble chat-typing">
                    <span /><span /><span />
                  </div>
                </div>
              )}
            </div>

            <form className="chat-input" onSubmit={onSubmit}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about projects, stack, or experience..."
                aria-label="Message"
              />
              <button type="submit" aria-label="Send" disabled={!input.trim()}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12l14-7-5 14-3-5-6-2z" strokeLinejoin="round" strokeLinecap="round" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
