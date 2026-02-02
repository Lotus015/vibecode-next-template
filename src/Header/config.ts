import type { GlobalConfig, GlobalAfterChangeHook } from 'payload'

/**
 * Revalidate header hook
 * Triggers Next.js revalidation when header is updated
 */
const revalidateHeader: GlobalAfterChangeHook = async ({ doc, req: { payload } }) => {
  payload.logger.info('Revalidating header')
  return doc
}

/**
 * Header Global
 *
 * Global configuration for the site header/navigation.
 *
 * Features:
 * - Logo upload field
 * - Navigation items array with label and link
 * - CTA button with label, link, and variant options
 * - Revalidation hook for Next.js cache invalidation
 */
export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header',
  admin: {
    description: 'Configure the site header, navigation items, and call-to-action button.',
  },
  hooks: {
    afterChange: [revalidateHeader],
  },
  access: {
    // Anyone can read the header (needed for frontend)
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
        description: 'Site logo displayed in the header',
      },
    },
    // Navigation items array
    {
      name: 'navItems',
      type: 'array',
      label: 'Navigation Items',
      labels: {
        singular: 'Nav Item',
        plural: 'Nav Items',
      },
      admin: {
        description: 'Links displayed in the main navigation',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
          admin: {
            description: 'Text displayed for this navigation item',
          },
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link',
          required: true,
          admin: {
            description: 'URL or path (e.g., /about or https://example.com)',
          },
        },
      ],
    },
    // CTA button group
    {
      name: 'ctaButton',
      type: 'group',
      label: 'CTA Button',
      admin: {
        description: 'Call-to-action button displayed in the header',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Button Label',
          admin: {
            description: 'Text displayed on the button',
          },
        },
        {
          name: 'link',
          type: 'text',
          label: 'Button Link',
          admin: {
            description: 'URL or path the button links to',
          },
        },
        {
          name: 'variant',
          type: 'select',
          label: 'Button Variant',
          defaultValue: 'default',
          options: [
            { label: 'Default (Primary)', value: 'default' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Outline', value: 'outline' },
            { label: 'Ghost', value: 'ghost' },
          ],
        },
      ],
    },
  ],
}

export default Header
