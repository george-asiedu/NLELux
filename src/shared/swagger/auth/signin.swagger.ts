import { ApiProperty } from '@nestjs/swagger';

export const signinResponse = {
  status: 200,
  message: 'Signin successful',
  data: {
    token: {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODYNGYzg5MTk4MzA5N2U5NGMyNzY4NiIsImVtYWlsIjoiZXhhbXBsZUBkb20uY29',
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODY0Zjk4OTAxYjMwOTdlOTRjMjc2ODYiLCJlbWFpbCI6InJlc2l3MzMxMjlAb2ZhY2VyLmNvbSIsImlhdCI6MTc1MTQ0Nzk0NiwiaXNzIjoiYXV0aC1zZXJ2aWNSIsImV4cCI6MTc1MTQ0NTE0Nn0',
    },
    user: {
      id: '6864f9891a83097e94c27686',
      name: 'Kanan Stark',
      email: 'resiw33129@ofacer.com',
      role: 'LEANER',
      accountStatus: 'VERIFIED',
    },
  },
};

export const signinBadRequest = {
  message: [
    'email - Please provide a valid email address',
    'email - Email must be a valid format with only allowed characters (letters, numbers, dots, underscores, hyphens)',
    'password - Password must be at least 8 characters long',
    'password - Password cannot exceed 50 characters',
    'invalidCredentials - Invalid email or password',
    'emailNotVerified - Email not verified, Please verify your email',
    'invalidCredentials - Invalid account credentials',
  ],
  error: 'Bad Request',
  statusCode: 400,
};

export const signinSummary = 'Signin a user with credentials';
export const signinBodyDescription =
  'JSON object containing user signin details';
export const signinBadRequestDescription = 'Bad Request';
export class SigninSwaggerDto {
  @ApiProperty({ example: 'resiw33129@ofacer.com' })
  email: string;

  @ApiProperty({ example: 'Password123!' })
  password: string;
}
