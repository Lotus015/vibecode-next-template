import type { CollectionConfig } from 'payload'
import { authenticated, authenticatedOrPublished, admins } from '@/access'
import { formatSlug, revalidatePost, populatePublishedAt } from '@/hooks'

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
  // Hooks for slug generation, publishedAt auto-population, and revalidation
  hooks: {
    beforeChange: [populatePublishedAt],
    afterChange: [revalidatePost],
  },
  access: {
    // Public read access for published posts, auth users can read all
    read: authenticatedOrPublished,
    // Only authenticated users can create posts
    create: authenticated,
    // Only authenticated users can update posts
    update: authenticated,
    // Only admins can delete posts
    delete: admins,
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
    // SEO fields are added by @payloadcms/plugin-seo
    // The plugin adds: meta.title, meta.description, meta.image
  ],
}

export default Posts
