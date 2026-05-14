import { useEffect, useState } from 'react';

const sections = ['about', 'skills', 'ai', 'projects', 'experience', 'contact'];

export default function Navbar() {
  const [active, setActive] = useState<string>('about');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
      <a href="#home" className="nav-logo">
        Sharoon <span>— Full Stack Engineer</span>
      </a>
      <div className="nav-links">
        {sections.map((s) => (
          <a
            key={s}
            href={`#${s}`}
            className={active === s ? 'is-active' : ''}
            data-label={s}
          >
            {s === 'projects' ? 'work' : s}
          </a>
        ))}
      </div>
      <div className="nav-cta">
        <span className="dot" />
        <span>available</span>
      </div>
    </nav>
  );
}
