import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.65,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <a className="landing-brand" href="#top" aria-label="Dixie Cards — Home">
      <span className="landing-brand__mark" aria-hidden="true">
        <span>D</span>
        <span>C</span>
      </span>
      {!compact && (
        <span className="landing-brand__wordmark">
          <strong>Dixie</strong>
          <span>Cards</span>
        </span>
      )}
    </a>
  );
}

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
}: SectionHeadingProps) {
  return (
    <div
      className={`landing-section-heading ${
        align === 'center' ? 'landing-section-heading--center' : ''
      }`}
    >
      <span className="landing-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
