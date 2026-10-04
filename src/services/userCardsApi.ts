import { userCardsMock } from '@/mocks/userCards.mock';
import type { UserCardBlockDto, UserCardDto } from '@/types/userCards';

export type UserCardPayload = Omit<UserCardDto, 'id' | 'blocks'>;
export type UserCardBlockPayload = Omit<UserCardBlockDto, 'id' | 'userCardId'>;

let userCardsStore: UserCardDto[] = cloneCards(userCardsMock);

function cloneCards(cards: UserCardDto[]) {
  return cards.map((card) => ({
    ...card,
    blocks: card.blocks.map((block) => ({ ...block })),
  }));
}

function sortCards(cards: UserCardDto[]) {
  return [...cards].sort(
    (currentCard, nextCard) => currentCard.sortOrder - nextCard.sortOrder,
  );
}

function getNextCardId() {
  return Math.max(0, ...userCardsStore.map((card) => card.id)) + 1;
}

function getNextBlockId() {
  return (
    Math.max(
      0,
      ...userCardsStore.flatMap((card) => card.blocks.map((block) => block.id)),
    ) + 1
  );
}

function findCardOrThrow(userCardId: number) {
  const card = userCardsStore.find((candidate) => candidate.id === userCardId);

  if (!card) {
    throw new Error('UserCard not found');
  }

  return card;
}

export const userCardsApi = {
  async listUserCards() {
    return sortCards(cloneCards(userCardsStore));
  },

  async createUserCard(payload: UserCardPayload) {
    const createdCard: UserCardDto = {
      ...payload,
      id: getNextCardId(),
      blocks: [],
    };

    userCardsStore = sortCards([...userCardsStore, createdCard]);

    return cloneCards([createdCard])[0];
  },

  async updateUserCard(userCardId: number, payload: UserCardPayload) {
    let updatedCard: UserCardDto | undefined;

    userCardsStore = sortCards(
      userCardsStore.map((card) => {
        if (card.id !== userCardId) {
          return card;
        }

        updatedCard = {
          ...card,
          ...payload,
          id: userCardId,
          blocks: card.blocks,
        };

        return updatedCard;
      }),
    );

    if (!updatedCard) {
      throw new Error('UserCard not found');
    }

    return cloneCards([updatedCard])[0];
  },

  async deleteUserCard(userCardId: number) {
    userCardsStore = userCardsStore.filter((card) => card.id !== userCardId);
  },

  async createUserCardBlock(userCardId: number, payload: UserCardBlockPayload) {
    const card = findCardOrThrow(userCardId);
    const createdBlock: UserCardBlockDto = {
      ...payload,
      id: getNextBlockId(),
      userCardId,
    };

    card.blocks = [...card.blocks, createdBlock].sort(
      (currentBlock, nextBlock) => currentBlock.sortOrder - nextBlock.sortOrder,
    );

    return { ...createdBlock };
  },

  async updateUserCardBlock(
    userCardId: number,
    userCardBlockId: number,
    payload: UserCardBlockPayload,
  ) {
    const card = findCardOrThrow(userCardId);
    let updatedBlock: UserCardBlockDto | undefined;

    card.blocks = card.blocks
      .map((block) => {
        if (block.id !== userCardBlockId) {
          return block;
        }

        updatedBlock = {
          ...block,
          ...payload,
          id: userCardBlockId,
          userCardId,
        };

        return updatedBlock;
      })
      .sort(
        (currentBlock, nextBlock) => currentBlock.sortOrder - nextBlock.sortOrder,
      );

    if (!updatedBlock) {
      throw new Error('UserCardBlock not found');
    }

    return { ...updatedBlock };
  },

  async deleteUserCardBlock(userCardId: number, userCardBlockId: number) {
    const card = findCardOrThrow(userCardId);

    card.blocks = card.blocks.filter((block) => block.id !== userCardBlockId);
  },
};

