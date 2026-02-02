import type { Block } from 'payload'

/**
 * Media Block
 *
 * A content block for displaying images with optional caption and positioning.
 *
 * Features:
 * - Media upload field (image)
 * - Optional caption text
 * - Position selector (left, center, right)
 * - Responsive image rendering with next/image
 */
export const MediaBlock: Block = {
  slug: 'mediaBlock',
  labels: {
    singular: 'Media Block',
    plural: 'Media Blocks',
  },
  interfaceName: 'MediaBlock',
  fields: [
    // Media upload field
    {
      name: 'media',
      type: 'upload',
      label: 'Media',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Upload an image to display',
      },
    },
    // Caption text field
    {
      name: 'caption',
      type: 'text',
      label: 'Caption',
      admin: {
        description: 'Optional caption to display below the image',
      },
    },
    // Position selector
    {
      name: 'position',
      type: 'select',
      label: 'Position',
      defaultValue: 'center',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
      admin: {
        description: 'Horizontal alignment of the media',
      },
    },
  ],
}

export default MediaBlock
