import type { StyleOption } from '@/constants/userCardEditorOptions';

const placementClasses = new Set([
  'self-start',
  'self-center',
  'self-end',
  'self-stretch',
]);

const horizontalPlacementClasses = new Set([
  'mr-auto',
  'mx-auto',
  'ml-auto',
]);

export function normalizeStyleText(styleText?: string | null) {
  return styleText?.trim().split(/\s+/).filter(Boolean).join(' ') ?? '';
}

function getTokens(styleText?: string | null) {
  const normalized = normalizeStyleText(styleText);

  return normalized ? normalized.split(' ') : [];
}

function removeTokens(sourceTokens: string[], tokensToRemove: string[]) {
  const removeSet = new Set(tokensToRemove);

  return sourceTokens.filter((token) => !removeSet.has(token));
}

export function styleTextIncludes(styleText: string | null | undefined, option: StyleOption) {
  const tokens = new Set(getTokens(styleText));

  return getTokens(option.styleText).every((token) => tokens.has(token));
}

export function toggleStyleOption(
  styleText: string | null | undefined,
  option: StyleOption,
  options: StyleOption[],
) {
  const currentTokens = getTokens(styleText);
  const selected = styleTextIncludes(styleText, option);
  const groupTokens = options
    .filter((candidate) => candidate.group === option.group)
    .flatMap((candidate) => getTokens(candidate.styleText));
  const nextTokens = removeTokens(currentTokens, groupTokens);

  if (!selected) {
    nextTokens.push(...getTokens(option.styleText));
  }

  return normalizeStyleText(nextTokens.join(' '));
}

export function getPlacementClassFromStyleText(styleText?: string | null) {
  return getTokens(styleText).find((token) => placementClasses.has(token)) ?? '';
}

export function getHorizontalPlacementClassFromStyleText(styleText?: string | null) {
  return getTokens(styleText).find((token) => horizontalPlacementClasses.has(token)) ?? '';
}
