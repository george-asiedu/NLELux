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
} from '../../shared/utils/auth.utils';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { errorMessages } from '../../shared/constants';

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
        select: { id: true, email: true, name: true, role: true },
      });
      if (existingUser) {
        throw new ConflictException('User already exists');
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
        '1h',
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
}
