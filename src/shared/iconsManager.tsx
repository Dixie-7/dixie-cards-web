import bootstrapIcon from '@/assets/icons/bootstrap.png';
import csharpIcon from '@/assets/icons/csharp.png';
import cssIcon from '@/assets/icons/css.png';
import defaultIcon from '@/assets/icons/defaultCoding.png';
import dotNetIcon from '@/assets/icons/dotnet.png';
import javaIcon from '@/assets/icons/java.png';
import javascriptIcon from '@/assets/icons/javascript.png';
import phpIcon from '@/assets/icons/php.png';
import reactIcon from '@/assets/icons/react.png';
import sqlIcon from '@/assets/icons/sql.png';

const techMap: Record<string, string> = {
  'c#': csharpIcon,
  csharp: csharpIcon,
  'c-sharp': csharpIcon,
  '.net': dotNetIcon,
  dotnet: dotNetIcon,
  'asp.net': dotNetIcon,
  aspnet: dotNetIcon,
  react: reactIcon,
  reactjs: reactIcon,
  'react js': reactIcon,
  sql: sqlIcon,
  'sql server': sqlIcon,
  sqlserver: sqlIcon,
  bootstrap: bootstrapIcon,
  css: cssIcon,
  java: javaIcon,
  javascript: javascriptIcon,
  js: javascriptIcon,
  php: phpIcon,
  default: defaultIcon,
};

function normalizeTech(tech: string): string {
  return tech.toLowerCase().trim().replace(/\s+/g, '');
}

export function getTechIcon(tech: string): string {
  const normalized = normalizeTech(tech);

  if (techMap[normalized]) {
    return techMap[normalized];
  }

  return `https://cdn.worldvectorlogo.com/logos/${normalized}.svg`;
}
