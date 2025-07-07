import { ApiProperty } from '@nestjs/swagger';

export const signupResponse = {
  status: 201,
  message: 'User signed up successfully',
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

export const userExists = {
  message: 'User already exist',
  error: 'Conflict',
  statusCode: 409,
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
