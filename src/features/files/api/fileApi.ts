import { userFilesMock } from '@/features/files/mocks/userFiles.mock';
import type {
  UserFileDto,
  UserFilePayload,
} from '@/features/files/types/userFile.types';
import { apiClient, isMockEnabled } from '@/shared/api/apiClient';

const userFilesEndpoint =
  import.meta.env.VITE_USER_FILES_ENDPOINT?.trim() || '/api/user-files';

export const isMockUserFilesEnabled =
  isMockEnabled('VITE_USE_MOCK_USER_FILES');

const userFilesStore: UserFileDto[] = cloneUserFiles(userFilesMock);

function cloneUserFiles(files: UserFileDto[]) {
  return files.map((file) => ({ ...file }));
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

function readBoolean(
  record: Record<string, unknown>,
  camelKey: string,
  pascalKey: string,
) {
  const value = readValue(record, camelKey, pascalKey);

  return typeof value === 'boolean' ? value : undefined;
}

function normalizeUserFile(value: unknown): UserFileDto | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const id = readNumber(value, 'id', 'Id');
  const userId = readNumber(value, 'userId', 'UserId');
  const name = readString(value, 'name', 'Name');
  const fileUrl = readString(value, 'fileUrl', 'FileUrl');
  const fileType = readString(value, 'fileType', 'FileType');
  const uploadedAt = readString(value, 'uploadedAt', 'UploadedAt');

  if (
    id === undefined ||
    userId === undefined ||
    !name ||
    !fileUrl ||
    !fileType ||
    !uploadedAt
  ) {
    return undefined;
  }

  return {
    id,
    userId,
    name,
    description: readNullableString(value, 'description', 'Description') ?? null,
    fileUrl,
    fileType,
    isPrimaryCv: readBoolean(value, 'isPrimaryCv', 'IsPrimaryCv') ?? false,
    uploadedAt,
  };
}

function normalizeUserFileCollection(value: unknown): UserFileDto[] | undefined {
  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeUserFile(item))
      .filter((file): file is UserFileDto => Boolean(file));
  }

  if (!isRecord(value)) {
    return undefined;
  }

  const nestedValue =
    value.data ?? value.Data ?? value.items ?? value.Items ?? value.files;

  return normalizeUserFileCollection(nestedValue);
}

async function simulateUserFilesLatency() {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 220);
  });
}

async function listUserFilesWithMock() {
  await simulateUserFilesLatency();

  return cloneUserFiles(userFilesStore);
}

async function listUserFilesWithApi(token?: string | null) {
  const { data: jsonResponse } = await apiClient.request(userFilesEndpoint, {
    method: 'GET',
    fallbackErrorMessage: 'No se pudieron cargar los archivos.',
    token,
  });

  const files = normalizeUserFileCollection(jsonResponse);

  if (!files) {
    throw new Error('El servidor devolvio una lista de archivos invalida.');
  }

  return files;
}

async function getUserFileWithApi(fileId: number, token?: string | null) {
  const { data: jsonResponse } = await apiClient.request(
    `${userFilesEndpoint}/${fileId}`,
    {
      method: 'GET',
      fallbackErrorMessage: 'No se pudo cargar el archivo.',
      token,
    },
  );
  const file =
    normalizeUserFile(jsonResponse) ??
    (isRecord(jsonResponse)
      ? normalizeUserFile(jsonResponse.data ?? jsonResponse.Data)
      : undefined);

  if (!file) {
    throw new Error('El servidor devolvio un archivo invalido.');
  }

  return file;
}

async function createUserFileWithApi(
  payload: UserFilePayload,
  token?: string | null,
) {
  const { data: jsonResponse } = await apiClient.request(userFilesEndpoint, {
    method: 'POST',
    body: payload,
    fallbackErrorMessage: 'No se pudo crear el archivo.',
    token,
  });
  const file =
    normalizeUserFile(jsonResponse) ??
    (isRecord(jsonResponse)
      ? normalizeUserFile(jsonResponse.data ?? jsonResponse.Data)
      : undefined);

  if (!file) {
    throw new Error('El servidor devolvio un archivo creado invalido.');
  }

  return file;
}

async function updateUserFileWithApi(
  fileId: number,
  payload: UserFilePayload,
  token?: string | null,
) {
  const { data: jsonResponse } = await apiClient.request(
    `${userFilesEndpoint}/${fileId}`,
    {
      method: 'PUT',
      body: payload,
      fallbackErrorMessage: 'No se pudo actualizar el archivo.',
      token,
    },
  );
  const file =
    normalizeUserFile(jsonResponse) ??
    (isRecord(jsonResponse)
      ? normalizeUserFile(jsonResponse.data ?? jsonResponse.Data)
      : undefined);

  if (!file) {
    return {
      ...payload,
      id: fileId,
      userId: 0,
      uploadedAt: new Date().toISOString(),
    };
  }

  return file;
}

async function deleteUserFileWithApi(fileId: number, token?: string | null) {
  await apiClient.request(`${userFilesEndpoint}/${fileId}`, {
    method: 'DELETE',
    fallbackErrorMessage: 'No se pudo eliminar el archivo.',
    token,
  });
}

export function isImageUserFile(file: UserFileDto) {
  const normalizedType = file.fileType.trim().toLowerCase();
  const normalizedUrl = file.fileUrl.trim().toLowerCase();

  return (
    !file.isPrimaryCv &&
    (normalizedType.startsWith('image/') ||
      /\.(avif|gif|jpe?g|png|svg|webp)(?:\?.*)?$/.test(normalizedUrl))
  );
}

export const fileApi = {
  listUserFiles(token?: string | null) {
    return isMockUserFilesEnabled
      ? listUserFilesWithMock()
      : listUserFilesWithApi(token);
  },

  getUserFile(fileId: number, token?: string | null) {
    if (isMockUserFilesEnabled) {
      const file = userFilesStore.find((candidate) => candidate.id === fileId);

      if (!file) {
        throw new Error('UserFile not found');
      }

      return Promise.resolve({ ...file });
    }

    return getUserFileWithApi(fileId, token);
  },

  createUserFile(payload: UserFilePayload, token?: string | null) {
    if (isMockUserFilesEnabled) {
      throw new Error('User file creation is not implemented in mock mode.');
    }

    return createUserFileWithApi(payload, token);
  },

  updateUserFile(
    fileId: number,
    payload: UserFilePayload,
    token?: string | null,
  ) {
    if (isMockUserFilesEnabled) {
      throw new Error('User file update is not implemented in mock mode.');
    }

    return updateUserFileWithApi(fileId, payload, token);
  },

  deleteUserFile(fileId: number, token?: string | null) {
    if (isMockUserFilesEnabled) {
      throw new Error('User file deletion is not implemented in mock mode.');
    }

    return deleteUserFileWithApi(fileId, token);
  },
};
