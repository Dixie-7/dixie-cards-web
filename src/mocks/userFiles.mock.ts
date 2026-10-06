import type { UserFileDto } from '@/types/userFiles';

export const userFilesMock: UserFileDto[] = [
  {
    id: 1,
    userId: 7,
    name: 'Portfolio workspace',
    description: 'Imagen principal para el carousel del portfolio.',
    fileUrl:
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
    fileType: 'image/jpeg',
    isPrimaryCv: false,
    uploadedAt: '2026-09-22T12:00:00.000Z',
  },
  {
    id: 2,
    userId: 7,
    name: 'Dashboard preview',
    description: 'Imagen de referencia para proyectos de dashboard.',
    fileUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    fileType: 'image/jpeg',
    isPrimaryCv: false,
    uploadedAt: '2026-09-25T12:00:00.000Z',
  },
  {
    id: 3,
    userId: 7,
    name: 'Resume',
    description: 'CV principal del usuario. No debe aparecer en el carousel.',
    fileUrl: '/files/max-lagos-cv.pdf',
    fileType: 'application/pdf',
    isPrimaryCv: true,
    uploadedAt: '2026-09-29T12:00:00.000Z',
  },
];
