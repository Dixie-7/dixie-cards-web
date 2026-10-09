import { useCallback, useEffect, useState } from 'react';
import { userLanguagesApi } from '@/services/userLanguagesApi';
import type {
  UserLanguageDto,
  UserLanguagePayload,
} from '@/types/userLanguages';

function sortLanguages(languages: UserLanguageDto[]) {
  return [...languages].sort(
    (currentLanguage, nextLanguage) =>
      currentLanguage.sortOrder - nextLanguage.sortOrder,
  );
}

export function useUserLanguagesCrud(
  token?: string | null,
  currentUserId = 7,
) {
  const [languages, setLanguages] = useState<UserLanguageDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLanguages = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setLanguages(await userLanguagesApi.listUserLanguages(token));
    } catch (unknownError) {
      setError(
        unknownError instanceof Error
          ? unknownError.message
          : 'Unexpected languages loading error',
      );
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadLanguages();
  }, [loadLanguages]);

  const createLanguage = useCallback(
    async (payload: UserLanguagePayload) => {
      const createdLanguage = await userLanguagesApi.createUserLanguage(
        payload,
        token,
        currentUserId,
      );

      setLanguages((currentLanguages) =>
        sortLanguages([...currentLanguages, createdLanguage]),
      );

      return createdLanguage;
    },
    [currentUserId, token],
  );

  const updateLanguage = useCallback(
    async (languageId: number, payload: UserLanguagePayload) => {
      const updatedLanguage = await userLanguagesApi.updateUserLanguage(
        languageId,
        payload,
        token,
        currentUserId,
      );

      setLanguages((currentLanguages) =>
        sortLanguages(
          currentLanguages.map((language) =>
            language.id === languageId ? updatedLanguage : language,
          ),
        ),
      );

      return updatedLanguage;
    },
    [currentUserId, token],
  );

  const deleteLanguage = useCallback(
    async (languageId: number) => {
      await userLanguagesApi.deleteUserLanguage(languageId, token);

      setLanguages((currentLanguages) =>
        currentLanguages.filter((language) => language.id !== languageId),
      );
    },
    [token],
  );

  return {
    languages,
    isLoading,
    error,
    reload: loadLanguages,
    createLanguage,
    updateLanguage,
    deleteLanguage,
  };
}
