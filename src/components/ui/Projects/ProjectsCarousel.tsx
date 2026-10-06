import { useMemo, useState } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PhotoIcon,
} from '@heroicons/react/24/solid';
import { AnimatePresence, motion } from 'motion/react';
import { isImageUserFile } from '@/services/userFilesApi';
import type { UserFileDto } from '@/types/userFiles';

interface ProjectsCarouselProps {
  files: UserFileDto[];
  isLoading?: boolean;
  error?: string | null;
}

function formatUploadedDate(uploadedAt: string) {
  const date = new Date(uploadedAt);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('es', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export default function ProjectsCarousel({
  files,
  isLoading = false,
  error = null,
}: ProjectsCarouselProps) {
  const imageFiles = useMemo(() => files.filter(isImageUserFile), [files]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [failedImageIds, setFailedImageIds] = useState<Set<number>>(
    () => new Set(),
  );

  const handleNext = () => {
    if (imageFiles.length <= 1) {
      return;
    }

    setDirection(1);
    setCurrentIndex(
      (previousIndex) =>
        (Math.min(previousIndex, imageFiles.length - 1) + 1) %
        imageFiles.length,
    );
  };

  const handlePrev = () => {
    if (imageFiles.length <= 1) {
      return;
    }

    setDirection(-1);
    setCurrentIndex(
      (previousIndex) =>
        (Math.min(previousIndex, imageFiles.length - 1) -
          1 +
          imageFiles.length) %
        imageFiles.length,
    );
  };

  const safeCurrentIndex =
    imageFiles.length === 0
      ? 0
      : Math.min(currentIndex, imageFiles.length - 1);
  const currentImage = imageFiles[safeCurrentIndex];
  const hasMultipleImages = imageFiles.length > 1;
  const uploadedDate = currentImage
    ? formatUploadedDate(currentImage.uploadedAt)
    : '';

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-4 py-10">
      <div className="w-full overflow-hidden rounded-lg bg-zinc-900 shadow-2xl shadow-black/30">
        <div className="relative h-64 w-full overflow-hidden sm:h-[320px] md:h-[420px] lg:h-[500px]">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 text-sm font-semibold text-zinc-300">
              Cargando imagenes...
            </div>
          )}

          {!isLoading && error && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-950/50 px-6 text-center text-sm font-semibold text-red-100">
              {error}
            </div>
          )}

          {!isLoading && !error && !currentImage && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-950 px-6 text-center text-zinc-300">
              <PhotoIcon className="h-10 w-10 text-cyan-200" aria-hidden="true" />
              <p className="text-sm font-semibold">
                No hay imagenes para mostrar en el carousel.
              </p>
            </div>
          )}

          {!isLoading && !error && currentImage && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImage.id}
                initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
                transition={{ duration: 0.15, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                {failedImageIds.has(currentImage.id) ? (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-zinc-950 px-6 text-center text-zinc-300">
                    <PhotoIcon
                      className="h-10 w-10 text-zinc-500"
                      aria-hidden="true"
                    />
                    <p className="text-sm font-semibold">
                      No se pudo cargar esta imagen.
                    </p>
                  </div>
                ) : (
                  <img
                    src={currentImage.fileUrl}
                    alt={currentImage.description ?? currentImage.name}
                    className="h-full w-full object-cover"
                    onError={() =>
                      setFailedImageIds((currentIds) => {
                        const nextIds = new Set(currentIds);

                        nextIds.add(currentImage.id);

                        return nextIds;
                      })
                    }
                  />
                )}

                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent" />

                <div className="absolute bottom-4 left-0 flex w-full justify-center px-4 md:bottom-6 md:px-8">
                  <div className="w-full max-w-2xl rounded-lg bg-black/35 p-3 text-center backdrop-blur-sm md:p-4">
                    <p className="text-xs font-semibold uppercase text-cyan-100">
                      Imagen {safeCurrentIndex + 1} de {imageFiles.length}
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-white md:text-2xl">
                      {currentImage.name}
                    </h2>
                    {currentImage.description && (
                      <p className="mt-2 text-xs leading-relaxed text-zinc-200 md:text-sm">
                        {currentImage.description}
                      </p>
                    )}
                    {uploadedDate && (
                      <p className="mt-2 text-xs text-zinc-400">
                        {uploadedDate}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {hasMultipleImages && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-4 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
                aria-label="Imagen anterior"
              >
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
                aria-label="Imagen siguiente"
              >
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </>
          )}
        </div>

        {hasMultipleImages && (
          <div className="flex items-center justify-center gap-2 border-t border-zinc-800 bg-zinc-950 px-4 py-3">
            {imageFiles.map((file, index) => (
              <button
                key={file.id}
                type="button"
                onClick={() => {
                  setDirection(index > safeCurrentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`h-2.5 rounded-full transition ${
                  index === safeCurrentIndex
                    ? 'w-8 bg-cyan-300'
                    : 'w-2.5 bg-zinc-600 hover:bg-zinc-400'
                }`}
                aria-label={`Ver imagen ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
