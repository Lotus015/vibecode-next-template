import type { CollectionConfig, CollectionAfterChangeHook, FieldHook } from 'payload'
import { Content } from '@/blocks/Content/config'

/**
 * Format slug from title
 * Converts title to URL-friendly slug (lowercase, hyphens, no special chars)
 */
const formatSlug: FieldHook = ({ value, data }) => {
  // If slug is manually provided, use it (but format it)
  if (typeof value === 'string' && value.length > 0) {
    return value
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  // If no slug, generate from title
  if (data?.title && typeof data.title === 'string') {
    return data.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  return value
}

/**
 * Revalidate path hook
 * Triggers Next.js revalidation when a page is updated
 */
const revalidatePage: CollectionAfterChangeHook = async ({
  doc,
  req: { payload },
  operation,
}) => {
  if (operation === 'create' || operation === 'update') {
    // Log revalidation (actual revalidation requires Next.js revalidatePath)
    payload.logger.info(`Revalidating page: ${doc.slug}`)
  }

  return doc
}

/**
 * Pages Collection
 *
 * Collection for static pages with hero sections, content blocks, and SEO.
 *
 * Features:
 * - Title and unique slug with auto-generation
 * - Hero section with multiple type options
 * - Layout with blocks array (to be populated with block types)
 * - SEO meta fields (title, description, image)
 * - Access control: published pages are public
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Page',
    plural: 'Pages',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'publishedAt', 'updatedAt'],
    preview: (doc) => {
      if (doc?.slug) {
        return `/${doc.slug === 'home' ? '' : doc.slug}`
      }
      return null
    },
  },
  // Hooks for slug generation and revalidation
  hooks: {
    afterChange: [revalidatePage],
  },
  access: {
    // Public read access for published pages
    read: ({ req: { user } }) => {
      // Authenticated users can read all pages
      if (user) return true

      // Public can only read published pages
      return {
        _status: {
          equals: 'published',
        },
      }
    },
    // Only authenticated users can create pages
    create: ({ req: { user } }) => Boolean(user),
    // Only authenticated users can update pages
    update: ({ req: { user } }) => Boolean(user),
    // Only admins can delete pages
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  // Enable draft/publish functionality
  versions: {
    drafts: true,
  },
  fields: [
    // Title field
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
    },
    // Slug field (unique, indexed)
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'URL-friendly identifier. Auto-generated from title if left empty.',
      },
      hooks: {
        beforeValidate: [formatSlug],
      },
    },
    // Published date
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Published At',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'When this page was/will be published',
      },
    },
    // Hero group field
    {
      name: 'hero',
      type: 'group',
      label: 'Hero Section',
      fields: [
        {
          name: 'type',
          type: 'select',
          label: 'Hero Type',
          defaultValue: 'none',
          options: [
            { label: 'None', value: 'none' },
            { label: 'High Impact', value: 'highImpact' },
            { label: 'Medium Impact', value: 'mediumImpact' },
            { label: 'Low Impact', value: 'lowImpact' },
          ],
        },
        {
          name: 'heading',
          type: 'text',
          label: 'Heading',
          admin: {
            condition: (_, siblingData) => siblingData?.type && siblingData.type !== 'none',
          },
        },
        {
          name: 'subheading',
          type: 'text',
          label: 'Subheading',
          admin: {
            condition: (_, siblingData) => siblingData?.type && siblingData.type !== 'none',
          },
        },
        {
          name: 'media',
          type: 'upload',
          label: 'Hero Media',
          relationTo: 'media',
          admin: {
            condition: (_, siblingData) =>
              siblingData?.type === 'highImpact' || siblingData?.type === 'mediumImpact',
          },
        },
        {
          name: 'richText',
          type: 'richText',
          label: 'Rich Text Content',
          admin: {
            condition: (_, siblingData) => siblingData?.type && siblingData.type !== 'none',
          },
        },
      ],
    },
    // Layout blocks array
    {
      name: 'layout',
      type: 'blocks',
      label: 'Layout',
      blocks: [Content],
      admin: {
        description: 'Add content blocks to build the page layout',
      },
    },
    // Meta group for SEO
    {
      name: 'meta',
      type: 'group',
      label: 'SEO & Meta',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Meta Title',
          admin: {
            description:
              'Title for search engines and social sharing. Defaults to page title if empty.',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Meta Description',
          admin: {
            description: 'Description for search engines and social sharing.',
          },
        },
        {
          name: 'image',
          type: 'upload',
          label: 'Meta Image',
          relationTo: 'media',
          admin: {
            description: 'Image for social sharing (Open Graph / Twitter Card)',
          },
        },
      ],
    },
  ],
}

export default Pages
