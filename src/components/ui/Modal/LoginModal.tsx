import React, { useMemo, useRef, useState } from 'react';
import {
  mockLoginCredentials,
  mockRegisterSuggestion,
} from '@/mocks/auth.mock';
import { isMockAuthEnabled } from '@/services/authApi';
import type { LoginRequestDto, RegisterRequestDto } from '@/types/auth';
import {
  getPasswordSecurityErrors,
  hasValidationErrors,
  validateLoginRequest,
  validateRegisterRequest,
} from '@/utils/authValidation';
import { useAuth } from '@/hooks/useAuth';
import BaseModal from './BaseModal';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  restoreFocusRef?: React.RefObject<HTMLElement | null>;
}

interface AuthFormErrors {
  usernameOrEmail?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
}

type AuthMode = 'login' | 'register';

function validateLoginForm(credentials: LoginRequestDto): AuthFormErrors {
  return validateLoginRequest(credentials);
}

function validateRegisterForm(
  credentials: RegisterRequestDto,
  confirmPassword: string,
): AuthFormErrors {
  const errors: AuthFormErrors = validateRegisterRequest(credentials);

  if (!confirmPassword) {
    errors.confirmPassword = 'Confirma tu contrasena.';
  } else if (credentials.password !== confirmPassword) {
    errors.confirmPassword = 'Las contrasenas no coinciden.';
  }

  return errors;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  restoreFocusRef,
}) => {
  const { isLoading, login, register } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const firstInputRef = useRef<HTMLInputElement | null>(null);

  const passwordSecurityErrors = useMemo(
    () =>
      registerPassword
        ? getPasswordSecurityErrors(registerPassword, {
            username: registerUsername,
            email: registerEmail,
          })
        : [],
    [registerEmail, registerPassword, registerUsername],
  );

  const clearFeedback = () => {
    setErrors({});
    setSuccessMessage(null);
  };

  const clearPasswords = () => {
    setLoginPassword('');
    setRegisterPassword('');
    setConfirmPassword('');
  };

  const handleClose = () => {
    clearPasswords();
    clearFeedback();
    setMode('login');
    onClose();
  };

  const handleModeChange = (nextMode: AuthMode) => {
    setMode(nextMode);
    clearPasswords();
    clearFeedback();
  };

  const handleLoginSubmit = async () => {
    const credentials = {
      usernameOrEmail: usernameOrEmail.trim(),
      password: loginPassword,
    };
    const validationErrors = validateLoginForm(credentials);

    if (hasValidationErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    clearFeedback();

    try {
      await login(credentials);
      setUsernameOrEmail('');
      setLoginPassword('');
      onClose();
    } catch (unknownError) {
      setLoginPassword('');
      setErrors({
        form:
          unknownError instanceof Error
            ? unknownError.message
            : 'No se pudo iniciar sesion.',
      });
    }
  };

  const handleRegisterSubmit = async () => {
    const credentials = {
      username: registerUsername.trim(),
      email: registerEmail.trim(),
      password: registerPassword,
    };
    const validationErrors = validateRegisterForm(
      credentials,
      confirmPassword,
    );

    if (hasValidationErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    clearFeedback();

    try {
      const message = await register(credentials);

      setUsernameOrEmail(credentials.email);
      setRegisterUsername('');
      setRegisterEmail('');
      setRegisterPassword('');
      setConfirmPassword('');
      setMode('login');
      setSuccessMessage(
        message ??
          'Registro exitoso. Revisa tu correo para verificar y activar tu cuenta.',
      );
    } catch (unknownError) {
      setRegisterPassword('');
      setConfirmPassword('');
      setErrors({
        form:
          unknownError instanceof Error
            ? unknownError.message
            : 'No se pudo completar el registro.',
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mode === 'login') {
      void handleLoginSubmit();
      return;
    }

    void handleRegisterSubmit();
  };

  const clearError = (field: keyof AuthFormErrors) => {
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
      form: undefined,
    }));
    setSuccessMessage(null);
  };

  const modalTitle = mode === 'login' ? 'Login' : 'Crear cuenta';
  const modalDescription =
    mode === 'login'
      ? 'Ingresa tus credenciales para continuar.'
      : 'Crea tu usuario y verifica el correo antes de iniciar sesion.';

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={modalTitle}
      description={modalDescription}
      size="md"
      initialFocusRef={firstInputRef}
      restoreFocusRef={restoreFocusRef}
    >
      <form
        onSubmit={handleSubmit}
        data-slot="auth-form"
        className="space-y-4"
        noValidate
      >
        <div className="grid grid-cols-2 gap-2 rounded-xl border border-violet-400/20 bg-zinc-950/40 p-1">
          <button
            type="button"
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              mode === 'login'
                ? 'bg-violet-600 text-white'
                : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
            }`}
            onClick={() => handleModeChange('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              mode === 'register'
                ? 'bg-violet-600 text-white'
                : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
            }`}
            onClick={() => handleModeChange('register')}
          >
            Registro
          </button>
        </div>

        {mode === 'login' ? (
          <>
            <div>
              <label
                htmlFor="login-username"
                className="mb-2 block text-sm font-medium text-violet-100"
              >
                Username o email
              </label>

              <input
                ref={firstInputRef}
                type="text"
                id="login-username"
                value={usernameOrEmail}
                onChange={(e) => {
                  setUsernameOrEmail(e.target.value);
                  clearError('usernameOrEmail');
                }}
                placeholder="your@email.com"
                autoComplete="username"
                maxLength={100}
                required
                aria-invalid={Boolean(errors.usernameOrEmail)}
                aria-describedby={
                  errors.usernameOrEmail ? 'login-username-error' : undefined
                }
                className={`block w-full rounded-xl border bg-zinc-800 px-3 py-2.5 text-white placeholder:text-zinc-400 outline-none transition focus:ring-2 ${
                  errors.usernameOrEmail
                    ? 'border-red-400 focus:border-red-300 focus:ring-red-500/20'
                    : 'border-violet-400/20 focus:border-violet-400 focus:ring-violet-500/20'
                }`}
              />

              {errors.usernameOrEmail && (
                <p
                  id="login-username-error"
                  className="mt-2 text-sm text-red-300"
                >
                  {errors.usernameOrEmail}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="mb-2 block text-sm font-medium text-violet-100"
              >
                Contrasena
              </label>

              <input
                type="password"
                id="login-password"
                value={loginPassword}
                onChange={(e) => {
                  setLoginPassword(e.target.value);
                  clearError('password');
                }}
                placeholder="********"
                autoComplete="current-password"
                maxLength={100}
                required
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? 'login-password-error' : undefined
                }
                className={`block w-full rounded-xl border bg-zinc-800 px-3 py-2.5 text-white placeholder:text-zinc-400 outline-none transition focus:ring-2 ${
                  errors.password
                    ? 'border-red-400 focus:border-red-300 focus:ring-red-500/20'
                    : 'border-violet-400/20 focus:border-violet-400 focus:ring-violet-500/20'
                }`}
              />

              {errors.password && (
                <p
                  id="login-password-error"
                  className="mt-2 text-sm text-red-300"
                >
                  {errors.password}
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <div>
              <label
                htmlFor="register-username"
                className="mb-2 block text-sm font-medium text-violet-100"
              >
                Username
              </label>

              <input
                ref={firstInputRef}
                type="text"
                id="register-username"
                value={registerUsername}
                onChange={(e) => {
                  setRegisterUsername(e.target.value);
                  clearError('username');
                }}
                placeholder="tu.usuario"
                autoComplete="username"
                maxLength={50}
                required
                aria-invalid={Boolean(errors.username)}
                aria-describedby={
                  errors.username ? 'register-username-error' : undefined
                }
                className={`block w-full rounded-xl border bg-zinc-800 px-3 py-2.5 text-white placeholder:text-zinc-400 outline-none transition focus:ring-2 ${
                  errors.username
                    ? 'border-red-400 focus:border-red-300 focus:ring-red-500/20'
                    : 'border-violet-400/20 focus:border-violet-400 focus:ring-violet-500/20'
                }`}
              />

              {errors.username && (
                <p
                  id="register-username-error"
                  className="mt-2 text-sm text-red-300"
                >
                  {errors.username}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="register-email"
                className="mb-2 block text-sm font-medium text-violet-100"
              >
                Email
              </label>

              <input
                type="email"
                id="register-email"
                value={registerEmail}
                onChange={(e) => {
                  setRegisterEmail(e.target.value);
                  clearError('email');
                }}
                placeholder="tu@email.com"
                autoComplete="email"
                maxLength={100}
                required
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? 'register-email-error' : undefined
                }
                className={`block w-full rounded-xl border bg-zinc-800 px-3 py-2.5 text-white placeholder:text-zinc-400 outline-none transition focus:ring-2 ${
                  errors.email
                    ? 'border-red-400 focus:border-red-300 focus:ring-red-500/20'
                    : 'border-violet-400/20 focus:border-violet-400 focus:ring-violet-500/20'
                }`}
              />

              {errors.email && (
                <p
                  id="register-email-error"
                  className="mt-2 text-sm text-red-300"
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="register-password"
                className="mb-2 block text-sm font-medium text-violet-100"
              >
                Contrasena
              </label>

              <input
                type="password"
                id="register-password"
                value={registerPassword}
                onChange={(e) => {
                  setRegisterPassword(e.target.value);
                  clearError('password');
                }}
                placeholder="********"
                autoComplete="new-password"
                maxLength={100}
                required
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password
                    ? 'register-password-error'
                    : 'register-password-hint'
                }
                className={`block w-full rounded-xl border bg-zinc-800 px-3 py-2.5 text-white placeholder:text-zinc-400 outline-none transition focus:ring-2 ${
                  errors.password
                    ? 'border-red-400 focus:border-red-300 focus:ring-red-500/20'
                    : 'border-violet-400/20 focus:border-violet-400 focus:ring-violet-500/20'
                }`}
              />

              {errors.password ? (
                <p
                  id="register-password-error"
                  className="mt-2 text-sm text-red-300"
                >
                  {errors.password}
                </p>
              ) : (
                <p
                  id="register-password-hint"
                  className={`mt-2 text-sm ${
                    registerPassword && passwordSecurityErrors.length === 0
                      ? 'text-emerald-300'
                      : 'text-zinc-400'
                  }`}
                >
                  {registerPassword && passwordSecurityErrors.length === 0
                    ? 'Contrasena segura.'
                    : 'Minimo 8 caracteres con mayuscula, minuscula, numero y caracter especial.'}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="register-confirm-password"
                className="mb-2 block text-sm font-medium text-violet-100"
              >
                Confirmar contrasena
              </label>

              <input
                type="password"
                id="register-confirm-password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearError('confirmPassword');
                }}
                placeholder="********"
                autoComplete="new-password"
                maxLength={100}
                required
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={
                  errors.confirmPassword
                    ? 'register-confirm-password-error'
                    : undefined
                }
                className={`block w-full rounded-xl border bg-zinc-800 px-3 py-2.5 text-white placeholder:text-zinc-400 outline-none transition focus:ring-2 ${
                  errors.confirmPassword
                    ? 'border-red-400 focus:border-red-300 focus:ring-red-500/20'
                    : 'border-violet-400/20 focus:border-violet-400 focus:ring-violet-500/20'
                }`}
              />

              {errors.confirmPassword && (
                <p
                  id="register-confirm-password-error"
                  className="mt-2 text-sm text-red-300"
                >
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </>
        )}

        {successMessage && (
          <div
            role="status"
            aria-live="polite"
            className="rounded-lg border border-emerald-400/30 bg-emerald-950/30 px-3 py-2 text-sm text-emerald-100"
          >
            {successMessage}
          </div>
        )}

        {errors.form && (
          <div
            role="alert"
            aria-live="polite"
            className="rounded-lg border border-red-400/30 bg-red-950/30 px-3 py-2 text-sm text-red-100"
          >
            {errors.form}
          </div>
        )}

        {isMockAuthEnabled && mode === 'login' && (
          <div className="rounded-lg border border-cyan-400/20 bg-cyan-950/20 px-3 py-2 text-xs leading-relaxed text-zinc-300">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-cyan-100">Usuario de prueba</p>
              <button
                type="button"
                className="rounded-md border border-cyan-400/30 px-2 py-1 font-semibold text-cyan-100 transition hover:bg-cyan-400/10"
                onClick={() => {
                  setUsernameOrEmail(mockLoginCredentials.usernameOrEmail);
                  setLoginPassword(mockLoginCredentials.password);
                  clearFeedback();
                }}
              >
                Usar
              </button>
            </div>
            <p>
              Email:{' '}
              <code className="rounded bg-zinc-950/70 px-1.5 py-0.5 text-cyan-100">
                {mockLoginCredentials.usernameOrEmail}
              </code>
            </p>
            <p>
              Password:{' '}
              <code className="rounded bg-zinc-950/70 px-1.5 py-0.5 text-cyan-100">
                {mockLoginCredentials.password}
              </code>
            </p>
          </div>
        )}

        {isMockAuthEnabled && mode === 'register' && (
          <div className="rounded-lg border border-cyan-400/20 bg-cyan-950/20 px-3 py-2 text-xs leading-relaxed text-zinc-300">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-cyan-100">Registro de prueba</p>
              <button
                type="button"
                className="rounded-md border border-cyan-400/30 px-2 py-1 font-semibold text-cyan-100 transition hover:bg-cyan-400/10"
                onClick={() => {
                  setRegisterUsername(mockRegisterSuggestion.username);
                  setRegisterEmail(mockRegisterSuggestion.email);
                  setRegisterPassword(mockRegisterSuggestion.password);
                  setConfirmPassword(mockRegisterSuggestion.password);
                  clearFeedback();
                }}
              >
                Usar
              </button>
            </div>
            <p>
              Email:{' '}
              <code className="rounded bg-zinc-950/70 px-1.5 py-0.5 text-cyan-100">
                {mockRegisterSuggestion.email}
              </code>
            </p>
            <p>
              Password:{' '}
              <code className="rounded bg-zinc-950/70 px-1.5 py-0.5 text-cyan-100">
                {mockRegisterSuggestion.password}
              </code>
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-violet-600 px-4 py-2.5 font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-300 sm:w-auto"
          >
            {isLoading
              ? mode === 'login'
                ? 'Ingresando...'
                : 'Creando...'
              : mode === 'login'
                ? 'Login'
                : 'Crear cuenta'}
          </button>

          {mode === 'login' ? (
            <button
              type="button"
              className="text-center text-sm text-violet-300 transition hover:text-violet-200 sm:text-left"
              onClick={() => {
                setErrors({
                  form: 'La recuperacion de contrasena se conectara cuando exista el endpoint correspondiente.',
                });
                setSuccessMessage(null);
              }}
            >
              Forgot Password?
            </button>
          ) : (
            <button
              type="button"
              className="text-center text-sm text-violet-300 transition hover:text-violet-200 sm:text-left"
              onClick={() => handleModeChange('login')}
            >
              Ya tengo cuenta
            </button>
          )}
        </div>
      </form>
    </BaseModal>
  );
};

export default LoginModal;
