import type { Access, AccessResult } from 'payload'

/**
 * adminsOrSelf - Admins or the user accessing their own data
 *
 * Returns true for admins (full access).
 * For non-admins, returns a query that filters to only the user's own documents.
 *
 * Use this for operations where users should only access their own data,
 * but admins need access to everything.
 *
 * @example
 * access: {
 *   read: adminsOrSelf,
 *   update: adminsOrSelf,
 * }
 */
export const adminsOrSelf: Access = ({ req: { user } }): AccessResult => {
  // Not authenticated - no access
  if (!user) {
    return false
  }

  // Admins have full access
  if (user.role === 'admin') {
    return true
  }

  // Non-admins can only access their own document
  return {
    id: {
      equals: user.id,
    },
  }
}
