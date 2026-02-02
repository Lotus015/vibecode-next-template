/**
 * Payload CMS Hooks
 *
 * Reusable hooks for Payload collections and globals.
 * These are server-side hooks, not React hooks.
 *
 * For React hooks (client-side), import directly from their files:
 * - use-mobile.ts - useIsMobile hook for responsive design
 */

// Field hooks
export { formatSlug, formatSlugString } from './formatSlug'

// Collection hooks
export { populatePublishedAt } from './populatePublishedAt'
export {
  revalidatePathAfterChange,
  revalidatePathAfterDelete,
  revalidatePage,
  revalidatePost,
} from './revalidatePath'
