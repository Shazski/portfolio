import { useEffect, useRef, useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { answer, SUGGESTED_PROMPTS, type Reply } from '../lib/portfolioBrain';

type Msg = {
  id: string;
  who: 'user' | 'bot';
  text: string;
  suggestions?: string[];
  streaming?: boolean;
};

const seed = (): Msg => ({
  id: 'seed',
  who: 'bot',
  text:
    "Hey, I'm Sharoon's personal AI — trained on his portfolio. Ask me about his projects, experience, stack, or how to reach him.",
  suggestions: SUGGESTED_PROMPTS,
});

type SR = {
  new (): SpeechRecognitionInstance;
};
type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: { [k: number]: { [k: number]: { transcript: string } } } }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

export default function PortfolioChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([seed()]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [recording, setRecording] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recRef = useRef<SpeechRecognitionInstance | null>(null);
  const streamTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const w = window as unknown as { SpeechRecognition?: SR; webkitSpeechRecognition?: SR };
    setVoiceSupported(!!(w.SpeechRecognition || w.webkitSpeechRecognition));
  }, []);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
      if (isCmdK) {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (e.key === 'Escape' && open) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, typing, open]);

  function streamReply(botId: string, reply: Reply) {
    const words = reply.text.split(/(\s+)/);
    let idx = 0;
    if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    streamTimerRef.current = setInterval(() => {
      idx += 2; // word + whitespace pair
      const partial = words.slice(0, idx).join('');
      setMsgs((m) =>
        m.map((msg) =>
          msg.id === botId
            ? {
                ...msg,
                text: partial,
                streaming: idx < words.length,
                suggestions: idx >= words.length ? reply.suggestions : undefined,
              }
            : msg
        )
      );
      if (idx >= words.length && streamTimerRef.current) {
        clearInterval(streamTimerRef.current);
        streamTimerRef.current = null;
      }
    }, 28);
  }

  function send(text: string) {
    const userMsg: Msg = { id: `u-${Date.now()}`, who: 'user', text };
    setMsgs((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);

    const reply: Reply = answer(text);
    const preDelay = 380 + Math.min(700, reply.text.length * 2);
    setTimeout(() => {
      setTyping(false);
      const botId = `b-${Date.now()}`;
      setMsgs((m) => [...m, { id: botId, who: 'bot', text: '', streaming: true }]);
      streamReply(botId, reply);
    }, preDelay);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const t = input.trim();
    if (!t) return;
    send(t);
  }

  function reset() {
    if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    setMsgs([seed()]);
  }

  function toggleVoice() {
    const w = window as unknown as { SpeechRecognition?: SR; webkitSpeechRecognition?: SR };
    const SRCtor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SRCtor) return;
    if (recording && recRef.current) {
      recRef.current.stop();
      setRecording(false);
      return;
    }
    const rec = new SRCtor();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-US';
    rec.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      // auto-submit on voice
      setTimeout(() => send(transcript), 200);
    };
    rec.onend = () => setRecording(false);
    rec.onerror = () => setRecording(false);
    rec.start();
    recRef.current = rec;
    setRecording(true);
  }

  return (
    <>
      <motion.button
        className={`chat-launcher ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        aria-label={open ? 'Close chat' : 'Open chat'}
        title="Ask AI (⌘K)"
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
                    <span className="chat-dot" /> online · streaming · portfolio-trained
                  </div>
                </div>
              </div>
              <button className="chat-reset" onClick={reset} aria-label="Reset chat">reset</button>
            </div>

            <div className="chat-scroller" ref={scrollerRef}>
              {msgs.map((m) => (
                <div key={m.id} className={`chat-msg chat-msg--${m.who}`}>
                  <div className="chat-bubble">
                    {m.text}
                    {m.streaming && m.who === 'bot' && <span className="chat-caret">▍</span>}
                  </div>
                  {m.suggestions && m.suggestions.length > 0 && !m.streaming && (
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
                placeholder={recording ? 'Listening…' : 'Ask about projects, stack, or experience...'}
                aria-label="Message"
              />
              {voiceSupported && (
                <button
                  type="button"
                  onClick={toggleVoice}
                  className={`chat-mic ${recording ? 'is-recording' : ''}`}
                  aria-label={recording ? 'Stop recording' : 'Start voice input'}
                  title="Speak your question"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="3" width="6" height="11" rx="3" />
                    <path d="M5 11a7 7 0 0 0 14 0" strokeLinecap="round" />
                    <path d="M12 18v3" strokeLinecap="round" />
                  </svg>
                </button>
              )}
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
