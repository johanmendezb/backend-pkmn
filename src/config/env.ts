import dotenv from 'dotenv'

dotenv.config()

interface EnvConfig {
  PORT: number
  JWT_SECRET: string
  POKEAPI_BASE_URL: string
  NODE_ENV: 'development' | 'production' | 'test'
  CACHE_TTL_SECONDS: number
}

function validateEnv(): EnvConfig {
  const requiredEnvVars = {
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    POKEAPI_BASE_URL: process.env.POKEAPI_BASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    CACHE_TTL_SECONDS: process.env.CACHE_TTL_SECONDS,
  }

  const missing = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }

  const port = parseInt(process.env.PORT!, 10)
  if (isNaN(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be a valid number between 1 and 65535')
  }

  const cacheTtl = parseInt(process.env.CACHE_TTL_SECONDS!, 10)
  if (isNaN(cacheTtl) || cacheTtl < 0) {
    throw new Error('CACHE_TTL_SECONDS must be a valid non-negative number')
  }

  const nodeEnv = process.env.NODE_ENV!
  if (!['development', 'production', 'test'].includes(nodeEnv)) {
    throw new Error('NODE_ENV must be one of: development, production, test')
  }

  return {
    PORT: port,
    JWT_SECRET: process.env.JWT_SECRET!,
    POKEAPI_BASE_URL: process.env.POKEAPI_BASE_URL!,
    NODE_ENV: nodeEnv as 'development' | 'production' | 'test',
    CACHE_TTL_SECONDS: cacheTtl,
  }
}

export const env = validateEnv()

