import type { LoginRequestDto, RegisterRequestDto } from '@/types/auth';

export const authValidationLimits = {
  usernameOrEmailMaxLength: 100,
  usernameMinLength: 3,
  usernameMaxLength: 50,
  emailMaxLength: 100,
  passwordMinLength: 8,
  passwordMaxLength: 100,
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[a-zA-Z0-9._-]+$/;

export interface LoginValidationErrors {
  usernameOrEmail?: string;
  password?: string;
}

export interface RegisterValidationErrors {
  username?: string;
  email?: string;
  password?: string;
}

export function validateUsername(username: string) {
  const normalizedUsername = username.trim();

  if (!normalizedUsername) {
    return 'Ingresa un username.';
  }

  if (
    normalizedUsername.length < authValidationLimits.usernameMinLength ||
    normalizedUsername.length > authValidationLimits.usernameMaxLength
  ) {
    return `El username debe tener entre ${authValidationLimits.usernameMinLength} y ${authValidationLimits.usernameMaxLength} caracteres.`;
  }

  if (!usernamePattern.test(normalizedUsername)) {
    return 'Usa solo letras, numeros, punto, guion o guion bajo.';
  }

  return undefined;
}

export function validateEmail(email: string) {
  const normalizedEmail = email.trim();

  if (!normalizedEmail) {
    return 'Ingresa tu email.';
  }

  if (normalizedEmail.length > authValidationLimits.emailMaxLength) {
    return `El email no puede superar ${authValidationLimits.emailMaxLength} caracteres.`;
  }

  if (!emailPattern.test(normalizedEmail)) {
    return 'Ingresa un email valido.';
  }

  return undefined;
}

export function getPasswordSecurityErrors(
  password: string,
  identity?: Pick<RegisterRequestDto, 'username' | 'email'>,
) {
  const errors: string[] = [];
  const normalizedPassword = password.trim();

  if (!password) {
    return ['Ingresa una contrasena.'];
  }

  if (password !== normalizedPassword) {
    errors.push('No puede empezar ni terminar con espacios.');
  }

  if (password.length < authValidationLimits.passwordMinLength) {
    errors.push(
      `Debe tener al menos ${authValidationLimits.passwordMinLength} caracteres.`,
    );
  }

  if (password.length > authValidationLimits.passwordMaxLength) {
    errors.push(
      `No puede superar ${authValidationLimits.passwordMaxLength} caracteres.`,
    );
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Incluye una letra minuscula.');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Incluye una letra mayuscula.');
  }

  if (!/\d/.test(password)) {
    errors.push('Incluye un numero.');
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Incluye un caracter especial.');
  }

  const lowerPassword = password.toLowerCase();
  const username = identity?.username.trim().toLowerCase();
  const emailPrefix = identity?.email.trim().split('@')[0]?.toLowerCase();

  if (username && username.length >= 3 && lowerPassword.includes(username)) {
    errors.push('No debe contener el username.');
  }

  if (
    emailPrefix &&
    emailPrefix.length >= 3 &&
    lowerPassword.includes(emailPrefix)
  ) {
    errors.push('No debe contener el nombre del email.');
  }

  return errors;
}

export function validateLoginRequest(payload: LoginRequestDto) {
  const errors: LoginValidationErrors = {};
  const usernameOrEmail = payload.usernameOrEmail.trim();

  if (!usernameOrEmail) {
    errors.usernameOrEmail = 'Ingresa tu usuario o email.';
  } else if (
    usernameOrEmail.length > authValidationLimits.usernameOrEmailMaxLength
  ) {
    errors.usernameOrEmail = `No puede superar ${authValidationLimits.usernameOrEmailMaxLength} caracteres.`;
  } else if (usernameOrEmail.includes('@')) {
    errors.usernameOrEmail = validateEmail(usernameOrEmail);
  }

  if (!payload.password) {
    errors.password = 'Ingresa tu contrasena.';
  } else if (payload.password.length > authValidationLimits.passwordMaxLength) {
    errors.password = `No puede superar ${authValidationLimits.passwordMaxLength} caracteres.`;
  }

  return errors;
}

export function validateRegisterRequest(payload: RegisterRequestDto) {
  const passwordErrors = getPasswordSecurityErrors(payload.password, payload);

  return {
    username: validateUsername(payload.username),
    email: validateEmail(payload.email),
    password: passwordErrors.length > 0 ? passwordErrors.join(' ') : undefined,
  };
}

export function hasValidationErrors<T extends object>(errors: T) {
  return Object.values(errors).some(Boolean);
}
