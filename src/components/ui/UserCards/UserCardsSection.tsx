import { userCardsMock } from '@/mocks/userCards.mock';
import UserCard from './UserCard';
import type { UserCardDto } from '@/types/userCards';
import { getPlacementClassFromStyleText } from '@/utils/styleText';

const mainCardTitle = 'MainCard';

interface UserCardsSectionProps {
  cards?: UserCardDto[];
}

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

export default function UserCardsSection({
  cards = userCardsMock.filter((card) => card.title !== mainCardTitle),
}: UserCardsSectionProps) {
  const sortedCards = [...cards].sort(
    (currentCard, nextCard) => currentCard.sortOrder - nextCard.sortOrder,
  );

  if (sortedCards.length === 0) {
    return null;
  }

  return (
    <section className="w-full px-4 pb-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 text-left">
          <p className="text-sm font-medium text-cyan-700 dark:text-cyan-300">
            Editable portfolio cards
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-white">
            UserCard DTO preview
          </h1>
        </div>

        <div className="-m-2.5 flex flex-wrap">
          {sortedCards.map((card) => (
            <div
              key={card.id}
              className={`p-2.5 ${getPlacementClassFromStyleText(card.styleText)}`}
              style={getWidthStyle(card.width)}
            >
              <UserCard card={card} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
