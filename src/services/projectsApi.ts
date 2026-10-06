import { projectsMock } from '@/mocks/projects.mock';
import type {
  ProjectDisplaySettingsDto,
  ProjectDto,
  ProjectPayload,
  ProjectStatus,
} from '@/types/projects';

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '')
  .trim()
  .replace(/\/$/, '');
const projectsEndpoint =
  import.meta.env.VITE_PROJECTS_ENDPOINT?.trim() || '/api/projects';

export const isMockProjectsEnabled =
  import.meta.env.VITE_USE_MOCK_PROJECTS !== 'false' || apiBaseUrl.length === 0;

let projectsStore: ProjectDto[] = cloneProjects(projectsMock);

function cloneProjects(projects: ProjectDto[]) {
  return projects.map((project) => ({
    ...project,
    displaySettings: project.displaySettings
      ? { ...project.displaySettings }
      : project.displaySettings,
  }));
}

function sortProjects(projects: ProjectDto[]) {
  return [...projects].sort(
    (currentProject, nextProject) =>
      currentProject.sortOrder - nextProject.sortOrder,
  );
}

function getNextProjectId() {
  return Math.max(0, ...projectsStore.map((project) => project.id)) + 1;
}

function getNextDisplaySettingsId() {
  return (
    Math.max(
      0,
      ...projectsStore.map((project) => project.displaySettings?.id ?? 0),
    ) + 1
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readValue(
  record: Record<string, unknown>,
  camelKey: string,
  pascalKey: string,
) {
  return record[camelKey] ?? record[pascalKey];
}

function readString(
  record: Record<string, unknown>,
  camelKey: string,
  pascalKey: string,
) {
  const value = readValue(record, camelKey, pascalKey);

  return typeof value === 'string' ? value : undefined;
}

function readNullableString(
  record: Record<string, unknown>,
  camelKey: string,
  pascalKey: string,
) {
  const value = readValue(record, camelKey, pascalKey);

  if (value === null) {
    return null;
  }

  return typeof value === 'string' ? value : undefined;
}

function readNumber(
  record: Record<string, unknown>,
  camelKey: string,
  pascalKey: string,
) {
  const value = readValue(record, camelKey, pascalKey);

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const parsedValue = Number(value);

    return Number.isNaN(parsedValue) ? undefined : parsedValue;
  }

  return undefined;
}

function readBoolean(
  record: Record<string, unknown>,
  camelKey: string,
  pascalKey: string,
) {
  const value = readValue(record, camelKey, pascalKey);

  return typeof value === 'boolean' ? value : undefined;
}

function readProjectStatus(
  record: Record<string, unknown>,
): ProjectStatus | undefined {
  const value = readValue(record, 'status', 'Status');

  if (typeof value === 'number' || typeof value === 'string') {
    return value;
  }

  return undefined;
}

function normalizeDisplaySettings(
  value: unknown,
): ProjectDisplaySettingsDto | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (!isRecord(value)) {
    return null;
  }

  const id = readNumber(value, 'id', 'Id') ?? 0;
  const projectId = readNumber(value, 'projectId', 'ProjectId') ?? 0;

  return {
    id,
    projectId,
    showStatusTag:
      readBoolean(value, 'showStatusTag', 'ShowStatusTag') ?? true,
    showIcons: readBoolean(value, 'showIcons', 'ShowIcons') ?? true,
    showTechnologies:
      readBoolean(value, 'showTechnologies', 'ShowTechnologies') ?? true,
    showProject: readBoolean(value, 'showProject', 'ShowProject') ?? true,
  };
}

function normalizeProject(value: unknown): ProjectDto | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const id = readNumber(value, 'id', 'Id');
  const userId = readNumber(value, 'userId', 'UserId');
  const name = readString(value, 'name', 'Name');
  const description = readString(value, 'description', 'Description') ?? '';
  const technologies = readString(value, 'technologies', 'Technologies') ?? '';
  const status = readProjectStatus(value);
  const sortOrder = readNumber(value, 'sortOrder', 'SortOrder') ?? 0;

  if (id === undefined || userId === undefined || !name || status === undefined) {
    return undefined;
  }

  return {
    id,
    userId,
    name,
    description,
    technologies,
    releaseDate: readNullableString(value, 'releaseDate', 'ReleaseDate') ?? null,
    status,
    collaborators:
      readNullableString(value, 'collaborators', 'Collaborators') ?? null,
    sortOrder,
    displaySettings: normalizeDisplaySettings(
      readValue(value, 'displaySettings', 'DisplaySettings'),
    ),
  };
}

function normalizeProjectCollection(value: unknown): ProjectDto[] | undefined {
  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeProject(item))
      .filter((project): project is ProjectDto => Boolean(project));
  }

  if (!isRecord(value)) {
    return undefined;
  }

  const nestedValue =
    value.data ?? value.Data ?? value.items ?? value.Items ?? value.projects;

  return normalizeProjectCollection(nestedValue);
}

async function readJsonResponse(response: Response) {
  const text = await response.text();

  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
}

function getApiUrl(path: string) {
  return `${apiBaseUrl}${path}`;
}

function getHeaders(token?: string | null) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function getResponseMessage(value: unknown, fallback: string) {
  if (!isRecord(value)) {
    return fallback;
  }

  return readString(value, 'message', 'Message') ?? fallback;
}

async function requestProject(
  path: string,
  init: RequestInit,
  token?: string | null,
) {
  const response = await fetch(getApiUrl(path), {
    ...init,
    headers: {
      ...getHeaders(token),
      ...init.headers,
    },
  });
  const jsonResponse = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(
      getResponseMessage(
        jsonResponse,
        `No se pudo completar la operacion. Estado HTTP ${response.status}.`,
      ),
    );
  }

  return jsonResponse;
}

function createMockDisplaySettings(
  projectId: number,
  payload: ProjectPayload,
): ProjectDisplaySettingsDto | null {
  if (!payload.displaySettings) {
    return null;
  }

  return {
    id: payload.displaySettings.id ?? getNextDisplaySettingsId(),
    projectId,
    showStatusTag: payload.displaySettings.showStatusTag,
    showIcons: payload.displaySettings.showIcons,
    showTechnologies: payload.displaySettings.showTechnologies,
    showProject: payload.displaySettings.showProject,
  };
}

function createProjectFromPayload(id: number, payload: ProjectPayload): ProjectDto {
  return {
    id,
    userId: payload.userId,
    name: payload.name,
    description: payload.description,
    technologies: payload.technologies,
    releaseDate: payload.releaseDate ?? null,
    status: payload.status,
    collaborators: payload.collaborators ?? null,
    sortOrder: payload.sortOrder,
    displaySettings: createMockDisplaySettings(id, payload),
  };
}

async function simulateProjectsLatency() {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 220);
  });
}

async function listProjectsWithMock() {
  await simulateProjectsLatency();

  return sortProjects(cloneProjects(projectsStore));
}

async function createProjectWithMock(payload: ProjectPayload) {
  await simulateProjectsLatency();

  const createdProject = createProjectFromPayload(getNextProjectId(), payload);

  projectsStore = sortProjects([...projectsStore, createdProject]);

  return cloneProjects([createdProject])[0];
}

async function updateProjectWithMock(projectId: number, payload: ProjectPayload) {
  await simulateProjectsLatency();

  let updatedProject: ProjectDto | undefined;

  projectsStore = sortProjects(
    projectsStore.map((project) => {
      if (project.id !== projectId) {
        return project;
      }

      updatedProject = createProjectFromPayload(projectId, payload);

      return updatedProject;
    }),
  );

  if (!updatedProject) {
    throw new Error('Project not found');
  }

  return cloneProjects([updatedProject])[0];
}

async function deleteProjectWithMock(projectId: number) {
  await simulateProjectsLatency();

  projectsStore = projectsStore.filter((project) => project.id !== projectId);
}

async function listProjectsWithApi(token?: string | null) {
  const jsonResponse = await requestProject(
    projectsEndpoint,
    { method: 'GET' },
    token,
  );
  const projects = normalizeProjectCollection(jsonResponse);

  if (!projects) {
    throw new Error('El servidor devolvio una lista de proyectos invalida.');
  }

  return sortProjects(projects);
}

async function createProjectWithApi(
  payload: ProjectPayload,
  token?: string | null,
) {
  const jsonResponse = await requestProject(
    projectsEndpoint,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    token,
  );
  const project =
    normalizeProject(jsonResponse) ??
    (isRecord(jsonResponse) ? normalizeProject(jsonResponse.data ?? jsonResponse.Data) : undefined);

  if (!project) {
    throw new Error('El servidor devolvio un proyecto creado invalido.');
  }

  return project;
}

async function updateProjectWithApi(
  projectId: number,
  payload: ProjectPayload,
  token?: string | null,
) {
  const jsonResponse = await requestProject(
    `${projectsEndpoint}/${projectId}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
    token,
  );
  const project =
    normalizeProject(jsonResponse) ??
    (isRecord(jsonResponse) ? normalizeProject(jsonResponse.data ?? jsonResponse.Data) : undefined);

  if (!project) {
    return createProjectFromPayload(projectId, payload);
  }

  return project;
}

async function deleteProjectWithApi(projectId: number, token?: string | null) {
  await requestProject(
    `${projectsEndpoint}/${projectId}`,
    { method: 'DELETE' },
    token,
  );
}

export const projectsApi = {
  listProjects(token?: string | null) {
    return isMockProjectsEnabled
      ? listProjectsWithMock()
      : listProjectsWithApi(token);
  },

  createProject(payload: ProjectPayload, token?: string | null) {
    return isMockProjectsEnabled
      ? createProjectWithMock(payload)
      : createProjectWithApi(payload, token);
  },

  updateProject(
    projectId: number,
    payload: ProjectPayload,
    token?: string | null,
  ) {
    return isMockProjectsEnabled
      ? updateProjectWithMock(projectId, payload)
      : updateProjectWithApi(projectId, payload, token);
  },

  deleteProject(projectId: number, token?: string | null) {
    return isMockProjectsEnabled
      ? deleteProjectWithMock(projectId)
      : deleteProjectWithApi(projectId, token);
  },
};
