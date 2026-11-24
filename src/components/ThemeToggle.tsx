import { useEffect, useState } from 'react';

function initial(): 'dark' | 'light' {
  try {
    const s = localStorage.getItem('theme');
    if (s === 'light' || s === 'dark') return s;
  } catch { /* ignore */ }
  return 'dark';
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>(initial);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('theme', theme); } catch { /* ignore */ }
  }, [theme]);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
    if (doc.startViewTransition) doc.startViewTransition(() => setTheme(next));
    else setTheme(next);
  };

  return (
    <button className="theme-toggle" onClick={toggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
      <span className={`theme-icon ${theme}`}>{theme === 'dark' ? '☾' : '☀'}</span>
    </button>
  );
}
