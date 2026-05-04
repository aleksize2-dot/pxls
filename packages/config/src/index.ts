import { z } from 'zod'

export const envSchema = z.object({
  // Supabase
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_KEY: z.string().min(1),

  // KIE
  KIE_API_KEY: z.string().min(1),
  KIE_API_URL: z.string().url().default('https://api.kie.ai'),

  // Telegram
  TG_BOT_TOKEN: z.string().min(1),

  // Ngrok tunnel (dev)
  NGROK_URL: z.string().url().optional(),

  // App
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export type Env = z.infer<typeof envSchema>

export function parseEnv(overrides?: Partial<Env>): Env {
  const parsed = envSchema.safeParse({ ...process.env, ...overrides })
  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors)
    process.exit(1)
  }
  return parsed.data
}

export { MODELS, MODEL_TABS, PACKAGES, CREDITS_PER_STAR, SIGNUP_BONUS } from './pricing.js'
