import { useEffect, useState } from 'react';
import Particles, {
  initParticlesEngine,
  type IParticlesProps,
} from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

const particlesOptions: NonNullable<IParticlesProps['options']> = {
  fullScreen: false,

  background: {
    color: 'transparent',
  },

  fpsLimit: 60,

  particles: {
    number: {
      value: 45,
      density: {
        enable: true,
      },
    },

    color: {
      value: ['#a855f7', '#c084fc', '#ffffff'],
    },

    links: {
      enable: false,
    },

    move: {
      enable: true,
      speed: 0.45,
      direction: 'none',
      random: true,
      straight: false,
      outModes: {
        default: 'out',
      },
    },

    opacity: {
      value: 0.18,
    },

    size: {
      value: { min: 1, max: 3 },
    },
  },

  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: 'repulse',
      },
    },

    modes: {
      repulse: {
        distance: 80,
        duration: 0.4,
      },
    },
  },

  detectRetina: true,
};

const ParticlesBackground = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    void initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      if (isMounted) {
        setIsReady(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <Particles
      id="tsparticles"
      options={particlesOptions}
      className="absolute inset-0 -z-10"
    />
  );
};

export default ParticlesBackground;
