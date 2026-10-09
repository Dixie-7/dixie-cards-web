import { AcademicCapIcon } from '@heroicons/react/24/outline';
import { motion } from 'motion/react';
import { useMemo, useState } from 'react';
import type { SkillDto } from '@/features/skills/types/skill.types';
import { getSkillAccentColor, getSkillIconSource } from './skillUi';

interface SkillsSectionProps {
  skills: SkillDto[];
  isLoading?: boolean;
  error?: string | null;
}

export default function SkillsSection({
  skills,
  isLoading = false,
  error = null,
}: SkillsSectionProps) {
  const sortedSkills = useMemo(
    () =>
      [...skills].sort(
        (currentSkill, nextSkill) =>
          currentSkill.sortOrder - nextSkill.sortOrder,
      ),
    [skills],
  );
  const [failedSkillIds, setFailedSkillIds] = useState<Set<number>>(
    () => new Set(),
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
            Skills
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-white">
            Herramientas y fortalezas
          </h2>
        </div>

        {isLoading && (
          <p className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-left text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
            Cargando skills...
          </p>
        )}

        {!isLoading && error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200">
            {error}
          </p>
        )}

        {!isLoading && !error && sortedSkills.length === 0 && (
          <div className="rounded-lg border border-dashed border-zinc-300 p-6 text-left text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            Este portfolio todavia no tiene skills publicadas.
          </div>
        )}

        {!isLoading && !error && sortedSkills.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {sortedSkills.map((skill) => {
              const accentColor = getSkillAccentColor(skill.skillColor);

              return (
                <article
                  key={skill.id}
                  className="group relative overflow-hidden rounded-lg border border-zinc-200 bg-white p-5 text-left shadow-sm shadow-zinc-950/5 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-cyan-950/10 dark:border-zinc-800 dark:bg-zinc-950/80 dark:shadow-black/20 dark:hover:border-cyan-400/40"
                >
                  <div
                    className="absolute inset-x-0 top-0 h-1"
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
                      {failedSkillIds.has(skill.id) ? (
                        <AcademicCapIcon
                          className="h-6 w-6"
                          style={{ color: accentColor }}
                          aria-hidden="true"
                        />
                      ) : (
                        <img
                          src={getSkillIconSource(
                            skill.skillIcon,
                            skill.skillName,
                          )}
                          alt=""
                          className="h-7 w-7 object-contain"
                          onError={() =>
                            setFailedSkillIds((currentIds) => {
                              const nextIds = new Set(currentIds);

                              nextIds.add(skill.id);

                              return nextIds;
                            })
                          }
                        />
                      )}
                    </span>

                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-semibold text-zinc-950 dark:text-white">
                          {skill.skillName}
                        </h3>
                        <span className="rounded-full border border-zinc-200 px-2.5 py-1 text-xs font-semibold text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                          Orden {skill.sortOrder}
                        </span>
                      </div>

                      {skill.skillDescription && (
                        <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                          {skill.skillDescription}
                        </p>
                      )}

                      {skill.skillNote && (
                        <p
                          className="mt-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold"
                          style={{
                            borderColor: `${accentColor}66`,
                            color: accentColor,
                            backgroundColor: `${accentColor}12`,
                          }}
                        >
                          {skill.skillNote}
                        </p>
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
