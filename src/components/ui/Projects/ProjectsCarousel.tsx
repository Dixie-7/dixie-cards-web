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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="absolute inset-0 flex flex-col"
              >
                <div className="relative h-72 w-full overflow-hidden sm:h-[360px] lg:h-[440px]">
                  {currentImage && !failedImageIds.has(currentImage.id) ? (
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentImage.id}
                        src={currentImage.imageUrl}
                        alt={currentImage.altText ?? currentProject.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
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
                  <div className="absolute left-0 top-0 flex w-full justify-center bg-linear-to-b from-black/70 via-black/25 to-transparent px-5 pb-10 pt-5 text-center sm:px-8 sm:pt-6">
                    <h2 className="max-w-3xl text-2xl font-bold leading-tight text-white drop-shadow-[0_3px_16px_rgba(0,0,0,0.85)] md:text-3xl">
                      {currentProject.name}
                    </h2>
                  </div>

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
                    <div className="flex items-end gap-2">
                      {projectImages.map((image, index) => (
                        <button
                          key={image.id}
                          type="button"
                          onClick={() => setImageIndex(index)}
                          className={`rounded-full transition ${
                            index === safeImageIndex
                              ? 'h-8 w-1.5 bg-cyan-300'
                              : 'h-4 w-1.5 bg-white/55 hover:h-6 hover:bg-white'
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

                  {currentProject.description && (
                    <p className="text-center text-sm leading-6 text-zinc-300 md:text-base md:leading-7">
                      {currentProject.description}
                    </p>
                  )}

                  {currentProject.collaborators && (
                    <p className="text-center text-sm font-medium text-zinc-300">
                      Colaboradores:{' '}
                      <span className="text-zinc-100">
                        {currentProject.collaborators}
                      </span>
                    </p>
                  )}

                  {(currentSettings.showTechnologies || hasMultipleProjects) && (
                    <div className="mx-auto grid w-full max-w-3xl items-center gap-3 md:grid-cols-[auto_minmax(0,1fr)_auto]">
                      <div className="flex justify-center">
                        {hasMultipleProjects && (
                          <motion.button
                            type="button"
                            onClick={showPreviousProject}
                            whileHover={{ x: -2, y: -1 }}
                            whileTap={{ scale: 0.96 }}
                            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-cyan-300/20 bg-zinc-900/80 px-2.5 text-[0.68rem] font-bold uppercase tracking-normal text-cyan-100 shadow-sm shadow-black/20 transition hover:border-cyan-200/70 hover:bg-cyan-950 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
                            aria-label="Proyecto anterior"
                          >
                            <ChevronLeftIcon className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Prev</span>
                          </motion.button>
                        )}
                      </div>

                      <div className="min-w-0">
                        {currentSettings.showTechnologies && (
                          <Technologies
                            technologies={splitTechnologies(currentProject.technologies)}
                            showIcons={currentSettings.showIcons}
                          />
                        )}
                      </div>

                      <div className="flex justify-center">
                        {hasMultipleProjects && (
                          <motion.button
                            type="button"
                            onClick={showNextProject}
                            whileHover={{ x: 2, y: -1 }}
                            whileTap={{ scale: 0.96 }}
                            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-cyan-300/20 bg-zinc-900/80 px-2.5 text-[0.68rem] font-bold uppercase tracking-normal text-cyan-100 shadow-sm shadow-black/20 transition hover:border-cyan-200/70 hover:bg-cyan-950 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
                            aria-label="Proyecto siguiente"
                          >
                            <span>Next</span>
                            <ChevronRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
                          </motion.button>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              </motion.article>
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
}
