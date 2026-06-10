import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type Accent = {
  id: string;
  label: string;
  swatch: string;
};

const ACCENTS: Accent[] = [
  { id: 'lavender', label: 'Lavender', swatch: '#a78bfa' },
  { id: 'periwinkle', label: 'Periwinkle', swatch: '#7c9eff' },
  { id: 'amber', label: 'Amber', swatch: '#e9b872' },
  { id: 'rose', label: 'Rose', swatch: '#fb7185' },
  { id: 'emerald', label: 'Emerald', swatch: '#34d399' },
  { id: 'teal', label: 'Teal', swatch: '#7fffdf' },
];

const DEFAULT = 'lavender';

function readSaved(): string {
  try {
    return localStorage.getItem('accent') || DEFAULT;
  } catch {
    return DEFAULT;
  }
}

export default function AccentSwitcher() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>(readSaved);

  useEffect(() => {
    document.documentElement.dataset.accent = active;
    try {
      localStorage.setItem('accent', active);
    } catch {
      /* ignore persistence errors */
    }
  }, [active]);

  return (
    <div className={`accent-switcher${open ? ' is-open' : ''}`}>
      <AnimatePresence>
        {open && (
          <motion.div
            className="accent-swatches"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {ACCENTS.map((a) => (
              <button
                key={a.id}
                className={`accent-dot${active === a.id ? ' is-active' : ''}`}
                style={{ '--dot': a.swatch } as React.CSSProperties}
                onClick={() => setActive(a.id)}
                aria-label={`${a.label} theme`}
                title={a.label}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        className="accent-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-label="Change accent color"
        aria-expanded={open}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="13.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="17.5" cy="10.5" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="8.5" cy="7.5" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="6.5" cy="12.5" r="1.2" fill="currentColor" stroke="none" />
          <path d="M12 2a10 10 0 1 0 0 20c1 0 1.8-.8 1.8-1.8 0-.5-.2-.9-.5-1.2-.3-.4-.5-.8-.5-1.3 0-1 .8-1.7 1.8-1.7H16a6 6 0 0 0 6-6c0-4.4-4.5-8-10-8z" />
        </svg>
      </button>
    </div>
  );
}
