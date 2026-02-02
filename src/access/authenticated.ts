import type { Access } from 'payload'

/**
 * authenticated - Requires an authenticated user
 *
 * Returns true if the request includes an authenticated user.
 * Use this for operations that require login but don't need specific roles.
 *
 * @example
 * access: {
 *   create: authenticated,
 *   update: authenticated,
 * }
 */
export const authenticated: Access = ({ req: { user } }): boolean => {
  return Boolean(user)
}
