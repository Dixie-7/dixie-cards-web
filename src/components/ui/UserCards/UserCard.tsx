import UserCardBlock from './UserCardBlock';
import type { ReactNode } from 'react';
import type { UserCardDto } from '@/types/userCards';
import type { UserCardBlockDto } from '@/types/userCards';
import { normalizeStyleText } from '@/utils/styleText';

interface UserCardProps {
  card: UserCardDto;
  className?: string;
  actions?: ReactNode;
  renderBlockActions?: (block: UserCardBlockDto) => ReactNode;
}

const cardTemplateStyles = {
  default: {
    article:
      'rounded-lg border border-zinc-200 bg-white p-5 text-left shadow-sm shadow-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-950/80 dark:shadow-black/20 sm:p-6',
    eyebrow: 'mb-2 text-sm font-medium text-emerald-700 dark:text-emerald-300',
    title: 'text-2xl font-semibold text-zinc-950 dark:text-white',
    description: 'mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300',
    blocks: '-m-2.5 flex flex-wrap',
  },
  feature: {
    article:
      'rounded-lg border border-cyan-100 bg-cyan-50/50 p-5 text-left shadow-sm shadow-cyan-950/5 dark:border-cyan-400/15 dark:bg-cyan-400/10 sm:p-6',
    eyebrow: 'mb-2 text-sm font-medium text-cyan-700 dark:text-cyan-300',
    title: 'text-2xl font-semibold text-zinc-950 dark:text-white',
    description: 'mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300',
    blocks: '-m-2.5 flex flex-wrap',
  },
  editorial: {
    article:
      'rounded-lg border border-zinc-200 bg-zinc-50 p-5 text-left shadow-sm shadow-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-900/70 sm:p-6',
    eyebrow: 'mb-2 text-sm font-medium text-blue-700 dark:text-blue-300',
    title: 'text-2xl font-semibold text-zinc-950 dark:text-white',
    description: 'mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300',
    blocks: '-m-2.5 flex flex-wrap',
  },
};

export default function UserCard({
  card,
  className = '',
  actions,
  renderBlockActions,
}: UserCardProps) {
  const sortedBlocks = [...card.blocks].sort(
    (currentBlock, nextBlock) => currentBlock.sortOrder - nextBlock.sortOrder,
  );
  const normalizedTemplate = card.template?.trim().toLowerCase() ?? 'default';
  const templateStyles =
    cardTemplateStyles[normalizedTemplate as keyof typeof cardTemplateStyles] ??
    cardTemplateStyles.default;
  const styleText = normalizeStyleText(card.styleText);

  return (
    <article
      className={`relative ${templateStyles.article} ${styleText} ${className}`}
    >
      {actions && (
        <div className="absolute right-4 top-4 z-10 flex gap-1.5">
          {actions}
        </div>
      )}
      <header className="mb-5">
        <p className={templateStyles.eyebrow}>
          User #{card.userId} / Card #{card.id} / {card.width}% width
        </p>
        <h2 className={templateStyles.title} data-card-title>
          {card.title}
        </h2>
        {card.description && (
          <p className={templateStyles.description} data-card-description>
            {card.description}
          </p>
        )}
      </header>

      <div className={templateStyles.blocks}>
        {sortedBlocks.map((block) => (
          <UserCardBlock
            key={block.id}
            block={block}
            actions={renderBlockActions?.(block)}
          />
        ))}
      </div>
    </article>
  );
}
