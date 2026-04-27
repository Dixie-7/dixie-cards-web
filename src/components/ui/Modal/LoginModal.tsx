import React, { useRef, useState } from 'react';
import BaseModal from './BaseModal';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: { email: string; password: string }) => void;
  restoreFocusRef?: React.RefObject<HTMLElement | null>;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  restoreFocusRef,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const emailInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = {
      email: email.trim(),
      password,
    };

    onSubmit?.(formData);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Login"
      description="Enter your credentials to continue."
      size="md"
      initialFocusRef={emailInputRef}
      restoreFocusRef={restoreFocusRef}
    >
      <form onSubmit={handleSubmit} data-slot="login-form" className="space-y-4">
        <div>
          <label
            htmlFor="login-email"
            className="mb-2 block text-sm font-medium text-violet-100"
          >
            Username or Email
          </label>

          <input
            ref={emailInputRef}
            type="text"
            id="login-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            autoComplete="username"
            required
            className="block w-full rounded-xl border border-violet-400/20 bg-zinc-800 px-3 py-2.5 text-white placeholder:text-zinc-400 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="mb-2 block text-sm font-medium text-violet-100"
          >
            Password
          </label>

          <input
            type="password"
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            autoComplete="current-password"
            required
            className="block w-full rounded-xl border border-violet-400/20 bg-zinc-800 px-3 py-2.5 text-white placeholder:text-zinc-400 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <button
            type="submit"
            className="w-full rounded-xl bg-violet-600 px-4 py-2.5 font-medium text-white transition hover:bg-violet-500 sm:w-auto"
          >
            Login
          </button>

          <a
            href="#"
            className="text-center text-sm text-violet-300 transition hover:text-violet-200 sm:text-left"
          >
            Forgot Password?
          </a>
        </div>
      </form>
    </BaseModal>
  );
};

export default LoginModal;
