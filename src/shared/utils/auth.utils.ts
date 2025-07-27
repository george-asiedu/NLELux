import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { errorMessages, validations } from './constants';

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

export const existingUser = async (prisma: PrismaService, email: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (existingUser) throw new ConflictException(validations.userExits);
  return existingUser;
};

export const findUserByEmail = async (prisma: PrismaService, email: string) => {
  const foundUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      accountStatus: true,
      password: true,
    },
  });
  if (!foundUser) throw new NotFoundException(errorMessages.userNotFound);
  return foundUser;
};

export const findUserByID = async (prisma: PrismaService, id: string) => {
  const foundUser = await prisma.user.findUnique({ where: { id } });
  if (!foundUser) throw new NotFoundException(errorMessages.userNotFound);
  return foundUser;
};
