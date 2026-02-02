import type { CollectionBeforeChangeHook } from 'payload'

/**
 * Before change hook that auto-populates publishedAt date
 *
 * This hook automatically sets the publishedAt field when:
 * 1. A document is first published (status changes to 'published')
 * 2. The publishedAt field is not already set
 *
 * This ensures that the publishedAt date reflects when content was first
 * made public, not when it was created as a draft.
 *
 * @example
 * ```ts
 * export const MyCollection: CollectionConfig = {
 *   slug: 'my-collection',
 *   hooks: {
 *     beforeChange: [populatePublishedAt],
 *   },
 *   // ...
 * }
 * ```
 */
export const populatePublishedAt: CollectionBeforeChangeHook = ({
  data,
  operation,
  originalDoc,
}) => {
  // Only run on create or update operations
  if (operation !== 'create' && operation !== 'update') {
    return data
  }

  // Check if we're publishing (status is 'published' and publishedAt is not set)
  const isPublishing = data._status === 'published'
  const alreadyHasPublishedAt = data.publishedAt || originalDoc?.publishedAt

  // Auto-set publishedAt when first publishing
  if (isPublishing && !alreadyHasPublishedAt) {
    return {
      ...data,
      publishedAt: new Date().toISOString(),
    }
  }

  return data
}

export default populatePublishedAt
