import { userCardsMock } from '@/features/cards/mocks/userCards.mock';
import type {
  UserCardBlockDto,
  UserCardBlockPayload,
  UserCardDto,
  UserCardPayload,
} from '@/features/cards/types/userCard.types';
import { apiClient, isMockEnabled } from '@/shared/api/apiClient';

type UserCardBlockRequest = UserCardBlockPayload & { id?: number };
type UserCardRequest = UserCardPayload & { blocks: UserCardBlockRequest[] };

interface BlockMutationResult {
  block: UserCardBlockDto;
  card: UserCardDto;
}

const userCardsEndpoint =
  import.meta.env.VITE_USER_CARDS_ENDPOINT?.trim() || '/api/UserCards';
const defaultMockUserId = 7;

export const isMockUserCardsEnabled = isMockEnabled('VITE_USE_MOCK_USER_CARDS');

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

function sortBlocks(blocks: UserCardBlockDto[]) {
  return [...blocks].sort(
    (currentBlock, nextBlock) => currentBlock.sortOrder - nextBlock.sortOrder,
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readValue(
  record: Record<string, unknown>,
  camelKey: string,
  pascalKey: string,
) {
  return record[camelKey] ?? record[pascalKey];
}

function readString(
  record: Record<string, unknown>,
  camelKey: string,
  pascalKey: string,
) {
  const value = readValue(record, camelKey, pascalKey);

  return typeof value === 'string' ? value : undefined;
}

function readNullableString(
  record: Record<string, unknown>,
  camelKey: string,
  pascalKey: string,
) {
  const value = readValue(record, camelKey, pascalKey);

  if (value === null) {
    return null;
  }

  return typeof value === 'string' ? value : undefined;
}

function readNumber(
  record: Record<string, unknown>,
  camelKey: string,
  pascalKey: string,
) {
  const value = readValue(record, camelKey, pascalKey);

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const parsedValue = Number(value);

    return Number.isNaN(parsedValue) ? undefined : parsedValue;
  }

  return undefined;
}

function normalizeUserCardBlock(
  value: unknown,
): UserCardBlockDto | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const id = readNumber(value, 'id', 'Id');
  const userCardId = readNumber(value, 'userCardId', 'UserCardId') ?? 0;
  const type = readString(value, 'type', 'Type');
  const width = readNumber(value, 'width', 'Width') ?? 100;
  const sortOrder = readNumber(value, 'sortOrder', 'SortOrder') ?? 0;

  if (id === undefined || !type) {
    return undefined;
  }

  return {
    id,
    userCardId,
    type,
    title: readNullableString(value, 'title', 'Title') ?? null,
    content: readNullableString(value, 'content', 'Content') ?? null,
    mediaUrl: readNullableString(value, 'mediaUrl', 'MediaUrl') ?? null,
    icon: readNullableString(value, 'icon', 'Icon') ?? null,
    template: readNullableString(value, 'template', 'Template') ?? null,
    styleText: readNullableString(value, 'styleText', 'StyleText') ?? null,
    caption: readNullableString(value, 'caption', 'Caption') ?? null,
    width,
    sortOrder,
  };
}

function normalizeUserCardBlocks(value: unknown): UserCardBlockDto[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return sortBlocks(
    value
      .map((item) => normalizeUserCardBlock(item))
      .filter((block): block is UserCardBlockDto => Boolean(block)),
  );
}

function normalizeUserCard(value: unknown): UserCardDto | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const id = readNumber(value, 'id', 'Id');
  const title = readString(value, 'title', 'Title');
  const userId = readNumber(value, 'userId', 'UserId') ?? defaultMockUserId;
  const width = readNumber(value, 'width', 'Width') ?? 100;
  const sortOrder = readNumber(value, 'sortOrder', 'SortOrder') ?? 0;

  if (id === undefined || !title) {
    return undefined;
  }

  return {
    id,
    userId,
    title,
    description: readNullableString(value, 'description', 'Description') ?? null,
    template: readNullableString(value, 'template', 'Template') ?? null,
    styleText: readNullableString(value, 'styleText', 'StyleText') ?? null,
    width,
    sortOrder,
    blocks: normalizeUserCardBlocks(readValue(value, 'blocks', 'Blocks')),
  };
}

function normalizeUserCardResponse(value: unknown): UserCardDto | undefined {
  const card = normalizeUserCard(value);

  if (card) {
    return card;
  }

  if (!isRecord(value)) {
    return undefined;
  }

  return normalizeUserCard(value.data ?? value.Data ?? value.card ?? value.Card);
}

function normalizeUserCardCollection(
  value: unknown,
): UserCardDto[] | undefined {
  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeUserCard(item))
      .filter((card): card is UserCardDto => Boolean(card));
  }

  if (!isRecord(value)) {
    return undefined;
  }

  return normalizeUserCardCollection(
    value.data ?? value.Data ?? value.items ?? value.Items ?? value.cards,
  );
}

function findCardOrThrow(userCardId: number) {
  const card = userCardsStore.find((candidate) => candidate.id === userCardId);

  if (!card) {
    throw new Error('UserCard not found');
  }

  return card;
}

function getCardPayload(card: UserCardDto): UserCardPayload {
  return {
    title: card.title,
    description: card.description ?? null,
    template: card.template ?? null,
    styleText: card.styleText ?? null,
    width: card.width,
    sortOrder: card.sortOrder,
  };
}

function getBlockRequest(block: UserCardBlockDto): UserCardBlockRequest {
  return {
    id: block.id,
    type: block.type,
    title: block.title ?? null,
    content: block.content ?? null,
    mediaUrl: block.mediaUrl ?? null,
    icon: block.icon ?? null,
    template: block.template ?? null,
    styleText: block.styleText ?? null,
    caption: block.caption ?? null,
    width: block.width,
    sortOrder: block.sortOrder,
  };
}

function createCardRequest(
  payload: UserCardPayload,
  blocks: UserCardBlockRequest[] = [],
): UserCardRequest {
  return {
    ...payload,
    blocks,
  };
}

function createCardFromPayload(
  id: number,
  payload: UserCardPayload,
  blocks: UserCardBlockDto[] = [],
): UserCardDto {
  return {
    ...payload,
    id,
    userId: defaultMockUserId,
    blocks,
  };
}

async function listUserCardsWithMock() {
  return sortCards(cloneCards(userCardsStore));
}

async function getUserCardWithMock(cardId: number) {
  return cloneCards([findCardOrThrow(cardId)])[0];
}

async function createUserCardWithMock(payload: UserCardPayload) {
  const createdCard = createCardFromPayload(getNextCardId(), payload);

  userCardsStore = sortCards([...userCardsStore, createdCard]);

  return cloneCards([createdCard])[0];
}

async function updateUserCardWithMock(
  userCardId: number,
  payload: UserCardPayload,
) {
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
}

async function deleteUserCardWithMock(userCardId: number) {
  userCardsStore = userCardsStore.filter((card) => card.id !== userCardId);
}

async function createUserCardBlockWithMock(
  userCardId: number,
  payload: UserCardBlockPayload,
): Promise<BlockMutationResult> {
  const card = findCardOrThrow(userCardId);
  const createdBlock: UserCardBlockDto = {
    ...payload,
    id: getNextBlockId(),
    userCardId,
  };

  card.blocks = sortBlocks([...card.blocks, createdBlock]);

  return {
    block: { ...createdBlock },
    card: cloneCards([card])[0],
  };
}

async function updateUserCardBlockWithMock(
  userCardId: number,
  userCardBlockId: number,
  payload: UserCardBlockPayload,
): Promise<BlockMutationResult> {
  const card = findCardOrThrow(userCardId);
  let updatedBlock: UserCardBlockDto | undefined;

  card.blocks = sortBlocks(
    card.blocks.map((block) => {
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
    }),
  );

  if (!updatedBlock) {
    throw new Error('UserCardBlock not found');
  }

  return {
    block: { ...updatedBlock },
    card: cloneCards([card])[0],
  };
}

async function deleteUserCardBlockWithMock(
  userCardId: number,
  userCardBlockId: number,
) {
  const card = findCardOrThrow(userCardId);

  card.blocks = card.blocks.filter((block) => block.id !== userCardBlockId);

  return cloneCards([card])[0];
}

async function listUserCardsWithApi(token?: string | null) {
  const { data: jsonResponse } = await apiClient.request(userCardsEndpoint, {
    method: 'GET',
    token,
  });
  const cards = normalizeUserCardCollection(jsonResponse);

  if (!cards) {
    throw new Error('El servidor devolvio una lista de cards invalida.');
  }

  return sortCards(cards);
}

async function getUserCardWithApi(cardId: number, token?: string | null) {
  const { data: jsonResponse } = await apiClient.request(
    `${userCardsEndpoint}/${cardId}`,
    {
      method: 'GET',
      token,
    },
  );
  const card = normalizeUserCardResponse(jsonResponse);

  if (!card) {
    throw new Error('El servidor devolvio una card invalida.');
  }

  return card;
}

async function createUserCardWithApi(
  payload: UserCardPayload,
  token?: string | null,
) {
  const { data: jsonResponse } = await apiClient.request(userCardsEndpoint, {
    method: 'POST',
    body: createCardRequest(payload),
    token,
  });
  const card = normalizeUserCardResponse(jsonResponse);

  if (!card) {
    return createCardFromPayload(0, payload);
  }

  return card;
}

async function putUserCardWithApi(
  cardId: number,
  request: UserCardRequest,
  token?: string | null,
) {
  const { data: jsonResponse } = await apiClient.request(
    `${userCardsEndpoint}/${cardId}`,
    {
      method: 'PUT',
      body: request,
      token,
    },
  );

  return normalizeUserCardResponse(jsonResponse);
}

async function updateUserCardWithApi(
  userCardId: number,
  payload: UserCardPayload,
  token?: string | null,
) {
  const currentCard = await getUserCardWithApi(userCardId, token);
  const updatedCard = await putUserCardWithApi(
    userCardId,
    createCardRequest(payload, currentCard.blocks.map(getBlockRequest)),
    token,
  );

  return updatedCard ?? createCardFromPayload(userCardId, payload, currentCard.blocks);
}

async function deleteUserCardWithApi(
  userCardId: number,
  token?: string | null,
) {
  await apiClient.request(`${userCardsEndpoint}/${userCardId}`, {
    method: 'DELETE',
    token,
  });
}

function findChangedBlock(
  card: UserCardDto,
  payload: UserCardBlockPayload,
  fallbackId: number,
) {
  return (
    card.blocks.find(
      (block) =>
        block.sortOrder === payload.sortOrder &&
        block.type === payload.type &&
        (block.title ?? '') === (payload.title ?? ''),
    ) ??
    card.blocks.find((block) => block.id === fallbackId) ??
    card.blocks[card.blocks.length - 1]
  );
}

async function createUserCardBlockWithApi(
  userCardId: number,
  payload: UserCardBlockPayload,
  token?: string | null,
): Promise<BlockMutationResult> {
  const currentCard = await getUserCardWithApi(userCardId, token);
  const updatedCard =
    (await putUserCardWithApi(
      userCardId,
      createCardRequest(getCardPayload(currentCard), [
        ...currentCard.blocks.map(getBlockRequest),
        payload,
      ]),
      token,
    )) ??
    createCardFromPayload(userCardId, getCardPayload(currentCard), [
      ...currentCard.blocks,
      {
        ...payload,
        id: 0,
        userCardId,
      },
    ]);
  const block = findChangedBlock(updatedCard, payload, 0);

  if (!block) {
    throw new Error('El servidor no devolvio el block creado.');
  }

  return { block, card: updatedCard };
}

async function updateUserCardBlockWithApi(
  userCardId: number,
  userCardBlockId: number,
  payload: UserCardBlockPayload,
  token?: string | null,
): Promise<BlockMutationResult> {
  const currentCard = await getUserCardWithApi(userCardId, token);
  const updatedBlocks = currentCard.blocks.map((block) =>
    block.id === userCardBlockId
      ? {
          ...getBlockRequest(block),
          ...payload,
          id: userCardBlockId,
        }
      : getBlockRequest(block),
  );
  const updatedCard =
    (await putUserCardWithApi(
      userCardId,
      createCardRequest(getCardPayload(currentCard), updatedBlocks),
      token,
    )) ??
    createCardFromPayload(userCardId, getCardPayload(currentCard), [
      ...currentCard.blocks.filter((block) => block.id !== userCardBlockId),
      {
        ...payload,
        id: userCardBlockId,
        userCardId,
      },
    ]);
  const block = updatedCard.blocks.find(
    (candidate) => candidate.id === userCardBlockId,
  );

  if (!block) {
    throw new Error('El servidor no devolvio el block actualizado.');
  }

  return { block, card: updatedCard };
}

async function deleteUserCardBlockWithApi(
  userCardId: number,
  userCardBlockId: number,
  token?: string | null,
) {
  const currentCard = await getUserCardWithApi(userCardId, token);
  const updatedCard = await putUserCardWithApi(
    userCardId,
    createCardRequest(
      getCardPayload(currentCard),
      currentCard.blocks
        .filter((block) => block.id !== userCardBlockId)
        .map(getBlockRequest),
    ),
    token,
  );

  return (
    updatedCard ??
    createCardFromPayload(
      userCardId,
      getCardPayload(currentCard),
      currentCard.blocks.filter((block) => block.id !== userCardBlockId),
    )
  );
}

export const cardApi = {
  listUserCards(token?: string | null) {
    return isMockUserCardsEnabled
      ? listUserCardsWithMock()
      : listUserCardsWithApi(token);
  },

  getUserCard(cardId: number, token?: string | null) {
    return isMockUserCardsEnabled
      ? getUserCardWithMock(cardId)
      : getUserCardWithApi(cardId, token);
  },

  createUserCard(payload: UserCardPayload, token?: string | null) {
    return isMockUserCardsEnabled
      ? createUserCardWithMock(payload)
      : createUserCardWithApi(payload, token);
  },

  updateUserCard(
    userCardId: number,
    payload: UserCardPayload,
    token?: string | null,
  ) {
    return isMockUserCardsEnabled
      ? updateUserCardWithMock(userCardId, payload)
      : updateUserCardWithApi(userCardId, payload, token);
  },

  deleteUserCard(userCardId: number, token?: string | null) {
    return isMockUserCardsEnabled
      ? deleteUserCardWithMock(userCardId)
      : deleteUserCardWithApi(userCardId, token);
  },

  createUserCardBlock(
    userCardId: number,
    payload: UserCardBlockPayload,
    token?: string | null,
  ) {
    return isMockUserCardsEnabled
      ? createUserCardBlockWithMock(userCardId, payload)
      : createUserCardBlockWithApi(userCardId, payload, token);
  },

  updateUserCardBlock(
    userCardId: number,
    userCardBlockId: number,
    payload: UserCardBlockPayload,
    token?: string | null,
  ) {
    return isMockUserCardsEnabled
      ? updateUserCardBlockWithMock(userCardId, userCardBlockId, payload)
      : updateUserCardBlockWithApi(userCardId, userCardBlockId, payload, token);
  },

  deleteUserCardBlock(
    userCardId: number,
    userCardBlockId: number,
    token?: string | null,
  ) {
    return isMockUserCardsEnabled
      ? deleteUserCardBlockWithMock(userCardId, userCardBlockId)
      : deleteUserCardBlockWithApi(userCardId, userCardBlockId, token);
  },
};
