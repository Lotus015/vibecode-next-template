/**
 * Access Control Functions
 *
 * Reusable access control functions for Payload CMS collections and globals.
 * Import from '@/access' to use in your collections.
 *
 * @example
 * import { authenticated, admins } from '@/access'
 *
 * export const MyCollection: CollectionConfig = {
 *   access: {
 *     create: authenticated,
 *     delete: admins,
 *   },
 * }
 */

export { authenticated } from './authenticated'
export { authenticatedOrPublished } from './authenticatedOrPublished'
export { admins, adminsAdminAccess } from './admins'
export { adminsOrSelf } from './adminsOrSelf'
