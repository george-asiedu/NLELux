import { ApiProperty } from '@nestjs/swagger';

export const signupResponse = {
  status: 201,
  message:
    'Signup Successful, please check your email o complete registration.',
  data: {
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODYNGYzg5MTk4MzA5N2U5NGMyNzY4NiIsImVtYWlsIjoiZXhhbXBsZUBkb20uY29',
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

export const signupSummary = 'Signup a new user';
export const signupBodyDescription =
  'JSON object containing user signup details';
export const signupBadRequestDescription = 'Bad Request';
export const signupConflictDescription = 'Conflict';

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
