import { userContactMock } from '@/features/contact/mocks/contact.mock';
import type { UserContactDto, UserContactPayload } from '@/features/contact/types/contact.types';
import {
  apiClient,
  getResponseMessage,
  hasApiBaseUrl,
} from '@/shared/api/apiClient';

const userContactEndpoint =
  import.meta.env.VITE_USER_CONTACT_ENDPOINT?.trim() || '/api/usercontact';

export const isMockUserContactEnabled =
  import.meta.env.VITE_USE_MOCK_USER_CONTACT !== 'false' ||
  !hasApiBaseUrl;

let userContactStore: UserContactDto | null = cloneContact(userContactMock);

function cloneContact(contact: UserContactDto | null) {
  return contact ? { ...contact } : null;
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

function normalizeUserContact(
  value: unknown,
): UserContactDto | null | undefined {
  if (value === null) {
    return null;
  }

  if (!isRecord(value)) {
    return undefined;
  }

  const id = readNumber(value, 'id', 'Id');
  const userId = readNumber(value, 'userId', 'UserId');

  if (id === undefined || userId === undefined) {
    return undefined;
  }

  return {
    id,
    userId,
    publicEmail:
      readNullableString(value, 'publicEmail', 'PublicEmail') ?? null,
    altEmail: readNullableString(value, 'altEmail', 'AltEmail') ?? null,
    phone: readNullableString(value, 'phone', 'Phone') ?? null,
    altPhone: readNullableString(value, 'altPhone', 'AltPhone') ?? null,
    site: readNullableString(value, 'site', 'Site') ?? null,
    instagram: readNullableString(value, 'instagram', 'Instagram') ?? null,
    gitHub: readNullableString(value, 'gitHub', 'GitHub') ?? null,
    facebook: readNullableString(value, 'facebook', 'Facebook') ?? null,
    linkedIn: readNullableString(value, 'linkedIn', 'LinkedIn') ?? null,
  };
}

function normalizeUserContactResponse(
  value: unknown,
): UserContactDto | null | undefined {
  const contact = normalizeUserContact(value);

  if (contact !== undefined) {
    return contact;
  }

  if (!isRecord(value)) {
    return undefined;
  }

  const nestedValue =
    value.data ??
    value.Data ??
    value.contact ??
    value.Contact ??
    value.userContact ??
    value.UserContact;

  return normalizeUserContact(nestedValue);
}

function createContactFromPayload(
  id: number,
  userId: number,
  payload: UserContactPayload,
): UserContactDto {
  return {
    id,
    userId,
    publicEmail: payload.publicEmail ?? null,
    altEmail: payload.altEmail ?? null,
    phone: payload.phone ?? null,
    altPhone: payload.altPhone ?? null,
    site: payload.site ?? null,
    instagram: payload.instagram ?? null,
    gitHub: payload.gitHub ?? null,
    facebook: payload.facebook ?? null,
    linkedIn: payload.linkedIn ?? null,
  };
}

async function simulateUserContactLatency() {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 220);
  });
}

async function getUserContactWithMock() {
  await simulateUserContactLatency();

  return cloneContact(userContactStore);
}

async function createUserContactWithMock(
  payload: UserContactPayload,
  userId: number,
) {
  await simulateUserContactLatency();

  const nextId = (userContactStore?.id ?? 0) + 1;
  const createdContact = createContactFromPayload(nextId, userId, payload);

  userContactStore = createdContact;

  return cloneContact(createdContact) as UserContactDto;
}

async function updateUserContactWithMock(
  contactId: number,
  payload: UserContactPayload,
  userId: number,
) {
  await simulateUserContactLatency();

  if (!userContactStore || userContactStore.id !== contactId) {
    throw new Error('UserContact not found');
  }

  userContactStore = createContactFromPayload(contactId, userId, payload);

  return cloneContact(userContactStore) as UserContactDto;
}

async function deleteUserContactWithMock(contactId: number) {
  await simulateUserContactLatency();

  if (userContactStore?.id === contactId) {
    userContactStore = null;
  }
}

async function getUserContactWithApi(token?: string | null) {
  const response = await apiClient.request(userContactEndpoint, {
    method: 'GET',
    token,
    throwOnHttpError: false,
  });
  const jsonResponse = response.data;

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      getResponseMessage(
        jsonResponse,
        `No se pudo cargar el contacto. Estado HTTP ${response.status}.`,
      ),
    );
  }

  const contact = normalizeUserContactResponse(jsonResponse);

  if (contact === undefined) {
    throw new Error('El servidor devolvio un contacto invalido.');
  }

  return contact;
}

async function createUserContactWithApi(
  payload: UserContactPayload,
  token?: string | null,
  userId = 0,
) {
  const { data: jsonResponse } = await apiClient.request(userContactEndpoint, {
    method: 'POST',
    body: payload,
    token,
  });
  const contact = normalizeUserContactResponse(jsonResponse);

  if (contact === undefined || contact === null) {
    return createContactFromPayload(0, userId, payload);
  }

  return contact;
}

async function updateUserContactWithApi(
  contactId: number,
  payload: UserContactPayload,
  token?: string | null,
  userId = 0,
) {
  const { data: jsonResponse } = await apiClient.request(
    `${userContactEndpoint}/${contactId}`,
    {
      method: 'PUT',
      body: payload,
      token,
    },
  );
  const contact = normalizeUserContactResponse(jsonResponse);

  if (contact === undefined || contact === null) {
    return createContactFromPayload(contactId, userId, payload);
  }

  return contact;
}

async function deleteUserContactWithApi(
  contactId: number,
  token?: string | null,
) {
  await apiClient.request(`${userContactEndpoint}/${contactId}`, {
    method: 'DELETE',
    token,
  });
}

export const contactApi = {
  getUserContact(token?: string | null) {
    return isMockUserContactEnabled
      ? getUserContactWithMock()
      : getUserContactWithApi(token);
  },

  createUserContact(
    payload: UserContactPayload,
    token?: string | null,
    userId = 0,
  ) {
    return isMockUserContactEnabled
      ? createUserContactWithMock(payload, userId)
      : createUserContactWithApi(payload, token, userId);
  },

  updateUserContact(
    contactId: number,
    payload: UserContactPayload,
    token?: string | null,
    userId = 0,
  ) {
    return isMockUserContactEnabled
      ? updateUserContactWithMock(contactId, payload, userId)
      : updateUserContactWithApi(contactId, payload, token, userId);
  },

  deleteUserContact(contactId: number, token?: string | null) {
    return isMockUserContactEnabled
      ? deleteUserContactWithMock(contactId)
      : deleteUserContactWithApi(contactId, token);
  },
};
