import type { Access, PayloadRequest } from 'payload'

/**
 * Type for admin panel access (boolean only, no query objects)
 *
 * The `admin` access key in collections requires a function that returns
 * only `boolean | Promise<boolean>`, unlike other access operations which
 * can also return query objects (Where).
 */
type AdminAccess = ({ req }: { req: PayloadRequest }) => boolean | Promise<boolean>

/**
 * admins - Requires user with admin role
 *
 * Returns true if the authenticated user has the 'admin' role.
 * Use this for operations that should be restricted to administrators only.
 *
 * @example
 * access: {
 *   delete: admins,
 * }
 */
export const admins: Access = ({ req: { user } }): boolean => {
  return user?.role === 'admin'
}

/**
 * adminsAdminAccess - Admin-only access for the `admin` key in collections
 *
 * Same as `admins` but typed specifically for the `admin` access key,
 * which requires `boolean | Promise<boolean>` return type (no query objects).
 *
 * @example
 * access: {
 *   admin: adminsAdminAccess,
 * }
 */
export const adminsAdminAccess: AdminAccess = ({ req: { user } }): boolean => {
  return user?.role === 'admin'
}
