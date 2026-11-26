import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Load Neon .env.local from project root, plus optional backend/.env
dotenv.config({ path: path.resolve(__dirname, '../../../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  ALLOWED_ORIGINS: z.string().default('http://localhost:8081,http://localhost:8082'),
  DATABASE_URL: z.string().optional(),
  DATABASE_URL_UNPOOLED: z.string().optional(),
  AI_PROVIDER: z.enum(['local', 'openai', 'fallback']).default('local'),
  LOCAL_AI_URL: z.string().url().default('http://localhost:11434/v1'),
  LOCAL_AI_MODEL: z.string().default('llama3.2'),
  AI_API_KEY: z.string().optional().default(''),
  AI_MODEL: z.string().default('gpt-4o-mini'),
  AI_BASE_URL: z.string().url().default('https://api.openai.com/v1'),
  JWT_SECRET: z.string().min(16).default('dev-local-jwt-secret-change-in-prod'),
});

export const env = envSchema.parse(process.env);
export const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map((s) => s.trim());
