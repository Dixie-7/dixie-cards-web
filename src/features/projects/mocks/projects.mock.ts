import type { ProjectDto } from '@/features/projects/types/project.types';

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
    images: [
      {
        id: 1,
        imageUrl:
          'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
        altText: 'Workspace principal del portfolio',
        sortOrder: 1,
        isCover: true,
      },
      {
        id: 2,
        imageUrl:
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        altText: 'Vista de dashboard del portfolio',
        sortOrder: 2,
        isCover: false,
      },
    ],
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
    images: [
      {
        id: 3,
        imageUrl:
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
        altText: 'Laptop con arquitectura de API',
        sortOrder: 1,
        isCover: true,
      },
      {
        id: 4,
        imageUrl:
          'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
        altText: 'Codigo de backend',
        sortOrder: 2,
        isCover: false,
      },
    ],
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
    images: [
      {
        id: 5,
        imageUrl:
          'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
        altText: 'Workspace musical',
        sortOrder: 1,
        isCover: true,
      },
    ],
  },
];
