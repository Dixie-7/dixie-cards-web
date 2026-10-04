import type { AuthSession } from '@/types/auth';

const AUTH_SESSION_STORAGE_KEY = 'dixie.auth.session';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isAuthSession(value: unknown): value is AuthSession {
  if (!isRecord(value) || !isRecord(value.user)) {
    return false;
  }

  return (
    typeof value.token === 'string' &&
    typeof value.expiration === 'string' &&
    typeof value.user.id === 'number' &&
    typeof value.user.username === 'string' &&
    typeof value.user.email === 'string'
  );
}

export function isSessionExpired(session: AuthSession) {
  const expirationTime = Date.parse(session.expiration);

  return Number.isNaN(expirationTime) || expirationTime <= Date.now();
}

export function getStoredAuthSession() {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedSession = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY);

  if (!storedSession) {
    return null;
  }

  try {
    const parsedSession: unknown = JSON.parse(storedSession);

    if (!isAuthSession(parsedSession) || isSessionExpired(parsedSession)) {
      clearAuthSession();
      return null;
    }

    return parsedSession;
  } catch {
    clearAuthSession();
    return null;
  }
}

export function saveAuthSession(session: AuthSession) {
  window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
}
