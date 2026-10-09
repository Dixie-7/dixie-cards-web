import { useCallback, useEffect, useState } from 'react';
import {
  createDefaultUserConfig,
  userConfigApi,
} from '@/services/userConfigApi';
import type { UserConfigDto, UserConfigPayload } from '@/types/userConfig';

export function useUserConfigCrud(token?: string | null, currentUserId = 7) {
  const [config, setConfig] = useState<UserConfigDto>(() =>
    createDefaultUserConfig(currentUserId),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setConfig(await userConfigApi.getUserConfig(token, currentUserId));
    } catch (unknownError) {
      setError(
        unknownError instanceof Error
          ? unknownError.message
          : 'Unexpected user config loading error',
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, token]);

  useEffect(() => {
    setConfig((currentConfig) => ({
      ...currentConfig,
      userId: currentUserId,
    }));
    void loadConfig();
  }, [currentUserId, loadConfig]);

  const updateConfig = useCallback(
    async (payload: UserConfigPayload) => {
      const updatedConfig = await userConfigApi.updateUserConfig(
        config.id,
        payload,
        token,
        currentUserId,
      );

      setConfig(updatedConfig);

      return updatedConfig;
    },
    [config.id, currentUserId, token],
  );

  return {
    config,
    isLoading,
    error,
    reload: loadConfig,
    updateConfig,
  };
}
