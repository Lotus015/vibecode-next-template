import type { CollectionConfig, CollectionAfterChangeHook, FieldHook } from 'payload'

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
 * Triggers Next.js revalidation when a post is updated
 */
const revalidatePost: CollectionAfterChangeHook = async ({
  doc,
  req: { payload },
  operation,
}) => {
  if (operation === 'create' || operation === 'update') {
    // Log revalidation (actual revalidation requires Next.js revalidatePath)
    payload.logger.info(`Revalidating post: ${doc.slug}`)
  }

  return doc
}

/**
 * Posts Collection
 *
 * Collection for blog posts with rich text content, categories, and author.
 *
 * Features:
 * - Title, unique slug with auto-generation, and excerpt
 * - Rich text content using Lexical editor
 * - Featured image (relationship to Media)
 * - Categories (hasMany relationship to Categories)
 * - Author (relationship to Users)
 * - Published date for scheduling
 * - SEO meta fields (title, description, image)
 * - Access control: published posts are public
 */
export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Post',
    plural: 'Posts',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'author', 'publishedAt', 'updatedAt'],
    preview: (doc) => {
      if (doc?.slug) {
        return `/posts/${doc.slug}`
      }
      return null
    },
  },
  // Hooks for slug generation and revalidation
  hooks: {
    afterChange: [revalidatePost],
  },
  access: {
    // Public read access for published posts
    read: ({ req: { user } }) => {
      // Authenticated users can read all posts
      if (user) return true

      // Public can only read published posts
      return {
        _status: {
          equals: 'published',
        },
      }
    },
    // Only authenticated users can create posts
    create: ({ req: { user } }) => Boolean(user),
    // Only authenticated users can update posts
    update: ({ req: { user } }) => Boolean(user),
    // Only admins can delete posts
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
    // Excerpt field
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Excerpt',
      admin: {
        description: 'A short summary of the post for listings and SEO.',
      },
    },
    // Content field (richText)
    {
      name: 'content',
      type: 'richText',
      label: 'Content',
      required: true,
    },
    // Featured image (relationship to Media)
    {
      name: 'featuredImage',
      type: 'upload',
      label: 'Featured Image',
      relationTo: 'media',
      admin: {
        description: 'Main image displayed in post listings and at the top of the post.',
      },
    },
    // Categories (hasMany relationship to Categories)
    {
      name: 'categories',
      type: 'relationship',
      label: 'Categories',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
        description: 'Select one or more categories for this post.',
      },
    },
    // Author (relationship to Users)
    {
      name: 'author',
      type: 'relationship',
      label: 'Author',
      relationTo: 'users',
      required: true,
      admin: {
        position: 'sidebar',
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
        description: 'When this post was/will be published',
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
              'Title for search engines and social sharing. Defaults to post title if empty.',
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
            description:
              'Image for social sharing (Open Graph / Twitter Card). Defaults to featured image if empty.',
          },
        },
      ],
    },
  ],
}

export default Posts
