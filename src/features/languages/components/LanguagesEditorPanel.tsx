import {
  CheckIcon,
  LanguageIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useMemo, useState, type FormEvent } from 'react';
import type {
  UserLanguageDto,
  UserLanguagePayload,
} from '@/features/languages/types/language.types';
import { getLanguageAccentColor, getSafePercent } from './languageUi';

interface LanguagesEditorPanelProps {
  languages: UserLanguageDto[];
  isLoading: boolean;
  error: string | null;
  currentUserId: number;
  onCreateLanguage: (
    payload: UserLanguagePayload,
  ) => Promise<UserLanguageDto>;
  onUpdateLanguage: (
    languageId: number,
    payload: UserLanguagePayload,
  ) => Promise<UserLanguageDto>;
  onDeleteLanguage: (languageId: number) => Promise<void>;
}

type LanguageEditor =
  | { mode: 'create' }
  | { mode: 'edit'; languageId: number };

interface LanguageDraft {
  language: string;
  level: string;
  skillPercent: number;
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

function createEmptyLanguageDraft(
  languages: UserLanguageDto[],
): LanguageDraft {
  return {
    language: 'Nuevo lenguaje',
    level: 'Basico',
    skillPercent: 50,
    sortOrder: getNextSortOrder(languages),
  };
}

function createLanguageDraft(language: UserLanguageDto): LanguageDraft {
  return {
    language: language.language,
    level: language.level,
    skillPercent: language.skillPercent,
    sortOrder: language.sortOrder,
  };
}

function getLanguagePayload(draft: LanguageDraft): UserLanguagePayload {
  return {
    language: draft.language.trim() || 'Untitled language',
    level: draft.level.trim() || 'Sin nivel',
    skillPercent: getSafePercent(Number(draft.skillPercent)),
    sortOrder: getSafeSortOrder(Number(draft.sortOrder)),
  };
}

function LanguageAdminCard({
  language,
  onEdit,
  onDelete,
}: {
  language: UserLanguageDto;
  onEdit: (language: UserLanguageDto) => void;
  onDelete: (language: UserLanguageDto) => void;
}) {
  const safePercent = getSafePercent(language.skillPercent);
  const accentColor = getLanguageAccentColor(safePercent);

  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-5 text-left shadow-sm shadow-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-950/80 dark:shadow-black/20">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-white dark:bg-zinc-900"
            style={{ borderColor: accentColor }}
          >
            <LanguageIcon
              className="h-5 w-5"
              style={{ color: accentColor }}
              aria-hidden="true"
            />
          </span>
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-semibold text-zinc-950 dark:text-white">
                {language.language}
              </h3>
              <span className="rounded-full border border-zinc-200 px-2.5 py-1 text-xs font-semibold text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                Orden {language.sortOrder}
              </span>
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
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${safePercent}%`,
                  backgroundColor: accentColor,
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex shrink-0 gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(language)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 transition hover:border-cyan-300 hover:text-cyan-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 dark:border-zinc-800 dark:text-zinc-200 dark:hover:text-cyan-200"
            aria-label={`Editar ${language.language}`}
            title="Editar"
          >
            <PencilSquareIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(language)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-700 transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:border-red-400/20 dark:text-red-200 dark:hover:bg-red-400/10"
            aria-label={`Eliminar ${language.language}`}
            title="Eliminar"
          >
            <TrashIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function LanguagesEditorPanel({
  languages,
  isLoading,
  error,
  currentUserId,
  onCreateLanguage,
  onUpdateLanguage,
  onDeleteLanguage,
}: LanguagesEditorPanelProps) {
  const sortedLanguages = useMemo(
    () =>
      [...languages].sort(
        (currentLanguage, nextLanguage) =>
          currentLanguage.sortOrder - nextLanguage.sortOrder,
      ),
    [languages],
  );
  const [editor, setEditor] = useState<LanguageEditor | null>(null);
  const [draft, setDraft] = useState<LanguageDraft>(() =>
    createEmptyLanguageDraft([]),
  );
  const [statusMessage, setStatusMessage] = useState('');
  const [mutationError, setMutationError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const openCreateLanguage = () => {
    setEditor({ mode: 'create' });
    setDraft(createEmptyLanguageDraft(sortedLanguages));
    setStatusMessage('');
    setMutationError('');
  };

  const openEditLanguage = (language: UserLanguageDto) => {
    setEditor({ mode: 'edit', languageId: language.id });
    setDraft(createLanguageDraft(language));
    setStatusMessage('');
    setMutationError('');
  };

  const closeEditor = () => {
    setEditor(null);
    setDraft(createEmptyLanguageDraft(sortedLanguages));
    setMutationError('');
  };

  const handleSaveLanguage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editor) {
      return;
    }

    setIsSaving(true);
    setMutationError('');

    try {
      const payload = getLanguagePayload(draft);
      const savedLanguage =
        editor.mode === 'create'
          ? await onCreateLanguage(payload)
          : await onUpdateLanguage(editor.languageId, payload);

      setStatusMessage(`Lenguaje "${savedLanguage.language}" guardado.`);
      closeEditor();
    } catch (unknownError) {
      setMutationError(
        unknownError instanceof Error
          ? unknownError.message
          : 'No se pudo guardar el lenguaje.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLanguage = async (language: UserLanguageDto) => {
    if (!window.confirm(`Eliminar "${language.language}"?`)) {
      return;
    }

    setIsSaving(true);
    setMutationError('');

    try {
      await onDeleteLanguage(language.id);

      if (editor?.mode === 'edit' && editor.languageId === language.id) {
        closeEditor();
      }

      setStatusMessage(`Lenguaje "${language.language}" eliminado.`);
    } catch (unknownError) {
      setMutationError(
        unknownError instanceof Error
          ? unknownError.message
          : 'No se pudo eliminar el lenguaje.',
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
              Languages manager
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-white">
              Lenguajes
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              User #{currentUserId}
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateLanguage}
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 dark:bg-white dark:text-zinc-950 dark:hover:bg-cyan-100 md:self-end"
          >
            <PlusIcon className="h-4 w-4" aria-hidden="true" />
            Crear lenguaje
          </button>
        </div>

        {isLoading && (
          <p className="mt-4 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-left text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
            Cargando lenguajes...
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
            onSubmit={handleSaveLanguage}
            className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50/80 p-4 text-left dark:border-zinc-800 dark:bg-zinc-900/40"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                  {editor.mode === 'create'
                    ? 'Crear lenguaje'
                    : 'Editar lenguaje'}
                </p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  DTO UserLanguageDto / UpdateUserLanguageDto
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
                <span className={labelClass}>Language</span>
                <input
                  value={draft.language}
                  maxLength={50}
                  onChange={(event) =>
                    setDraft((currentDraft) => ({
                      ...currentDraft,
                      language: event.target.value,
                    }))
                  }
                  className={fieldClass}
                  required
                />
              </label>

              <label>
                <span className={labelClass}>Level</span>
                <input
                  value={draft.level}
                  maxLength={30}
                  onChange={(event) =>
                    setDraft((currentDraft) => ({
                      ...currentDraft,
                      level: event.target.value,
                    }))
                  }
                  className={fieldClass}
                  required
                />
              </label>

              <label>
                <span className={labelClass}>SkillPercent</span>
                <div className="grid gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={draft.skillPercent}
                    onChange={(event) =>
                      setDraft((currentDraft) => ({
                        ...currentDraft,
                        skillPercent: Number(event.target.value),
                      }))
                    }
                    className={fieldClass}
                  />
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={getSafePercent(draft.skillPercent)}
                    onChange={(event) =>
                      setDraft((currentDraft) => ({
                        ...currentDraft,
                        skillPercent: Number(event.target.value),
                      }))
                    }
                    className="w-full accent-cyan-700"
                  />
                </div>
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

        {!isLoading && sortedLanguages.length === 0 && (
          <div className="mt-6 rounded-lg border border-dashed border-zinc-300 p-6 text-left text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            No hay lenguajes todavia.
          </div>
        )}

        {sortedLanguages.length > 0 && (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {sortedLanguages.map((language) => (
              <LanguageAdminCard
                key={language.id}
                language={language}
                onEdit={openEditLanguage}
                onDelete={(languageToDelete) =>
                  void handleDeleteLanguage(languageToDelete)
                }
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
