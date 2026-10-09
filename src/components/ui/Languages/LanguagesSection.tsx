import { LanguageIcon } from '@heroicons/react/24/outline';
import { motion } from 'motion/react';
import { useMemo } from 'react';
import type { UserLanguageDto } from '@/types/userLanguages';
import { getLanguageAccentColor, getSafePercent } from './languageUi';

interface LanguagesSectionProps {
  languages: UserLanguageDto[];
  isLoading?: boolean;
  error?: string | null;
  showPercent?: boolean;
  showLevel?: boolean;
}

export default function LanguagesSection({
  languages,
  isLoading = false,
  error = null,
  showPercent = true,
  showLevel = true,
}: LanguagesSectionProps) {
  const sortedLanguages = useMemo(
    () =>
      [...languages].sort(
        (currentLanguage, nextLanguage) =>
          currentLanguage.sortOrder - nextLanguage.sortOrder,
      ),
    [languages],
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="w-full px-4 py-12"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 text-left">
          <p className="text-sm font-medium text-cyan-700 dark:text-cyan-300">
            Lenguajes
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-white">
            Idiomas y comunicacion
          </h2>
        </div>

        {isLoading && (
          <p className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-left text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
            Cargando lenguajes...
          </p>
        )}

        {!isLoading && error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200">
            {error}
          </p>
        )}

        {!isLoading && !error && sortedLanguages.length === 0 && (
          <div className="rounded-lg border border-dashed border-zinc-300 p-6 text-left text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            Este portfolio todavia no tiene lenguajes publicados.
          </div>
        )}

        {!isLoading && !error && sortedLanguages.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {sortedLanguages.map((language) => {
              const safePercent = getSafePercent(language.skillPercent);
              const accentColor = getLanguageAccentColor(safePercent);

              return (
                <article
                  key={language.id}
                  className="relative overflow-hidden rounded-lg border border-zinc-200 bg-white p-5 text-left shadow-sm shadow-zinc-950/5 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-cyan-950/10 dark:border-zinc-800 dark:bg-zinc-950/80 dark:shadow-black/20 dark:hover:border-cyan-400/40"
                >
                  <div
                    className="absolute inset-y-0 left-0 w-1"
                    style={{ backgroundColor: accentColor }}
                  />
                  <div className="flex items-start gap-4">
                    <span
                      className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border bg-white dark:bg-zinc-900"
                      style={{
                        borderColor: accentColor,
                        boxShadow: `0 0 0 4px ${accentColor}18`,
                      }}
                    >
                      <LanguageIcon
                        className="h-6 w-6"
                        style={{ color: accentColor }}
                        aria-hidden="true"
                      />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-semibold text-zinc-950 dark:text-white">
                          {language.language}
                        </h3>
                        {showLevel && (
                          <span
                            className="rounded-full border px-2.5 py-1 text-xs font-semibold"
                            style={{
                              borderColor: `${accentColor}66`,
                              color: accentColor,
                              backgroundColor: `${accentColor}12`,
                            }}
                          >
                            {language.level}
                          </span>
                        )}
                      </div>

                      {showPercent && (
                        <div>
                          <div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                            <span>Dominio</span>
                            <span>{safePercent}%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${safePercent}%`,
                                backgroundColor: accentColor,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </motion.section>
  );
}
