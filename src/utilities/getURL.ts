/**
 * URL utility functions for server and client-side URL resolution.
 * Uses NEXT_PUBLIC_SERVER_URL environment variable with fallback to localhost.
 */

/**
 * Gets the server-side URL for internal API calls and redirects.
 * Uses NEXT_PUBLIC_SERVER_URL environment variable or falls back to localhost.
 *
 * @returns The server URL without trailing slash
 */
export function getServerSideURL(): string {
  let url = process.env.NEXT_PUBLIC_SERVER_URL

  if (!url && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  if (!url) {
    url = 'http://localhost:3000'
  }

  return url.replace(/\/$/, '')
}

/**
 * Gets the client-side URL for browser navigation and external links.
 * In browser environment, uses window.location.origin.
 * In server environment, falls back to getServerSideURL.
 *
 * @returns The client URL without trailing slash
 */
export function getClientSideURL(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  return getServerSideURL()
}
