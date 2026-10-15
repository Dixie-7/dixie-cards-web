import {
  defaultUserParticlesConfig,
  type UserParticleDirection,
  type UserParticleHoverMode,
  type UserParticlesConfig,
  type UserParticleShape,
} from '@/features/user-config/types/userConfig.types';

const hexColorPattern = /^#[0-9a-fA-F]{6}$/;
const shapes = new Set<UserParticleShape>([
  'circle',
  'square',
  'triangle',
  'star',
  'basic',
]);
const directions = new Set<UserParticleDirection>([
  'none',
  'top',
  'bottom',
  'left',
  'right',
]);
const hoverModes = new Set<UserParticleHoverMode>([
  'repulse',
  'grab',
  'bubble',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readValue(record: Record<string, unknown>, key: string) {
  return record[key] ?? record[key.charAt(0).toUpperCase() + key.slice(1)];
}

function readBoolean(record: Record<string, unknown>, key: string) {
  const value = readValue(record, key);

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }

  return undefined;
}

function readNumber(record: Record<string, unknown>, key: string) {
  const value = readValue(record, key);

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : undefined;
  }

  return undefined;
}

function readString(record: Record<string, unknown>, key: string) {
  const value = readValue(record, key);
  return typeof value === 'string' ? value : undefined;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function cloneParticlesConfig(
  config: UserParticlesConfig,
): UserParticlesConfig {
  return { ...config };
}

export function normalizeUserParticlesConfig(
  value: unknown,
): UserParticlesConfig | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'string') {
    try {
      return normalizeUserParticlesConfig(JSON.parse(value));
    } catch {
      return null;
    }
  }

  if (!isRecord(value)) {
    return null;
  }

  const shapeValue = readString(value, 'shape') as UserParticleShape | undefined;
  const directionValue = readString(value, 'direction') as
    | UserParticleDirection
    | undefined;
  const hoverModeValue = readString(value, 'hoverMode') as
    | UserParticleHoverMode
    | undefined;
  const colorValue = readString(value, 'color');
  const linksColorValue = readString(value, 'linksColor');
  const minSize = clamp(
    readNumber(value, 'minSize') ?? defaultUserParticlesConfig.minSize,
    1,
    12,
  );
  const maxSize = clamp(
    readNumber(value, 'maxSize') ?? defaultUserParticlesConfig.maxSize,
    1,
    12,
  );

  return {
    enabled:
      readBoolean(value, 'enabled') ?? defaultUserParticlesConfig.enabled,
    count: Math.round(
      clamp(
        readNumber(value, 'count') ?? defaultUserParticlesConfig.count,
        0,
        100,
      ),
    ),
    color:
      colorValue && hexColorPattern.test(colorValue)
        ? colorValue
        : defaultUserParticlesConfig.color,
    shape:
      shapeValue && shapes.has(shapeValue)
        ? shapeValue
        : defaultUserParticlesConfig.shape,
    minSize: Math.min(minSize, maxSize),
    maxSize: Math.max(minSize, maxSize),
    speed: clamp(
      readNumber(value, 'speed') ?? defaultUserParticlesConfig.speed,
      0,
      5,
    ),
    direction:
      directionValue && directions.has(directionValue)
        ? directionValue
        : defaultUserParticlesConfig.direction,
    opacity: clamp(
      readNumber(value, 'opacity') ?? defaultUserParticlesConfig.opacity,
      0,
      1,
    ),
    linksEnabled:
      readBoolean(value, 'linksEnabled') ??
      defaultUserParticlesConfig.linksEnabled,
    linksColor:
      linksColorValue && hexColorPattern.test(linksColorValue)
        ? linksColorValue
        : defaultUserParticlesConfig.linksColor,
    hoverEnabled:
      readBoolean(value, 'hoverEnabled') ??
      defaultUserParticlesConfig.hoverEnabled,
    hoverMode:
      hoverModeValue && hoverModes.has(hoverModeValue)
        ? hoverModeValue
        : defaultUserParticlesConfig.hoverMode,
  };
}
