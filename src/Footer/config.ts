import type { GlobalConfig, GlobalAfterChangeHook } from 'payload'

/**
 * Revalidate footer hook
 * Triggers Next.js revalidation when footer is updated
 */
const revalidateFooter: GlobalAfterChangeHook = async ({ doc, req: { payload } }) => {
  payload.logger.info('Revalidating footer')
  return doc
}

/**
 * Footer Global
 *
 * Global configuration for the site footer.
 *
 * Features:
 * - Logo upload field
 * - Multiple columns with title and links array
 * - Social links with platform and URL
 * - Copyright text field
 * - Revalidation hook for Next.js cache invalidation
 */
export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  admin: {
    description: 'Configure the site footer, link columns, social links, and copyright text.',
  },
  hooks: {
    afterChange: [revalidateFooter],
  },
  access: {
    // Anyone can read the footer (needed for frontend)
    read: () => true,
    // Only authenticated users can update
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    // Logo field
    {
      name: 'logo',
      type: 'upload',
      label: 'Logo',
      relationTo: 'media',
      admin: {
        description: 'Footer logo (optional)',
      },
    },
    // Columns array
    {
      name: 'columns',
      type: 'array',
      label: 'Footer Columns',
      labels: {
        singular: 'Column',
        plural: 'Columns',
      },
      admin: {
        description: 'Footer link columns (e.g., Company, Resources, Support)',
      },
      maxRows: 4,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Column Title',
          required: true,
          admin: {
            description: 'Title displayed above the links (e.g., "Company", "Resources")',
          },
        },
        {
          name: 'links',
          type: 'array',
          label: 'Links',
          labels: {
            singular: 'Link',
            plural: 'Links',
          },
          admin: {
            description: 'Links displayed in this column',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Label',
              required: true,
              admin: {
                description: 'Link text',
              },
            },
            {
              name: 'link',
              type: 'text',
              label: 'URL',
              required: true,
              admin: {
                description: 'URL or path (e.g., /about or https://example.com)',
              },
            },
          ],
        },
      ],
    },
    // Social links array
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Links',
      labels: {
        singular: 'Social Link',
        plural: 'Social Links',
      },
      admin: {
        description: 'Social media links with icons',
      },
      fields: [
        {
          name: 'platform',
          type: 'select',
          label: 'Platform',
          required: true,
          options: [
            { label: 'Twitter / X', value: 'twitter' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'GitHub', value: 'github' },
            { label: 'TikTok', value: 'tiktok' },
          ],
          admin: {
            description: 'Social media platform (determines icon)',
          },
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          required: true,
          admin: {
            description: 'Full URL to your social media profile',
          },
        },
      ],
    },
    // Copyright text
    {
      name: 'copyright',
      type: 'text',
      label: 'Copyright Text',
      admin: {
        description: 'Copyright text displayed at the bottom (e.g., "© 2024 Company Name. All rights reserved.")',
      },
    },
  ],
}

export default Footer
