import dotenv from 'dotenv';

dotenv.config();

const getEnvVariable = (key, defaultValue) => {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || defaultValue || '';
};

const env = {
  port: parseInt(getEnvVariable('PORT', '5000'), 10),
  nodeEnv: getEnvVariable('NODE_ENV', 'development'),
  databaseUrl: getEnvVariable('DATABASE_URL'),
  corsOrigin: getEnvVariable('CORS_ORIGIN', 'http://localhost:3000'),
  apiPrefix: getEnvVariable('API_PREFIX', '/api'),
  apiVersion: getEnvVariable('API_VERSION', 'v1'),
  logLevel: getEnvVariable('LOG_LEVEL', 'debug'),
};

export default env;
