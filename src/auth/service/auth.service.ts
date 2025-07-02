import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../../mail/service/mail.service';
import { signupDto } from '../dto/signup.dto';
import {
  generateCode,
  generateToken,
  hashPassword,
  tokenExpiresAt,
  verifyToken,
} from '../../shared/utils/auth.utils';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { errorMessages, validations } from '../../shared/constants';
import { verifyAccountDto } from '../dto/verify_account.dto';

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
      const existingUser = await this.prisma.user.findUnique({
        where: { email: user.email },
      });
      if (existingUser) {
        throw new ConflictException(validations.userExists);
      }

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
        },
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError')
        throw new BadRequestException(validations.expiredToken);
      throw new BadRequestException(
        error.message || errorMessages.accountVerificationFailed,
      );
    }
  }
}
