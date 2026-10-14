export interface UserDto {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

export interface LoginRequestDto {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  expiration: string;
  userId: number;
  username: string;
  email: string;
}

export interface RegisterRequestDto {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponseDto {
  userId: number;
  username: string;
  email: string;
  verificationSent: boolean;
}

export type AuthErrorCode =
  | 'VALIDATION_ERROR'
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_NOT_VERIFIED'
  | 'ACCOUNT_INACTIVE'
  | 'EMAIL_ALREADY_EXISTS'
  | 'USERNAME_ALREADY_EXISTS'
  | 'SESSION_EXPIRED'
  | 'RATE_LIMITED'
  | 'UNEXPECTED_ERROR';

export interface LoginResultDto {
  success: boolean;
  errorCode?: AuthErrorCode;
  message?: string;
  data?: LoginResponseDto;
}

export interface RegisterResultDto {
  success: boolean;
  errorCode?: AuthErrorCode;
  message?: string;
  data?: RegisterResponseDto;
}

export interface AuthActionResultDto {
  success: boolean;
  errorCode?: AuthErrorCode;
  message?: string;
}

export interface VerifyEmailRequestDto {
  token: string;
}

export interface ResendVerificationRequestDto {
  email: string;
}

export type AuthenticatedUserDto = Pick<UserDto, 'id' | 'username' | 'email'>;

export interface AuthSession {
  token: string;
  expiration: string;
  user: AuthenticatedUserDto;
}
