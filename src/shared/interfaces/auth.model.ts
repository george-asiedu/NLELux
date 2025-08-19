import { AccountStatus, Role } from '@prisma/client';

export enum AuthToken {
  ACCESS = 'access-tk',
  REFRESH_TOKEN = 'refresh-tk',
}

export interface Data<T> {
  message: string;
  data: T;
}

export interface MessageOnly {
  message: string;
}

export interface RefreshTokenPayload {
  sub: string;
  email: string;
  token: AuthToken;
  exp: number;
  iat: number;
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  accountStatus?: AccountStatus;
}

export interface JwtTokenPayload {
  sub: string;
  token: AuthToken;
  exp: number;
  iat: number;
}

export interface AuthRequestProps {
  headers: {
    authorization?: string;
    [key: string]: any;
  };
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  [key: string]: any;
}

export interface VerifyEmailProps {
  code: string;
  expirationTime?: string;
}

export interface EmailTokenProps {
  name: string;
  token: string;
}
