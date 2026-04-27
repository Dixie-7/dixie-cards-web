import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { AnimatePresence, motion } from 'motion/react';
import Technologies from './Technologies';

type ProjectItem = {
  id: string;
  title: string;
  imageSrc: string;
  description: string;
  technologies: string[];
};

const projects: ProjectItem[] = [
  {
    id: 'portfolio-website',
    title: 'Portfolio Website',
    imageSrc:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
    description:
      'A modern portfolio built with React, TypeScript and responsive design principles.',
    technologies: ['Dotnet', 'TypeScript', 'Bootstrap'],
  },
  {
    id: 'ecommerce-dashboard',
    title: 'E-commerce Dashboard',
    imageSrc:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    description:
      'An admin dashboard for tracking sales, orders and customer activity in real time.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
  },
  {
    id: 'task-management-app',
    title: 'Task Management App',
    imageSrc:
      'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80',
    description:
      'A clean productivity app to organize tasks, priorities and project workflows.',
    technologies: ['SQL Server', 'CSS', 'HTML'],
  },
];

export default function ProjectsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((previousIndex) => (previousIndex + 1) % projects.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex(
      (previousIndex) => (previousIndex - 1 + projects.length) % projects.length,
    );
  };

  const currentProject = projects[currentIndex];

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-4 py-10">
      <div className="w-full overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl">
        <div className="relative h-65 w-full overflow-hidden sm:h-[320px] md:h-[420px] lg:h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProject.id}
              initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
              transition={{ duration: 0.15, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <img
                src={currentProject.imageSrc}
                alt={currentProject.title}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/35 to-transparent" />

              <div className="absolute bottom-4 left-0 flex w-full justify-center px-4 md:bottom-6 md:px-8">
                <div className="w-full max-w-[90%] rounded-xl bg-black/30 p-3 text-center backdrop-blur-sm md:max-w-2xl md:p-4">
                  <h2 className="mb-2 text-lg font-bold text-white md:text-2xl lg:text-3xl">
                    {currentProject.title}
                  </h2>
                  <p className="text-xs leading-relaxed text-zinc-200 md:text-sm lg:text-base">
                    {currentProject.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-4 bottom-1/4 z-10 -translate-y-1/2 rounded-full bg-black/35 p-3 text-white backdrop-blur-sm transition hover:bg-black/50"
            aria-label="Previous project"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="absolute right-4 bottom-1/4 z-10 -translate-y-1/2 rounded-full bg-black/35 p-3 text-white backdrop-blur-sm transition hover:bg-black/50"
            aria-label="Next project"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-4 py-10">
          <Technologies technologies={currentProject.technologies} />
        </div>
      </div>
    </section>
  );
}
