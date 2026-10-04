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

export interface IconOption {
  value: string;
  label: string;
}

export const mainCardTitle = 'MainCard';

export const blockIconOptions: IconOption[] = [
  { value: '', label: 'Auto por tipo' },
  { value: 'none', label: 'Sin icono' },
  { value: 'document', label: 'Documento' },
  { value: 'photo', label: 'Imagen' },
  { value: 'list', label: 'Lista' },
  { value: 'sparkles', label: 'Destacado' },
  { value: 'code', label: 'Codigo' },
  { value: 'command', label: 'Terminal' },
  { value: 'cpu', label: 'Sistema' },
  { value: 'bolt', label: 'Rapidez' },
  { value: 'lightbulb', label: 'Idea' },
  { value: 'chart', label: 'Metricas' },
  { value: 'paint', label: 'Diseno' },
  { value: 'globe', label: 'Web' },
  { value: 'rocket', label: 'Lanzamiento' },
];

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
  { id: 'card-title-left', label: 'Titulo izquierda', styleText: '[&_[data-card-title]]:text-left', group: 'titleAlign' },
  { id: 'card-title-center', label: 'Titulo centro', styleText: '[&_[data-card-title]]:text-center', group: 'titleAlign' },
  { id: 'card-title-right', label: 'Titulo derecha', styleText: '[&_[data-card-title]]:text-right', group: 'titleAlign' },
  { id: 'card-title-sm', label: 'Titulo pequeno', styleText: '[&_[data-card-title]]:text-xl', group: 'titleSize' },
  { id: 'card-title-md', label: 'Titulo medio', styleText: '[&_[data-card-title]]:text-2xl', group: 'titleSize' },
  { id: 'card-title-lg', label: 'Titulo grande', styleText: '[&_[data-card-title]]:text-3xl', group: 'titleSize' },
  { id: 'card-title-xl', label: 'Titulo hero', styleText: '[&_[data-card-title]]:text-4xl', group: 'titleSize' },
  { id: 'card-title-normal', label: 'Titulo regular', styleText: '[&_[data-card-title]]:font-medium', group: 'titleWeight' },
  { id: 'card-title-bold', label: 'Titulo bold', styleText: '[&_[data-card-title]]:font-bold', group: 'titleWeight' },
  { id: 'card-content-sm', label: 'Contenido pequeno', styleText: '[&_[data-card-description]]:text-sm', group: 'contentSize' },
  { id: 'card-content-md', label: 'Contenido medio', styleText: '[&_[data-card-description]]:text-base', group: 'contentSize' },
  { id: 'card-content-lg', label: 'Contenido grande', styleText: '[&_[data-card-description]]:text-lg', group: 'contentSize' },
  { id: 'card-content-normal', label: 'Contenido regular', styleText: '[&_[data-card-description]]:font-normal', group: 'contentWeight' },
  { id: 'card-content-medium', label: 'Contenido medio peso', styleText: '[&_[data-card-description]]:font-medium', group: 'contentWeight' },
  { id: 'card-pos-top', label: 'Arriba', styleText: 'self-start', group: 'verticalPosition' },
  { id: 'card-pos-center', label: 'Centro vertical', styleText: 'self-center', group: 'verticalPosition' },
  { id: 'card-pos-bottom', label: 'Abajo', styleText: 'self-end', group: 'verticalPosition' },
  { id: 'card-pos-stretch', label: 'Estirar', styleText: 'self-stretch h-full', group: 'verticalPosition' },
  { id: 'card-surface-clean', label: 'Superficie limpia', styleText: 'bg-white/95 dark:bg-zinc-950/90', group: 'surface' },
  { id: 'card-surface-soft', label: 'Superficie suave', styleText: 'bg-zinc-50 dark:bg-zinc-900/80', group: 'surface' },
  { id: 'card-surface-cyan', label: 'Fondo cyan', styleText: 'bg-cyan-50/80 dark:bg-cyan-950/30', group: 'surface' },
  { id: 'card-surface-emerald', label: 'Fondo verde', styleText: 'bg-emerald-50/80 dark:bg-emerald-950/30', group: 'surface' },
  { id: 'card-surface-sky', label: 'Fondo azul', styleText: 'bg-sky-50/80 dark:bg-sky-950/30', group: 'surface' },
  { id: 'card-surface-rose', label: 'Fondo rosa', styleText: 'bg-rose-50/80 dark:bg-rose-950/30', group: 'surface' },
  { id: 'card-opacity-solid', label: 'Opacidad 100', styleText: 'opacity-100', group: 'opacity' },
  { id: 'card-opacity-soft', label: 'Opacidad 90', styleText: 'opacity-90', group: 'opacity' },
  { id: 'card-opacity-muted', label: 'Opacidad 75', styleText: 'opacity-75', group: 'opacity' },
  { id: 'card-ring-cyan', label: 'Borde cyan', styleText: 'ring-1 ring-cyan-500/20', group: 'accent' },
  { id: 'card-ring-emerald', label: 'Borde verde', styleText: 'ring-1 ring-emerald-500/20', group: 'accent' },
  { id: 'card-ring-blue', label: 'Borde azul', styleText: 'ring-1 ring-blue-500/20', group: 'accent' },
  { id: 'card-ring-rose', label: 'Borde rosa', styleText: 'ring-1 ring-rose-500/20', group: 'accent' },
  { id: 'card-shadow-soft', label: 'Sombra suave', styleText: 'shadow-lg shadow-zinc-950/10', group: 'shadow' },
  { id: 'card-shadow-cyan', label: 'Sombra cyan', styleText: 'shadow-lg shadow-cyan-950/10', group: 'shadow' },
  { id: 'card-shadow-none', label: 'Sin sombra', styleText: 'shadow-none', group: 'shadow' },
];

export const blockStyleOptions: StyleOption[] = [
  { id: 'block-text-left', label: 'Texto izquierda', styleText: 'text-left [&_*]:text-left', group: 'textAlign' },
  { id: 'block-text-center', label: 'Texto centro', styleText: 'text-center [&_*]:text-center', group: 'textAlign' },
  { id: 'block-text-right', label: 'Texto derecha', styleText: 'text-right [&_*]:text-right', group: 'textAlign' },
  { id: 'block-title-left', label: 'Titulo izquierda', styleText: '[&_[data-block-header]]:justify-start [&_[data-block-heading]]:items-start [&_[data-block-heading]]:text-left [&_[data-block-title]]:text-left', group: 'titleAlign' },
  { id: 'block-title-center', label: 'Titulo centro', styleText: '[&_[data-block-header]]:relative [&_[data-block-header]]:justify-center [&_[data-block-icon]]:absolute [&_[data-block-icon]]:left-0 [&_[data-block-heading]]:items-center [&_[data-block-heading]]:text-center [&_[data-block-title]]:text-center', group: 'titleAlign' },
  { id: 'block-title-right', label: 'Titulo derecha', styleText: '[&_[data-block-header]]:relative [&_[data-block-header]]:justify-end [&_[data-block-icon]]:absolute [&_[data-block-icon]]:left-0 [&_[data-block-heading]]:items-end [&_[data-block-heading]]:text-right [&_[data-block-title]]:text-right', group: 'titleAlign' },
  { id: 'block-title-xs', label: 'Titulo XS', styleText: '[&_[data-block-title]]:text-sm', group: 'titleSize' },
  { id: 'block-title-sm', label: 'Titulo pequeno', styleText: '[&_[data-block-title]]:text-base', group: 'titleSize' },
  { id: 'block-title-md', label: 'Titulo medio', styleText: '[&_[data-block-title]]:text-lg', group: 'titleSize' },
  { id: 'block-title-lg', label: 'Titulo grande', styleText: '[&_[data-block-title]]:text-2xl', group: 'titleSize' },
  { id: 'block-title-xl', label: 'Titulo hero', styleText: '[&_[data-block-title]]:text-4xl', group: 'titleSize' },
  { id: 'block-title-normal', label: 'Titulo regular', styleText: '[&_[data-block-title]]:font-medium', group: 'titleWeight' },
  { id: 'block-title-semibold', label: 'Titulo semibold', styleText: '[&_[data-block-title]]:font-semibold', group: 'titleWeight' },
  { id: 'block-title-bold', label: 'Titulo bold', styleText: '[&_[data-block-title]]:font-bold', group: 'titleWeight' },
  { id: 'block-content-xs', label: 'Contenido XS', styleText: '[&_[data-block-content]]:text-xs', group: 'contentSize' },
  { id: 'block-content-sm', label: 'Contenido pequeno', styleText: '[&_[data-block-content]]:text-sm', group: 'contentSize' },
  { id: 'block-content-md', label: 'Contenido medio', styleText: '[&_[data-block-content]]:text-base', group: 'contentSize' },
  { id: 'block-content-lg', label: 'Contenido grande', styleText: '[&_[data-block-content]]:text-lg', group: 'contentSize' },
  { id: 'block-content-xl', label: 'Contenido XL', styleText: '[&_[data-block-content]]:text-xl', group: 'contentSize' },
  { id: 'block-content-normal', label: 'Contenido regular', styleText: '[&_[data-block-content]]:font-normal', group: 'contentWeight' },
  { id: 'block-content-medium-weight', label: 'Contenido medium', styleText: '[&_[data-block-content]]:font-medium', group: 'contentWeight' },
  { id: 'block-content-bold', label: 'Contenido bold', styleText: '[&_[data-block-content]]:font-bold', group: 'contentWeight' },
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
  { id: 'block-surface-clean', label: 'Fondo limpio', styleText: 'bg-white/95 dark:bg-zinc-950/90', group: 'surface' },
  { id: 'block-surface-soft', label: 'Fondo suave', styleText: 'bg-zinc-50/90 dark:bg-zinc-900/80', group: 'surface' },
  { id: 'block-surface-cyan', label: 'Fondo cyan', styleText: 'bg-cyan-50/80 dark:bg-cyan-950/30', group: 'surface' },
  { id: 'block-surface-emerald', label: 'Fondo verde', styleText: 'bg-emerald-50/80 dark:bg-emerald-950/30', group: 'surface' },
  { id: 'block-surface-blue', label: 'Fondo azul', styleText: 'bg-blue-50/80 dark:bg-blue-950/30', group: 'surface' },
  { id: 'block-surface-amber', label: 'Fondo ambar', styleText: 'bg-amber-50/80 dark:bg-amber-950/30', group: 'surface' },
  { id: 'block-surface-rose', label: 'Fondo rosa', styleText: 'bg-rose-50/80 dark:bg-rose-950/30', group: 'surface' },
  { id: 'block-opacity-solid', label: 'Opacidad 100', styleText: 'opacity-100', group: 'opacity' },
  { id: 'block-opacity-soft', label: 'Opacidad 90', styleText: 'opacity-90', group: 'opacity' },
  { id: 'block-opacity-muted', label: 'Opacidad 75', styleText: 'opacity-75', group: 'opacity' },
  { id: 'block-opacity-faint', label: 'Opacidad 60', styleText: 'opacity-60', group: 'opacity' },
  { id: 'block-ring-cyan', label: 'Borde cyan', styleText: 'ring-1 ring-cyan-500/20', group: 'accent' },
  { id: 'block-ring-emerald', label: 'Borde verde', styleText: 'ring-1 ring-emerald-500/20', group: 'accent' },
  { id: 'block-ring-blue', label: 'Borde azul', styleText: 'ring-1 ring-blue-500/20', group: 'accent' },
  { id: 'block-ring-amber', label: 'Borde ambar', styleText: 'ring-1 ring-amber-500/25', group: 'accent' },
  { id: 'block-ring-rose', label: 'Borde rosa', styleText: 'ring-1 ring-rose-500/20', group: 'accent' },
  { id: 'block-shadow-soft', label: 'Sombra suave', styleText: 'shadow-lg shadow-zinc-950/10', group: 'shadow' },
  { id: 'block-shadow-cyan', label: 'Sombra cyan', styleText: 'shadow-lg shadow-cyan-950/10', group: 'shadow' },
  { id: 'block-shadow-emerald', label: 'Sombra verde', styleText: 'shadow-lg shadow-emerald-950/10', group: 'shadow' },
  { id: 'block-shadow-none', label: 'Sin sombra', styleText: 'shadow-none', group: 'shadow' },
  { id: 'block-min-height', label: 'Altura media', styleText: 'min-h-44', group: 'height' },
  { id: 'block-height-small', label: 'Altura chica', styleText: 'min-h-28', group: 'height' },
  { id: 'block-height-large', label: 'Altura grande', styleText: 'min-h-64', group: 'height' },
  { id: 'block-rounded-none', label: 'Sin radio', styleText: 'rounded-none', group: 'radius' },
  { id: 'block-rounded-soft', label: 'Radio suave', styleText: 'rounded-lg', group: 'radius' },
  { id: 'block-rounded-pill', label: 'Radio amplio', styleText: 'rounded-2xl', group: 'radius' },
];
