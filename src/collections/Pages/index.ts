import type { CollectionConfig } from 'payload'
import { Content } from '@/blocks/Content/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { authenticated, authenticatedOrPublished, admins } from '@/access'
import { formatSlug, revalidatePage, populatePublishedAt } from '@/hooks'

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
  // Hooks for slug generation, publishedAt auto-population, and revalidation
  hooks: {
    beforeChange: [populatePublishedAt],
    afterChange: [revalidatePage],
  },
  access: {
    // Public read access for published pages, auth users can read all
    read: authenticatedOrPublished,
    // Only authenticated users can create pages
    create: authenticated,
    // Only authenticated users can update pages
    update: authenticated,
    // Only admins can delete pages
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
      blocks: [Content, MediaBlock, CallToAction],
      admin: {
        description: 'Add content blocks to build the page layout',
      },
    },
    // SEO fields are added by @payloadcms/plugin-seo
    // The plugin adds: meta.title, meta.description, meta.image
  ],
}

export default Pages
