import type { CollectionConfig } from 'payload'

/**
 * Categories Collection
 *
 * Collection for organizing posts into categories.
 * This is a minimal implementation for S8 (Posts) relationship support.
 * Full implementation with parent/breadcrumbs will be added in S9.
 *
 * Features:
 * - Title and unique slug
 * - Proper indexing on slug
 */
export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Category',
    plural: 'Categories',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: {
    // Anyone can read categories
    read: () => true,
    // Only authenticated users can create
    create: ({ req: { user } }) => Boolean(user),
    // Only authenticated users can update
    update: ({ req: { user } }) => Boolean(user),
    // Only admins can delete
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL-friendly identifier',
      },
    },
  ],
}

export default Categories
