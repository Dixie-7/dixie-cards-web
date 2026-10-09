import { userConfigMock } from '@/mocks/userConfig.mock';
import {
  defaultUserConfigPayload,
  type UserConfigDto,
  type UserConfigPayload,
} from '@/types/userConfig';

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '')
  .trim()
  .replace(/\/$/, '');
const userConfigEndpoint =
  import.meta.env.VITE_USER_CONFIG_ENDPOINT?.trim() || '/api/userconfig';

export const isMockUserConfigEnabled =
  import.meta.env.VITE_USE_MOCK_USER_CONFIG !== 'false' ||
  apiBaseUrl.length === 0;

let userConfigStore: UserConfigDto = cloneConfig(userConfigMock);

export function createDefaultUserConfig(userId = 7): UserConfigDto {
  return {
    id: 0,
    userId,
    ...defaultUserConfigPayload,
  };
}

function cloneConfig(config: UserConfigDto) {
  return { ...config };
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

function readBoolean(
  record: Record<string, unknown>,
  camelKey: string,
  pascalKey: string,
) {
  const value = readValue(record, camelKey, pascalKey);

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalizedValue = value.trim().toLowerCase();

    if (normalizedValue === 'true') {
      return true;
    }

    if (normalizedValue === 'false') {
      return false;
    }
  }

  return undefined;
}

function normalizeUserConfig(
  value: unknown,
  userIdFallback: number,
): UserConfigDto | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  return {
    id: readNumber(value, 'id', 'Id') ?? 0,
    userId: readNumber(value, 'userId', 'UserId') ?? userIdFallback,
    showProjectsSection:
      readBoolean(value, 'showProjectsSection', 'ShowProjectsSection') ??
      defaultUserConfigPayload.showProjectsSection,
    showSkillsSection:
      readBoolean(value, 'showSkillsSection', 'ShowSkillsSection') ??
      defaultUserConfigPayload.showSkillsSection,
    showLanguagesSection:
      readBoolean(value, 'showLanguagesSection', 'ShowLanguagesSection') ??
      defaultUserConfigPayload.showLanguagesSection,
    showContactSection:
      readBoolean(value, 'showContactSection', 'ShowContactSection') ??
      defaultUserConfigPayload.showContactSection,
    showCardsSection:
      readBoolean(value, 'showCardsSection', 'ShowCardsSection') ??
      defaultUserConfigPayload.showCardsSection,
    showCv:
      readBoolean(value, 'showCv', 'ShowCv') ??
      defaultUserConfigPayload.showCv,
    showEmail:
      readBoolean(value, 'showEmail', 'ShowEmail') ??
      defaultUserConfigPayload.showEmail,
    showAltEmail:
      readBoolean(value, 'showAltEmail', 'ShowAltEmail') ??
      defaultUserConfigPayload.showAltEmail,
    showPhone:
      readBoolean(value, 'showPhone', 'ShowPhone') ??
      defaultUserConfigPayload.showPhone,
    showAltPhone:
      readBoolean(value, 'showAltPhone', 'ShowAltPhone') ??
      defaultUserConfigPayload.showAltPhone,
    showInstagram:
      readBoolean(value, 'showInstagram', 'ShowInstagram') ??
      defaultUserConfigPayload.showInstagram,
    showGitHub:
      readBoolean(value, 'showGitHub', 'ShowGitHub') ??
      defaultUserConfigPayload.showGitHub,
    showFacebook:
      readBoolean(value, 'showFacebook', 'ShowFacebook') ??
      defaultUserConfigPayload.showFacebook,
    showLinkedIn:
      readBoolean(value, 'showLinkedIn', 'ShowLinkedIn') ??
      defaultUserConfigPayload.showLinkedIn,
    showWebsite:
      readBoolean(value, 'showWebsite', 'ShowWebsite') ??
      defaultUserConfigPayload.showWebsite,
    showLanguagePercent:
      readBoolean(value, 'showLanguagePercent', 'ShowLanguagePercent') ??
      defaultUserConfigPayload.showLanguagePercent,
    showLanguageLevel:
      readBoolean(value, 'showLanguageLevel', 'ShowLanguageLevel') ??
      defaultUserConfigPayload.showLanguageLevel,
  };
}

function normalizeUserConfigResponse(
  value: unknown,
  userIdFallback: number,
) {
  const config = normalizeUserConfig(value, userIdFallback);

  if (config) {
    return config;
  }

  if (!isRecord(value)) {
    return undefined;
  }

  const nestedValue =
    value.data ??
    value.Data ??
    value.config ??
    value.Config ??
    value.userConfig ??
    value.UserConfig;

  return normalizeUserConfig(nestedValue, userIdFallback);
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

async function requestUserConfig(
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

function createUserConfigFromPayload(
  id: number,
  userId: number,
  payload: UserConfigPayload,
): UserConfigDto {
  return {
    id,
    userId,
    ...payload,
  };
}

async function simulateUserConfigLatency() {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 220);
  });
}

async function getUserConfigWithMock(userId: number) {
  await simulateUserConfigLatency();

  return {
    ...cloneConfig(userConfigStore),
    userId,
  };
}

async function updateUserConfigWithMock(
  configId: number,
  payload: UserConfigPayload,
  userId: number,
) {
  await simulateUserConfigLatency();

  const nextId = configId > 0 ? configId : userConfigStore.id || 1;

  userConfigStore = createUserConfigFromPayload(nextId, userId, payload);

  return cloneConfig(userConfigStore);
}

async function getUserConfigWithApi(token?: string | null, userId = 7) {
  const response = await fetch(getApiUrl(userConfigEndpoint), {
    method: 'GET',
    headers: getHeaders(token),
  });
  const jsonResponse = await readJsonResponse(response);

  if (response.status === 404) {
    return createDefaultUserConfig(userId);
  }

  if (!response.ok) {
    throw new Error(
      getResponseMessage(
        jsonResponse,
        `No se pudo cargar la configuracion. Estado HTTP ${response.status}.`,
      ),
    );
  }

  const config = normalizeUserConfigResponse(jsonResponse, userId);

  if (!config) {
    throw new Error('El servidor devolvio una configuracion invalida.');
  }

  return config;
}

async function updateUserConfigWithApi(
  configId: number,
  payload: UserConfigPayload,
  token?: string | null,
  userId = 7,
) {
  const path =
    configId > 0 ? `${userConfigEndpoint}/${configId}` : userConfigEndpoint;
  const jsonResponse = await requestUserConfig(
    path,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
    token,
  );
  const config = normalizeUserConfigResponse(jsonResponse, userId);

  if (!config) {
    return createUserConfigFromPayload(configId, userId, payload);
  }

  return config;
}

export const userConfigApi = {
  getUserConfig(token?: string | null, userId = 7) {
    return isMockUserConfigEnabled
      ? getUserConfigWithMock(userId)
      : getUserConfigWithApi(token, userId);
  },

  updateUserConfig(
    configId: number,
    payload: UserConfigPayload,
    token?: string | null,
    userId = 7,
  ) {
    return isMockUserConfigEnabled
      ? updateUserConfigWithMock(configId, payload, userId)
      : updateUserConfigWithApi(configId, payload, token, userId);
  },
};
