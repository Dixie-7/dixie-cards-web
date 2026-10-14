import type {
  UserCardBlockDto,
  UserCardDto,
} from '@/features/cards/types/userCard.types';
import type { UserContactDto } from '@/features/contact/types/contact.types';
import type { UserFileDto } from '@/features/files/types/userFile.types';
import type {
  PublicLanguageDto,
  PublicPortfolio,
} from '@/features/public-portfolio/types/publicPortfolio.types';
import type {
  ProjectDisplaySettingsDto,
  ProjectDto,
  ProjectImageDto,
  ProjectStatus,
} from '@/features/projects/types/project.types';
import type { SkillDto } from '@/features/skills/types/skill.types';
import { apiClient, getResponseMessage } from '@/shared/api/apiClient';

const publicPortfoliosEndpoint = '/api/public/portfolios';

export class PublicPortfolioNotFoundError extends Error {
  constructor(username: string) {
    super(`No encontramos un portfolio publico para "${username}".`);
    this.name = 'PublicPortfolioNotFoundError';
  }
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

function readNullableStringFromKeys(
  record: Record<string, unknown>,
  keys: string[],
) {
  for (const key of keys) {
    const value = record[key];

    if (value === null) {
      return null;
    }

    if (typeof value === 'string') {
      return value;
    }
  }

  return undefined;
}

function readTemplate(record: Record<string, unknown>) {
  return readNullableStringFromKeys(record, ['template', 'Template']);
}

function readStyleText(record: Record<string, unknown>) {
  return readNullableStringFromKeys(record, [
    'styleText',
    'StyleText',
    'styletext',
    'Styletext',
    'STYLETEXT',
    'style_text',
    'Style_Text',
  ]);
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

function readProjectStatus(
  record: Record<string, unknown>,
): ProjectStatus | undefined {
  const value = readValue(record, 'status', 'Status');

  if (typeof value === 'number' || typeof value === 'string') {
    return value;
  }

  return undefined;
}

function readArray(record: Record<string, unknown>, camelKey: string) {
  const value = readValue(
    record,
    camelKey,
    camelKey.charAt(0).toUpperCase() + camelKey.slice(1),
  );

  return Array.isArray(value) ? value : [];
}

function normalizeDisplaySettings(
  value: unknown,
  project: Record<string, unknown>,
  projectId: number,
): ProjectDisplaySettingsDto {
  const displaySettings = isRecord(value) ? value : project;

  return {
    id: readNumber(displaySettings, 'id', 'Id') ?? 0,
    projectId,
    showStatusTag:
      readBoolean(displaySettings, 'showStatusTag', 'ShowStatusTag') ?? true,
    showIcons: readBoolean(displaySettings, 'showIcons', 'ShowIcons') ?? true,
    showTechnologies:
      readBoolean(displaySettings, 'showTechnologies', 'ShowTechnologies') ??
      true,
    showProject: readBoolean(displaySettings, 'showProject', 'ShowProject') ?? true,
  };
}

function normalizeProjectImage(
  value: unknown,
  fallbackId: number,
): ProjectImageDto | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const imageUrl = readString(value, 'imageUrl', 'ImageUrl');

  if (!imageUrl) {
    return undefined;
  }

  return {
    id: readNumber(value, 'id', 'Id') ?? fallbackId,
    imageUrl,
    altText: readNullableString(value, 'altText', 'AltText') ?? null,
    sortOrder: readNumber(value, 'sortOrder', 'SortOrder') ?? fallbackId,
    isCover: readBoolean(value, 'isCover', 'IsCover') ?? false,
  };
}

function normalizeProject(
  value: unknown,
  fallbackId: number,
): ProjectDto | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const name = readString(value, 'name', 'Name');
  const status = readProjectStatus(value) ?? 'published';

  if (!name) {
    return undefined;
  }

  const id = readNumber(value, 'id', 'Id') ?? fallbackId;
  const images = readArray(value, 'images')
    .map((image, index) => normalizeProjectImage(image, index + 1))
    .filter((image): image is ProjectImageDto => Boolean(image))
    .sort(
      (currentImage, nextImage) =>
        currentImage.sortOrder - nextImage.sortOrder,
    );

  return {
    id,
    userId: 0,
    name,
    description: readString(value, 'description', 'Description') ?? '',
    technologies: readString(value, 'technologies', 'Technologies') ?? '',
    releaseDate: readNullableString(value, 'releaseDate', 'ReleaseDate') ?? null,
    status,
    collaborators:
      readNullableString(value, 'collaborators', 'Collaborators') ?? null,
    sortOrder: readNumber(value, 'sortOrder', 'SortOrder') ?? fallbackId,
    displaySettings: normalizeDisplaySettings(
      readValue(value, 'displaySettings', 'DisplaySettings'),
      value,
      id,
    ),
    images,
  };
}

function normalizeSkill(
  value: unknown,
  fallbackId: number,
): SkillDto | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const skillName = readString(value, 'skillName', 'SkillName');

  if (!skillName) {
    return undefined;
  }

  return {
    id: readNumber(value, 'id', 'Id') ?? fallbackId,
    userId: 0,
    skillName,
    skillDescription:
      readNullableString(value, 'skillDescription', 'SkillDescription') ?? null,
    skillNote: readNullableString(value, 'skillNote', 'SkillNote') ?? null,
    skillIcon: readNullableString(value, 'skillIcon', 'SkillIcon') ?? null,
    skillColor: readNullableString(value, 'skillColor', 'SkillColor') ?? null,
    sortOrder: readNumber(value, 'sortOrder', 'SortOrder') ?? fallbackId,
  };
}

function normalizeLanguage(
  value: unknown,
  fallbackId: number,
): PublicLanguageDto | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const language = readString(value, 'language', 'Language');

  if (!language) {
    return undefined;
  }

  return {
    id: readNumber(value, 'id', 'Id') ?? fallbackId,
    userId: 0,
    language,
    level: readNullableString(value, 'level', 'Level') ?? null,
    skillPercent: readNumber(value, 'skillPercent', 'SkillPercent') ?? null,
    sortOrder: readNumber(value, 'sortOrder', 'SortOrder') ?? fallbackId,
  };
}

function normalizeCardBlock(
  value: unknown,
  fallbackId: number,
  userCardId: number,
): UserCardBlockDto | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const type = readString(value, 'type', 'Type');

  if (!type) {
    return undefined;
  }

  return {
    id: readNumber(value, 'id', 'Id') ?? fallbackId,
    userCardId,
    type,
    title: readNullableString(value, 'title', 'Title') ?? null,
    content: readNullableString(value, 'content', 'Content') ?? null,
    mediaUrl: readNullableString(value, 'mediaUrl', 'MediaUrl') ?? null,
    icon: readNullableString(value, 'icon', 'Icon') ?? null,
    template: readTemplate(value) ?? null,
    styleText: readStyleText(value) ?? null,
    caption: readNullableString(value, 'caption', 'Caption') ?? null,
    width: readNumber(value, 'width', 'Width') ?? 100,
    sortOrder: readNumber(value, 'sortOrder', 'SortOrder') ?? fallbackId,
  };
}

function normalizeCard(
  value: unknown,
  fallbackId: number,
): UserCardDto | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const title = readString(value, 'title', 'Title');

  if (!title) {
    return undefined;
  }

  const id = readNumber(value, 'id', 'Id') ?? fallbackId;
  const blocks = readArray(value, 'blocks')
    .map((block, index) => normalizeCardBlock(block, index + 1, id))
    .filter((block): block is UserCardBlockDto => Boolean(block))
    .sort(
      (currentBlock, nextBlock) =>
        currentBlock.sortOrder - nextBlock.sortOrder,
    );

  return {
    id,
    userId: 0,
    title,
    description: readNullableString(value, 'description', 'Description') ?? null,
    template: readTemplate(value) ?? null,
    styleText: readStyleText(value) ?? null,
    width: readNumber(value, 'width', 'Width') ?? 100,
    sortOrder: readNumber(value, 'sortOrder', 'SortOrder') ?? fallbackId,
    blocks,
  };
}

function normalizeContact(value: unknown): UserContactDto | null {
  if (value === null || value === undefined || !isRecord(value)) {
    return null;
  }

  return {
    id: readNumber(value, 'id', 'Id') ?? 0,
    userId: 0,
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

function normalizeCv(value: unknown): UserFileDto | null {
  if (typeof value === 'string') {
    return {
      id: 0,
      userId: 0,
      name: 'CV',
      description: null,
      fileUrl: value,
      fileType: 'application/pdf',
      isPrimaryCv: true,
      uploadedAt: '',
    };
  }

  if (value === null || value === undefined || !isRecord(value)) {
    return null;
  }

  const fileUrl =
    readString(value, 'fileUrl', 'FileUrl') ?? readString(value, 'url', 'Url');

  if (!fileUrl) {
    return null;
  }

  return {
    id: readNumber(value, 'id', 'Id') ?? 0,
    userId: 0,
    name: readString(value, 'name', 'Name') ?? 'CV',
    description: readNullableString(value, 'description', 'Description') ?? null,
    fileUrl,
    fileType: readString(value, 'fileType', 'FileType') ?? 'application/pdf',
    isPrimaryCv: readBoolean(value, 'isPrimaryCv', 'IsPrimaryCv') ?? true,
    uploadedAt: readString(value, 'uploadedAt', 'UploadedAt') ?? '',
  };
}

function sortBySortOrder<T extends { sortOrder: number }>(items: T[]) {
  return [...items].sort(
    (currentItem, nextItem) => currentItem.sortOrder - nextItem.sortOrder,
  );
}

function normalizePublicPortfolio(value: unknown): PublicPortfolio | undefined {
  const source = isRecord(value)
    ? value.data ?? value.Data ?? value.portfolio ?? value.Portfolio ?? value
    : value;

  if (!isRecord(source)) {
    return undefined;
  }

  const username = readString(source, 'username', 'Username');

  if (!username) {
    return undefined;
  }

  return {
    username,
    name: readNullableString(source, 'name', 'Name') ?? null,
    lastName: readNullableString(source, 'lastName', 'LastName') ?? null,
    songUrl: readNullableString(source, 'songUrl', 'SongUrl') ?? null,
    projects: sortBySortOrder(
      readArray(source, 'projects')
        .map((project, index) => normalizeProject(project, index + 1))
        .filter((project): project is ProjectDto => Boolean(project)),
    ),
    skills: sortBySortOrder(
      readArray(source, 'skills')
        .map((skill, index) => normalizeSkill(skill, index + 1))
        .filter((skill): skill is SkillDto => Boolean(skill)),
    ),
    languages: sortBySortOrder(
      readArray(source, 'languages')
        .map((language, index) => normalizeLanguage(language, index + 1))
        .filter(
          (language): language is PublicLanguageDto => Boolean(language),
        ),
    ),
    cards: sortBySortOrder(
      readArray(source, 'cards')
        .map((card, index) => normalizeCard(card, index + 1))
        .filter((card): card is UserCardDto => Boolean(card)),
    ),
    contact: normalizeContact(readValue(source, 'contact', 'Contact')),
    cv: normalizeCv(readValue(source, 'cv', 'Cv')),
  };
}

export async function getPublicPortfolio(username: string) {
  const response = await apiClient.request(
    `${publicPortfoliosEndpoint}/${encodeURIComponent(username)}`,
    {
      method: 'GET',
      throwOnHttpError: false,
    },
  );

  if (response.status === 404) {
    throw new PublicPortfolioNotFoundError(username);
  }

  if (!response.ok) {
    throw new Error(
      getResponseMessage(
        response.data,
        `No se pudo cargar el portfolio publico. Estado HTTP ${response.status}.`,
      ),
    );
  }

  const portfolio = normalizePublicPortfolio(response.data);

  if (!portfolio) {
    throw new Error('El servidor devolvio un portfolio publico invalido.');
  }

  return portfolio;
}
