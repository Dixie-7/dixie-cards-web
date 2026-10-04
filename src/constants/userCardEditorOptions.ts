export interface TemplateOption {
  value: string;
  label: string;
}

export interface StyleOption {
  id: string;
  label: string;
  styleText: string;
  group: string;
}

export const mainCardTitle = 'MainCard';

export const cardTemplateOptions: TemplateOption[] = [
  { value: 'default', label: 'Default' },
  { value: 'feature', label: 'Feature' },
  { value: 'editorial', label: 'Editorial' },
];

export const blockTemplateOptions: TemplateOption[] = [
  { value: 'default', label: 'Default' },
  { value: 'featured', label: 'Featured' },
  { value: 'wide', label: 'Wide' },
  { value: 'compact', label: 'Compact' },
  { value: 'highlight', label: 'Highlight' },
  { value: 'split', label: 'Split' },
  { value: 'main', label: 'Main' },
  { value: 'main-wide', label: 'Main Wide' },
  { value: 'main-highlight', label: 'Main Highlight' },
  { value: 'main-presentation', label: 'Main Presentation' },
  { value: 'main-skills', label: 'Main Skills' },
  { value: 'main-photo', label: 'Main Photo' },
];

export const cardStyleOptions: StyleOption[] = [
  { id: 'card-text-left', label: 'Texto izquierda', styleText: 'text-left [&_*]:text-left', group: 'textAlign' },
  { id: 'card-text-center', label: 'Texto centro', styleText: 'text-center [&_*]:text-center', group: 'textAlign' },
  { id: 'card-text-right', label: 'Texto derecha', styleText: 'text-right [&_*]:text-right', group: 'textAlign' },
  { id: 'card-pos-top', label: 'Arriba', styleText: 'self-start', group: 'verticalPosition' },
  { id: 'card-pos-center', label: 'Centro vertical', styleText: 'self-center', group: 'verticalPosition' },
  { id: 'card-pos-bottom', label: 'Abajo', styleText: 'self-end', group: 'verticalPosition' },
  { id: 'card-pos-stretch', label: 'Estirar', styleText: 'self-stretch h-full', group: 'verticalPosition' },
  { id: 'card-surface-clean', label: 'Superficie limpia', styleText: 'bg-white/95 dark:bg-zinc-950/90', group: 'surface' },
  { id: 'card-surface-soft', label: 'Superficie suave', styleText: 'bg-zinc-50 dark:bg-zinc-900/80', group: 'surface' },
  { id: 'card-ring-cyan', label: 'Borde cyan', styleText: 'ring-1 ring-cyan-500/20', group: 'accent' },
  { id: 'card-ring-emerald', label: 'Borde verde', styleText: 'ring-1 ring-emerald-500/20', group: 'accent' },
  { id: 'card-shadow-soft', label: 'Sombra suave', styleText: 'shadow-lg shadow-zinc-950/10', group: 'shadow' },
];

export const blockStyleOptions: StyleOption[] = [
  { id: 'block-text-left', label: 'Texto izquierda', styleText: 'text-left [&_*]:text-left', group: 'textAlign' },
  { id: 'block-text-center', label: 'Texto centro', styleText: 'text-center [&_*]:text-center', group: 'textAlign' },
  { id: 'block-text-right', label: 'Texto derecha', styleText: 'text-right [&_*]:text-right', group: 'textAlign' },
  { id: 'block-pos-top', label: 'Arriba', styleText: 'self-start', group: 'verticalPosition' },
  { id: 'block-pos-center', label: 'Centro vertical', styleText: 'self-center', group: 'verticalPosition' },
  { id: 'block-pos-bottom', label: 'Abajo', styleText: 'self-end', group: 'verticalPosition' },
  { id: 'block-pos-stretch', label: 'Estirar', styleText: 'self-stretch h-full', group: 'verticalPosition' },
  { id: 'block-horizontal-left', label: 'Bloque izquierda', styleText: 'mr-auto', group: 'horizontalPosition' },
  { id: 'block-horizontal-center', label: 'Bloque centro', styleText: 'mx-auto', group: 'horizontalPosition' },
  { id: 'block-horizontal-right', label: 'Bloque derecha', styleText: 'ml-auto', group: 'horizontalPosition' },
  { id: 'block-content-start', label: 'Contenido inicio', styleText: 'flex flex-col items-start', group: 'contentAlign' },
  { id: 'block-content-center', label: 'Contenido centro', styleText: 'flex flex-col items-center', group: 'contentAlign' },
  { id: 'block-content-end', label: 'Contenido final', styleText: 'flex flex-col items-end', group: 'contentAlign' },
  { id: 'block-ring-cyan', label: 'Borde cyan', styleText: 'ring-1 ring-cyan-500/20', group: 'accent' },
  { id: 'block-ring-emerald', label: 'Borde verde', styleText: 'ring-1 ring-emerald-500/20', group: 'accent' },
  { id: 'block-shadow-soft', label: 'Sombra suave', styleText: 'shadow-lg shadow-zinc-950/10', group: 'shadow' },
  { id: 'block-min-height', label: 'Altura media', styleText: 'min-h-44', group: 'height' },
];
