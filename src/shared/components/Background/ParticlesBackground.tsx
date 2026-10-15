import { useMemo, useState, useEffect, useId } from 'react';
import { useReducedMotion } from 'motion/react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { mapUserParticlesConfigToOptions } from '@/features/user-config/mappers/particlesConfig.mapper';
import type { UserParticlesConfig } from '@/features/user-config/types/userConfig.types';
import './ParticlesBackground.css';

let particlesEnginePromise: Promise<void> | null = null;

function initializeParticlesEngine() {
  if (!particlesEnginePromise) {
    particlesEnginePromise = initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    });
  }

  return particlesEnginePromise;
}

interface ParticlesBackgroundProps {
  config?: UserParticlesConfig | null;
  id?: string;
  className?: string;
  preview?: boolean;
}

export default function ParticlesBackground({
  config,
  id,
  className = '',
  preview = false,
}: ParticlesBackgroundProps) {
  const generatedId = useId().replace(/:/g, '');
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [isReady, setIsReady] = useState(false);
  const options = useMemo(
    () =>
      config
        ? mapUserParticlesConfigToOptions(config, shouldReduceMotion)
        : undefined,
    [config, shouldReduceMotion],
  );

  useEffect(() => {
    let isMounted = true;

    void initializeParticlesEngine()
      .then(() => {
        if (isMounted) {
          setIsReady(true);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsReady(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!config?.enabled || !isReady || !options) {
    return null;
  }

  return (
    <Particles
      id={id ?? `particles-${generatedId}`}
      options={options}
      className={`particles-background absolute inset-0 overflow-hidden ${
        preview ? 'particles-background--preview' : ''
      } ${className}`}
      aria-hidden="true"
    />
  );
}
