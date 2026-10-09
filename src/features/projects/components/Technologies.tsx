import React from 'react';
import { motion } from 'motion/react';
import { getTechIcon } from '@/shared/iconsManager';

interface TechnologiesProps {
  technologies: string[];
  showIcons?: boolean;
}

const Technologies: React.FC<TechnologiesProps> = ({
  technologies,
  showIcons = true,
}) => {
  const techList = technologies.map((tech) => tech.trim()).filter(Boolean);

  if (techList.length === 0) {
    return null;
  }

  return (
    <div className="w-full pt-1">
      <div className="mx-auto mb-5 h-px w-24 bg-zinc-700 sm:w-32" />
      <div className="flex flex-wrap items-center justify-center gap-4">
        {techList.map((tech, index) => (
          <div
            key={`${tech.toLowerCase()}-${index}`}
            className="group relative flex items-center justify-center"
          >
            {showIcons ? (
              <motion.img
                whileHover={{ scale: 1.12, y: -2 }}
                transition={{ duration: 0.18 }}
                src={getTechIcon(tech)}
                alt={tech}
                className="h-8 w-8"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = getTechIcon('default');
                }}
              />
            ) : (
              <span className="rounded-md border border-zinc-700 bg-zinc-950 px-2.5 py-1 text-xs font-semibold text-zinc-200">
                {tech}
              </span>
            )}

            {showIcons && (
              <div className="pointer-events-none absolute -top-10 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md bg-violet-900 px-3 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition duration-200 group-hover:opacity-100">
                {tech}
                <div className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 rotate-45 bg-violet-900" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Technologies;
