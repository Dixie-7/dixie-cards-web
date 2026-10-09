import { userLanguagesMock } from '@/mocks/userLanguages.mock';
import type {
  UserLanguageDto,
  UserLanguagePayload,
} from '@/types/userLanguages';

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '')
  .trim()
  .replace(/\/$/, '');
const userLanguagesEndpoint =
  import.meta.env.VITE_USER_LANGUAGES_ENDPOINT?.trim() ||
  '/api/userlanguages';

export const isMockUserLanguagesEnabled =
  import.meta.env.VITE_USE_MOCK_USER_LANGUAGES !== 'false' ||
  apiBaseUrl.length === 0;

let userLanguagesStore: UserLanguageDto[] = cloneLanguages(userLanguagesMock);

function cloneLanguages(languages: UserLanguageDto[]) {
  return languages.map((language) => ({ ...language }));
}

function sortLanguages(languages: UserLanguageDto[]) {
  return [...languages].sort(
    (currentLanguage, nextLanguage) =>
      currentLanguage.sortOrder - nextLanguage.sortOrder,
  );
}

function getNextLanguageId() {
  return Math.max(0, ...userLanguagesStore.map((language) => language.id)) + 1;
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

function normalizeUserLanguage(value: unknown): UserLanguageDto | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const id = readNumber(value, 'id', 'Id');
  const userId = readNumber(value, 'userId', 'UserId');
  const language = readString(value, 'language', 'Language');
  const level = readString(value, 'level', 'Level');
  const skillPercent = readNumber(value, 'skillPercent', 'SkillPercent');
  const sortOrder = readNumber(value, 'sortOrder', 'SortOrder') ?? 0;

  if (
    id === undefined ||
    userId === undefined ||
    !language ||
    !level ||
    skillPercent === undefined
  ) {
    return undefined;
  }

  return {
    id,
    userId,
    language,
    level,
    skillPercent,
    sortOrder,
  };
}

function normalizeUserLanguageCollection(
  value: unknown,
): UserLanguageDto[] | undefined {
  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeUserLanguage(item))
      .filter((language): language is UserLanguageDto => Boolean(language));
  }

  if (!isRecord(value)) {
    return undefined;
  }

  const nestedValue =
    value.data ??
    value.Data ??
    value.items ??
    value.Items ??
    value.languages ??
    value.userLanguages;

  return normalizeUserLanguageCollection(nestedValue);
}

async function readJsonResponse(response: Response) {
  const text = await response.text();

  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
}

function getApiUrl(path: string) {
  return `${apiBaseUrl}${path}`;
}

function getHeaders(token?: string | null) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function getResponseMessage(value: unknown, fallback: string) {
  if (!isRecord(value)) {
    return fallback;
  }

  return readString(value, 'message', 'Message') ?? fallback;
}

async function requestUserLanguage(
  path: string,
  init: RequestInit,
  token?: string | null,
) {
  const response = await fetch(getApiUrl(path), {
    ...init,
    headers: {
      ...getHeaders(token),
      ...init.headers,
    },
  });
  const jsonResponse = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(
      getResponseMessage(
        jsonResponse,
        `No se pudo completar la operacion. Estado HTTP ${response.status}.`,
      ),
    );
  }

  return jsonResponse;
}

function createUserLanguageFromPayload(
  id: number,
  userId: number,
  payload: UserLanguagePayload,
): UserLanguageDto {
  return {
    id,
    userId,
    language: payload.language,
    level: payload.level,
    skillPercent: payload.skillPercent,
    sortOrder: payload.sortOrder,
  };
}

async function simulateUserLanguagesLatency() {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 220);
  });
}

async function listUserLanguagesWithMock() {
  await simulateUserLanguagesLatency();

  return sortLanguages(cloneLanguages(userLanguagesStore));
}

async function createUserLanguageWithMock(
  payload: UserLanguagePayload,
  userId: number,
) {
  await simulateUserLanguagesLatency();

  const createdLanguage = createUserLanguageFromPayload(
    getNextLanguageId(),
    userId,
    payload,
  );

  userLanguagesStore = sortLanguages([...userLanguagesStore, createdLanguage]);

  return cloneLanguages([createdLanguage])[0];
}

async function updateUserLanguageWithMock(
  languageId: number,
  payload: UserLanguagePayload,
  userId: number,
) {
  await simulateUserLanguagesLatency();

  let updatedLanguage: UserLanguageDto | undefined;

  userLanguagesStore = sortLanguages(
    userLanguagesStore.map((language) => {
      if (language.id !== languageId) {
        return language;
      }

      updatedLanguage = createUserLanguageFromPayload(
        languageId,
        userId,
        payload,
      );

      return updatedLanguage;
    }),
  );

  if (!updatedLanguage) {
    throw new Error('UserLanguage not found');
  }

  return cloneLanguages([updatedLanguage])[0];
}

async function deleteUserLanguageWithMock(languageId: number) {
  await simulateUserLanguagesLatency();

  userLanguagesStore = userLanguagesStore.filter(
    (language) => language.id !== languageId,
  );
}

async function listUserLanguagesWithApi(token?: string | null) {
  const jsonResponse = await requestUserLanguage(
    userLanguagesEndpoint,
    { method: 'GET' },
    token,
  );
  const languages = normalizeUserLanguageCollection(jsonResponse);

  if (!languages) {
    throw new Error('El servidor devolvio una lista de lenguajes invalida.');
  }

  return sortLanguages(languages);
}

async function createUserLanguageWithApi(
  payload: UserLanguagePayload,
  token?: string | null,
  userId = 0,
) {
  const jsonResponse = await requestUserLanguage(
    userLanguagesEndpoint,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    token,
  );
  const language =
    normalizeUserLanguage(jsonResponse) ??
    (isRecord(jsonResponse)
      ? normalizeUserLanguage(jsonResponse.data ?? jsonResponse.Data)
      : undefined);

  if (!language) {
    return createUserLanguageFromPayload(0, userId, payload);
  }

  return language;
}

async function updateUserLanguageWithApi(
  languageId: number,
  payload: UserLanguagePayload,
  token?: string | null,
  userId = 0,
) {
  const jsonResponse = await requestUserLanguage(
    `${userLanguagesEndpoint}/${languageId}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
    token,
  );
  const language =
    normalizeUserLanguage(jsonResponse) ??
    (isRecord(jsonResponse)
      ? normalizeUserLanguage(jsonResponse.data ?? jsonResponse.Data)
      : undefined);

  if (!language) {
    return createUserLanguageFromPayload(languageId, userId, payload);
  }

  return language;
}

async function deleteUserLanguageWithApi(
  languageId: number,
  token?: string | null,
) {
  await requestUserLanguage(
    `${userLanguagesEndpoint}/${languageId}`,
    { method: 'DELETE' },
    token,
  );
}

export const userLanguagesApi = {
  listUserLanguages(token?: string | null) {
    return isMockUserLanguagesEnabled
      ? listUserLanguagesWithMock()
      : listUserLanguagesWithApi(token);
  },

  createUserLanguage(
    payload: UserLanguagePayload,
    token?: string | null,
    userId = 0,
  ) {
    return isMockUserLanguagesEnabled
      ? createUserLanguageWithMock(payload, userId)
      : createUserLanguageWithApi(payload, token, userId);
  },

  updateUserLanguage(
    languageId: number,
    payload: UserLanguagePayload,
    token?: string | null,
    userId = 0,
  ) {
    return isMockUserLanguagesEnabled
      ? updateUserLanguageWithMock(languageId, payload, userId)
      : updateUserLanguageWithApi(languageId, payload, token, userId);
  },

  deleteUserLanguage(languageId: number, token?: string | null) {
    return isMockUserLanguagesEnabled
      ? deleteUserLanguageWithMock(languageId)
      : deleteUserLanguageWithApi(languageId, token);
  },
};
