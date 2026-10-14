import { useEffect, useState } from 'react';
import {
  getPublicPortfolio,
  PublicPortfolioNotFoundError,
} from '@/features/public-portfolio/api/publicPortfolioApi';
import type { PublicPortfolio } from '@/features/public-portfolio/types/publicPortfolio.types';

export function usePublicPortfolio(username?: string) {
  const [portfolio, setPortfolio] = useState<PublicPortfolio | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(username));
  const [error, setError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    const requestedUsername = username?.trim() ?? '';

    if (!requestedUsername) {
      setPortfolio(null);
      setIsLoading(false);
      setError('No se indico un usuario para cargar.');
      setIsNotFound(false);
      return;
    }

    let isMounted = true;

    async function loadPublicPortfolio() {
      setIsLoading(true);
      setError(null);
      setIsNotFound(false);

      try {
        const nextPortfolio = await getPublicPortfolio(requestedUsername);

        if (isMounted) {
          setPortfolio(nextPortfolio);
        }
      } catch (unknownError) {
        if (!isMounted) {
          return;
        }

        setPortfolio(null);
        setIsNotFound(unknownError instanceof PublicPortfolioNotFoundError);
        setError(
          unknownError instanceof Error
            ? unknownError.message
            : 'No se pudo cargar el portfolio publico.',
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadPublicPortfolio();

    return () => {
      isMounted = false;
    };
  }, [username]);

  return {
    portfolio,
    isLoading,
    error,
    isNotFound,
  };
}
