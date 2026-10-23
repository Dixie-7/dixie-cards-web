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
    videoUrl: 'https://www.youtube.com/watch?v=X7pl9wAU84o&list=RDX7pl9wAU84o&start_radio=1',
  },
  {
    id: 'behind-dixie',
    index: '02',
    duration: 'Behind the product',
    eyebrow: 'Historia y desarrollo',
    title: 'Cómo se construyó Dixie Cards',
    description:
      'Las ideas, decisiones técnicas y aprendizajes que transformaron una necesidad real en una plataforma multiusuario.',
    highlights: ['Origen de la idea', 'Arquitectura del producto', 'Estado actual de la plataforma'],
    // Agregá aquí la URL del video informativo cuando esté disponible.
    videoUrl: 'https://www.youtube.com/watch?v=95-cScAf_40&list=RD95-cScAf_40&start_radio=1',
  },
];

export const englishLearnVideos: LearnVideo[] = [
  {
    id: 'tutorial',
    index: '01',
    duration: 'Tutorial',
    eyebrow: 'From zero to published',
    title: 'How to create your portfolio in Dixie Cards',
    description:
      'A practical tour through account creation, the MainCard and the sections that make up your public portfolio.',
    highlights: ['Set up your profile', 'Add content', 'Publish and share'],
    videoUrl: undefined,
  },
  {
    id: 'behind-dixie',
    index: '02',
    duration: 'Behind the product',
    eyebrow: 'Story and development',
    title: 'How Dixie Cards was built',
    description:
      'The ideas, technical decisions and lessons that turned a real need into a multi-user platform.',
    highlights: ['Origin of the idea', 'Product architecture', 'Challenges and lessons'],
    videoUrl: undefined,
  },
];
