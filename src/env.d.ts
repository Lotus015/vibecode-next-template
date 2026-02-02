/**
 * TypeScript declarations for environment variables
 * This extends the NodeJS.ProcessEnv interface with our custom env vars
 */

declare namespace NodeJS {
  interface ProcessEnv {
    // Database Configuration
    DATABASE_URL?: string

    // Payload CMS Configuration
    PAYLOAD_SECRET?: string

    // Application URLs
    NEXT_PUBLIC_SERVER_URL?: string
    VERCEL_PROJECT_PRODUCTION_URL?: string

    // Application Settings
    NEXT_PUBLIC_APP_NAME?: string

    // Node environment
    NODE_ENV: "development" | "production" | "test"
  }
}
