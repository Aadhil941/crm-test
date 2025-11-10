import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  port: number;
  nodeEnv: string;
  db: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
    poolMin: number;
    poolMax: number;
  };
  apiBaseUrl: string;
}

function validateEnv(): EnvConfig {
  const requiredEnvVars = [
    'DB_HOST',
    'DB_PORT',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD',
  ];

  const missing = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }

  return {
    port: parseInt(process.env.PORT || '3001', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    db: {
      host: process.env.DB_HOST!,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      name: process.env.DB_NAME!,
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      poolMin: parseInt(process.env.DB_POOL_MIN || '2', 10),
      poolMax: parseInt(process.env.DB_POOL_MAX || '20', 10),
    },
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3001',
  };
}

export const env = validateEnv();



