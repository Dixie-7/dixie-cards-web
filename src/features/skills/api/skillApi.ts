import { skillsMock } from '@/features/skills/mocks/skills.mock';
import type { SkillDto, SkillPayload } from '@/features/skills/types/skill.types';
import { apiClient, hasApiBaseUrl } from '@/shared/api/apiClient';

const skillsEndpoint =
  import.meta.env.VITE_SKILLS_ENDPOINT?.trim() || '/api/skills';

export const isMockSkillsEnabled =
  import.meta.env.VITE_USE_MOCK_SKILLS !== 'false' || !hasApiBaseUrl;

let skillsStore: SkillDto[] = cloneSkills(skillsMock);

function cloneSkills(skills: SkillDto[]) {
  return skills.map((skill) => ({ ...skill }));
}

function sortSkills(skills: SkillDto[]) {
  return [...skills].sort(
    (currentSkill, nextSkill) => currentSkill.sortOrder - nextSkill.sortOrder,
  );
}

function getNextSkillId() {
  return Math.max(0, ...skillsStore.map((skill) => skill.id)) + 1;
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

function normalizeSkill(value: unknown): SkillDto | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const id = readNumber(value, 'id', 'Id');
  const userId = readNumber(value, 'userId', 'UserId');
  const skillName = readString(value, 'skillName', 'SkillName');
  const sortOrder = readNumber(value, 'sortOrder', 'SortOrder') ?? 0;

  if (id === undefined || userId === undefined || !skillName) {
    return undefined;
  }

  return {
    id,
    userId,
    skillName,
    skillDescription:
      readNullableString(value, 'skillDescription', 'SkillDescription') ?? null,
    skillNote: readNullableString(value, 'skillNote', 'SkillNote') ?? null,
    skillIcon: readNullableString(value, 'skillIcon', 'SkillIcon') ?? null,
    skillColor: readNullableString(value, 'skillColor', 'SkillColor') ?? null,
    sortOrder,
  };
}

function normalizeSkillCollection(value: unknown): SkillDto[] | undefined {
  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeSkill(item))
      .filter((skill): skill is SkillDto => Boolean(skill));
  }

  if (!isRecord(value)) {
    return undefined;
  }

  const nestedValue =
    value.data ?? value.Data ?? value.items ?? value.Items ?? value.skills;

  return normalizeSkillCollection(nestedValue);
}

function createSkillFromPayload(
  id: number,
  userId: number,
  payload: SkillPayload,
): SkillDto {
  return {
    id,
    userId,
    skillName: payload.skillName,
    skillDescription: payload.skillDescription ?? null,
    skillNote: payload.skillNote ?? null,
    skillIcon: payload.skillIcon ?? null,
    skillColor: payload.skillColor ?? null,
    sortOrder: payload.sortOrder,
  };
}

async function simulateSkillsLatency() {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 220);
  });
}

async function listSkillsWithMock() {
  await simulateSkillsLatency();

  return sortSkills(cloneSkills(skillsStore));
}

async function createSkillWithMock(payload: SkillPayload, userId: number) {
  await simulateSkillsLatency();

  const createdSkill = createSkillFromPayload(getNextSkillId(), userId, payload);

  skillsStore = sortSkills([...skillsStore, createdSkill]);

  return cloneSkills([createdSkill])[0];
}

async function updateSkillWithMock(
  skillId: number,
  payload: SkillPayload,
  userId: number,
) {
  await simulateSkillsLatency();

  let updatedSkill: SkillDto | undefined;

  skillsStore = sortSkills(
    skillsStore.map((skill) => {
      if (skill.id !== skillId) {
        return skill;
      }

      updatedSkill = createSkillFromPayload(skillId, userId, payload);

      return updatedSkill;
    }),
  );

  if (!updatedSkill) {
    throw new Error('Skill not found');
  }

  return cloneSkills([updatedSkill])[0];
}

async function deleteSkillWithMock(skillId: number) {
  await simulateSkillsLatency();

  skillsStore = skillsStore.filter((skill) => skill.id !== skillId);
}

async function listSkillsWithApi(token?: string | null) {
  const { data: jsonResponse } = await apiClient.request(skillsEndpoint, {
    method: 'GET',
    token,
  });
  const skills = normalizeSkillCollection(jsonResponse);

  if (!skills) {
    throw new Error('El servidor devolvio una lista de skills invalida.');
  }

  return sortSkills(skills);
}

async function createSkillWithApi(
  payload: SkillPayload,
  token?: string | null,
  userId = 0,
) {
  const { data: jsonResponse } = await apiClient.request(skillsEndpoint, {
    method: 'POST',
    body: payload,
    token,
  });
  const skill =
    normalizeSkill(jsonResponse) ??
    (isRecord(jsonResponse)
      ? normalizeSkill(jsonResponse.data ?? jsonResponse.Data)
      : undefined);

  if (!skill) {
    return createSkillFromPayload(0, userId, payload);
  }

  return skill;
}

async function updateSkillWithApi(
  skillId: number,
  payload: SkillPayload,
  token?: string | null,
  userId = 0,
) {
  const { data: jsonResponse } = await apiClient.request(
    `${skillsEndpoint}/${skillId}`,
    {
      method: 'PUT',
      body: payload,
      token,
    },
  );
  const skill =
    normalizeSkill(jsonResponse) ??
    (isRecord(jsonResponse)
      ? normalizeSkill(jsonResponse.data ?? jsonResponse.Data)
      : undefined);

  if (!skill) {
    return createSkillFromPayload(skillId, userId, payload);
  }

  return skill;
}

async function deleteSkillWithApi(skillId: number, token?: string | null) {
  await apiClient.request(`${skillsEndpoint}/${skillId}`, {
    method: 'DELETE',
    token,
  });
}

export const skillApi = {
  listSkills(token?: string | null) {
    return isMockSkillsEnabled ? listSkillsWithMock() : listSkillsWithApi(token);
  },

  createSkill(
    payload: SkillPayload,
    token?: string | null,
    userId = 0,
  ) {
    return isMockSkillsEnabled
      ? createSkillWithMock(payload, userId)
      : createSkillWithApi(payload, token, userId);
  },

  updateSkill(
    skillId: number,
    payload: SkillPayload,
    token?: string | null,
    userId = 0,
  ) {
    return isMockSkillsEnabled
      ? updateSkillWithMock(skillId, payload, userId)
      : updateSkillWithApi(skillId, payload, token, userId);
  },

  deleteSkill(skillId: number, token?: string | null) {
    return isMockSkillsEnabled
      ? deleteSkillWithMock(skillId)
      : deleteSkillWithApi(skillId, token);
  },
};
