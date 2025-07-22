import { z } from "zod/v4";

const envSchema = z.object({
  VITE_FRONTEND_URL: z.url(),
});

type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (cachedEnv) return cachedEnv;
  
  // Use import.meta.env for Vite/browser environments only
  const env = import.meta.env || {};
    
  const parsed = envSchema.safeParse(env);
  if (!parsed.success) {
    throw new Error(
      "Invalid environment variables:\n" +
        JSON.stringify(z.treeifyError(parsed.error), null, 2)
    );
  }
  cachedEnv = parsed.data;
  return cachedEnv;
}