import { useCallback, useMemo, useState } from 'react';
import { cloneParticlesConfig } from '@/features/user-config/services/particlesConfigNormalizer';
import type { UserParticlesConfig } from '@/features/user-config/types/userConfig.types';

export function useParticlesConfigDraft(initialConfig: UserParticlesConfig) {
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
      return 'El tamaño mínimo no puede ser mayor que el máximo.';
    }

    return null;
  }, [draft.maxSize, draft.minSize]);

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
