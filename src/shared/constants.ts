export const swagger = {
  swaggerDocsTitle: 'NLELux API Documentation',
  swaggerDocsDescription:
    'REST API for NLELux ecommerce platform, providing endpoints for managing products, orders, users, and more.',
  swaggerDocsVersion: '1.0.0',
  swaggerDocsPath: 'api-docs',
  productionUrl: 'https://nle_lux.onrender.com',
  localUrl: 'http://localhost:',
  globalPrefix: 'api/v1',
  noAccess: 'Url cannot access this resource',
};

export const allowedOrigins = ['http://localhost:4200'];
export const allowedMethods = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
  'OPTIONS',
];
export const allowedHeaders = 'Content-Type, Accept, X-Powered-By: NLELux';

export const validations = {
  validationError: 'Validation failed',
  password:
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  invalidEmailFormat: 'Please provide a valid email address',
  emailTyeError: 'Email should be a string',
  emailError:
    'Email must be a valid format with only allowed characters (letters, numbers, dots, underscores, hyphens)',
  emailLengthError: 'Email cannot exceed 50 characters',
  nameLengthError: 'Name must be at least 5 characters long',
  nameMaxLengthError: 'Name cannot exceed 50 characters',
  nameFormatError:
    'Name must contain only letters and single spaces between words, no numbers or special characters allowed',
  userExists: 'User already exist',
  signupFailed: 'Failed to create user',
  loginFailed: 'Login failed, please check your credentials',
  userDataRequired: 'User data is required',
  nameRequired: 'Name is required',
  emailRequired: 'Email is required',
  passwordRequired: 'Password is required',
  passwordLengthError: 'Password must be at least 8 characters long',
  passwordMaxLengthError: 'Password cannot exceed 50 characters',
  codeRequired: 'Verification code is required',
  codeFormatError: 'Code must be a 6-digit number',
  invalidTokenPurpose: 'Invalid token purpose',
  invalidToken: 'Invalid token',
  expiredToken: 'Expired verification code',
  noTokenProvided: 'No token provided',
};

export const errorMessages = {
  port: 'Port not found in environment variables',
  userFailed: 'Failed to create user',
  signupFailed: 'Failed to sign up user',
  userNotFound: 'User not found',
  accountVerificationFailed: 'Account verification failed',
};

export const patterns = {
  password:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])[A-Za-z\d!@#$%^&*()\-_=+{};:,<.>]{8,50}$/,
  name: /^(?! )[A-Za-z]+(?: [A-Za-z]+)*(?<! )$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  code: /^\d{6}$/,
};

export const emailMessages = {
  verifyAccount: 'Verify your account',
  verificationMailSent: 'Verification email sent successfully to',
  failedVerificationMail: 'Failed to send verification email to',
};

export const privileges = {
  rolesKey: 'roles',
  privilegesRestricted:
    'Role does not have the required privileges to access this resource',
};
