import { getTechIcon } from '@/shared/iconsManager';
import academicIcon from '@/assets/icons/academic.png';
import bootstrapIcon from '@/assets/icons/bootstrap.png';
import businessCardIcon from '@/assets/icons/business-card.jpg';
import codingSkillsIcon from '@/assets/icons/coding_skills.png';
import communicatorIcon from '@/assets/icons/communicator.png';
import csharpIcon from '@/assets/icons/csharp.png';
import cssIcon from '@/assets/icons/css.png';
import defaultCodingIcon from '@/assets/icons/defaultCoding.png';
import dotnetIcon from '@/assets/icons/dotnet.png';
import fastLearnerIcon from '@/assets/icons/fast-learner.png';
import flexibleIcon from '@/assets/icons/flexible-icon.jpg';
import githubIcon from '@/assets/icons/github.png';
import htmlIcon from '@/assets/icons/html5.png';
import javaIcon from '@/assets/icons/java.png';
import javascriptIcon from '@/assets/icons/javascript.png';
import laravelIcon from '@/assets/icons/laravel.png';
import photoshopIcon from '@/assets/icons/photoshop.jpg';
import phpIcon from '@/assets/icons/php.png';
import reactIcon from '@/assets/icons/react.png';
import skillsIcon from '@/assets/icons/skills.png';
import sqlIcon from '@/assets/icons/sql.png';
import teamWorkIcon from '@/assets/icons/team-work.png';
import tutorIcon from '@/assets/icons/tutor.png';

export interface SkillIconOption {
  value: string;
  label: string;
  description: string;
  source: string;
}

const skillIconSources: Record<string, string> = {
  default: defaultCodingIcon,
  skills: skillsIcon,
  teamwork: teamWorkIcon,
  leadership: tutorIcon,
  communication: communicatorIcon,
  fastLearner: fastLearnerIcon,
  flexibility: flexibleIcon,
  mentoring: tutorIcon,
  academic: academicIcon,
  product: businessCardIcon,
  coding: codingSkillsIcon,
  react: reactIcon,
  javascript: javascriptIcon,
  typescript: getTechIcon('typescript'),
  html: htmlIcon,
  css: cssIcon,
  csharp: csharpIcon,
  dotnet: dotnetIcon,
  sql: sqlIcon,
  github: githubIcon,
  bootstrap: bootstrapIcon,
  java: javaIcon,
  php: phpIcon,
  laravel: laravelIcon,
  photoshop: photoshopIcon,
};

export const skillIconOptions: SkillIconOption[] = [
  {
    value: '',
    label: 'Auto',
    description: 'Usa el nombre de la skill',
    source: defaultCodingIcon,
  },
  {
    value: 'skills',
    label: 'Skills',
    description: 'Habilidad general',
    source: skillsIcon,
  },
  {
    value: 'teamwork',
    label: 'Companerismo',
    description: 'Trabajo en equipo',
    source: teamWorkIcon,
  },
  {
    value: 'leadership',
    label: 'Liderazgo',
    description: 'Guia y criterio',
    source: tutorIcon,
  },
  {
    value: 'communication',
    label: 'Comunicacion',
    description: 'Claridad y escucha',
    source: communicatorIcon,
  },
  {
    value: 'fastLearner',
    label: 'Aprendizaje',
    description: 'Aprendizaje rapido',
    source: fastLearnerIcon,
  },
  {
    value: 'flexibility',
    label: 'Flexibilidad',
    description: 'Adaptacion al cambio',
    source: flexibleIcon,
  },
  {
    value: 'mentoring',
    label: 'Mentoria',
    description: 'Acompanamiento tecnico',
    source: tutorIcon,
  },
  {
    value: 'academic',
    label: 'Academico',
    description: 'Formacion y metodo',
    source: academicIcon,
  },
  {
    value: 'product',
    label: 'Producto',
    description: 'Vision de negocio',
    source: businessCardIcon,
  },
  {
    value: 'coding',
    label: 'Coding',
    description: 'Desarrollo tecnico',
    source: codingSkillsIcon,
  },
  {
    value: 'react',
    label: 'React',
    description: 'Frontend UI',
    source: reactIcon,
  },
  {
    value: 'javascript',
    label: 'JavaScript',
    description: 'Lenguaje web',
    source: javascriptIcon,
  },
  {
    value: 'typescript',
    label: 'TypeScript',
    description: 'Tipado y contratos',
    source: getTechIcon('typescript'),
  },
  {
    value: 'html',
    label: 'HTML',
    description: 'Estructura web',
    source: htmlIcon,
  },
  {
    value: 'css',
    label: 'CSS',
    description: 'Estilos web',
    source: cssIcon,
  },
  {
    value: 'csharp',
    label: 'C#',
    description: 'Backend .NET',
    source: csharpIcon,
  },
  {
    value: 'dotnet',
    label: '.NET',
    description: 'APIs y servicios',
    source: dotnetIcon,
  },
  {
    value: 'sql',
    label: 'SQL',
    description: 'Bases de datos',
    source: sqlIcon,
  },
  {
    value: 'github',
    label: 'GitHub',
    description: 'Versionado',
    source: githubIcon,
  },
  {
    value: 'bootstrap',
    label: 'Bootstrap',
    description: 'UI framework',
    source: bootstrapIcon,
  },
  {
    value: 'java',
    label: 'Java',
    description: 'Backend',
    source: javaIcon,
  },
  {
    value: 'php',
    label: 'PHP',
    description: 'Backend web',
    source: phpIcon,
  },
  {
    value: 'laravel',
    label: 'Laravel',
    description: 'Framework PHP',
    source: laravelIcon,
  },
  {
    value: 'photoshop',
    label: 'Photoshop',
    description: 'Diseno visual',
    source: photoshopIcon,
  },
];

export function getSkillIconSource(skillIcon?: string | null, skillName = '') {
  const iconValue = skillIcon?.trim() || skillName.trim() || 'default';

  if (/^https?:\/\//i.test(iconValue) || iconValue.startsWith('/')) {
    return iconValue;
  }

  if (skillIconSources[iconValue]) {
    return skillIconSources[iconValue];
  }

  return getTechIcon(iconValue);
}

export function isSafeCssColor(value?: string | null) {
  if (!value?.trim()) {
    return false;
  }

  return (
    /^#[\da-f]{3,8}$/i.test(value.trim()) ||
    /^rgb(a)?\([\d\s.,%]+\)$/i.test(value.trim()) ||
    /^hsl(a)?\([\d\s.,%]+\)$/i.test(value.trim())
  );
}

export function getSkillAccentColor(value?: string | null) {
  return isSafeCssColor(value) ? value?.trim() : '#06b6d4';
}
