import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../../mail/service/mail.service';
import { signupDto } from '../dto/signup.dto';
import {
  existingUser,
  generateCode,
  generateToken,
  hashPassword,
  tokenExpiresAt,
  verifyToken,
} from '../../shared/utils/auth.utils';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { errorMessages, validations } from '../../shared/utils/constants';
import { verifyAccountDto } from '../dto/verify_account.dto';
import { signinDto } from '../dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private mail: MailService,
    private jwt: JwtService,
    private configService: ConfigService,
  ) {}

  async signupService(user: signupDto) {
    try {
      await existingUser(this.prisma, user.email);
      const verificationCode = generateCode();
      const hashedPassword = await hashPassword(user.password);

      const newUser = await this.prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: hashedPassword,
        },
        select: { id: true, email: true, name: true },
      });

      const expiresAt = tokenExpiresAt();
      await this.prisma.verificationToken.create({
        data: {
          userId: newUser.id,
          tokenHash: verificationCode,
          expiresAt,
        },
      });

      const token = generateToken(
        this.jwt,
        this.configService,
        {
          email: newUser.email,
          code: verificationCode,
          type: 'signup',
        },
        '25m',
      );

      await this.mail.sendAccountVerificationEmail(
        user.email,
        verificationCode,
      );

      return {
        user: newUser,
        token,
      };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(errorMessages.signupFailed);
    }
  }

  async verifyAccount(body: verifyAccountDto, token: string) {
    try {
      const decoded = verifyToken(token, this.jwt, this.configService);
      if (decoded.type !== 'signup')
        throw new BadRequestException(validations.invalidTokenPurpose);

      const { email } = decoded;
      const user = await this.prisma.user.findUnique({
        where: { email },
        select: { id: true, name: true, email: true, isEmailVerified: true },
      });
      if (!user) throw new BadRequestException(errorMessages.userNotFound);

      const verificationToken = await this.prisma.verificationToken.findFirst({
        where: {
          userId: user.id,
          expiresAt: { gt: new Date() },
        },
      });

      if (!verificationToken || verificationToken.tokenHash !== body.code) {
        throw new BadRequestException(validations.invalidToken);
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: { isEmailVerified: true },
      });

      await this.prisma.verificationToken.delete({
        where: { id: verificationToken.id },
      });

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isEmailVerified: true,
        },
      };
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'name' in error &&
        error.name === 'TokenExpiredError'
      )
        throw new BadRequestException(validations.expiredToken);
      throw new BadRequestException(
        (typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message?: string }).message
          : undefined) || errorMessages.accountVerificationFailed,
      );
    }
  }
}
