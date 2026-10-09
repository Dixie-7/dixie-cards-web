import { authUsersMock } from '@/features/auth/mocks/auth.mock';
import type { MockAuthUser } from '@/features/auth/mocks/auth.mock';
import type {
  AuthErrorCode,
  LoginRequestDto,
  LoginResponseDto,
  LoginResultDto,
  RegisterRequestDto,
  RegisterResponseDto,
  RegisterResultDto,
} from '@/features/auth/types/auth.types';
import {
  hasValidationErrors,
  validateLoginRequest,
  validateRegisterRequest,
} from '@/features/auth/services/authValidation';
import { apiClient, hasApiBaseUrl } from '@/shared/api/apiClient';

const authEndpoints = {
  login: '/api/auth/login',
  register: '/api/auth/register',
};

let authUsersStore: MockAuthUser[] = authUsersMock.map((user) => ({ ...user }));

export const isMockAuthEnabled =
  import.meta.env.VITE_USE_MOCK_AUTH !== 'false' || !hasApiBaseUrl;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readString(
  record: Record<string, unknown>,
  camelKey: string,
  pascalKey: string,
) {
  const value = record[camelKey] ?? record[pascalKey];

  return typeof value === 'string' ? value : undefined;
}

function readNumber(
  record: Record<string, unknown>,
  camelKey: string,
  pascalKey: string,
) {
  const value = record[camelKey] ?? record[pascalKey];

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const parsedValue = Number(value);

    return Number.isNaN(parsedValue) ? undefined : parsedValue;
  }

  return undefined;
}

function readBoolean(
  record: Record<string, unknown>,
  camelKey: string,
  pascalKey: string,
) {
  const value = record[camelKey] ?? record[pascalKey];

  return typeof value === 'boolean' ? value : undefined;
}

function normalizeErrorCode(value: string | undefined) {
  return value as AuthErrorCode | undefined;
}

function normalizeLoginResponse(value: unknown): LoginResponseDto | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const token = readString(value, 'token', 'Token');
  const expiration = readString(value, 'expiration', 'Expiration');
  const userId = readNumber(value, 'userId', 'UserId');
  const username = readString(value, 'username', 'Username');
  const email = readString(value, 'email', 'Email');

  if (!token || !expiration || userId === undefined || !username || !email) {
    return undefined;
  }

  return {
    token,
    expiration,
    userId,
    username,
    email,
  };
}

function normalizeRegisterResponse(
  value: unknown,
): RegisterResponseDto | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const userId =
    readNumber(value, 'userId', 'UserId') ?? readNumber(value, 'id', 'Id');
  const username = readString(value, 'username', 'Username');
  const email = readString(value, 'email', 'Email');

  if (userId === undefined || !username || !email) {
    return undefined;
  }

  return {
    userId,
    username,
    email,
    verificationSent:
      readBoolean(value, 'verificationSent', 'VerificationSent') ?? true,
  };
}

function normalizeLoginResult(value: unknown): LoginResultDto | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const success = readBoolean(value, 'success', 'Success');

  if (success === undefined) {
    return undefined;
  }

  return {
    success,
    errorCode: normalizeErrorCode(readString(value, 'errorCode', 'ErrorCode')),
    message: readString(value, 'message', 'Message'),
    data: normalizeLoginResponse(value.data ?? value.Data),
  };
}

function normalizeRegisterResult(value: unknown): RegisterResultDto | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const success = readBoolean(value, 'success', 'Success');

  if (success === undefined) {
    return undefined;
  }

  return {
    success,
    errorCode: normalizeErrorCode(readString(value, 'errorCode', 'ErrorCode')),
    message: readString(value, 'message', 'Message'),
    data: normalizeRegisterResponse(value.data ?? value.Data),
  };
}

function createValidationMessage<T extends object>(
  errors: T,
  fallbackMessage: string,
) {
  return Object.values(errors).filter(Boolean).join(' ') || fallbackMessage;
}

function validateLoginPayload(payload: LoginRequestDto): LoginResultDto | null {
  const errors = validateLoginRequest(payload);

  if (!hasValidationErrors(errors)) {
    return null;
  }

  return {
    success: false,
    errorCode: 'VALIDATION_ERROR',
    message: createValidationMessage(
      errors,
      'Ingresa credenciales validas para iniciar sesion.',
    ),
  };
}

function validateRegisterPayload(
  payload: RegisterRequestDto,
): RegisterResultDto | null {
  const errors = validateRegisterRequest(payload);

  if (!hasValidationErrors(errors)) {
    return null;
  }

  return {
    success: false,
    errorCode: 'VALIDATION_ERROR',
    message: createValidationMessage(
      errors,
      'Ingresa datos validos para crear la cuenta.',
    ),
  };
}

function createMockJwt(userId: number, expiration: string) {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };
  const payload = {
    sub: String(userId),
    exp: Math.floor(Date.parse(expiration) / 1000),
    iss: 'dixie-cards-web.mock',
  };

  return [
    btoa(JSON.stringify(header)),
    btoa(JSON.stringify(payload)),
    'mock-signature',
  ].join('.');
}

function getNextMockUserId() {
  return Math.max(0, ...authUsersStore.map((user) => user.id)) + 1;
}

function normalizeIdentifier(value: string) {
  return value.trim().toLowerCase();
}

async function simulateAuthLatency() {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 450);
  });
}

async function loginWithMock(
  payload: LoginRequestDto,
): Promise<LoginResultDto> {
  await simulateAuthLatency();

  const validationError = validateLoginPayload(payload);

  if (validationError) {
    return validationError;
  }

  const normalizedIdentifier = normalizeIdentifier(payload.usernameOrEmail);
  const user = authUsersStore.find(
    (candidate) =>
      normalizeIdentifier(candidate.email) === normalizedIdentifier ||
      normalizeIdentifier(candidate.username) === normalizedIdentifier,
  );

  if (!user || user.password !== payload.password) {
    return {
      success: false,
      errorCode: 'INVALID_CREDENTIALS',
      message: 'Usuario/email o contrasena incorrectos.',
    };
  }

  if (!user.isEmailVerified) {
    return {
      success: false,
      errorCode: 'EMAIL_NOT_VERIFIED',
      message: 'Verifica tu correo antes de iniciar sesion.',
    };
  }

  if (!user.isActive) {
    return {
      success: false,
      errorCode: 'ACCOUNT_INACTIVE',
      message: 'La cuenta no esta activa.',
    };
  }

  const expiration = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  return {
    success: true,
    message: 'Login exitoso.',
    data: {
      token: createMockJwt(user.id, expiration),
      expiration,
      userId: user.id,
      username: user.username,
      email: user.email,
    },
  };
}

async function registerWithMock(
  payload: RegisterRequestDto,
): Promise<RegisterResultDto> {
  await simulateAuthLatency();

  const validationError = validateRegisterPayload(payload);

  if (validationError) {
    return validationError;
  }

  const normalizedUsername = normalizeIdentifier(payload.username);
  const normalizedEmail = normalizeIdentifier(payload.email);
  const isEmailTaken = authUsersStore.some(
    (user) => normalizeIdentifier(user.email) === normalizedEmail,
  );

  if (isEmailTaken) {
    return {
      success: false,
      errorCode: 'EMAIL_ALREADY_EXISTS',
      message: 'Ya existe una cuenta registrada con ese email.',
    };
  }

  const isUsernameTaken = authUsersStore.some(
    (user) => normalizeIdentifier(user.username) === normalizedUsername,
  );

  if (isUsernameTaken) {
    return {
      success: false,
      errorCode: 'USERNAME_ALREADY_EXISTS',
      message: 'Ese username ya esta en uso.',
    };
  }

  const createdUser: MockAuthUser = {
    id: getNextMockUserId(),
    username: payload.username.trim(),
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
    isActive: false,
    isEmailVerified: false,
    createdAt: new Date().toISOString(),
  };

  authUsersStore = [...authUsersStore, createdUser];

  return {
    success: true,
    message:
      'Registro exitoso. Te enviamos un correo para verificar y activar tu cuenta.',
    data: {
      userId: createdUser.id,
      username: createdUser.username,
      email: createdUser.email,
      verificationSent: true,
    },
  };
}

async function loginWithApi(
  payload: LoginRequestDto,
): Promise<LoginResultDto> {
  const validationError = validateLoginPayload(payload);

  if (validationError) {
    return validationError;
  }

  try {
    const response = await apiClient.request(authEndpoints.login, {
      method: 'POST',
      body: payload,
      throwOnHttpError: false,
    });
    const result = normalizeLoginResult(response.data);

    if (result) {
      return result;
    }

    if (!response.ok) {
      return {
        success: false,
        errorCode: 'UNEXPECTED_ERROR',
        message: `No se pudo iniciar sesion. Estado HTTP ${response.status}.`,
      };
    }

    return {
      success: false,
      errorCode: 'UNEXPECTED_ERROR',
      message: 'El servidor devolvio una respuesta de login invalida.',
    };
  } catch {
    return {
      success: false,
      errorCode: 'UNEXPECTED_ERROR',
      message: 'No se pudo conectar con el servidor de autenticacion.',
    };
  }
}

async function registerWithApi(
  payload: RegisterRequestDto,
): Promise<RegisterResultDto> {
  const validationError = validateRegisterPayload(payload);

  if (validationError) {
    return validationError;
  }

  try {
    const response = await apiClient.request(authEndpoints.register, {
      method: 'POST',
      body: payload,
      throwOnHttpError: false,
    });
    const jsonResponse = response.data;
    const result = normalizeRegisterResult(jsonResponse);

    if (result) {
      return result;
    }

    const data = normalizeRegisterResponse(jsonResponse);

    if (response.ok && data) {
      return {
        success: true,
        message:
          'Registro exitoso. Revisa tu correo para verificar y activar tu cuenta.',
        data,
      };
    }

    if (!response.ok) {
      return {
        success: false,
        errorCode: 'UNEXPECTED_ERROR',
        message: `No se pudo completar el registro. Estado HTTP ${response.status}.`,
      };
    }

    return {
      success: false,
      errorCode: 'UNEXPECTED_ERROR',
      message: 'El servidor devolvio una respuesta de registro invalida.',
    };
  } catch {
    return {
      success: false,
      errorCode: 'UNEXPECTED_ERROR',
      message: 'No se pudo conectar con el servidor de autenticacion.',
    };
  }
}

export const authApi = {
  login(payload: LoginRequestDto) {
    return isMockAuthEnabled ? loginWithMock(payload) : loginWithApi(payload);
  },

  register(payload: RegisterRequestDto) {
    return isMockAuthEnabled
      ? registerWithMock(payload)
      : registerWithApi(payload);
  },
};
