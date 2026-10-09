import type { SkillDto } from '@/features/skills/types/skill.types';

export const skillsMock: SkillDto[] = [
  {
    id: 1,
    userId: 7,
    skillName: 'React',
    skillDescription:
      'Componentes reutilizables, estados de UI y experiencias interactivas.',
    skillNote: 'Principal stack frontend',
    skillIcon: 'react',
    skillColor: '#06b6d4',
    sortOrder: 1,
  },
  {
    id: 2,
    userId: 7,
    skillName: 'TypeScript',
    skillDescription:
      'Contratos claros entre componentes, servicios y DTOs de backend.',
    skillNote: 'Tipado estricto',
    skillIcon: 'typescript',
    skillColor: '#2563eb',
    sortOrder: 2,
  },
  {
    id: 3,
    userId: 7,
    skillName: '.NET',
    skillDescription:
      'APIs REST, autenticacion, servicios y persistencia de datos.',
    skillNote: 'Backend',
    skillIcon: 'dotnet',
    skillColor: '#7c3aed',
    sortOrder: 3,
  },
  {
    id: 4,
    userId: 7,
    skillName: 'SQL Server',
    skillDescription:
      'Modelado, consultas y estructuras listas para alimentar portfolios dinamicos.',
    skillNote: 'Datos',
    skillIcon: 'sql server',
    skillColor: '#0f766e',
    sortOrder: 4,
  },
];
