import type { GlobalConfig, GlobalAfterChangeHook } from 'payload'

/**
 * Revalidate site settings hook
 * Triggers Next.js revalidation when site settings are updated
 */
const revalidateSiteSettings: GlobalAfterChangeHook = async ({ doc, req: { payload } }) => {
  payload.logger.info('Revalidating site settings')
  return doc
}

/**
 * SiteSettings Global
 *
 * Global configuration for site-wide settings.
 *
 * Features:
 * - Site name and description for branding
 * - Default Open Graph image for social sharing
 * - Contact information (email, phone, address)
 * - Social links array for social media profiles
 * - Analytics IDs for tracking integrations
 * - Revalidation hook for Next.js cache invalidation
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    description: 'Configure site-wide settings including branding, contact information, social links, and analytics.',
  },
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
  access: {
    // Anyone can read the site settings (needed for frontend)
    read: () => true,
    // Only authenticated users can update
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    // General Settings Tab
    {
      name: 'general',
      type: 'group',
      label: 'General Settings',
      admin: {
        description: 'Basic site information and branding',
      },
      fields: [
        {
          name: 'siteName',
          type: 'text',
          label: 'Site Name',
          required: true,
          defaultValue: 'My Website',
          admin: {
            description: 'The name of your website (used in titles, meta tags, etc.)',
          },
        },
        {
          name: 'siteDescription',
          type: 'textarea',
          label: 'Site Description',
          defaultValue: 'A website built with Next.js and Payload CMS',
          admin: {
            description: 'A brief description of your website (used in meta tags)',
          },
        },
        {
          name: 'defaultOgImage',
          type: 'upload',
          label: 'Default Open Graph Image',
          relationTo: 'media',
          admin: {
            description: 'Default image used for social media sharing when no specific image is set',
          },
        },
      ],
    },
    // Contact Information Group
    {
      name: 'contact',
      type: 'group',
      label: 'Contact Information',
      admin: {
        description: 'Contact details displayed on the website',
      },
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'Email Address',
          admin: {
            description: 'Primary contact email address',
          },
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Phone Number',
          admin: {
            description: 'Primary contact phone number',
          },
        },
        {
          name: 'address',
          type: 'textarea',
          label: 'Address',
          admin: {
            description: 'Physical address or location',
          },
        },
      ],
    },
    // Social Links Array
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Links',
      labels: {
        singular: 'Social Link',
        plural: 'Social Links',
      },
      admin: {
        description: 'Social media profile links',
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
            description: 'Social media platform',
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
    // Analytics Group
    {
      name: 'analytics',
      type: 'group',
      label: 'Analytics & Tracking',
      admin: {
        description: 'Analytics and tracking configuration',
      },
      fields: [
        {
          name: 'googleAnalyticsId',
          type: 'text',
          label: 'Google Analytics ID',
          admin: {
            description: 'Google Analytics Measurement ID (e.g., G-XXXXXXXXXX)',
          },
        },
        {
          name: 'googleTagManagerId',
          type: 'text',
          label: 'Google Tag Manager ID',
          admin: {
            description: 'Google Tag Manager Container ID (e.g., GTM-XXXXXXX)',
          },
        },
        {
          name: 'facebookPixelId',
          type: 'text',
          label: 'Facebook Pixel ID',
          admin: {
            description: 'Meta/Facebook Pixel ID for conversion tracking',
          },
        },
      ],
    },
  ],
}

export default SiteSettings
