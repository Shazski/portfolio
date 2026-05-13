import { useRef, MouseEvent, ReactNode, CSSProperties } from 'react';
import { motion } from 'framer-motion';

type Props = {
  as?: 'a' | 'button';
  href?: string;
  className?: string;
  children: ReactNode;
  strength?: number;
  style?: CSSProperties;
  download?: string | boolean;
  target?: string;
  rel?: string;
};

export default function MagneticButton({
  as = 'a',
  href,
  className,
  children,
  strength = 0.35,
  style,
  download,
  target,
  rel,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = '';
  };

  const MotionTag = as === 'a' ? motion.a : motion.button;

  return (
    <MotionTag
      ref={ref as never}
      href={href}
      className={`magnetic ${className ?? ''}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={style}
      download={download as never}
      target={target}
      rel={rel}
    >
      <span className="magnetic-inner">{children}</span>
    </MotionTag>
  );
}
