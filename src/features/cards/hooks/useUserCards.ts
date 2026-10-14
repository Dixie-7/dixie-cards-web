import { useCallback, useEffect, useState } from 'react';
import { cardApi } from '@/features/cards/api/cardApi';
import type {
  UserCardBlockPayload,
  UserCardDto,
  UserCardPayload,
} from '@/features/cards/types/userCard.types';

function sortCards(cards: UserCardDto[]) {
  return [...cards].sort(
    (currentCard, nextCard) => currentCard.sortOrder - nextCard.sortOrder,
  );
}

export function useUserCards(token?: string | null) {
  const [cards, setCards] = useState<UserCardDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCards = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setCards(await cardApi.listUserCards(token));
    } catch (unknownError) {
      setError(
        unknownError instanceof Error
          ? unknownError.message
          : 'Unexpected portfolio loading error',
      );
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadCards();
  }, [loadCards]);

  const createCard = useCallback(async (payload: UserCardPayload) => {
    const createdCard = await cardApi.createUserCard(payload, token);

    setCards((currentCards) => sortCards([...currentCards, createdCard]));

    return createdCard;
  }, [token]);

  const updateCard = useCallback(
    async (userCardId: number, payload: UserCardPayload) => {
      const updatedCard = await cardApi.updateUserCard(userCardId, payload, token);

      setCards((currentCards) =>
        sortCards(
          currentCards.map((card) =>
            card.id === userCardId ? updatedCard : card,
          ),
        ),
      );

      return updatedCard;
    },
    [token],
  );

  const deleteCard = useCallback(async (userCardId: number) => {
    await cardApi.deleteUserCard(userCardId, token);
    setCards((currentCards) =>
      currentCards.filter((card) => card.id !== userCardId),
    );
  }, [token]);

  const createBlock = useCallback(
    async (userCardId: number, payload: UserCardBlockPayload) => {
      const { block: createdBlock, card: updatedCard } =
        await cardApi.createUserCardBlock(
          userCardId,
          payload,
          token,
        );

      setCards((currentCards) =>
        currentCards.map((card) =>
          card.id === userCardId ? updatedCard : card,
        ),
      );

      return createdBlock;
    },
    [token],
  );

  const updateBlock = useCallback(
    async (
      userCardId: number,
      userCardBlockId: number,
      payload: UserCardBlockPayload,
    ) => {
      const { block: updatedBlock, card: updatedCard } =
        await cardApi.updateUserCardBlock(
          userCardId,
          userCardBlockId,
          payload,
          token,
        );

      setCards((currentCards) =>
        currentCards.map((card) =>
          card.id === userCardId ? updatedCard : card,
        ),
      );

      return updatedBlock;
    },
    [token],
  );

  const deleteBlock = useCallback(
    async (userCardId: number, userCardBlockId: number) => {
      const updatedCard = await cardApi.deleteUserCardBlock(
        userCardId,
        userCardBlockId,
        token,
      );

      setCards((currentCards) =>
        currentCards.map((card) =>
          card.id === userCardId ? updatedCard : card,
        ),
      );
    },
    [token],
  );

  return {
    cards,
    isLoading,
    error,
    reload: loadCards,
    createCard,
    updateCard,
    deleteCard,
    createBlock,
    updateBlock,
    deleteBlock,
  };
}
