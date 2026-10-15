import type { IParticlesProps } from '@tsparticles/react';
import type { UserParticlesConfig } from '@/features/user-config/types/userConfig.types';

export type ParticlesOptions = NonNullable<IParticlesProps['options']>;

const basicShapes = ['circle', 'square', 'triangle'] as const;

export function mapUserParticlesConfigToOptions(
  config: UserParticlesConfig,
  prefersReducedMotion = false,
): ParticlesOptions {
  const effectiveSpeed = prefersReducedMotion
    ? Math.min(config.speed, 0.25)
    : config.speed;
  const effectiveCount = prefersReducedMotion
    ? Math.min(config.count, 30)
    : config.count;

  return {
    fullScreen: false,
    background: {
      color: 'transparent',
    },
    fpsLimit: prefersReducedMotion ? 24 : 60,
    particles: {
      number: {
        value: effectiveCount,
        density: {
          enable: true,
        },
      },
      color: {
        value: config.color,
      },
      shape: {
        type: config.shape === 'basic' ? [...basicShapes] : config.shape,
      },
      links: {
        enable: config.linksEnabled,
        color: config.linksColor,
        distance: 135,
        opacity: Math.min(0.75, config.opacity * 0.75),
        width: 1,
      },
      move: {
        enable: config.enabled && effectiveSpeed > 0,
        speed: effectiveSpeed,
        direction: config.direction,
        random: config.direction === 'none',
        straight: config.direction !== 'none',
        outModes: {
          default: 'out',
        },
      },
      opacity: {
        value: config.opacity,
      },
      size: {
        value: {
          min: config.minSize,
          max: config.maxSize,
        },
      },
    },
    interactivity: {
      detectsOn: 'window',
      events: {
        onHover: {
          enable: config.hoverEnabled && !prefersReducedMotion,
          mode: config.hoverMode,
        },
      },
      modes: {
        repulse: {
          distance: 90,
          duration: 0.4,
        },
        grab: {
          distance: 145,
          links: {
            opacity: 0.8,
          },
        },
        bubble: {
          distance: 130,
          duration: 0.5,
          opacity: Math.min(1, config.opacity + 0.3),
          size: Math.min(24, config.maxSize * 1.8),
        },
      },
    },
    detectRetina: true,
  };
}
