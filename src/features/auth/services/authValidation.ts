import type { LoginRequestDto, RegisterRequestDto } from '@/features/auth/types/auth.types';
import type { AppLanguage } from '@/shared/i18n/i18n.types';

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

export function validateUsername(username: string, language: AppLanguage = 'es') {
  const normalizedUsername = username.trim();

  if (!normalizedUsername) {
    return language === 'en' ? 'Enter a username.' : 'Ingresa un username.';
  }

  if (
    normalizedUsername.length < authValidationLimits.usernameMinLength ||
    normalizedUsername.length > authValidationLimits.usernameMaxLength
  ) {
    return language === 'en'
      ? `The username must be between ${authValidationLimits.usernameMinLength} and ${authValidationLimits.usernameMaxLength} characters.`
      : `El username debe tener entre ${authValidationLimits.usernameMinLength} y ${authValidationLimits.usernameMaxLength} caracteres.`;
  }

  if (!usernamePattern.test(normalizedUsername)) {
    return language === 'en'
      ? 'Use only letters, numbers, periods, hyphens or underscores.'
      : 'Usa solo letras, numeros, punto, guion o guion bajo.';
  }

  return undefined;
}

export function validateEmail(email: string, language: AppLanguage = 'es') {
  const normalizedEmail = email.trim();

  if (!normalizedEmail) {
    return language === 'en' ? 'Enter your email.' : 'Ingresa tu email.';
  }

  if (normalizedEmail.length > authValidationLimits.emailMaxLength) {
    return language === 'en'
      ? `The email cannot exceed ${authValidationLimits.emailMaxLength} characters.`
      : `El email no puede superar ${authValidationLimits.emailMaxLength} caracteres.`;
  }

  if (!emailPattern.test(normalizedEmail)) {
    return language === 'en' ? 'Enter a valid email.' : 'Ingresa un email valido.';
  }

  return undefined;
}

export function getPasswordSecurityErrors(
  password: string,
  identity?: Pick<RegisterRequestDto, 'username' | 'email'>,
  language: AppLanguage = 'es',
) {
  const errors: string[] = [];
  const normalizedPassword = password.trim();

  if (!password) {
    return [language === 'en' ? 'Enter a password.' : 'Ingresa una contrasena.'];
  }

  if (password !== normalizedPassword) {
    errors.push(language === 'en' ? 'It cannot start or end with spaces.' : 'No puede empezar ni terminar con espacios.');
  }

  if (password.length < authValidationLimits.passwordMinLength) {
    errors.push(
      language === 'en'
        ? `It must have at least ${authValidationLimits.passwordMinLength} characters.`
        : `Debe tener al menos ${authValidationLimits.passwordMinLength} caracteres.`,
    );
  }

  if (password.length > authValidationLimits.passwordMaxLength) {
    errors.push(
      language === 'en'
        ? `It cannot exceed ${authValidationLimits.passwordMaxLength} characters.`
        : `No puede superar ${authValidationLimits.passwordMaxLength} caracteres.`,
    );
  }

  if (!/[a-z]/.test(password)) {
    errors.push(language === 'en' ? 'Include a lowercase letter.' : 'Incluye una letra minuscula.');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push(language === 'en' ? 'Include an uppercase letter.' : 'Incluye una letra mayuscula.');
  }

  if (!/\d/.test(password)) {
    errors.push(language === 'en' ? 'Include a number.' : 'Incluye un numero.');
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push(language === 'en' ? 'Include a special character.' : 'Incluye un caracter especial.');
  }

  const lowerPassword = password.toLowerCase();
  const username = identity?.username.trim().toLowerCase();
  const emailPrefix = identity?.email.trim().split('@')[0]?.toLowerCase();

  if (username && username.length >= 3 && lowerPassword.includes(username)) {
    errors.push(language === 'en' ? 'It must not contain the username.' : 'No debe contener el username.');
  }

  if (
    emailPrefix &&
    emailPrefix.length >= 3 &&
    lowerPassword.includes(emailPrefix)
  ) {
    errors.push(language === 'en' ? 'It must not contain the email name.' : 'No debe contener el nombre del email.');
  }

  return errors;
}

export function validateLoginRequest(payload: LoginRequestDto, language: AppLanguage = 'es') {
  const errors: LoginValidationErrors = {};
  const usernameOrEmail = payload.usernameOrEmail.trim();

  if (!usernameOrEmail) {
    errors.usernameOrEmail = language === 'en' ? 'Enter your username or email.' : 'Ingresa tu usuario o email.';
  } else if (
    usernameOrEmail.length > authValidationLimits.usernameOrEmailMaxLength
  ) {
    errors.usernameOrEmail = language === 'en'
      ? `It cannot exceed ${authValidationLimits.usernameOrEmailMaxLength} characters.`
      : `No puede superar ${authValidationLimits.usernameOrEmailMaxLength} caracteres.`;
  } else if (usernameOrEmail.includes('@')) {
    errors.usernameOrEmail = validateEmail(usernameOrEmail, language);
  }

  if (!payload.password) {
    errors.password = language === 'en' ? 'Enter your password.' : 'Ingresa tu contrasena.';
  } else if (payload.password.length > authValidationLimits.passwordMaxLength) {
    errors.password = language === 'en'
      ? `It cannot exceed ${authValidationLimits.passwordMaxLength} characters.`
      : `No puede superar ${authValidationLimits.passwordMaxLength} caracteres.`;
  }

  return errors;
}

export function validateRegisterRequest(payload: RegisterRequestDto, language: AppLanguage = 'es') {
  const passwordErrors = getPasswordSecurityErrors(payload.password, payload, language);

  return {
    username: validateUsername(payload.username, language),
    email: validateEmail(payload.email, language),
    password: passwordErrors.length > 0 ? passwordErrors.join(' ') : undefined,
  };
}

export function hasValidationErrors<T extends object>(errors: T) {
  return Object.values(errors).some(Boolean);
}
