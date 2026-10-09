import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import type { UserCardBlockDto, UserCardDto } from '@/features/cards/types/userCard.types';
import {
  getHorizontalPlacementClassFromStyleText,
  getPlacementClassFromStyleText,
} from '@/features/cards/services/styleText';
import UserCard from './UserCard';

interface UserCardsEditSectionProps {
  cards: UserCardDto[];
  onEditCard: (card: UserCardDto) => void;
  onDeleteCard: (card: UserCardDto) => void;
  onAddBlock: (card: UserCardDto) => void;
  onEditBlock: (card: UserCardDto, block: UserCardBlockDto) => void;
  onDeleteBlock: (card: UserCardDto, block: UserCardBlockDto) => void;
  activeCardId?: number | null;
}

const iconButtonClass =
  'inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white/95 text-zinc-700 shadow-sm shadow-zinc-950/5 transition hover:border-cyan-300 hover:text-cyan-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 dark:border-zinc-800 dark:bg-zinc-950/95 dark:text-zinc-200 dark:hover:text-cyan-200';
const dangerIconButtonClass =
  'inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-white/95 text-red-700 shadow-sm shadow-zinc-950/5 transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:border-red-400/20 dark:bg-zinc-950/95 dark:text-red-200 dark:hover:bg-red-400/10';

function getSafeWidth(width: number) {
  if (!Number.isFinite(width)) {
    return 100;
  }

  return Math.min(Math.max(width, 1), 100);
}

function getWidthStyle(width: number) {
  return {
    width: `${getSafeWidth(width)}%`,
  };
}

export default function UserCardsEditSection({
  cards,
  onEditCard,
  onDeleteCard,
  onAddBlock,
  onEditBlock,
  onDeleteBlock,
  activeCardId = null,
}: UserCardsEditSectionProps) {
  const sortedCards = [...cards].sort(
    (currentCard, nextCard) => currentCard.sortOrder - nextCard.sortOrder,
  );

  if (sortedCards.length === 0) {
    return (
      <section className="w-full px-4 pb-12">
        <div className="mx-auto max-w-5xl rounded-lg border border-dashed border-zinc-300 p-6 text-left text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          No UserCards yet.
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-4 pb-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 text-left">
          <p className="text-sm font-medium text-cyan-700 dark:text-cyan-300">
            Edit mode
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-white">
            Editable UserCards
          </h1>
        </div>

        <div className="-m-2.5 flex flex-wrap">
          {sortedCards.map((card) => {
            const isActiveCard = card.id === activeCardId;
            const horizontalPlacement = getHorizontalPlacementClassFromStyleText(
              card.styleText,
            );

            return (
              <div
                key={card.id}
                className={`p-2.5 ${getPlacementClassFromStyleText(card.styleText)} ${isActiveCard ? '' : horizontalPlacement}`}
                style={getWidthStyle(isActiveCard ? 100 : card.width)}
              >
                <div
                  className={
                    isActiveCard
                      ? `rounded-xl ring-2 ring-cyan-400/70 ring-offset-4 ring-offset-white dark:ring-cyan-300/60 dark:ring-offset-zinc-950 ${horizontalPlacement}`
                      : ''
                  }
                  style={getWidthStyle(isActiveCard ? card.width : 100)}
                >
                  <UserCard
                    card={card}
                    actions={
                      <>
                        <button
                          type="button"
                          onClick={() => onEditCard(card)}
                          className={iconButtonClass}
                          aria-label={`Edit ${card.title}`}
                          title="Edit"
                        >
                          <PencilSquareIcon className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onAddBlock(card)}
                          className={iconButtonClass}
                          aria-label={`Add block to ${card.title}`}
                          title="Add block"
                        >
                          <PlusIcon className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteCard(card)}
                          className={dangerIconButtonClass}
                          aria-label={`Delete ${card.title}`}
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </>
                    }
                    renderBlockActions={(block) => (
                      <>
                        <button
                          type="button"
                          onClick={() => onEditBlock(card, block)}
                          className={iconButtonClass}
                          aria-label={`Edit ${block.title ?? block.type}`}
                          title="Edit"
                        >
                          <PencilSquareIcon className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteBlock(card, block)}
                          className={dangerIconButtonClass}
                          aria-label={`Delete ${block.title ?? block.type}`}
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </>
                    )}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
