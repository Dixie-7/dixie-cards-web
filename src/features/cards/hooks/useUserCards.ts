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

export function useUserCards() {
  const [cards, setCards] = useState<UserCardDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCards = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setCards(await cardApi.listUserCards());
    } catch (unknownError) {
      setError(
        unknownError instanceof Error
          ? unknownError.message
          : 'Unexpected portfolio loading error',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCards();
  }, [loadCards]);

  const createCard = useCallback(async (payload: UserCardPayload) => {
    const createdCard = await cardApi.createUserCard(payload);

    setCards((currentCards) => sortCards([...currentCards, createdCard]));

    return createdCard;
  }, []);

  const updateCard = useCallback(
    async (userCardId: number, payload: UserCardPayload) => {
      const updatedCard = await cardApi.updateUserCard(userCardId, payload);

      setCards((currentCards) =>
        sortCards(
          currentCards.map((card) =>
            card.id === userCardId ? updatedCard : card,
          ),
        ),
      );

      return updatedCard;
    },
    [],
  );

  const deleteCard = useCallback(async (userCardId: number) => {
    await cardApi.deleteUserCard(userCardId);
    setCards((currentCards) =>
      currentCards.filter((card) => card.id !== userCardId),
    );
  }, []);

  const createBlock = useCallback(
    async (userCardId: number, payload: UserCardBlockPayload) => {
      const createdBlock = await cardApi.createUserCardBlock(
        userCardId,
        payload,
      );

      setCards((currentCards) =>
        currentCards.map((card) => {
          if (card.id !== userCardId) {
            return card;
          }

          return {
            ...card,
            blocks: [...card.blocks, createdBlock].sort(
              (currentBlock, nextBlock) =>
                currentBlock.sortOrder - nextBlock.sortOrder,
            ),
          };
        }),
      );

      return createdBlock;
    },
    [],
  );

  const updateBlock = useCallback(
    async (
      userCardId: number,
      userCardBlockId: number,
      payload: UserCardBlockPayload,
    ) => {
      const updatedBlock = await cardApi.updateUserCardBlock(
        userCardId,
        userCardBlockId,
        payload,
      );

      setCards((currentCards) =>
        currentCards.map((card) => {
          if (card.id !== userCardId) {
            return card;
          }

          return {
            ...card,
            blocks: card.blocks
              .map((block) =>
                block.id === userCardBlockId ? updatedBlock : block,
              )
              .sort(
                (currentBlock, nextBlock) =>
                  currentBlock.sortOrder - nextBlock.sortOrder,
              ),
          };
        }),
      );

      return updatedBlock;
    },
    [],
  );

  const deleteBlock = useCallback(
    async (userCardId: number, userCardBlockId: number) => {
      await cardApi.deleteUserCardBlock(userCardId, userCardBlockId);

      setCards((currentCards) =>
        currentCards.map((card) => {
          if (card.id !== userCardId) {
            return card;
          }

          return {
            ...card,
            blocks: card.blocks.filter((block) => block.id !== userCardBlockId),
          };
        }),
      );
    },
    [],
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
