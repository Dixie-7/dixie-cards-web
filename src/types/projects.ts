export type ProjectStatus = number | string;

export interface ProjectDisplaySettingsDto {
  id: number;
  projectId: number;
  showStatusTag: boolean;
  showIcons: boolean;
  showTechnologies: boolean;
  showProject: boolean;
}

export interface ProjectDto {
  id: number;
  userId: number;
  name: string;
  description: string;
  technologies: string;
  releaseDate?: string | null;
  status: ProjectStatus;
  collaborators?: string | null;
  sortOrder: number;
  displaySettings?: ProjectDisplaySettingsDto | null;
}

export interface ProjectDisplaySettingsPayload {
  id?: number;
  projectId?: number;
  showStatusTag: boolean;
  showIcons: boolean;
  showTechnologies: boolean;
  showProject: boolean;
}

export interface ProjectPayload {
  userId: number;
  name: string;
  description: string;
  technologies: string;
  releaseDate?: string | null;
  status: ProjectStatus;
  collaborators?: string | null;
  sortOrder: number;
  displaySettings?: ProjectDisplaySettingsPayload | null;
}
