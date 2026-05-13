import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectVisual from './ProjectVisual';

export type ProjectDetail = {
  num: string;
  type: string;
  title: string;
  desc: string;
  tags: string[];
  impact: { num: string; label: string };
  problem?: string;
  approach?: string[];
  outcome?: string;
  stack?: string[];
};

type Props = {
  project: ProjectDetail | null;
  onClose: () => void;
};

export default function ProjectModal({ project, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [project]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="modal-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          />

          <motion.div
            className="modal-panel"
            initial={{ y: '6%', opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: '4%', opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={onClose} aria-label="Close">
              <span /><span />
            </button>

            <motion.div
              className="modal-body"
              data-lenis-prevent
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
              }}
            >
              <Reveal>
                <div className="modal-eyebrow mono">
                  <span>{project.num}</span>
                  <span className="dot-sep">·</span>
                  <span>{project.type}</span>
                </div>
              </Reveal>

              <Reveal>
                <h2 className="modal-title">{project.title}</h2>
              </Reveal>

              <Reveal>
                <p className="modal-lede">{project.desc}</p>
              </Reveal>

              <Reveal>
                <div className="modal-meta-row">
                  <div className="modal-impact">
                    <div className="modal-impact-num">{project.impact.num}</div>
                    <div className="modal-impact-label mono">{project.impact.label}</div>
                  </div>
                  <div className="modal-meta-chips">
                    {project.tags.slice(0, 4).map((t) => (
                      <span key={t} className="mono">{t}</span>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal>
                <ProjectVisual num={project.num} title={project.title} />
              </Reveal>

              <Reveal>
                <section className="modal-section">
                  <div className="modal-section-head">
                    <span className="modal-section-tag mono">01 · description</span>
                    <h3 className="modal-section-title">Description</h3>
                  </div>
                  <p className="modal-section-body">{project.desc}</p>
                </section>
              </Reveal>

              {project.problem && (
                <Reveal>
                  <section className="modal-section">
                    <div className="modal-section-head">
                      <span className="modal-section-tag mono">02 · problem</span>
                      <h3 className="modal-section-title">Problem</h3>
                    </div>
                    <p className="modal-section-body">{project.problem}</p>
                  </section>
                </Reveal>
              )}

              {project.approach && (
                <Reveal>
                  <section className="modal-section">
                    <div className="modal-section-head">
                      <span className="modal-section-tag mono">03 · solution</span>
                      <h3 className="modal-section-title">Solution</h3>
                    </div>
                    <ul className="modal-list">
                      {project.approach.map((step, i) => (
                        <li key={i}>
                          <span className="bullet">•</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </section>
                </Reveal>
              )}

              {project.outcome && (
                <Reveal>
                  <section className="modal-section">
                    <div className="modal-section-head">
                      <span className="modal-section-tag mono">04 · outcome</span>
                      <h3 className="modal-section-title">Outcome</h3>
                    </div>
                    <p className="modal-section-body">{project.outcome}</p>
                  </section>
                </Reveal>
              )}

              <Reveal>
                <section className="modal-section">
                  <div className="modal-section-head">
                    <span className="modal-section-tag mono">05 · tech stack</span>
                    <h3 className="modal-section-title">Tech stack</h3>
                  </div>
                  <div className="modal-tags">
                    {(project.stack ?? project.tags).map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </section>
              </Reveal>

              <Reveal>
                <div className="modal-foot mono">
                  <span>press ESC to close</span>
                </div>
              </Reveal>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Reveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}
