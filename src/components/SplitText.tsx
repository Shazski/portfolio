import { motion, Variants } from 'framer-motion';

type Props = {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div';
  delay?: number;
  stagger?: number;
  by?: 'word' | 'char';
};

const container: Variants = {
  hidden: {},
  show: (custom: { stagger: number; delay: number }) => ({
    transition: { staggerChildren: custom.stagger, delayChildren: custom.delay },
  }),
};

const item: Variants = {
  hidden: { y: '110%', opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function SplitText({
  children,
  className,
  as = 'h2',
  delay = 0,
  stagger = 0.04,
  by = 'word',
}: Props) {
  const tokens = by === 'word' ? children.split(/(\s+)/) : Array.from(children);

  const inner = (
    <>
      {tokens.map((t, i) => {
        if (/^\s+$/.test(t)) return <span key={i}> </span>;
        return (
          <span className="split-mask" key={i}>
            <motion.span className="split-token" variants={item}>
              {t}
            </motion.span>
          </span>
        );
      })}
    </>
  );

  const commonProps = {
    className: `split ${className ?? ''}`,
    variants: container,
    custom: { stagger, delay },
    initial: 'hidden' as const,
    whileInView: 'show' as const,
    viewport: { once: true, amount: 0.4 },
  };

  if (as === 'h1') return <motion.h1 {...commonProps}>{inner}</motion.h1>;
  if (as === 'h2') return <motion.h2 {...commonProps}>{inner}</motion.h2>;
  if (as === 'h3') return <motion.h3 {...commonProps}>{inner}</motion.h3>;
  if (as === 'p') return <motion.p {...commonProps}>{inner}</motion.p>;
  return <motion.div {...commonProps}>{inner}</motion.div>;
}
