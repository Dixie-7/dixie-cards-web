import UserCardBlock from './UserCardBlock';
import type { ReactNode } from 'react';
import type { UserCardDto } from '@/features/cards/types/userCard.types';
import type { UserCardBlockDto } from '@/features/cards/types/userCard.types';
import {
  getCustomColorStylesFromStyleText,
  normalizeStyleText,
} from '@/features/cards/services/styleText';

interface MainCardProps {
  card: UserCardDto;
  actions?: ReactNode;
  manageWidth?: boolean;
  renderBlockActions?: (block: UserCardBlockDto) => ReactNode;
  standalone?: boolean;
}

const mainCardTemplateStyles = {
  default: {
    container: 'mx-auto max-w-5xl',
    body: '',
    blocks: '-m-2.5 flex flex-wrap gap-y-3',
  },
  feature: {
    container: 'mx-auto max-w-5xl',
    body:
      'rounded-lg border border-cyan-100 bg-cyan-50/40 p-3 dark:border-cyan-400/15 dark:bg-cyan-400/10',
    blocks: '-m-2.5 flex flex-wrap gap-y-3',
  },
  editorial: {
    container: 'mx-auto max-w-5xl',
    body:
      'rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/70',
    blocks: '-m-2.5 flex flex-wrap gap-y-3',
  },
};

function getSafeWidth(width: number) {
  if (!Number.isFinite(width)) {
    return 100;
  }

  return Math.min(Math.max(width, 0), 100);
}

export default function MainCard({
  card,
  actions,
  manageWidth = true,
  renderBlockActions,
  standalone = true,
}: MainCardProps) {
  const sortedBlocks = [...card.blocks].sort(
    (currentBlock, nextBlock) => currentBlock.sortOrder - nextBlock.sortOrder,
  );
  const normalizedTemplate = card.template?.trim().toLowerCase() ?? 'default';
  const templateStyles =
    mainCardTemplateStyles[
      normalizedTemplate as keyof typeof mainCardTemplateStyles
    ] ?? mainCardTemplateStyles.default;
  const styleText = normalizeStyleText(card.styleText);
  const customColorStyles = getCustomColorStylesFromStyleText(styleText);
  const article = (
    <article
      className={`relative ${templateStyles.body} ${styleText}`}
      data-user-card-id={card.id}
      style={{
        ...customColorStyles.rootStyle,
        ...(manageWidth ? { width: `${getSafeWidth(card.width)}%` } : {}),
      }}
    >
      {actions && (
        <div className="mb-3 flex justify-end gap-1.5">
          {actions}
        </div>
      )}
      <div className={templateStyles.blocks} data-card-blocks>
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

  if (!standalone) {
    return article;
  }

  return (
    <section className="w-full px-4 pb-8 pt-6">
      <div className={templateStyles.container}>
        {article}
      </div>
    </section>
  );
}
