import dotenv from 'dotenv';

dotenv.config();

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value || typeof value !== 'string' || !value.trim()) {
    throw new Error(`${name} is required`);
  }
  return value.trim();
}

function getValidatedDatabaseUrl() {
  const raw = getRequiredEnv('DATABASE_URL');
  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error('DATABASE_URL must be a valid URL');
  }
  if (!['postgresql:', 'postgres:'].includes(parsed.protocol)) {
    throw new Error('DATABASE_URL must use postgres/postgresql protocol');
  }
  return raw;
}

function getAllowedCorsOrigins() {
  const raw = process.env.ALLOWED_ORIGINS || '';
  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function getLlmTemperature() {
  const raw = process.env.OPENAI_TEMPERATURE;
  if (raw == null || raw === '') {
    return 0.2;
  }
  const value = Number(raw);
  if (Number.isNaN(value) || value < 0 || value > 2) {
    throw new Error('OPENAI_TEMPERATURE must be a number between 0 and 2');
  }
  return value;
}

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: getRequiredEnv('JWT_SECRET'),
  databaseUrl: getValidatedDatabaseUrl(),
  corsAllowedOrigins: getAllowedCorsOrigins(),
  llmTemperature: getLlmTemperature(),
};
