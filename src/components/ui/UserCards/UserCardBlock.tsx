import {
  BoltIcon,
  ChartBarIcon,
  CodeBracketIcon,
  CommandLineIcon,
  CpuChipIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  LightBulbIcon,
  PaintBrushIcon,
  PhotoIcon,
  QueueListIcon,
  RocketLaunchIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import type { ReactNode } from 'react';
import type { UserCardBlockDto } from '@/types/userCards';
import {
  getHorizontalPlacementClassFromStyleText,
  getPlacementClassFromStyleText,
  normalizeStyleText,
} from '@/utils/styleText';

interface UserCardBlockProps {
  block: UserCardBlockDto;
  actions?: ReactNode;
}

const blockIconMap = {
  bolt: BoltIcon,
  chart: ChartBarIcon,
  code: CodeBracketIcon,
  command: CommandLineIcon,
  cpu: CpuChipIcon,
  document: DocumentTextIcon,
  globe: GlobeAltIcon,
  lightbulb: LightBulbIcon,
  text: DocumentTextIcon,
  media: PhotoIcon,
  image: PhotoIcon,
  paint: PaintBrushIcon,
  photo: PhotoIcon,
  list: QueueListIcon,
  quote: SparklesIcon,
  rocket: RocketLaunchIcon,
  sparkles: SparklesIcon,
};

type BlockTemplateStyle = {
  article: string;
  verticalAlign?: string;
  header: string;
  showHeader: boolean;
  showIcon: boolean;
  showEyebrow: boolean;
  icon: string;
  title: string;
  eyebrow: string;
  text: string;
  figure: string;
  figureFrame: string;
  caption: string;
  list: string;
  listItem: string;
  quote: string;
};

const defaultListItem =
  'rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200';

const blockTemplateStyles: Record<string, BlockTemplateStyle> = {
  default: {
    article: 'border-t border-zinc-200 py-5 first:border-t-0 first:pt-0 dark:border-zinc-800',
    header: 'mb-3 flex items-center gap-3 text-left',
    showHeader: true,
    showIcon: true,
    showEyebrow: true,
    icon: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-200',
    title: 'text-base',
    eyebrow: 'text-xs uppercase tracking-normal text-zinc-500 dark:text-zinc-400',
    text: 'text-sm leading-6',
    figure: 'aspect-[16/9]',
    figureFrame:
      'overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 text-left dark:border-zinc-800 dark:bg-zinc-900',
    caption: 'px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300',
    list: 'gap-2',
    listItem: defaultListItem,
    quote: 'border-l-4 border-emerald-500 pl-4 text-lg',
  },
  featured: {
    article:
      'rounded-lg border border-cyan-100 bg-cyan-50/60 p-4 dark:border-cyan-400/15 dark:bg-cyan-400/10',
    header: 'mb-3 flex items-center gap-3 text-left',
    showHeader: true,
    showIcon: true,
    showEyebrow: true,
    icon: 'bg-white text-cyan-700 dark:bg-zinc-950 dark:text-cyan-200',
    title: 'text-lg',
    eyebrow: 'text-xs uppercase tracking-normal text-zinc-500 dark:text-zinc-400',
    text: 'text-base leading-7',
    figure: 'aspect-[16/9]',
    figureFrame:
      'overflow-hidden rounded-lg border border-cyan-100 bg-white text-left dark:border-cyan-400/15 dark:bg-zinc-950',
    caption: 'px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300',
    list: 'gap-2',
    listItem: defaultListItem,
    quote: 'border-l-4 border-cyan-500 pl-4 text-lg',
  },
  wide: {
    article: 'border-t border-zinc-200 py-5 first:border-t-0 first:pt-0 dark:border-zinc-800',
    header: 'mb-3 flex items-center gap-3 text-left',
    showHeader: true,
    showIcon: true,
    showEyebrow: true,
    icon: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-100',
    title: 'text-base',
    eyebrow: 'text-xs uppercase tracking-normal text-zinc-500 dark:text-zinc-400',
    text: 'text-sm leading-6',
    figure: 'aspect-[21/9]',
    figureFrame:
      'overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 text-left dark:border-zinc-800 dark:bg-zinc-900',
    caption: 'px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300',
    list: 'gap-2',
    listItem: defaultListItem,
    quote: 'border-l-4 border-zinc-500 pl-4 text-lg',
  },
  compact: {
    article: 'border-t border-zinc-200 pt-4 first:border-t-0 first:pt-0 dark:border-zinc-800',
    header: 'mb-3 flex items-center gap-3 text-left',
    showHeader: true,
    showIcon: true,
    showEyebrow: true,
    icon: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200',
    title: 'text-base',
    eyebrow: 'text-xs uppercase tracking-normal text-zinc-500 dark:text-zinc-400',
    text: 'text-sm leading-6',
    figure: 'aspect-[16/9]',
    figureFrame:
      'overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 text-left dark:border-zinc-800 dark:bg-zinc-900',
    caption: 'px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300',
    list: 'gap-2',
    listItem: defaultListItem,
    quote: 'border-l-4 border-emerald-500 pl-4 text-base',
  },
  highlight: {
    article:
      'rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-400/20 dark:bg-emerald-400/10',
    header: 'mb-3 flex items-center gap-3 text-left',
    showHeader: true,
    showIcon: true,
    showEyebrow: true,
    icon: 'bg-white text-emerald-700 dark:bg-zinc-950 dark:text-emerald-200',
    title: 'text-lg',
    eyebrow: 'text-xs uppercase tracking-normal text-zinc-500 dark:text-zinc-400',
    text: 'text-base leading-7',
    figure: 'aspect-[16/9]',
    figureFrame:
      'overflow-hidden rounded-lg border border-emerald-200 bg-white text-left dark:border-emerald-400/20 dark:bg-zinc-950',
    caption: 'px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300',
    list: 'gap-2',
    listItem: defaultListItem,
    quote: 'border-l-4 border-emerald-500 pl-4 text-xl',
  },
  split: {
    article: 'border-t border-zinc-200 py-5 first:border-t-0 first:pt-0 dark:border-zinc-800',
    header: 'mb-3 flex items-center gap-3 text-left',
    showHeader: true,
    showIcon: true,
    showEyebrow: true,
    icon: 'bg-violet-50 text-violet-700 dark:bg-violet-400/10 dark:text-violet-200',
    title: 'text-base',
    eyebrow: 'text-xs uppercase tracking-normal text-zinc-500 dark:text-zinc-400',
    text: 'text-sm leading-6',
    figure: 'aspect-[4/3]',
    figureFrame:
      'overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 text-left dark:border-zinc-800 dark:bg-zinc-900',
    caption: 'px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300',
    list: 'gap-2',
    listItem: defaultListItem,
    quote: 'border-l-4 border-violet-500 pl-4 text-lg',
  },
  main: {
    article: 'border-t border-zinc-200 py-6 first:border-t-0 first:pt-0 dark:border-zinc-800',
    header: 'mb-3 flex items-center gap-3 text-left',
    showHeader: true,
    showIcon: true,
    showEyebrow: true,
    icon: 'bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-200',
    title: 'text-xl',
    eyebrow: 'text-xs uppercase tracking-normal text-zinc-500 dark:text-zinc-400',
    text: 'text-base leading-7',
    figure: 'aspect-[16/9]',
    figureFrame:
      'overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 text-left dark:border-zinc-800 dark:bg-zinc-900',
    caption: 'px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300',
    list: 'gap-3',
    listItem: defaultListItem,
    quote: 'border-l-4 border-blue-500 pl-5 text-xl',
  },
  'main-wide': {
    article: 'border-t border-zinc-200 py-6 first:border-t-0 first:pt-0 dark:border-zinc-800',
    header: 'mb-3 flex items-center gap-3 text-left',
    showHeader: true,
    showIcon: true,
    showEyebrow: true,
    icon: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100',
    title: 'text-xl',
    eyebrow: 'text-xs uppercase tracking-normal text-zinc-500 dark:text-zinc-400',
    text: 'text-base leading-7',
    figure: 'aspect-[21/9]',
    figureFrame:
      'overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 text-left dark:border-zinc-800 dark:bg-zinc-900',
    caption: 'px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300',
    list: 'gap-3',
    listItem: defaultListItem,
    quote: 'border-l-4 border-zinc-500 pl-5 text-xl',
  },
  'main-highlight': {
    article:
      'rounded-lg border border-blue-200 bg-blue-50 p-5 dark:border-blue-400/20 dark:bg-blue-400/10',
    header: 'mb-3 flex items-center gap-3 text-left',
    showHeader: true,
    showIcon: true,
    showEyebrow: true,
    icon: 'bg-white text-blue-700 dark:bg-zinc-950 dark:text-blue-200',
    title: 'text-xl',
    eyebrow: 'text-xs uppercase tracking-normal text-zinc-500 dark:text-zinc-400',
    text: 'text-base leading-7',
    figure: 'aspect-[16/9]',
    figureFrame:
      'overflow-hidden rounded-lg border border-blue-200 bg-white text-left dark:border-blue-400/20 dark:bg-zinc-950',
    caption: 'px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300',
    list: 'gap-3',
    listItem: defaultListItem,
    quote: 'border-l-4 border-blue-500 pl-5 text-xl',
  },
  'main-presentation': {
    article:
      'rounded-lg border border-zinc-200 bg-linear-to-br from-white via-cyan-50/70 to-emerald-50/60 p-6 shadow-sm shadow-cyan-950/5 dark:border-zinc-800 dark:from-zinc-950 dark:via-cyan-950/30 dark:to-emerald-950/20 sm:p-8',
    header: 'mb-5 text-left',
    showHeader: true,
    showIcon: false,
    showEyebrow: false,
    icon: 'bg-zinc-950 text-cyan-200 dark:bg-white dark:text-zinc-950',
    title: 'text-4xl leading-tight sm:text-5xl',
    eyebrow: 'text-xs uppercase tracking-normal text-cyan-700 dark:text-cyan-300',
    text: 'max-w-3xl text-lg leading-8',
    figure: 'aspect-[16/9]',
    figureFrame:
      'overflow-hidden rounded-lg border border-cyan-100 bg-white text-left dark:border-cyan-400/20 dark:bg-zinc-950',
    caption: 'px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300',
    list: 'gap-3',
    listItem:
      'rounded-full border border-cyan-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 shadow-sm shadow-cyan-950/5 dark:border-cyan-400/20 dark:bg-zinc-950 dark:text-zinc-100',
    quote: 'border-l-4 border-cyan-500 pl-5 text-xl',
  },
  'main-skills': {
    article:
      'rounded-lg border border-zinc-200 bg-white/80 p-5 dark:border-zinc-800 dark:bg-zinc-950/80',
    header: 'mb-4 flex items-center gap-3 text-left',
    showHeader: true,
    showIcon: false,
    showEyebrow: false,
    icon: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200',
    title: 'text-lg',
    eyebrow: 'text-xs uppercase tracking-normal text-emerald-700 dark:text-emerald-300',
    text: 'text-base leading-7',
    figure: 'aspect-[16/9]',
    figureFrame:
      'overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 text-left dark:border-zinc-800 dark:bg-zinc-900',
    caption: 'px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300',
    list: 'gap-3',
    listItem:
      'rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-100',
    quote: 'border-l-4 border-emerald-500 pl-5 text-lg',
  },
  'main-photo': {
    article:
      'overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm shadow-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-950',
    header: 'hidden',
    showHeader: false,
    showIcon: false,
    showEyebrow: false,
    icon: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100',
    title: 'text-xl',
    eyebrow: 'text-xs uppercase tracking-normal text-zinc-500 dark:text-zinc-400',
    text: 'text-base leading-7',
    figure: 'aspect-[16/10]',
    figureFrame: 'overflow-hidden bg-zinc-100 text-left dark:bg-zinc-900',
    caption: 'px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300',
    list: 'gap-3',
    listItem: defaultListItem,
    quote: 'border-l-4 border-zinc-500 pl-5 text-xl',
  },
};

function getListItems(content?: string | null) {
  return content
    ?.split(';')
    .map((item) => item.trim())
    .filter(Boolean);
}

function getSafeWidth(width: number) {
  if (!Number.isFinite(width)) {
    return 100;
  }

  return Math.min(Math.max(width, 1), 100);
}

export default function UserCardBlock({ block, actions }: UserCardBlockProps) {
  const normalizedType = block.type.trim().toLowerCase();
  const normalizedTemplate = block.template?.trim().toLowerCase() ?? 'default';
  const normalizedIcon = block.icon?.trim().toLowerCase() ?? '';
  const iconKey = normalizedIcon || normalizedType;
  const Icon =
    blockIconMap[iconKey as keyof typeof blockIconMap] ?? DocumentTextIcon;
  const templateStyles =
    blockTemplateStyles[normalizedTemplate] ?? blockTemplateStyles.default;
  const listItems = normalizedType === 'list' ? getListItems(block.content) : [];
  const isMediaBlock = normalizedType === 'media' || normalizedType === 'image';
  const hasHeaderContent = Boolean(block.title) || templateStyles.showEyebrow;
  const showIcon = templateStyles.showIcon && normalizedIcon !== 'none';
  const verticalAlign =
    getPlacementClassFromStyleText(block.styleText) ||
    templateStyles.verticalAlign ||
    'self-center';
  const horizontalAlign = getHorizontalPlacementClassFromStyleText(block.styleText);
  const styleText = normalizeStyleText(block.styleText);

  return (
    <div
      className={`relative p-2.5 ${verticalAlign} ${horizontalAlign}`}
      style={{ width: `${getSafeWidth(block.width)}%` }}
      data-user-card-block-id={block.id}
    >
      {actions && (
        <div className="absolute right-4 top-4 z-10 flex gap-1.5">
          {actions}
        </div>
      )}
      <article className={`w-full ${templateStyles.article} ${styleText}`}>
        {templateStyles.showHeader && hasHeaderContent && (
          <div className={`${templateStyles.header} w-full`} data-block-header>
            {showIcon && (
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${templateStyles.icon}`}
                data-block-icon
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
            )}

            <div className="min-w-0 flex-1" data-block-heading>
              {block.title && (
                <h3
                  className={`${templateStyles.title} w-full font-semibold text-zinc-950 dark:text-white`}
                  data-block-title
                >
                  {block.title}
                </h3>
              )}
              {templateStyles.showEyebrow && (
                <p className={templateStyles.eyebrow}>
                  {block.type}
                  {block.template ? ` / ${block.template}` : ''}
                </p>
              )}
            </div>
          </div>
        )}

        {isMediaBlock && block.mediaUrl && (
          <figure className={templateStyles.figureFrame}>
            <img
              src={block.mediaUrl}
              alt={block.title ?? block.caption ?? 'Portfolio media'}
              className={`${templateStyles.figure} w-full object-cover`}
            />
            {block.caption && (
              <figcaption className={templateStyles.caption} data-block-content>
                {block.caption}
              </figcaption>
            )}
          </figure>
        )}

        {normalizedType === 'quote' && block.content && (
          <blockquote
            className={`${templateStyles.quote} text-left font-medium leading-relaxed text-zinc-800 dark:text-zinc-100`}
            data-block-content
          >
            "{block.content}"
            {block.caption && (
              <footer className="mt-3 text-sm font-normal text-zinc-500 dark:text-zinc-400">
                {block.caption}
              </footer>
            )}
          </blockquote>
        )}

        {normalizedType === 'list' && listItems && listItems.length > 0 && (
          <ul
            className={`flex flex-wrap text-left ${templateStyles.list}`}
            data-block-content
          >
            {listItems.map((item) => (
              <li key={item} className={templateStyles.listItem} data-block-content>
                {item}
              </li>
            ))}
          </ul>
        )}

        {!isMediaBlock &&
          normalizedType !== 'quote' &&
          normalizedType !== 'list' && (
            <p
              className={`text-left ${templateStyles.text} text-zinc-600 dark:text-zinc-300`}
              data-block-content
            >
              {block.content}
            </p>
          )}
      </article>
    </div>
  );
}
