import type { ProjectDto } from '@/types/projects';

export const projectsMock: ProjectDto[] = [
  {
    id: 1,
    userId: 7,
    name: 'Dixie Cards',
    description:
      'Portfolio builder con tarjetas editables, bloques dinamicos y gestion API-driven.',
    technologies: 'React; TypeScript; Tailwind CSS; .NET',
    releaseDate: '2026-09-12T00:00:00.000Z',
    status: 2,
    collaborators: 'Max Lagos',
    sortOrder: 1,
    displaySettings: {
      id: 1,
      projectId: 1,
      showStatusTag: true,
      showIcons: true,
      showTechnologies: true,
      showProject: true,
    },
  },
  {
    id: 2,
    userId: 7,
    name: 'Portfolio API',
    description:
      'API RESTful para autenticacion, proyectos, usercards, bloques y archivos de usuario.',
    technologies: 'C#; ASP.NET; SQL Server',
    releaseDate: null,
    status: 1,
    collaborators: null,
    sortOrder: 2,
    displaySettings: {
      id: 2,
      projectId: 2,
      showStatusTag: true,
      showIcons: true,
      showTechnologies: true,
      showProject: true,
    },
  },
  {
    id: 3,
    userId: 7,
    name: 'Music Workspace',
    description:
      'Experimento de portfolio para integrar musica ambiente y una experiencia mas inmersiva.',
    technologies: 'React; React Player; CSS',
    releaseDate: '2026-10-01T00:00:00.000Z',
    status: 0,
    collaborators: 'Dixie Lab',
    sortOrder: 3,
    displaySettings: {
      id: 3,
      projectId: 3,
      showStatusTag: true,
      showIcons: false,
      showTechnologies: true,
      showProject: true,
    },
  },
];
