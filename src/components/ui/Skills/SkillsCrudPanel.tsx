import {
  CheckIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useMemo, useState, type FormEvent } from 'react';
import type { SkillDto, SkillPayload } from '@/types/skills';
import {
  getSkillAccentColor,
  getSkillIconSource,
  skillIconOptions,
  type SkillIconOption,
} from './skillUi';

interface SkillsCrudPanelProps {
  skills: SkillDto[];
  isLoading: boolean;
  error: string | null;
  currentUserId: number;
  onCreateSkill: (payload: SkillPayload) => Promise<SkillDto>;
  onUpdateSkill: (
    skillId: number,
    payload: SkillPayload,
  ) => Promise<SkillDto>;
  onDeleteSkill: (skillId: number) => Promise<void>;
}

type SkillEditor = { mode: 'create' } | { mode: 'edit'; skillId: number };

interface SkillDraft {
  skillName: string;
  skillDescription: string;
  skillNote: string;
  skillIcon: string;
  skillColor: string;
  sortOrder: number;
}

const fieldClass =
  'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white';
const labelClass =
  'mb-1.5 block text-xs font-semibold text-zinc-600 dark:text-zinc-300';

function getNextSortOrder(items: Array<{ sortOrder: number }>) {
  return Math.max(0, ...items.map((item) => item.sortOrder)) + 1;
}

function getSafeSortOrder(sortOrder: number) {
  if (!Number.isFinite(sortOrder)) {
    return 0;
  }

  return Math.max(0, Math.round(sortOrder));
}

function createEmptySkillDraft(skills: SkillDto[]): SkillDraft {
  return {
    skillName: 'Nueva skill',
    skillDescription: '',
    skillNote: '',
    skillIcon: '',
    skillColor: '#06b6d4',
    sortOrder: getNextSortOrder(skills),
  };
}

function createSkillDraft(skill: SkillDto): SkillDraft {
  return {
    skillName: skill.skillName,
    skillDescription: skill.skillDescription ?? '',
    skillNote: skill.skillNote ?? '',
    skillIcon: skill.skillIcon ?? '',
    skillColor: skill.skillColor ?? '',
    sortOrder: skill.sortOrder,
  };
}

function getSkillPayload(draft: SkillDraft): SkillPayload {
  return {
    skillName: draft.skillName.trim() || 'Untitled skill',
    skillDescription: draft.skillDescription.trim() || null,
    skillNote: draft.skillNote.trim() || null,
    skillIcon: draft.skillIcon.trim() || null,
    skillColor: draft.skillColor.trim() || null,
    sortOrder: getSafeSortOrder(Number(draft.sortOrder)),
  };
}

function SkillAdminCard({
  skill,
  onEdit,
  onDelete,
}: {
  skill: SkillDto;
  onEdit: (skill: SkillDto) => void;
  onDelete: (skill: SkillDto) => void;
}) {
  const accentColor = getSkillAccentColor(skill.skillColor);

  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-5 text-left shadow-sm shadow-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-950/80 dark:shadow-black/20">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-white dark:bg-zinc-900"
            style={{ borderColor: accentColor }}
          >
            <img
              src={getSkillIconSource(skill.skillIcon, skill.skillName)}
              alt=""
              className="h-6 w-6 object-contain"
            />
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
              <p className="mt-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                {skill.skillNote}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(skill)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 transition hover:border-cyan-300 hover:text-cyan-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 dark:border-zinc-800 dark:text-zinc-200 dark:hover:text-cyan-200"
            aria-label={`Editar ${skill.skillName}`}
            title="Editar"
          >
            <PencilSquareIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(skill)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-700 transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:border-red-400/20 dark:text-red-200 dark:hover:bg-red-400/10"
            aria-label={`Eliminar ${skill.skillName}`}
            title="Eliminar"
          >
            <TrashIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}

function SkillIconPicker({
  value,
  skillName,
  onChange,
}: {
  value: string;
  skillName: string;
  onChange: (value: string) => void;
}) {
  const normalizedValue = value.trim();
  const hasKnownSelection = skillIconOptions.some(
    (option) => option.value === normalizedValue,
  );
  const currentCustomOption: SkillIconOption | null =
    normalizedValue && !hasKnownSelection
      ? {
          value: normalizedValue,
          label: 'Icono actual',
          description: normalizedValue,
          source: getSkillIconSource(normalizedValue, skillName),
        }
      : null;
  const pickerOptions = currentCustomOption
    ? [currentCustomOption, ...skillIconOptions]
    : skillIconOptions;

  return (
    <div className="md:col-span-2">
      <span className={labelClass}>SkillIcon</span>
      <div
        role="radiogroup"
        aria-label="Seleccionar icono de skill"
        className="grid max-h-80 gap-2 overflow-y-auto rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-950 sm:grid-cols-2 lg:grid-cols-3"
      >
        {pickerOptions.map((option) => {
          const selected = option.value === normalizedValue;

          return (
            <button
              key={option.value || 'auto'}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.value)}
              className={`flex min-h-16 items-center gap-3 rounded-lg border px-3 py-2 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 ${
                selected
                  ? 'border-cyan-500 bg-cyan-50 text-cyan-950 ring-2 ring-cyan-500/20 dark:border-cyan-400 dark:bg-cyan-400/10 dark:text-cyan-50'
                  : 'border-zinc-200 bg-white text-zinc-700 hover:border-cyan-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200'
              }`}
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                <img
                  src={option.source}
                  alt=""
                  className="h-7 w-7 object-contain"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = getSkillIconSource('default');
                  }}
                />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">
                  {option.label}
                </span>
                <span className="mt-0.5 block truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {option.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function SkillsCrudPanel({
  skills,
  isLoading,
  error,
  currentUserId,
  onCreateSkill,
  onUpdateSkill,
  onDeleteSkill,
}: SkillsCrudPanelProps) {
  const sortedSkills = useMemo(
    () =>
      [...skills].sort(
        (currentSkill, nextSkill) =>
          currentSkill.sortOrder - nextSkill.sortOrder,
      ),
    [skills],
  );
  const [editor, setEditor] = useState<SkillEditor | null>(null);
  const [draft, setDraft] = useState<SkillDraft>(() =>
    createEmptySkillDraft([]),
  );
  const [statusMessage, setStatusMessage] = useState('');
  const [mutationError, setMutationError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const openCreateSkill = () => {
    setEditor({ mode: 'create' });
    setDraft(createEmptySkillDraft(sortedSkills));
    setStatusMessage('');
    setMutationError('');
  };

  const openEditSkill = (skill: SkillDto) => {
    setEditor({ mode: 'edit', skillId: skill.id });
    setDraft(createSkillDraft(skill));
    setStatusMessage('');
    setMutationError('');
  };

  const closeEditor = () => {
    setEditor(null);
    setDraft(createEmptySkillDraft(sortedSkills));
    setMutationError('');
  };

  const handleSaveSkill = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editor) {
      return;
    }

    setIsSaving(true);
    setMutationError('');

    try {
      const payload = getSkillPayload(draft);
      const savedSkill =
        editor.mode === 'create'
          ? await onCreateSkill(payload)
          : await onUpdateSkill(editor.skillId, payload);

      setStatusMessage(`Skill "${savedSkill.skillName}" guardada.`);
      closeEditor();
    } catch (unknownError) {
      setMutationError(
        unknownError instanceof Error
          ? unknownError.message
          : 'No se pudo guardar la skill.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSkill = async (skill: SkillDto) => {
    if (!window.confirm(`Eliminar "${skill.skillName}"?`)) {
      return;
    }

    setIsSaving(true);
    setMutationError('');

    try {
      await onDeleteSkill(skill.id);

      if (editor?.mode === 'edit' && editor.skillId === skill.id) {
        closeEditor();
      }

      setStatusMessage(`Skill "${skill.skillName}" eliminada.`);
    } catch (unknownError) {
      setMutationError(
        unknownError instanceof Error
          ? unknownError.message
          : 'No se pudo eliminar la skill.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="w-full px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-3 text-left md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-cyan-700 dark:text-cyan-300">
              Skills manager
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-white">
              Skills
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              User #{currentUserId}
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateSkill}
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 dark:bg-white dark:text-zinc-950 dark:hover:bg-cyan-100 md:self-end"
          >
            <PlusIcon className="h-4 w-4" aria-hidden="true" />
            Crear skill
          </button>
        </div>

        {isLoading && (
          <p className="mt-4 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-left text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
            Cargando skills...
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200">
            {error}
          </p>
        )}

        {mutationError && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200">
            {mutationError}
          </p>
        )}

        {statusMessage && (
          <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-left text-sm text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
            {statusMessage}
          </p>
        )}

        {editor && (
          <form
            onSubmit={handleSaveSkill}
            className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50/80 p-4 text-left dark:border-zinc-800 dark:bg-zinc-900/40"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                  {editor.mode === 'create' ? 'Crear skill' : 'Editar skill'}
                </p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  DTO CreateSkillDto / UpdateSkillDto
                </p>
              </div>
              <button
                type="button"
                onClick={closeEditor}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition hover:border-cyan-300 dark:border-zinc-800 dark:text-zinc-300"
                aria-label="Cerrar editor"
                title="Cerrar"
              >
                <XMarkIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label>
                <span className={labelClass}>SkillName</span>
                <input
                  value={draft.skillName}
                  maxLength={50}
                  onChange={(event) =>
                    setDraft((currentDraft) => ({
                      ...currentDraft,
                      skillName: event.target.value,
                    }))
                  }
                  className={fieldClass}
                  required
                />
              </label>

              <label>
                <span className={labelClass}>SortOrder</span>
                <input
                  type="number"
                  min={0}
                  value={draft.sortOrder}
                  onChange={(event) =>
                    setDraft((currentDraft) => ({
                      ...currentDraft,
                      sortOrder: Number(event.target.value),
                    }))
                  }
                  className={fieldClass}
                />
              </label>

              <SkillIconPicker
                value={draft.skillIcon}
                skillName={draft.skillName}
                onChange={(skillIcon) =>
                  setDraft((currentDraft) => ({
                    ...currentDraft,
                    skillIcon,
                  }))
                }
              />

              <label>
                <span className={labelClass}>SkillColor</span>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={
                      /^#[\da-f]{6}$/i.test(draft.skillColor)
                        ? draft.skillColor
                        : '#06b6d4'
                    }
                    onChange={(event) =>
                      setDraft((currentDraft) => ({
                        ...currentDraft,
                        skillColor: event.target.value,
                      }))
                    }
                    className="h-10 w-12 cursor-pointer rounded-lg border border-zinc-300 bg-transparent p-1 dark:border-zinc-700"
                    aria-label="Skill color"
                  />
                  <input
                    value={draft.skillColor}
                    maxLength={30}
                    placeholder="#06b6d4"
                    onChange={(event) =>
                      setDraft((currentDraft) => ({
                        ...currentDraft,
                        skillColor: event.target.value,
                      }))
                    }
                    className={fieldClass}
                  />
                </div>
              </label>

              <label className="md:col-span-2">
                <span className={labelClass}>SkillDescription</span>
                <textarea
                  value={draft.skillDescription}
                  maxLength={500}
                  rows={3}
                  onChange={(event) =>
                    setDraft((currentDraft) => ({
                      ...currentDraft,
                      skillDescription: event.target.value,
                    }))
                  }
                  className={fieldClass}
                />
              </label>

              <label className="md:col-span-2">
                <span className={labelClass}>SkillNote</span>
                <input
                  value={draft.skillNote}
                  maxLength={250}
                  onChange={(event) =>
                    setDraft((currentDraft) => ({
                      ...currentDraft,
                      skillNote: event.target.value,
                    }))
                  }
                  className={fieldClass}
                />
              </label>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-wait disabled:bg-zinc-600"
              >
                <CheckIcon className="h-4 w-4" aria-hidden="true" />
                {isSaving ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                type="button"
                onClick={closeEditor}
                className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-cyan-300 dark:border-zinc-800 dark:text-zinc-200"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {!isLoading && sortedSkills.length === 0 && (
          <div className="mt-6 rounded-lg border border-dashed border-zinc-300 p-6 text-left text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            No hay skills todavia.
          </div>
        )}

        {sortedSkills.length > 0 && (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {sortedSkills.map((skill) => (
              <SkillAdminCard
                key={skill.id}
                skill={skill}
                onEdit={openEditSkill}
                onDelete={(skillToDelete) => void handleDeleteSkill(skillToDelete)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
