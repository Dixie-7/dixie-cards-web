export function getSafePercent(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(Math.max(Math.round(value), 0), 100);
}

export function getLanguageAccentColor(percent: number) {
  const safePercent = getSafePercent(percent);

  if (safePercent >= 85) {
    return '#10b981';
  }

  if (safePercent >= 60) {
    return '#06b6d4';
  }

  if (safePercent >= 35) {
    return '#f59e0b';
  }

  return '#a78bfa';
}
