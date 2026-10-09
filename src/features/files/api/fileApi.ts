import { userFilesMock } from '@/features/files/mocks/userFiles.mock';
import type { UserFileDto } from '@/features/files/types/userFile.types';
import { apiClient, hasApiBaseUrl } from '@/shared/api/apiClient';

const userFilesEndpoint =
  import.meta.env.VITE_USER_FILES_ENDPOINT?.trim() || '/api/userfiles';

export const isMockUserFilesEnabled =
  import.meta.env.VITE_USE_MOCK_USER_FILES !== 'false' ||
  !hasApiBaseUrl;

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
};
