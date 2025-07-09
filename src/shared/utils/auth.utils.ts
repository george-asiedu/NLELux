import * as bcrypt from 'bcrypt';
import { JwtTokenPayload } from '../../model/auth.model';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { ConflictException } from '@nestjs/common';
import { validations } from './constants';

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hashed: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashed);
};

export const generateCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateToken = (
  jwtService: JwtService,
  configService: ConfigService,
  payload: JwtTokenPayload,
  expiresIn: string,
): string => {
  const secret = configService.get<string>('JWT_SECRET');
  return jwtService.sign(payload, { secret, expiresIn });
};

export const verifyToken = (
  token: string,
  jwtService: JwtService,
  configService: ConfigService,
): JwtTokenPayload => {
  const secret = configService.get<string>('JWT_SECRET');
  return jwtService.verify<JwtTokenPayload>(token, { secret });
};

export const generateRawToken = (): string => {
  return randomBytes(32).toString('hex');
};

export const hashToken = (token: string): string => {
  return createHash('sha256').update(token).digest('hex');
};

export const tokenExpiresAt = () => {
  return new Date(Date.now() + 15 * 60 * 1000);
};

export const existingUser = async (prisma: PrismaService, email: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    throw new ConflictException(validations.userExists);
  }
  return existingUser;
};
