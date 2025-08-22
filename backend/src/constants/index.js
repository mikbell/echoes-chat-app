// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

// JWT Configuration
export const JWT_CONFIG = {
  EXPIRES_IN: '7d',
  COOKIE_MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  COOKIE_NAME: 'jwt'
};

// Password Configuration
export const PASSWORD_CONFIG = {
  MIN_LENGTH: 6,
  SALT_ROUNDS: 12 // Increased from 10 for better security
};

// Message Configuration
export const MESSAGE_CONFIG = {
  MAX_LENGTH: 1000,
  IMAGE_MAX_SIZE: 5 * 1024 * 1024 // 5MB in bytes
};

// User Configuration
export const USER_CONFIG = {
  FULLNAME_MIN_LENGTH: 2,
  FULLNAME_MAX_LENGTH: 50
};

// Error Messages
export const ERROR_MESSAGES = {
  // Authentication
  INVALID_CREDENTIALS: 'Invalid credentials',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  USER_NOT_FOUND: 'User not found',
  INVALID_TOKEN: 'Invalid or expired token',
  NO_TOKEN_PROVIDED: 'No token provided',
  UNAUTHORIZED: 'Unauthorized access',
  
  // General
  INTERNAL_SERVER_ERROR: 'Internal server error',
  VALIDATION_FAILED: 'Validation failed',
  REQUIRED_FIELDS_MISSING: 'All fields are required',
  
  // Files
  IMAGE_UPLOAD_FAILED: 'Failed to upload image',
  INVALID_FILE_TYPE: 'Invalid file type',
  FILE_TOO_LARGE: 'File size exceeds limit'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  USER_CREATED: 'Account created successfully',
  LOGIN_SUCCESS: 'Logged in successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  MESSAGE_SENT: 'Message sent successfully'
};

// Environment
export const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test'
};
