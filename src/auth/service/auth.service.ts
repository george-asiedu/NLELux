import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../../mail/service/mail.service';
import { signupDto } from '../dto/signup.dto';
import {
  comparePassword,
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
import { JwtPayload } from 'src/model/auth.model';

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

  async signinService(user: signinDto) {
    try {
      const foundUser = await this.prisma.user.findUnique({
        where: { email: user.email.toLowerCase() },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isEmailVerified: true,
          password: true,
        },
      });
      if (!foundUser) {
        throw new BadRequestException(validations.invalidCredentials);
      }

      if (!foundUser.isEmailVerified) {
        throw new BadRequestException(validations.emailNotVerified);
      }

      const isPasswordValid = await comparePassword(
        user.password,
        foundUser.password,
      );
      if (!isPasswordValid) {
        throw new BadRequestException(validations.invalidPassword);
      }

      const payload: JwtPayload = {
        userId: foundUser.id,
      };

      const accessToken = this.jwt.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRATION'),
      });

      const refreshToken = this.jwt.sign(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES'),
      });

      await this.prisma.refreshToken.create({
        data: {
          userId: foundUser.id,
          tokenHash: refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      return {
        user: {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
          isEmailVerified: foundUser.isEmailVerified,
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new BadRequestException(
        (typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message?: string }).message
          : undefined) || errorMessages.signinFailed,
      );
    }
  }
}
