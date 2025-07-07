import {
  CanActivate,
  Injectable,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { privileges, validations } from '../utils/constants';
import { AuthRequest } from 'src/model/auth.model';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException(validations.noTokenProvided);

    try {
      const payload = this.jwtService.verify<{ id: string }>(token);

      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
        select: { id: true, email: true, name: true, role: true },
      });
      if (!user) {
        throw new UnauthorizedException(privileges.privilegesRestricted);
      }

      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException(validations.invalidToken);
    }
  }

  private extractTokenFromHeader(request: AuthRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
