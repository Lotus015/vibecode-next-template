import { revalidatePath as nextRevalidatePath, revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

type RevalidatePathOptions = {
  /**
   * Function to get the path(s) to revalidate based on the document
   * @param doc - The document that was changed
   * @returns Path or array of paths to revalidate
   */
  getPath: (doc: Record<string, unknown>) => string | string[]
  /**
   * Optional cache tags to revalidate
   * In Next.js 16, tags are revalidated with 'max' cacheLife profile for SWR behavior
   */
  tags?: string[]
}

/**
 * Creates an afterChange hook that revalidates Next.js paths
 *
 * This hook triggers Next.js ISR revalidation when content changes,
 * ensuring that cached pages are updated with the latest content.
 *
 * @param options - Configuration for path revalidation
 * @returns CollectionAfterChangeHook
 *
 * @example
 * ```ts
 * // For pages collection
 * export const Pages: CollectionConfig = {
 *   slug: 'pages',
 *   hooks: {
 *     afterChange: [
 *       revalidatePathAfterChange({
 *         getPath: (doc) => `/${doc.slug === 'home' ? '' : doc.slug}`,
 *       }),
 *     ],
 *   },
 * }
 *
 * // For posts collection with tag revalidation
 * export const Posts: CollectionConfig = {
 *   slug: 'posts',
 *   hooks: {
 *     afterChange: [
 *       revalidatePathAfterChange({
 *         getPath: (doc) => `/posts/${doc.slug}`,
 *         tags: ['posts-list'],
 *       }),
 *     ],
 *   },
 * }
 * ```
 */
export function revalidatePathAfterChange(
  options: RevalidatePathOptions,
): CollectionAfterChangeHook {
  return async ({ doc, req: { payload }, operation }) => {
    if (operation === 'create' || operation === 'update') {
      try {
        const paths = options.getPath(doc)
        const pathArray = Array.isArray(paths) ? paths : [paths]

        // Revalidate each path
        for (const path of pathArray) {
          if (path) {
            nextRevalidatePath(path)
            payload.logger.info(`Revalidated path: ${path}`)
          }
        }

        // Revalidate cache tags if provided (using 'max' cacheLife for SWR behavior in Next.js 16)
        if (options.tags?.length) {
          for (const tag of options.tags) {
            revalidateTag(tag, 'max')
            payload.logger.info(`Revalidated tag: ${tag}`)
          }
        }
      } catch (error) {
        // Log error but don't fail the operation
        payload.logger.error(`Failed to revalidate: ${String(error)}`)
      }
    }

    return doc
  }
}

/**
 * Creates an afterDelete hook that revalidates Next.js paths
 *
 * Similar to revalidatePathAfterChange but for delete operations.
 *
 * @param options - Configuration for path revalidation
 * @returns CollectionAfterDeleteHook
 */
export function revalidatePathAfterDelete(
  options: RevalidatePathOptions,
): CollectionAfterDeleteHook {
  return async ({ doc, req: { payload } }) => {
    try {
      const paths = options.getPath(doc)
      const pathArray = Array.isArray(paths) ? paths : [paths]

      // Revalidate each path
      for (const path of pathArray) {
        if (path) {
          nextRevalidatePath(path)
          payload.logger.info(`Revalidated path after delete: ${path}`)
        }
      }

      // Revalidate cache tags if provided (using 'max' cacheLife for SWR behavior in Next.js 16)
      if (options.tags?.length) {
        for (const tag of options.tags) {
          revalidateTag(tag, 'max')
          payload.logger.info(`Revalidated tag after delete: ${tag}`)
        }
      }
    } catch (error) {
      // Log error but don't fail the operation
      payload.logger.error(`Failed to revalidate after delete: ${String(error)}`)
    }

    return doc
  }
}

/**
 * Pre-configured afterChange hook for Pages collection
 */
export const revalidatePage: CollectionAfterChangeHook = revalidatePathAfterChange({
  getPath: (doc) => `/${doc.slug === 'home' ? '' : doc.slug}`,
})

/**
 * Pre-configured afterChange hook for Posts collection
 */
export const revalidatePost: CollectionAfterChangeHook = revalidatePathAfterChange({
  getPath: (doc) => `/posts/${doc.slug}`,
  tags: ['posts-list'],
})
