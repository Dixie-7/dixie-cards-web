import {
  CalendarDaysIcon,
  CheckIcon,
  CodeBracketIcon,
  EyeIcon,
  EyeSlashIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useMemo, useState, type FormEvent } from 'react';
import type { ProjectDto, ProjectPayload, ProjectStatus } from '@/features/projects/types/project.types';
import Technologies from './Technologies';

interface ProjectsEditorPanelProps {
  projects: ProjectDto[];
  isLoading: boolean;
  error: string | null;
  currentUserId: number;
  onCreateProject: (payload: ProjectPayload) => Promise<ProjectDto>;
  onUpdateProject: (
    projectId: number,
    payload: ProjectPayload,
  ) => Promise<ProjectDto>;
  onDeleteProject: (projectId: number) => Promise<void>;
}

type ProjectEditor = { mode: 'create' } | { mode: 'edit'; projectId: number };

interface ProjectDraft {
  userId: number;
  name: string;
  description: string;
  technologies: string;
  releaseDate: string;
  status: string;
  collaborators: string;
  sortOrder: number;
  showStatusTag: boolean;
  showIcons: boolean;
  showTechnologies: boolean;
  showProject: boolean;
  images: ProjectImageDraft[];
}

interface ProjectImageDraft {
  imageUrl: string;
  altText: string;
  sortOrder: number;
  isCover: boolean;
}

const fieldClass =
  'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white';
const labelClass =
  'mb-1.5 block text-xs font-semibold text-zinc-600 dark:text-zinc-300';

const statusOptions = [
  { value: '0', label: 'Planificado' },
  { value: '1', label: 'En progreso' },
  { value: '2', label: 'Publicado' },
  { value: '3', label: 'Archivado' },
];

function getNextSortOrder(items: Array<{ sortOrder: number }>) {
  return Math.max(0, ...items.map((item) => item.sortOrder)) + 1;
}

function getSafeSortOrder(sortOrder: number) {
  if (!Number.isFinite(sortOrder)) {
    return 0;
  }

  return Math.max(0, Math.round(sortOrder));
}

function getDateInputValue(value?: string | null) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString().slice(0, 10);
}

function getDisplaySettings(project: ProjectDto) {
  return {
    showStatusTag: project.displaySettings?.showStatusTag ?? true,
    showIcons: project.displaySettings?.showIcons ?? true,
    showTechnologies: project.displaySettings?.showTechnologies ?? true,
    showProject: project.displaySettings?.showProject ?? true,
  };
}

function sortProjectImages(project: ProjectDto) {
  return [...project.images].sort(
    (currentImage, nextImage) =>
      currentImage.sortOrder - nextImage.sortOrder,
  );
}

function createEmptyProjectDraft(
  currentUserId: number,
  projects: ProjectDto[],
): ProjectDraft {
  return {
    userId: currentUserId,
    name: 'Nuevo proyecto',
    description: '',
    technologies: '',
    releaseDate: '',
    status: '0',
    collaborators: '',
    sortOrder: getNextSortOrder(projects),
    showStatusTag: true,
    showIcons: true,
    showTechnologies: true,
    showProject: true,
    images: [],
  };
}

function createProjectDraft(project: ProjectDto): ProjectDraft {
  const displaySettings = getDisplaySettings(project);

  return {
    userId: project.userId,
    name: project.name,
    description: project.description,
    technologies: project.technologies,
    releaseDate: getDateInputValue(project.releaseDate),
    status: String(project.status),
    collaborators: project.collaborators ?? '',
    sortOrder: project.sortOrder,
    ...displaySettings,
    images: sortProjectImages(project).map((image) => ({
      imageUrl: image.imageUrl,
      altText: image.altText ?? '',
      sortOrder: image.sortOrder,
      isCover: image.isCover,
    })),
  };
}

function parseProjectStatus(status: string): ProjectStatus {
  const normalizedStatus = status.trim();
  const numericStatus = Number(normalizedStatus);

  return normalizedStatus !== '' && Number.isFinite(numericStatus)
    ? numericStatus
    : normalizedStatus;
}

function getProjectPayload(
  draft: ProjectDraft,
  project?: ProjectDto | null,
): ProjectPayload {
  const images = draft.images
    .map((image) => ({
      imageUrl: image.imageUrl.trim(),
      altText: image.altText.trim() || null,
      sortOrder: getSafeSortOrder(Number(image.sortOrder)),
      isCover: image.isCover,
    }))
    .filter((image) => image.imageUrl);
  const hasCover = images.some((image) => image.isCover);

  return {
    userId: Number(draft.userId),
    name: draft.name.trim() || 'Untitled project',
    description: draft.description.trim(),
    technologies: draft.technologies.trim(),
    releaseDate: draft.releaseDate
      ? new Date(`${draft.releaseDate}T00:00:00.000Z`).toISOString()
      : null,
    status: parseProjectStatus(draft.status),
    collaborators: draft.collaborators.trim() || null,
    sortOrder: getSafeSortOrder(Number(draft.sortOrder)),
    displaySettings: {
      id: project?.displaySettings?.id,
      projectId: project?.id,
      showStatusTag: draft.showStatusTag,
      showIcons: draft.showIcons,
      showTechnologies: draft.showTechnologies,
      showProject: draft.showProject,
    },
    images: images.map((image, index) => ({
      ...image,
      isCover: hasCover ? image.isCover : index === 0,
    })),
  };
}

function splitTechnologies(technologies: string) {
  return technologies
    .split(/[;,]/)
    .map((technology) => technology.trim())
    .filter(Boolean);
}

function getStatusLabel(status: ProjectStatus) {
  const statusValue = String(status);
  const option = statusOptions.find(
    (statusOption) => statusOption.value === statusValue,
  );

  if (option) {
    return option.label;
  }

  const normalizedStatus = statusValue.trim().toLowerCase();

  if (normalizedStatus === 'planned' || normalizedStatus === 'planificado') {
    return 'Planificado';
  }

  if (
    normalizedStatus === 'inprogress' ||
    normalizedStatus === 'in_progress' ||
    normalizedStatus === 'en progreso'
  ) {
    return 'En progreso';
  }

  if (
    normalizedStatus === 'released' ||
    normalizedStatus === 'published' ||
    normalizedStatus === 'publicado'
  ) {
    return 'Publicado';
  }

  if (normalizedStatus === 'archived' || normalizedStatus === 'archivado') {
    return 'Archivado';
  }

  return statusValue || 'Sin estado';
}

function formatReleaseDate(value?: string | null) {
  if (!value) {
    return 'Sin fecha';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Sin fecha';
  }

  return new Intl.DateTimeFormat('es', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function ProjectCard({
  project,
  onEdit,
  onDelete,
}: {
  project: ProjectDto;
  onEdit: (project: ProjectDto) => void;
  onDelete: (project: ProjectDto) => void;
}) {
  const displaySettings = getDisplaySettings(project);
  const technologies = splitTechnologies(project.technologies);

  return (
    <article className="flex h-full flex-col rounded-lg border border-zinc-200 bg-white p-5 text-left shadow-sm shadow-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-950/80 dark:shadow-black/20">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {displaySettings.showIcons && (
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-100 bg-cyan-50 text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-200">
                <CodeBracketIcon className="h-4 w-4" aria-hidden="true" />
              </span>
            )}
            {displaySettings.showStatusTag && (
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-100">
                {getStatusLabel(project.status)}
              </span>
            )}
            <span className="rounded-full border border-zinc-200 px-2.5 py-1 text-xs font-semibold text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              Orden {project.sortOrder}
            </span>
            {!displaySettings.showProject && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100">
                <EyeSlashIcon className="h-3.5 w-3.5" aria-hidden="true" />
                Oculto
              </span>
            )}
          </div>
          <h3 className="text-xl font-semibold text-zinc-950 dark:text-white">
            {project.name}
          </h3>
        </div>

        <div className="flex shrink-0 gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(project)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 transition hover:border-cyan-300 hover:text-cyan-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 dark:border-zinc-800 dark:text-zinc-200 dark:hover:text-cyan-200"
            aria-label={`Editar ${project.name}`}
            title="Editar"
          >
            <PencilSquareIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(project)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-700 transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:border-red-400/20 dark:text-red-200 dark:hover:bg-red-400/10"
            aria-label={`Eliminar ${project.name}`}
            title="Eliminar"
          >
            <TrashIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {project.description && (
        <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
          {project.description}
        </p>
      )}

      <div className="mt-4 grid gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        <p className="flex items-center gap-2">
          <CalendarDaysIcon className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
          {formatReleaseDate(project.releaseDate)}
        </p>
        {project.collaborators && (
          <p className="flex items-center gap-2">
            <UsersIcon className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
            {project.collaborators}
          </p>
        )}
      </div>

      {displaySettings.showTechnologies && (
        <div className="mt-5">
          <Technologies
            technologies={technologies}
            showIcons={displaySettings.showIcons}
          />
        </div>
      )}
    </article>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-cyan-700"
      />
    </label>
  );
}

export default function ProjectsEditorPanel({
  projects,
  isLoading,
  error,
  currentUserId,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
}: ProjectsEditorPanelProps) {
  const sortedProjects = useMemo(
    () =>
      [...projects].sort(
        (currentProject, nextProject) =>
          currentProject.sortOrder - nextProject.sortOrder,
      ),
    [projects],
  );
  const [editor, setEditor] = useState<ProjectEditor | null>(null);
  const [draft, setDraft] = useState<ProjectDraft>(() =>
    createEmptyProjectDraft(currentUserId, []),
  );
  const [statusMessage, setStatusMessage] = useState('');
  const [mutationError, setMutationError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const editorProject =
    editor?.mode === 'edit'
      ? sortedProjects.find((project) => project.id === editor.projectId) ?? null
      : null;

  const openCreateProject = () => {
    setEditor({ mode: 'create' });
    setDraft(createEmptyProjectDraft(currentUserId, sortedProjects));
    setStatusMessage('');
    setMutationError('');
  };

  const openEditProject = (project: ProjectDto) => {
    setEditor({ mode: 'edit', projectId: project.id });
    setDraft(createProjectDraft(project));
    setStatusMessage('');
    setMutationError('');
  };

  const closeEditor = () => {
    setEditor(null);
    setDraft(createEmptyProjectDraft(currentUserId, sortedProjects));
    setMutationError('');
  };

  const addImageDraft = () => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      images: [
        ...currentDraft.images,
        {
          imageUrl: '',
          altText: '',
          sortOrder: getNextSortOrder(
            currentDraft.images.map((image, index) => ({
              sortOrder: image.sortOrder || index,
            })),
          ),
          isCover: currentDraft.images.length === 0,
        },
      ],
    }));
  };

  const updateImageDraft = (
    imageIndex: number,
    updater: (image: ProjectImageDraft) => ProjectImageDraft,
  ) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      images: currentDraft.images.map((image, index) =>
        index === imageIndex ? updater(image) : image,
      ),
    }));
  };

  const setCoverImageDraft = (imageIndex: number) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      images: currentDraft.images.map((image, index) => ({
        ...image,
        isCover: index === imageIndex,
      })),
    }));
  };

  const removeImageDraft = (imageIndex: number) => {
    setDraft((currentDraft) => {
      const nextImages = currentDraft.images.filter(
        (_image, index) => index !== imageIndex,
      );
      const hasCover = nextImages.some((image) => image.isCover);

      return {
        ...currentDraft,
        images: nextImages.map((image, index) => ({
          ...image,
          isCover: hasCover ? image.isCover : index === 0,
        })),
      };
    });
  };

  const handleSaveProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editor) {
      return;
    }

    setIsSaving(true);
    setMutationError('');

    try {
      const payload = getProjectPayload(draft, editorProject);
      const savedProject =
        editor.mode === 'create'
          ? await onCreateProject(payload)
          : await onUpdateProject(editor.projectId, payload);

      setStatusMessage(`Proyecto "${savedProject.name}" guardado.`);
      closeEditor();
    } catch (unknownError) {
      setMutationError(
        unknownError instanceof Error
          ? unknownError.message
          : 'No se pudo guardar el proyecto.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async (project: ProjectDto) => {
    if (!window.confirm(`Eliminar "${project.name}"?`)) {
      return;
    }

    setIsSaving(true);
    setMutationError('');

    try {
      await onDeleteProject(project.id);

      if (editor?.mode === 'edit' && editor.projectId === project.id) {
        closeEditor();
      }

      setStatusMessage(`Proyecto "${project.name}" eliminado.`);
    } catch (unknownError) {
      setMutationError(
        unknownError instanceof Error
          ? unknownError.message
          : 'No se pudo eliminar el proyecto.',
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
              Project manager
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-white">
              Proyectos
            </h2>
          </div>
          <button
            type="button"
            onClick={openCreateProject}
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 dark:bg-white dark:text-zinc-950 dark:hover:bg-cyan-100 md:self-end"
          >
            <PlusIcon className="h-4 w-4" aria-hidden="true" />
            Crear proyecto
          </button>
        </div>

        {isLoading && (
          <p className="mt-4 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-left text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
            Cargando proyectos...
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
            onSubmit={handleSaveProject}
            className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50/80 p-4 text-left dark:border-zinc-800 dark:bg-zinc-900/40"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                  {editor.mode === 'create'
                    ? 'Crear proyecto'
                    : 'Editar proyecto'}
                </p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  DTO Project y DisplaySettings
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
                <span className={labelClass}>Nombre</span>
                <input
                  value={draft.name}
                  onChange={(event) =>
                    setDraft((currentDraft) => ({
                      ...currentDraft,
                      name: event.target.value,
                    }))
                  }
                  className={fieldClass}
                  required
                />
              </label>

              <label>
                <span className={labelClass}>UserId</span>
                <input
                  type="number"
                  value={draft.userId}
                  onChange={(event) =>
                    setDraft((currentDraft) => ({
                      ...currentDraft,
                      userId: Number(event.target.value),
                    }))
                  }
                  className={fieldClass}
                />
              </label>

              <label>
                <span className={labelClass}>Fecha de release</span>
                <input
                  type="date"
                  value={draft.releaseDate}
                  onChange={(event) =>
                    setDraft((currentDraft) => ({
                      ...currentDraft,
                      releaseDate: event.target.value,
                    }))
                  }
                  className={fieldClass}
                />
              </label>

              <label>
                <span className={labelClass}>Status</span>
                <select
                  value={draft.status}
                  onChange={(event) =>
                    setDraft((currentDraft) => ({
                      ...currentDraft,
                      status: event.target.value,
                    }))
                  }
                  className={fieldClass}
                >
                  {!statusOptions.some((option) => option.value === draft.status) && (
                    <option value={draft.status}>{draft.status}</option>
                  )}
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
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

              <label>
                <span className={labelClass}>Colaboradores</span>
                <input
                  value={draft.collaborators}
                  onChange={(event) =>
                    setDraft((currentDraft) => ({
                      ...currentDraft,
                      collaborators: event.target.value,
                    }))
                  }
                  className={fieldClass}
                />
              </label>

              <label className="md:col-span-2">
                <span className={labelClass}>Tecnologias</span>
                <input
                  value={draft.technologies}
                  onChange={(event) =>
                    setDraft((currentDraft) => ({
                      ...currentDraft,
                      technologies: event.target.value,
                    }))
                  }
                  placeholder="React; TypeScript; .NET"
                  className={fieldClass}
                />
              </label>

              <label className="md:col-span-2">
                <span className={labelClass}>Descripcion</span>
                <textarea
                  value={draft.description}
                  onChange={(event) =>
                    setDraft((currentDraft) => ({
                      ...currentDraft,
                      description: event.target.value,
                    }))
                  }
                  rows={3}
                  className={fieldClass}
                />
              </label>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <ToggleField
                label="Mostrar proyecto"
                checked={draft.showProject}
                onChange={(showProject) =>
                  setDraft((currentDraft) => ({
                    ...currentDraft,
                    showProject,
                  }))
                }
              />
              <ToggleField
                label="Mostrar status"
                checked={draft.showStatusTag}
                onChange={(showStatusTag) =>
                  setDraft((currentDraft) => ({
                    ...currentDraft,
                    showStatusTag,
                  }))
                }
              />
              <ToggleField
                label="Mostrar iconos"
                checked={draft.showIcons}
                onChange={(showIcons) =>
                  setDraft((currentDraft) => ({
                    ...currentDraft,
                    showIcons,
                  }))
                }
              />
              <ToggleField
                label="Mostrar tecnologias"
                checked={draft.showTechnologies}
                onChange={(showTechnologies) =>
                  setDraft((currentDraft) => ({
                    ...currentDraft,
                    showTechnologies,
                  }))
                }
              />
            </div>

            <div className="mt-5 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                    Imagenes del proyecto
                  </p>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    URLs de imagen para el carousel interno del proyecto.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addImageDraft}
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:border-cyan-300 dark:border-zinc-800 dark:text-zinc-200"
                >
                  <PlusIcon className="h-4 w-4" aria-hidden="true" />
                  Agregar imagen
                </button>
              </div>

              {draft.images.length === 0 ? (
                <div className="rounded-lg border border-dashed border-zinc-300 p-4 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                  Este proyecto todavia no tiene imagenes.
                </div>
              ) : (
                <div className="space-y-3">
                  {draft.images.map((image, index) => (
                    <div
                      key={`${index}-${image.sortOrder}`}
                      className="grid gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_7rem_auto_auto]"
                    >
                      <label>
                        <span className={labelClass}>ImageUrl</span>
                        <input
                          type="url"
                          value={image.imageUrl}
                          onChange={(event) =>
                            updateImageDraft(index, (currentImage) => ({
                              ...currentImage,
                              imageUrl: event.target.value,
                            }))
                          }
                          placeholder="https://..."
                          className={fieldClass}
                        />
                      </label>
                      <label>
                        <span className={labelClass}>AltText</span>
                        <input
                          value={image.altText}
                          onChange={(event) =>
                            updateImageDraft(index, (currentImage) => ({
                              ...currentImage,
                              altText: event.target.value,
                            }))
                          }
                          className={fieldClass}
                        />
                      </label>
                      <label>
                        <span className={labelClass}>Orden</span>
                        <input
                          type="number"
                          min={0}
                          value={image.sortOrder}
                          onChange={(event) =>
                            updateImageDraft(index, (currentImage) => ({
                              ...currentImage,
                              sortOrder: Number(event.target.value),
                            }))
                          }
                          className={fieldClass}
                        />
                      </label>
                      <label className="flex items-center gap-2 self-end rounded-lg border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-700 dark:border-zinc-800 dark:text-zinc-200">
                        <input
                          type="radio"
                          name="project-cover-image"
                          checked={image.isCover}
                          onChange={() => setCoverImageDraft(index)}
                          className="h-4 w-4 accent-cyan-700"
                        />
                        Cover
                      </label>
                      <button
                        type="button"
                        onClick={() => removeImageDraft(index)}
                        className="inline-flex h-10 w-10 items-center justify-center self-end rounded-lg border border-red-200 text-red-700 transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:border-red-400/20 dark:text-red-200 dark:hover:bg-red-400/10"
                        aria-label="Eliminar imagen"
                        title="Eliminar imagen"
                      >
                        <TrashIcon className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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

        {!isLoading && sortedProjects.length === 0 && (
          <div className="mt-6 rounded-lg border border-dashed border-zinc-300 p-6 text-left text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            No hay proyectos todavia.
          </div>
        )}

        {sortedProjects.length > 0 && (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {sortedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={openEditProject}
                onDelete={(projectToDelete) => void handleDeleteProject(projectToDelete)}
              />
            ))}
          </div>
        )}

        {sortedProjects.some(
          (project) => project.displaySettings?.showProject === false,
        ) && (
          <p className="mt-4 inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <EyeIcon className="h-4 w-4" aria-hidden="true" />
            Los proyectos ocultos se conservan en el CRUD pero no deberian mostrarse en vistas publicas.
          </p>
        )}
      </div>
    </section>
  );
}
