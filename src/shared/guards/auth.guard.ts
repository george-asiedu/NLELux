import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, } from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { privileges } from '../utils/constants';
import { AuthRequestProps, AuthToken, JwtTokenPayload, } from '../interfaces/auth.model';
import { ConfigService } from '@nestjs/config';
import { findUserByID } from '../repository/user.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly secret: string;

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.secret = this.configService.get<string>('JWT_SECRET') as string;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequestProps>();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException(privileges.accessDenied);

    try {
      const payload = this.jwtService.verify<JwtTokenPayload>(token, {
        secret: this.secret,
      });

      const user = await findUserByID(this.prisma, payload.sub);
      if (
        (user.accountStatus !== 'VERIFIED' && !user) ||
        payload.token !== AuthToken.ACCESS
      ) {
        throw new UnauthorizedException(privileges.privilegesRestricted);
      }

      request.user = user;
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(privileges.sessionExpired);
      }

      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Your token is invalid.');
      }

      throw new UnauthorizedException(error.message || privileges.accessDenied);
    }
  }

  private extractTokenFromHeader(
    request: AuthRequestProps,
  ): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
