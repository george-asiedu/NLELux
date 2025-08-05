export const swagger = {
  swaggerDocsTitle: 'TrendLoom API Documentation',
  swaggerDocsDescription:
    'REST API for TrendLoom ecommerce platform, providing endpoints for managing products, orders, users, and more.',
  swaggerDocsVersion: '1.0.0',
  swaggerDocsPath: 'api-docs',
  productionUrl: 'https://nle_lux.onrender.com',
  localUrl: 'http://localhost:',
  globalPrefix: 'api',
  noAccess: 'Url cannot access this resource',
};

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
  confirmPasswordRequired: 'Confirm password is required',
  passwordsDoNotMatch: 'Passwords do not match',
  passwordLengthError: 'Password must be at least 8 characters long',
  passwordMaxLengthError: 'Password cannot exceed 50 characters',
  codeRequired: 'Verification code is required',
  codeFormatError: 'Code must be a 6-digit number',
  tokenRequired: 'Token s required',
  invalidToken: 'Invalid or expired token',
  noTokenProvided: 'No token provided',
  emailNotVerified: 'Email not verified, Please verify your email',
  invalidCredentials: 'Invalid email or password',
  invalidPassword: 'Invalid password',
  userExits: 'User already exist',
};

export const errorMessages = {
  port: 'Port not found in environment variables',
  userFailed: 'Failed to create user',
  signupFailed: 'Failed to sign up user',
  userNotFound: 'User not found',
  accountVerificationFailed: 'Account verification failed',
  signinFailed: 'Failed to sign in user',
  accountAlreadyVerified: 'Email is already verified',
};
export const successMessages = {
  signup: 'Signup successful',
  signin: 'Signin successful',
  accountVerified: 'Account verified successfully',
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
  accessDenied: 'Access denied',
};
