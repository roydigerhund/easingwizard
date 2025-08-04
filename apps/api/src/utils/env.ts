import { z } from 'zod/v4';

const envSchema = z.object({
  API_URL: z.url(),
});

type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (cachedEnv) return cachedEnv;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error('Invalid environment variables:\n' + JSON.stringify(parsed.error.format(), null, 2));
  }
  cachedEnv = parsed.data;
  return cachedEnv;
}
