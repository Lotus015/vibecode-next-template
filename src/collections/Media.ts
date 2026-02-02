import type { CollectionConfig } from 'payload'

/**
 * Media Collection
 *
 * Collection for file uploads with image optimization.
 * Supports image files with configurable sizes for responsive display.
 *
 * Image sizes:
 * - thumbnail: 400x300 (for lists and previews)
 * - card: 768x576 (for card displays)
 * - hero: 1920x1080 (for hero sections)
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Media',
    plural: 'Media',
  },
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'mimeType', 'updatedAt'],
  },
  access: {
    // Anyone can read media (public files)
    read: () => true,
    // Only authenticated users can upload/create
    create: ({ req: { user } }) => Boolean(user),
    // Only authenticated users can update
    update: ({ req: { user } }) => Boolean(user),
    // Only admins can delete media
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  upload: {
    // Filter to only allow image files
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    // Image sizes for responsive images
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 576,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        position: 'centre',
      },
    ],
    // Admin thumbnail configuration - use thumbnail size for list view
    adminThumbnail: 'thumbnail',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text',
      required: true,
      admin: {
        description: 'Describe the image for accessibility and SEO',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Caption',
      admin: {
        description: 'Optional caption to display below the image',
      },
    },
  ],
}

export default Media
