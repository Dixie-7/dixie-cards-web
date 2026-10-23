import type { UserCardDto } from '@/features/cards/types/userCard.types';
import type { UserContactDto } from '@/features/contact/types/contact.types';
import type { UserFileDto } from '@/features/files/types/userFile.types';
import type { UserLanguageDto } from '@/features/languages/types/language.types';
import type { ProjectDto } from '@/features/projects/types/project.types';
import type { SkillDto } from '@/features/skills/types/skill.types';

export const landingDemoMainCard: UserCardDto = {
  id: 101,
  userId: 0,
  title: 'MainCard',
  description: 'Presentacion principal del portfolio.',
  template: 'feature',
  styleText: 'ring-1 ring-violet-500/20',
  width: 100,
  sortOrder: 0,
  blocks: [
    {
      id: 1001,
      userCardId: 101,
      type: 'text',
      title: 'Sofía Rios',
      content:
        'Desarrolladora full stack. Convierto procesos complejos en productos web claros y faciles de usar.',
      icon: 'none',
      template: 'main-presentation',
      width: 100,
      sortOrder: 1,
    },
    {
      id: 1002,
      userCardId: 101,
      type: 'list',
      title: 'Stack principal',
      content: 'React; TypeScript; ASP.NET Core; PostgreSQL',
      icon: 'code',
      template: 'main-skills',
      width: 45,
      sortOrder: 2,
    },
    {
      id: 1003,
      userCardId: 101,
      type: 'media',
      title: 'Workspace',
      mediaUrl:
        'https://images.pexels.com/photos/5473309/pexels-photo-5473309.jpeg',
      caption: 'Diseño, desarrollo y entrega de producto.',
      icon: 'photo',
      template: 'main-photo',
      width: 55,
      sortOrder: 3,
    },
  ],
};

export const landingDemoCards: UserCardDto[] = [
  {
    id: 102,
    userId: 0,
    title: 'Experiencia frontend',
    description:
      'Interfaces mantenibles, accesibles y conectadas con APIs reales.',
    template: 'feature',
    styleText: 'ring-1 ring-cyan-500/20',
    width: 50,
    sortOrder: 1,
    blocks: [
      {
        id: 1101,
        userCardId: 102,
        type: 'text',
        title: 'Producto y UI',
        content:
          'Trabajo desde el flujo de usuario hasta los componentes y estados finales de la interfaz.',
        icon: 'paint',
        template: 'Figma to React',
        width: 100,
        sortOrder: 1,
      },
      {
        id: 1102,
        userCardId: 102,
        type: 'list',
        title: 'En la practica',
        content: 'Design systems; Accesibilidad; Responsive; Motion',
        icon: 'sparkles',
        template: 'UX / UI Specialist',
        width: 100,
        sortOrder: 2,
      },
    ],
  },
  {
    id: 103,
    userId: 0,
    title: 'Cómo trabajo',
    description: 'Decisiones visibles, entregas cortas y mejora continua.',
    template: 'editorial',
    styleText: 'ring-1 ring-emerald-500/20',
    width: 50,
    sortOrder: 2,
    blocks: [
      {
        id: 1201,
        userCardId: 103,
        type: 'quote',
        title: 'Principio',
        content:
          'Una interfaz funciona mejor cuando la persona entiende que hacer sin tener que pensarlo dos veces.',
        caption: 'Sofía Rios',
        icon: 'lightbulb',
        template: 'Ideas claras',
        width: 100,
        sortOrder: 1,
      },
      {
        id: 1202,
        userCardId: 103,
        type: 'list',
        title: 'Proceso',
        content: 'Descubrir; Prototipar; Construir; Medir',
        icon: 'rocket',
        template: 'Transparencia total',
        width: 100,
        sortOrder: 2,
      },
    ],
  },
];

export const landingDemoProject: ProjectDto = {
  id: 201,
  userId: 0,
  name: 'EasyFarm',
  description:
    'Una solución práctica para la gestión de medicamentos, horarios, servicios y personal ideado para la industria farmacéutica.',
  technologies: 'React; TypeScript; ASP.NET Core; PostgreSQL',
  releaseDate: '2026-08-18T00:00:00.000Z',
  status: 'published',
  collaborators: 'Camila Torres',
  sortOrder: 1,
  displaySettings: {
    id: 301,
    projectId: 201,
    showStatusTag: true,
    showIcons: true,
    showTechnologies: true,
    showProject: true,
  },
  images: [
    {
      id: 401,
      imageUrl:
        'https://images.pexels.com/photos/8657287/pexels-photo-8657287.jpeg',
      altText: 'Dashboard de TurnoSimple',
      sortOrder: 1,
      isCover: true,
    },
    {
      id: 402,
      imageUrl:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80',
      altText: 'Metricas de TurnoSimple',
      sortOrder: 2,
      isCover: false,
    },
  ],
};

export const landingDemoSkills: SkillDto[] = [
  {
    id: 501,
    userId: 0,
    skillName: 'React',
    skillDescription: 'Interfaces y componentes reutilizables.',
    skillNote: 'Frontend',
    skillIcon: 'react',
    skillColor: '#65d9e8',
    sortOrder: 1,
  },
  {
    id: 502,
    userId: 0,
    skillName: 'TypeScript',
    skillDescription: 'Contratos claros y codigo mantenible.',
    skillNote: 'Tipado',
    skillIcon: 'typescript',
    skillColor: '#7c9cff',
    sortOrder: 2,
  },
  {
    id: 503,
    userId: 0,
    skillName: '.NET',
    skillDescription: 'APIs, autenticacion y servicios.',
    skillNote: 'Backend',
    skillIcon: 'dotnet',
    skillColor: '#9b87f5',
    sortOrder: 3,
  },
  {
    id: 504,
    userId: 0,
    skillName: 'PostgreSQL',
    skillDescription: 'Modelado y consultas de datos.',
    skillNote: 'Datos',
    skillIcon: 'database',
    skillColor: '#c9f67b',
    sortOrder: 4,
  },
];

export const landingDemoLanguages: UserLanguageDto[] = [
  {
    id: 601,
    userId: 0,
    language: 'Español',
    level: 'Nativo',
    skillPercent: 100,
    sortOrder: 1,
  },
  {
    id: 602,
    userId: 0,
    language: 'Inglés',
    level: 'B2',
    skillPercent: 78,
    sortOrder: 2,
  },
];

export const landingDemoContact: UserContactDto = {
  id: 701,
  userId: 0,
  publicEmail: 'hola@sofiarios.dev',
  site: 'https://sofiarios.dev',
  gitHub: 'sofiarios',
  linkedIn: 'sofia-rios-dev',
};

export const landingDemoCv: UserFileDto = {
  id: 801,
  userId: 0,
  name: 'CV-Sofia-Rios.pdf',
  description: 'Experiencia, formación y proyectos seleccionados.',
  fileUrl: '#',
  fileType: 'application/pdf',
  isPrimaryCv: true,
  uploadedAt: '2026-09-01T00:00:00.000Z',
};
