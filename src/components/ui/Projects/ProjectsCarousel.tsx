import { useMemo, useState } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PhotoIcon,
} from '@heroicons/react/24/solid';
import { AnimatePresence, motion } from 'motion/react';
import type { ProjectDto, ProjectImageDto, ProjectStatus } from '@/types/projects';
import Technologies from './Technologies';

interface ProjectsCarouselProps {
  projects: ProjectDto[];
  isLoading?: boolean;
  error?: string | null;
}

function splitTechnologies(technologies: string) {
  return technologies
    .split(/[;,]/)
    .map((technology) => technology.trim())
    .filter(Boolean);
}

function getDisplaySettings(project: ProjectDto) {
  return {
    showStatusTag: project.displaySettings?.showStatusTag ?? true,
    showIcons: project.displaySettings?.showIcons ?? true,
    showTechnologies: project.displaySettings?.showTechnologies ?? true,
    showProject: project.displaySettings?.showProject ?? true,
  };
}

function sortImages(images: ProjectImageDto[]) {
  return [...images].sort((currentImage, nextImage) => {
    if (currentImage.isCover !== nextImage.isCover) {
      return currentImage.isCover ? -1 : 1;
    }

    return currentImage.sortOrder - nextImage.sortOrder;
  });
}

function getStatusLabel(status: ProjectStatus) {
  const statusValue = String(status);
  const statusMap: Record<string, string> = {
    '0': 'Planificado',
    '1': 'En progreso',
    '2': 'Publicado',
    '3': 'Archivado',
    planned: 'Planificado',
    inprogress: 'En progreso',
    in_progress: 'En progreso',
    released: 'Publicado',
    published: 'Publicado',
    archived: 'Archivado',
  };

  return statusMap[statusValue.trim().toLowerCase()] ?? statusValue;
}

export default function ProjectsCarousel({
  projects,
  isLoading = false,
  error = null,
}: ProjectsCarouselProps) {
  const visibleProjects = useMemo(
    () =>
      projects
        .filter((project) => getDisplaySettings(project).showProject)
        .sort(
          (currentProject, nextProject) =>
            currentProject.sortOrder - nextProject.sortOrder,
        ),
    [projects],
  );
  const [projectIndex, setProjectIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [projectDirection, setProjectDirection] = useState<1 | -1>(1);
  const [imageDirection, setImageDirection] = useState<1 | -1>(1);
  const [failedImageIds, setFailedImageIds] = useState<Set<number>>(
    () => new Set(),
  );

  const safeProjectIndex =
    visibleProjects.length === 0
      ? 0
      : Math.min(projectIndex, visibleProjects.length - 1);
  const currentProject = visibleProjects[safeProjectIndex];
  const currentSettings = currentProject
    ? getDisplaySettings(currentProject)
    : null;
  const projectImages = currentProject ? sortImages(currentProject.images) : [];
  const safeImageIndex =
    projectImages.length === 0
      ? 0
      : Math.min(imageIndex, projectImages.length - 1);
  const currentImage = projectImages[safeImageIndex];
  const hasMultipleProjects = visibleProjects.length > 1;
  const hasMultipleImages = projectImages.length > 1;

  const showNextProject = () => {
    if (!hasMultipleProjects) {
      return;
    }

    setProjectDirection(1);
    setImageIndex(0);
    setProjectIndex(
      (currentIndex) =>
        (Math.min(currentIndex, visibleProjects.length - 1) + 1) %
        visibleProjects.length,
    );
  };

  const showPreviousProject = () => {
    if (!hasMultipleProjects) {
      return;
    }

    setProjectDirection(-1);
    setImageIndex(0);
    setProjectIndex(
      (currentIndex) =>
        (Math.min(currentIndex, visibleProjects.length - 1) -
          1 +
          visibleProjects.length) %
        visibleProjects.length,
    );
  };

  const showNextImage = () => {
    if (!hasMultipleImages) {
      return;
    }

    setImageDirection(1);
    setImageIndex(
      (currentIndex) =>
        (Math.min(currentIndex, projectImages.length - 1) + 1) %
        projectImages.length,
    );
  };

  const showPreviousImage = () => {
    if (!hasMultipleImages) {
      return;
    }

    setImageDirection(-1);
    setImageIndex(
      (currentIndex) =>
        (Math.min(currentIndex, projectImages.length - 1) -
          1 +
          projectImages.length) %
        projectImages.length,
    );
  };

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-4 py-10">
      <div className="w-full overflow-hidden rounded-lg bg-zinc-900 shadow-2xl shadow-black/30">
        <div className="relative min-h-[560px] w-full overflow-hidden sm:min-h-[620px] lg:min-h-[680px]">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 text-sm font-semibold text-zinc-300">
              Cargando proyectos...
            </div>
          )}

          {!isLoading && error && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-950/50 px-6 text-center text-sm font-semibold text-red-100">
              {error}
            </div>
          )}

          {!isLoading && !error && !currentProject && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-950 px-6 text-center text-zinc-300">
              <PhotoIcon className="h-10 w-10 text-cyan-200" aria-hidden="true" />
              <p className="text-sm font-semibold">
                No hay proyectos visibles para mostrar en el carousel.
              </p>
            </div>
          )}

          {!isLoading && !error && currentProject && currentSettings && (
            <AnimatePresence mode="wait">
              <motion.article
                key={currentProject.id}
                initial={{ x: projectDirection > 0 ? 320 : -320, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: projectDirection > 0 ? -320 : 320, opacity: 0 }}
                transition={{ duration: 0.18, ease: 'easeInOut' }}
                className="absolute inset-0 flex flex-col"
              >
                <div className="relative h-72 w-full overflow-hidden sm:h-[360px] lg:h-[440px]">
                  {currentImage && !failedImageIds.has(currentImage.id) ? (
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentImage.id}
                        src={currentImage.imageUrl}
                        alt={currentImage.altText ?? currentProject.name}
                        initial={{
                          x: imageDirection > 0 ? 160 : -160,
                          opacity: 0,
                        }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{
                          x: imageDirection > 0 ? -160 : 160,
                          opacity: 0,
                        }}
                        transition={{ duration: 0.15, ease: 'easeInOut' }}
                        className="absolute inset-0 h-full w-full object-cover"
                        onError={() =>
                          setFailedImageIds((currentIds) => {
                            const nextIds = new Set(currentIds);

                            nextIds.add(currentImage.id);

                            return nextIds;
                          })
                        }
                      />
                    </AnimatePresence>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-950 px-6 text-center text-zinc-300">
                      <PhotoIcon
                        className="h-10 w-10 text-zinc-500"
                        aria-hidden="true"
                      />
                      <p className="text-sm font-semibold">
                        {currentImage
                          ? 'No se pudo cargar esta imagen.'
                          : 'Este proyecto no tiene imagenes cargadas.'}
                      </p>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />

                  {hasMultipleImages && (
                    <>
                      <motion.button
                        type="button"
                        onClick={showPreviousImage}
                        whileHover={{ scale: 1.08, x: -2 }}
                        whileTap={{ scale: 0.96 }}
                        className="absolute left-3 top-1/2 z-10 inline-flex -translate-y-1/2 items-center justify-center px-2 py-10 text-white/70 drop-shadow-[0_4px_18px_rgba(0,0,0,0.85)] transition hover:text-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 sm:left-5"
                        aria-label="Imagen anterior del proyecto"
                      >
                        <span
                          className="inline-block scale-y-[2.6] text-6xl font-light leading-none sm:text-7xl"
                          aria-hidden="true"
                        >
                          {'<'}
                        </span>
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={showNextImage}
                        whileHover={{ scale: 1.08, x: 2 }}
                        whileTap={{ scale: 0.96 }}
                        className="absolute right-3 top-1/2 z-10 inline-flex -translate-y-1/2 items-center justify-center px-2 py-10 text-white/70 drop-shadow-[0_4px_18px_rgba(0,0,0,0.85)] transition hover:text-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 sm:right-5"
                        aria-label="Imagen siguiente del proyecto"
                      >
                        <span
                          className="inline-block scale-y-[2.6] text-6xl font-light leading-none sm:text-7xl"
                          aria-hidden="true"
                        >
                          {'>'}
                        </span>
                      </motion.button>
                    </>
                  )}

                  <div className="absolute bottom-4 left-0 flex w-full justify-center px-4">
                    <div className="flex items-center gap-2">
                      {projectImages.map((image, index) => (
                        <button
                          key={image.id}
                          type="button"
                          onClick={() => {
                            setImageDirection(index > safeImageIndex ? 1 : -1);
                            setImageIndex(index);
                          }}
                          className={`h-2.5 rounded-full transition ${
                            index === safeImageIndex
                              ? 'w-8 bg-cyan-300'
                              : 'w-2.5 bg-white/55 hover:bg-white'
                          }`}
                          aria-label={`Ver imagen ${index + 1} del proyecto`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-5 bg-zinc-950 px-5 py-5 text-left sm:px-7">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2.5 py-1 text-xs font-semibold text-cyan-100">
                      Proyecto {safeProjectIndex + 1} de {visibleProjects.length}
                    </span>
                    {currentSettings.showStatusTag && (
                      <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-100">
                        {getStatusLabel(currentProject.status)}
                      </span>
                    )}
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white md:text-3xl">
                      {currentProject.name}
                    </h2>
                    {currentProject.description && (
                      <p className="mt-3 text-sm leading-6 text-zinc-300 md:text-base md:leading-7">
                        {currentProject.description}
                      </p>
                    )}
                  </div>

                  {currentProject.collaborators && (
                    <p className="text-sm font-medium text-zinc-300">
                      Colaboradores:{' '}
                      <span className="text-zinc-100">
                        {currentProject.collaborators}
                      </span>
                    </p>
                  )}

                  {currentSettings.showTechnologies && (
                    <Technologies
                      technologies={splitTechnologies(currentProject.technologies)}
                      showIcons={currentSettings.showIcons}
                    />
                  )}
                </div>
              </motion.article>
            </AnimatePresence>
          )}

          {hasMultipleProjects && (
            <>
              <motion.button
                type="button"
                onClick={showPreviousProject}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="absolute left-4 top-5 z-20 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-950/80 px-3 py-2 text-xs font-semibold uppercase text-white shadow-lg shadow-black/30 backdrop-blur-sm transition hover:border-cyan-300/50 hover:bg-cyan-900/75 hover:text-cyan-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
                aria-label="Proyecto anterior"
              >
                <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
                <span>Previous</span>
              </motion.button>
              <motion.button
                type="button"
                onClick={showNextProject}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="absolute right-4 top-5 z-20 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-950/80 px-3 py-2 text-xs font-semibold uppercase text-white shadow-lg shadow-black/30 backdrop-blur-sm transition hover:border-cyan-300/50 hover:bg-cyan-900/75 hover:text-cyan-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
                aria-label="Proyecto siguiente"
              >
                <span>Next</span>
                <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
              </motion.button>
            </>
          )}
        </div>

        {hasMultipleProjects && (
          <div className="flex items-center justify-center gap-2 border-t border-zinc-800 bg-zinc-950 px-4 py-3">
            {visibleProjects.map((project, index) => (
              <button
                key={project.id}
                type="button"
                onClick={() => {
                  setProjectDirection(index > safeProjectIndex ? 1 : -1);
                  setProjectIndex(index);
                  setImageIndex(0);
                }}
                className={`h-2.5 rounded-full transition ${
                  index === safeProjectIndex
                    ? 'w-8 bg-cyan-300'
                    : 'w-2.5 bg-zinc-600 hover:bg-zinc-400'
                }`}
                aria-label={`Ver proyecto ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
