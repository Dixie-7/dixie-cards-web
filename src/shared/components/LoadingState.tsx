import { motion, useReducedMotion } from 'motion/react';
import { useLanguage } from '@/shared/i18n/useLanguage';

type LoadingStateVariant = 'compact' | 'content' | 'overlay' | 'screen';

interface LoadingStateProps {
  className?: string;
  label?: string;
  variant?: LoadingStateVariant;
}

const shellClasses: Record<LoadingStateVariant, string> = {
  compact:
    'min-h-20 rounded-lg border border-zinc-200 bg-white/90 p-4 dark:border-zinc-800 dark:bg-zinc-950/80',
  content:
    'min-h-32 rounded-lg border border-zinc-200 bg-white/90 p-5 shadow-sm shadow-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-950/80 dark:shadow-black/20',
  overlay:
    'absolute inset-0 z-20 flex items-center justify-center bg-zinc-950/95 p-6',
  screen:
    'grid min-h-screen place-items-center bg-zinc-950 px-6 text-white',
};

function LoadingMark() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center gap-1 rounded-lg border border-cyan-400/20 bg-cyan-400/10"
      aria-hidden="true"
    >
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className={`h-5 w-1 rounded-full ${
            index === 0
              ? 'bg-cyan-300'
              : index === 1
                ? 'bg-emerald-300'
                : 'bg-violet-300'
          }`}
          animate={
            shouldReduceMotion
              ? { opacity: 0.75, scaleY: 0.7 }
              : { scaleY: [0.4, 1, 0.4], opacity: [0.45, 1, 0.45] }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: 0.9,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  delay: index * 0.14,
                }
          }
        />
      ))}
    </span>
  );
}

function SkeletonLine({ className }: { className: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.span
      className={`block rounded-full bg-zinc-200 dark:bg-zinc-800 ${className}`}
      animate={
        shouldReduceMotion ? { opacity: 0.7 } : { opacity: [0.45, 0.9, 0.45] }
      }
      transition={
        shouldReduceMotion
          ? undefined
          : { duration: 1.25, ease: 'easeInOut', repeat: Infinity }
      }
      aria-hidden="true"
    />
  );
}

export default function LoadingState({
  className = '',
  label,
  variant = 'content',
}: LoadingStateProps) {
  const { t } = useLanguage();
  const accessibleLabel = label ?? t('loadingContent');
  const isExpanded = variant !== 'compact';
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={`${shellClasses[variant]} ${className}`}
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">{accessibleLabel}</span>
      <div
        className={`w-full ${
          variant === 'screen' || variant === 'overlay' ? 'max-w-md' : ''
        }`}
      >
        <div className="flex items-center gap-4">
          <LoadingMark />
          <div className="min-w-0 flex-1 space-y-2.5">
            <SkeletonLine className="h-2.5 w-2/5" />
            <SkeletonLine className="h-2 w-4/5" />
          </div>
        </div>

        {isExpanded && (
          <div className="mt-5 grid grid-cols-3 gap-2.5" aria-hidden="true">
            {[0, 1, 2].map((index) => (
              <motion.span
                key={index}
                className="h-10 rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
                animate={
                  shouldReduceMotion
                    ? { opacity: 0.65 }
                    : { opacity: [0.35, 0.8, 0.35] }
                }
                transition={
                  shouldReduceMotion
                    ? undefined
                    : {
                        duration: 1.35,
                        ease: 'easeInOut',
                        repeat: Infinity,
                        delay: index * 0.16,
                      }
                }
              />
            ))}
          </div>
        )}

        <div
          className="mt-4 h-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
          aria-hidden="true"
        >
          <motion.div
            className="h-full w-1/3 rounded-full bg-linear-to-r from-cyan-400 via-emerald-400 to-violet-400"
            animate={shouldReduceMotion ? { x: '100%' } : { x: ['-110%', '310%'] }}
            transition={
              shouldReduceMotion
                ? undefined
                : { duration: 1.2, ease: 'easeInOut', repeat: Infinity }
            }
          />
        </div>
      </div>
    </div>
  );
}
