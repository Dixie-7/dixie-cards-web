import { userCardsMock } from '@/features/cards/mocks/userCards.mock';
import UserCard from './UserCard';
import type { UserCardDto } from '@/features/cards/types/userCard.types';
import {
  getHorizontalPlacementClassFromStyleText,
  getPlacementClassFromStyleText,
} from '@/features/cards/services/styleText';
import { useLanguage } from '@/shared/i18n/useLanguage';

const mainCardTitle = 'MainCard';

interface UserCardsSectionProps {
  cards?: UserCardDto[];
  showHeader?: boolean;
  title?: string;
  // TODO(showCardNumber): Uncomment when card numbering is enabled again.
  // showCardNumber?: boolean;
}

function getSafeWidth(width: number) {
  if (!Number.isFinite(width)) {
    return 100;
  }

  return Math.min(Math.max(width, 0), 100);
}

function getWidthStyle(width: number) {
  return {
    width: `${getSafeWidth(width)}%`,
  };
}

export default function UserCardsSection({
  cards = userCardsMock.filter((card) => card.title !== mainCardTitle),
  showHeader = true,
  title,
  // showCardNumber = false,
}: UserCardsSectionProps) {
  const { t } = useLanguage();
  const sortedCards = [...cards].sort(
    (currentCard, nextCard) => currentCard.sortOrder - nextCard.sortOrder,
  );

  if (sortedCards.length === 0) {
    return null;
  }

  return (
    <section className="w-full px-4 pb-12">
      <div className="mx-auto max-w-5xl">
        {showHeader && (
          <div className="mb-6 text-left">
            <h2 className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-white">
              {title ?? t('cardsTitle')}
            </h2>
          </div>
        )}

        <div className="-m-2.5 flex flex-wrap">
          {sortedCards.map((card) => (
            <div
              key={card.id}
              className={`p-2.5 ${getPlacementClassFromStyleText(card.styleText)} ${getHorizontalPlacementClassFromStyleText(card.styleText)}`}
              style={getWidthStyle(card.width)}
            >
              <UserCard
                card={card}
                // TODO(showCardNumber): Uncomment when card numbering is enabled again.
                // showCardNumber={showCardNumber}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
