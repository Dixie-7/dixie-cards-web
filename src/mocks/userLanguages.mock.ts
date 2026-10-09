import type { UserLanguageDto } from '@/types/userLanguages';

export const userLanguagesMock: UserLanguageDto[] = [
  {
    id: 1,
    userId: 7,
    language: 'Espanol',
    level: 'Nativo',
    skillPercent: 100,
    sortOrder: 1,
  },
  {
    id: 2,
    userId: 7,
    language: 'Ingles',
    level: 'Intermedio alto',
    skillPercent: 78,
    sortOrder: 2,
  },
  {
    id: 3,
    userId: 7,
    language: 'Portugues',
    level: 'Basico',
    skillPercent: 35,
    sortOrder: 3,
  },
];
