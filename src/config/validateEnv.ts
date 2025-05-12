import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'NODE_ENV'
];

export const validateEnv = () => {
  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}`
    );
  }

  // Validate JWT_SECRET length
  if (process.env.JWT_SECRET!.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }

  // Validate JWT_EXPIRES_IN format
  const expiresInRegex = /^\d+[smhd]$/;
  if (!expiresInRegex.test(process.env.JWT_EXPIRES_IN!)) {
    throw new Error('JWT_EXPIRES_IN must be in format: <number>[s|m|h|d]');
  }
}; 