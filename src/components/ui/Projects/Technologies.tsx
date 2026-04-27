import React from 'react';
import { motion } from 'motion/react';
import { getTechIcon } from '../../../shared/iconsManager';

interface TechnologiesProps {
  technologies: string[];
}

const Technologies: React.FC<TechnologiesProps> = ({ technologies }) => {
  const techList = technologies.map((tech) => tech.trim()).filter(Boolean);

  return (
    <div className="flex items-center gap-4 border-t border-zinc-700 pt-6">
      {techList.map((tech, index) => (
        <div
          key={`${tech.toLowerCase()}-${index}`}
          className="group relative flex items-center justify-center"
        >
          <motion.img
            whileHover={{ scale: 1.12 }}
            transition={{ duration: 0.18 }}
            src={getTechIcon(tech)}
            alt={tech}
            className="h-8 w-8"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = getTechIcon('default');
            }}
          />

          <div className="pointer-events-none absolute -top-10 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md bg-zinc-900 px-3 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition duration-200 group-hover:opacity-100">
            {tech}
            <div className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 rotate-45 bg-zinc-900" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Technologies;
