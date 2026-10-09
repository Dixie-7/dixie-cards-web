import { useCallback, useEffect, useMemo, useState } from 'react';
import { isImageUserFile, fileApi } from '@/features/files/api/fileApi';
import type { UserFileDto } from '@/features/files/types/userFile.types';

function sortFiles(files: UserFileDto[]) {
  return [...files].sort(
    (currentFile, nextFile) =>
      Date.parse(nextFile.uploadedAt) - Date.parse(currentFile.uploadedAt),
  );
}

export function useUserFiles(token?: string | null) {
  const [files, setFiles] = useState<UserFileDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setFiles(sortFiles(await fileApi.listUserFiles(token)));
    } catch (unknownError) {
      setError(
        unknownError instanceof Error
          ? unknownError.message
          : 'Unexpected files loading error',
      );
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadFiles();
  }, [loadFiles]);

  const imageFiles = useMemo(
    () => files.filter((file) => isImageUserFile(file)),
    [files],
  );

  return {
    files,
    imageFiles,
    isLoading,
    error,
    reload: loadFiles,
  };
}
