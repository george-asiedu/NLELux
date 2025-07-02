import { User } from '@prisma/client';
import { Request } from 'express';

export interface JwtTokenPayload {
  email: string;
  code: string;
  type: 'signup' | 'access' | 'refresh';
}

export interface JwtPayload {
  userId: string;
}

export interface RequestInterface extends Request {
  user: User;
}

export interface ResponseInterface<T> {
  status: number;
  message: string;
  data: T;
}
