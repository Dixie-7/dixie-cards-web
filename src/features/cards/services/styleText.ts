import type { CSSProperties } from 'react';
import type { StyleOption } from '@/features/cards/constants/cardEditorOptions';

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

export type HexColorTarget = 'bg' | 'text' | 'border' | 'ring';

const hexColorTokenPrefix: Record<HexColorTarget, string> = {
  bg: 'bg',
  text: 'text',
  border: 'border',
  ring: 'ring',
};

const hexColorTokenPattern = {
  bg: /^bg-\[(#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?)\]$/,
  text: /^text-\[(#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?)\]$/,
  border: /^border-\[(#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?)\]$/,
  ring: /^ring-\[(#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?)\]$/,
} satisfies Record<HexColorTarget, RegExp>;

export function isValidHexColor(color: string) {
  return /^#[0-9a-fA-F]{6}$/.test(color) || /^#[0-9a-fA-F]{3}$/.test(color);
}

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

export function getHexColorFromStyleText(
  styleText: string | null | undefined,
  target: HexColorTarget,
) {
  const pattern = hexColorTokenPattern[target];

  for (const token of getTokens(styleText)) {
    const match = token.match(pattern);

    if (match?.[1]) {
      return match[1].toLowerCase();
    }
  }

  return '';
}

export function upsertHexColorStyle(
  styleText: string | null | undefined,
  target: HexColorTarget,
  color: string,
) {
  const normalizedColor = color.trim().toLowerCase();
  const nextTokens = getTokens(styleText).filter(
    (token) => !hexColorTokenPattern[target].test(token),
  );

  if (target === 'ring' && normalizedColor && !nextTokens.includes('ring-1')) {
    nextTokens.push('ring-1');
  }

  if (isValidHexColor(normalizedColor)) {
    nextTokens.push(`${hexColorTokenPrefix[target]}-[${normalizedColor}]`);
  }

  return normalizeStyleText(nextTokens.join(' '));
}

export function getCustomColorStylesFromStyleText(styleText?: string | null) {
  const backgroundColor = getHexColorFromStyleText(styleText, 'bg');
  const color = getHexColorFromStyleText(styleText, 'text');
  const borderColor = getHexColorFromStyleText(styleText, 'border');
  const ringColor = getHexColorFromStyleText(styleText, 'ring');
  const rootStyle: CSSProperties & Record<string, string> = {};
  const textStyle: CSSProperties = {};

  if (backgroundColor) {
    rootStyle.backgroundColor = backgroundColor;
  }

  if (borderColor) {
    rootStyle.borderColor = borderColor;
  }

  if (ringColor) {
    rootStyle['--tw-ring-color'] = ringColor;
  }

  if (color) {
    rootStyle.color = color;
    textStyle.color = color;
  }

  return {
    rootStyle: rootStyle as CSSProperties,
    textStyle,
  };
}
