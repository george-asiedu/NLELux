import { ApiProperty } from '@nestjs/swagger';

export const signupResponse = {
  status: 201,
  message: 'Signup successful',
  data: {
    user: {
      id: '6864f9891a83097e94c27686',
      email: 'resiw33129@ofacer.com',
      name: 'Kanan Stark',
    },
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJlc2l3MzMxMjlAb2ZhY2VyLmNvbSIsImNvZGUiOiIzNTQxODYiLCJ0eXBlIjoic2lnbnVwIiwiaWF0IjoxNzUxNDQ3OTQ2LCJleHAiOjE3NTE0NTE1NDZ9.l4Q9cEnU2I64m__PzLuIKK0ynNFHYI3GQ1rIfazVLI0',
  },
};

export const verifyAccountResponse = {
  status: 200,
  message: 'Account verified successfully',
  data: {
    user: {
      id: '6864f9891a83097e94c27686',
      email: 'resiw33129@ofacer.com',
      name: 'Kanan Stark',
      isEmailVerified: true,
    },
  },
};

export const signinResponse = {
  status: 200,
  message: 'Signin successful',
  data: {
    user: {
      id: '6864f9891a83097e94c27686',
      name: 'Kanan Stark',
      email: 'resiw33129@ofacer.com',
      role: 'customer',
      isEmailVerified: true,
    },
    accessToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODYNGYzg5MTk4MzA5N2U5NGMyNzY4NiIsImVtYWlsIjoiZXhhbXBsZUBkb20uY29',
    refreshToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODY0Zjk4OTAxYjMwOTdlOTRjMjc2ODYiLCJlbWFpbCI6InJlc2l3MzMxMjlAb2ZhY2VyLmNvbSIsImlhdCI6MTc1MTQ0Nzk0NiwiaXNzIjoiYXV0aC1zZXJ2aWNSIsImV4cCI6MTc1MTQ0NTE0Nn0',
  },
};

export const signupBadRequest = {
  message: [
    'name - Name must contain only letters and single spaces between words, no numbers or special characters allowed',
    'email - Please provide a valid email address',
    'email - Email must be a valid format with only allowed characters (letters, numbers, dots, underscores, hyphens)',
    'password - Password must be at least 8 characters long',
    'password - Password cannot exceed 50 characters',
    'passwordsDoNotMatch - Passwords do not match',
  ],
  error: 'Bad Request',
  statusCode: 400,
};

export const verifyAccountBadRequest = {
  message: [
    'code - Verification code is required',
    'code - Code must be a 6-digit number',
  ],
  error: 'Bad Request',
  statusCode: 400,
};

export const signinBadRequest = {
  message: [
    'email - Please provide a valid email address',
    'email - Email must be a valid format with only allowed characters (letters, numbers, dots, underscores, hyphens)',
    'password - Password must be at least 8 characters long',
    'password - Password cannot exceed 50 characters',
    'invalidCredentials - Invalid email or password',
    'emailNotVerified - Email not verified, Please verify your email',
    'invalidPassword - Invalid password',
  ],
  error: 'Bad Request',
  statusCode: 400,
};

export const userExists = {
  message: 'User already exist',
  error: 'Conflict',
  statusCode: 409,
};

export const summary = {
  signup: 'User Signup',
  verifyAccount: 'Verify account using code and token',
  signin: 'User Signin',
};

export const bodyDescription = {
  signup: 'JSON object containing user signup details',
  verifyAccount: "Two factor auth code to verify user's account",
  signin: 'JSON object containing user signin details',
  tokenParam: 'Token to verify user account, provided in the query string',
};

export const responseDescription = {
  badRequest: 'Bad Request',
  unauthorized: 'Unauthorized',
  forbidden: 'Forbidden',
  notFound: 'Not Found',
  conflict: 'Conflict',
};

export class SignupSwaggerDto {
  @ApiProperty({ example: 'Kanan Stark' })
  name: string;

  @ApiProperty({ example: 'resiw33129@ofacer.com' })
  email: string;

  @ApiProperty({ example: 'Password123!' })
  password: string;

  @ApiProperty({ example: 'Password123!' })
  confirmPassword: string;
}

export class VerifyAccountSwaggerDto {
  @ApiProperty({ example: '123456' })
  code: string;
}

export class SigninSwaggerDto {
  @ApiProperty({ example: 'resiw33129@ofacer.com' })
  email: string;

  @ApiProperty({ example: 'Password123!' })
  password: string;
}
