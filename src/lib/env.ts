import { z } from "zod"

/**
 * Server-side environment variables schema
 * These are validated at runtime and NOT exposed to the client
 */
const serverEnvSchema = z.object({
  // Database - required for runtime, optional for builds
  DATABASE_URL: z.string().url().optional(),
  // Payload CMS secret - required for runtime, optional for builds
  PAYLOAD_SECRET: z.string().min(16).optional(),
  // Vercel auto-populated URL (optional, used as fallback)
  VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
})

/**
 * Client-side environment variables schema
 * These are exposed to the browser (prefixed with NEXT_PUBLIC_)
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("Vibecode"),
  NEXT_PUBLIC_SERVER_URL: z.string().url().optional(),
})

/**
 * Combined environment schema
 */
const envSchema = serverEnvSchema.merge(clientEnvSchema)

/**
 * Validated environment variables
 * Note: Some variables are optional during builds (DATABASE_URL, PAYLOAD_SECRET)
 * but are required at runtime when the CMS is active
 */
export const env = envSchema.parse({
  // Server-side variables
  DATABASE_URL: process.env.DATABASE_URL,
  PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
  VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  // Client-side variables
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
})

/**
 * Type-safe environment object
 */
export type Env = z.infer<typeof envSchema>

/**
 * Helper to get the server URL (for SSR and API routes)
 * Prefers NEXT_PUBLIC_SERVER_URL, falls back to Vercel URL
 */
export function getServerURL(): string {
  if (env.NEXT_PUBLIC_SERVER_URL) {
    return env.NEXT_PUBLIC_SERVER_URL
  }
  if (env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  return "http://localhost:3000"
}
