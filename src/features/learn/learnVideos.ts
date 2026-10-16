export interface LearnVideo {
  id: 'tutorial' | 'behind-dixie';
  index: string;
  duration: string;
  eyebrow: string;
  title: string;
  description: string;
  highlights: string[];
  videoUrl?: string;
}

export const learnVideos: LearnVideo[] = [
  {
    id: 'tutorial',
    index: '01',
    duration: 'Tutorial',
    eyebrow: 'De cero a publicado',
    title: 'Cómo crear tu portfolio en Dixie Cards',
    description:
      'Un recorrido práctico por la creación de la cuenta, la MainCard y las secciones que forman tu portfolio público.',
    highlights: ['Configurar el perfil', 'Cargar contenido', 'Publicar y compartir'],
    // Agregá aquí la URL del video tutorial cuando esté disponible.
    videoUrl: undefined,
  },
  {
    id: 'behind-dixie',
    index: '02',
    duration: 'Behind the product',
    eyebrow: 'Historia y desarrollo',
    title: 'Cómo se construyó Dixie Cards',
    description:
      'Las ideas, decisiones técnicas y aprendizajes que transformaron una necesidad real en una plataforma multiusuario.',
    highlights: ['Origen de la idea', 'Arquitectura del producto', 'Desafíos y aprendizajes'],
    // Agregá aquí la URL del video informativo cuando esté disponible.
    videoUrl: undefined,
  },
];
