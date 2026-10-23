import { ArrowDownTrayIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import type { UserFileDto } from '@/features/files/types/userFile.types';
import { useLanguage } from '@/shared/i18n/useLanguage';

interface CvSectionProps {
  cv: UserFileDto;
}

export default function CvSection({ cv }: CvSectionProps) {
  const { t } = useLanguage();

  return (
    <section id="cv" className="app-section-anchor w-full px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 text-left">
          <p className="text-sm font-medium text-cyan-700 dark:text-cyan-300">
            CV
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-white">
            {t('cvAvailable')}
          </h2>
        </div>

        <a
          href={cv.fileUrl}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-white p-5 text-left shadow-sm shadow-zinc-950/5 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-cyan-950/10 dark:border-zinc-800 dark:bg-zinc-950/80 dark:shadow-black/20 dark:hover:border-cyan-400/40"
        >
          <span className="flex min-w-0 items-center gap-4">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-cyan-100 bg-cyan-50 text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-200">
              <DocumentTextIcon className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-lg font-semibold text-zinc-950 dark:text-white">
                {cv.name}
              </span>
              {cv.description && (
                <span className="mt-1 block text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  {cv.description}
                </span>
              )}
            </span>
          </span>
          <ArrowDownTrayIcon
            className="h-5 w-5 shrink-0 text-cyan-600 transition group-hover:translate-y-0.5 dark:text-cyan-300"
            aria-hidden="true"
          />
        </a>
      </div>
    </section>
  );
}
