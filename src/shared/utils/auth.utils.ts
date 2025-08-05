import * as bcrypt from 'bcrypt';
import { AuthToken, UserInfo } from '../interfaces/auth.model';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

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

export const createLoginToken = (
  user: UserInfo,
  jwtService: JwtService,
  configService: ConfigService,
) => {
  let secretKey = configService.get<string>('JWT_SECRET');
  const accessTokenDuration = '30m';

  const accessToken = jwtService.sign(
    {
      sub: user.id,
      token: AuthToken.ACCESS,
    },
    { expiresIn: accessTokenDuration, secret: secretKey },
  );

  const refreshTokenDuration = '7d';
  const refreshToken = jwtService.sign(
    {
      sub: user.id,
      email: user.email,
      token: AuthToken.REFRESH_TOKEN,
    },
    { expiresIn: refreshTokenDuration, secret: secretKey },
  );

  return { accessToken, refreshToken };
};
