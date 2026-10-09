import { createContext } from 'react';
import type {
  AuthenticatedUserDto,
  LoginRequestDto,
  RegisterRequestDto,
} from '@/features/auth/types/auth.types';

export interface AuthContextValue {
  user: AuthenticatedUserDto | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequestDto) => Promise<void>;
  register: (credentials: RegisterRequestDto) => Promise<string | undefined>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
