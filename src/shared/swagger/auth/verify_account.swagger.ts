import { ApiProperty } from '@nestjs/swagger';

export const verifyAccountResponse = {
  status: 200,
  message: 'Account verified successfully',
};

export const verifyAccountBadRequest = {
  message: [
    'code - Verification OTP code is required',
    'code - Verification OTP code must be a 6-digit number',
  ],
  error: 'Bad Request',
  statusCode: 400,
};

export const verificationSummary = "Verifies a user's email";
export const verifyAccountBodyDescription = 'JSON object containing OTP code';
export const verificationBadRequestDescription = 'Bad Request';

export class VerificationSwaggerDto {
  @ApiProperty({ example: '226867' })
  code: string;
}
export const tokenParam =
  'Token to verify user account, provided in the query string';
