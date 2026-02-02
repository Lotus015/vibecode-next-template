import type { FieldHook } from 'payload'

/**
 * Formats a string into a URL-friendly slug
 *
 * - Converts to lowercase
 * - Replaces spaces with hyphens
 * - Removes special characters (keeps only a-z, 0-9, and hyphens)
 * - Removes consecutive hyphens
 * - Removes leading/trailing hyphens
 */
export function formatSlugString(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Field hook for formatting slugs
 *
 * Use this hook on slug fields to auto-generate URL-friendly slugs from title.
 * If a slug value is manually provided, it will be formatted.
 * If no slug is provided, it will be generated from the title field.
 *
 * @example
 * ```ts
 * {
 *   name: 'slug',
 *   type: 'text',
 *   hooks: {
 *     beforeValidate: [formatSlug],
 *   },
 * }
 * ```
 */
export const formatSlug: FieldHook = ({ value, data }) => {
  // If slug is manually provided, format it
  if (typeof value === 'string' && value.length > 0) {
    return formatSlugString(value)
  }

  // If no slug, generate from title
  if (data?.title && typeof data.title === 'string') {
    return formatSlugString(data.title)
  }

  return value
}

export default formatSlug
