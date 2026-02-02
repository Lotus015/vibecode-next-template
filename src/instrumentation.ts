/**
 * Next.js Instrumentation
 *
 * This file is used to handle global error handling and monitoring.
 * It catches unhandled promise rejections that can occur when
 * Payload CMS fails to connect to the database.
 */

export async function register(): Promise<void> {
  // Only run on the server
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Handle unhandled promise rejections gracefully
    // This prevents noisy errors when database is unavailable during development
    process.on('unhandledRejection', (reason: unknown) => {
      // Ignore undefined rejections (common with Payload DB connection failures)
      if (reason === undefined) {
        return
      }

      // Log actual errors for debugging
      if (reason instanceof Error) {
        // Check if it's a known Payload initialization error
        if (
          reason.message?.includes('cannot connect to Postgres') ||
          reason.message?.includes('ECONNREFUSED')
        ) {
          // Already logged by Payload, no need to log again
          return
        }
        console.error('Unhandled rejection:', reason.message)
      } else {
        console.error('Unhandled rejection:', reason)
      }
    })
  }
}
