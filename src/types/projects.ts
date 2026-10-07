export type ProjectStatus = number | string;

export interface ProjectImageDto {
  id: number;
  imageUrl: string;
  altText?: string | null;
  sortOrder: number;
  isCover: boolean;
}

export interface ProjectImageRequestDto {
  imageUrl: string;
  altText?: string | null;
  sortOrder: number;
  isCover: boolean;
}

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
  images: ProjectImageDto[];
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
  images: ProjectImageRequestDto[];
}
