import { useCallback, useMemo, useState } from 'react';
import { cloneParticlesConfig } from '@/features/user-config/services/particlesConfigNormalizer';
import type { UserParticlesConfig } from '@/features/user-config/types/userConfig.types';
import type { AppLanguage } from '@/shared/i18n/i18n.types';

export function useParticlesConfigDraft(
  initialConfig: UserParticlesConfig,
  language: AppLanguage = 'en',
) {
  const [draft, setDraft] = useState<UserParticlesConfig>(() =>
    cloneParticlesConfig(initialConfig),
  );

  const updateField = useCallback(
    <Key extends keyof UserParticlesConfig>(
      key: Key,
      value: UserParticlesConfig[Key],
    ) => {
      setDraft((currentDraft) => ({
        ...currentDraft,
        [key]: value,
      }));
    },
    [],
  );

  const validationError = useMemo(() => {
    if (draft.minSize > draft.maxSize) {
      return language === 'es'
        ? 'El tamano minimo no puede ser mayor que el maximo.'
        : 'The minimum size cannot be greater than the maximum size.';
    }

    return null;
  }, [draft.maxSize, draft.minSize, language]);

  const reset = useCallback(() => {
    setDraft(cloneParticlesConfig(initialConfig));
  }, [initialConfig]);

  return {
    draft,
    updateField,
    validationError,
    reset,
  };
}
