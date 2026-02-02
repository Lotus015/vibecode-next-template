import type { CollectionConfig } from 'payload'

/**
 * Categories Collection
 *
 * Collection for organizing posts into categories with nested hierarchy support.
 *
 * Features:
 * - Title and unique slug
 * - Parent self-reference for nested categories
 * - Breadcrumbs field for nested docs hierarchy
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
    defaultColumns: ['title', 'slug', 'parent', 'updatedAt'],
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
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Parent Category',
      admin: {
        description: 'Select a parent category for nesting',
      },
      // Filter out the current document to prevent circular references
      filterOptions: ({ id }) => {
        if (!id) return true
        return {
          id: {
            not_equals: id,
          },
        }
      },
    },
    {
      name: 'breadcrumbs',
      type: 'array',
      label: 'Breadcrumbs',
      admin: {
        readOnly: true,
        description: 'Auto-generated breadcrumb trail (managed by nested-docs plugin)',
      },
      fields: [
        {
          name: 'doc',
          type: 'relationship',
          relationTo: 'categories',
          label: 'Category',
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
        },
        {
          name: 'label',
          type: 'text',
          label: 'Label',
        },
      ],
    },
  ],
}

export default Categories
