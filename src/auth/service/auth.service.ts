import {
  BadRequestException,
  ConflictException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../../mail/service/mail.service';
import { signupDto } from '../dto/signup.dto';
import {
  comparePassword,
  createLoginToken,
  generateCode,
  hashPassword,
} from '../../shared/utils/auth.utils';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { errorMessages, validations } from '../../shared/utils/constants';
import { verifyAccountDto } from '../dto/verify_account.dto';
import { signinDto } from '../dto/signin.dto';
import { JwtTokenPayload } from '../../shared/interfaces/auth.model';
import { AccountStatus } from '@prisma/client';
import {
  existingUser,
  findUserByEmail,
} from '../../shared/repository/user.repository';

@Injectable()
export class AuthService {
  private readonly secret: string | undefined;

  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.secret = this.configService.get<string>('JWT_SECRET');
  }

  async signupService(user: signupDto) {
    try {
      await existingUser(this.prisma, user.email);
      const verificationCode = generateCode();
      const hashedPassword = await hashPassword(user.password);
      const signupTokenDuration = '30m';

      await this.prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: hashedPassword,
        },
      });

      const token = this.jwtService.sign(
        {
          sub: user.email,
          code: verificationCode,
        },
        { expiresIn: signupTokenDuration, secret: this.secret },
      );

      await this.mailService.sendAccountVerificationEmail(
        user.email,
        verificationCode,
      );

      return { token };
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
      if (!body.code) throw new BadRequestException(validations.codeRequired);

      const payload: JwtTokenPayload = this.jwtService.verify(token, {
        secret: this.secret,
      });
      if (!payload) throw new BadRequestException(validations.tokenRequired);

      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) {
        throw new BadRequestException(validations.invalidToken);
      }

      const user = await findUserByEmail(this.prisma, payload.sub);
      if (user.accountStatus === AccountStatus.VERIFIED) {
        throw new BadRequestException(errorMessages.accountAlreadyVerified);
      }

      return await this.prisma.user.update({
        where: { id: user.id },
        data: {
          accountStatus: AccountStatus.VERIFIED,
        },
      });
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error && typeof error === 'object' && 'name' in error) {
        if (
          error.name === 'JsonWebTokenError' ||
          error.name === 'TokenExpiredError'
        ) {
          throw new BadRequestException(validations.invalidToken);
        }
      }

      throw new ServiceUnavailableException(
        errorMessages.accountVerificationFailed,
      );
    }
  }

  async signinService(user: signinDto) {
    try {
      const foundUser = await findUserByEmail(this.prisma, user.email);
      const passwordValid = comparePassword(user.password, foundUser.password);
      const isVerified = foundUser
        ? foundUser.accountStatus === AccountStatus.VERIFIED
        : false;
      if (!passwordValid || !isVerified)
        throw new BadRequestException(validations.invalidCredentials);

      const token = createLoginToken(
        foundUser,
        this.jwtService,
        this.configService,
      );

      return {
        token,
        user: {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
          accountStatus: foundUser.accountStatus,
        },
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
