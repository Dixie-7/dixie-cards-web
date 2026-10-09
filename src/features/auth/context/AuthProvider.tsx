import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { AuthContext } from '@/features/auth/context/AuthContext';
import { authApi } from '@/features/auth/api/authApi';
import {
  clearAuthSession,
  getStoredAuthSession,
  saveAuthSession,
} from '@/features/auth/services/authSession';
import type { AuthSession, LoginRequestDto } from '@/features/auth/types/auth.types';
import type { RegisterRequestDto } from '@/features/auth/types/auth.types';

interface AuthProviderProps {
  children: ReactNode;
}

function createSessionFromLoginResponse(
  data: NonNullable<Awaited<ReturnType<typeof authApi.login>>['data']>,
): AuthSession {
  return {
    token: data.token,
    expiration: data.expiration,
    user: {
      id: data.userId,
      username: data.username,
      email: data.email,
    },
  };
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(() =>
    getStoredAuthSession(),
  );
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (credentials: LoginRequestDto) => {
    setIsLoading(true);

    try {
      const result = await authApi.login(credentials);

      if (!result.success || !result.data) {
        throw new Error(result.message ?? 'No se pudo iniciar sesion.');
      }

      const nextSession = createSessionFromLoginResponse(result.data);

      saveAuthSession(nextSession);
      setSession(nextSession);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (credentials: RegisterRequestDto) => {
    setIsLoading(true);

    try {
      const result = await authApi.register(credentials);

      if (!result.success) {
        throw new Error(result.message ?? 'No se pudo completar el registro.');
      }

      return result.message;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearAuthSession();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session?.token),
      isLoading,
      login,
      register,
      logout,
    }),
    [isLoading, login, logout, register, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
