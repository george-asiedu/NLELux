import { PrismaService } from '../../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { errorMessages, validations } from '../utils/constants';

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
