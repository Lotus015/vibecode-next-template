import type { Access, AccessResult } from 'payload'

/**
 * authenticatedOrPublished - Public read for published content, auth for everything else
 *
 * Returns true for authenticated users (full access).
 * For unauthenticated users, returns a query that filters to only published content.
 *
 * Use this for content that should be publicly readable when published,
 * but requires authentication for editing/viewing drafts.
 *
 * @example
 * access: {
 *   read: authenticatedOrPublished,
 * }
 */
export const authenticatedOrPublished: Access = ({ req: { user } }): AccessResult => {
  // Authenticated users can access all content (published and drafts)
  if (user) {
    return true
  }

  // Unauthenticated users can only read published content
  return {
    _status: {
      equals: 'published',
    },
  }
}
