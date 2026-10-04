import type { UserDto } from '@/types/auth';

export interface MockAuthUser extends UserDto {
  password: string;
  isActive: boolean;
  isEmailVerified: boolean;
}

export const mockLoginCredentials = {
  usernameOrEmail: 'demo@dixie.test',
  password: 'demo1234',
};

export const mockRegisterSuggestion = {
  username: 'nuevo.usuario',
  email: 'nuevo.usuario@dixie.test',
  password: 'Nuevo123!',
};

export const authUsersMock: MockAuthUser[] = [
  {
    id: 7,
    username: 'maxlg',
    email: mockLoginCredentials.usernameOrEmail,
    password: mockLoginCredentials.password,
    isActive: true,
    isEmailVerified: true,
    createdAt: '2026-10-01T12:00:00.000Z',
  },
  {
    id: 8,
    username: 'pending',
    email: 'pending@dixie.test',
    password: 'pending1234',
    isActive: false,
    isEmailVerified: false,
    createdAt: '2026-10-02T12:00:00.000Z',
  },
];
