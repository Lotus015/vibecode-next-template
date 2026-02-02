import type { Block } from 'payload'

/**
 * CallToAction Block
 *
 * A promotional section block for calls to action.
 *
 * Features:
 * - Heading and subheading text fields
 * - Rich text content area
 * - Buttons array with label, link, and variant
 * - Background color/style options
 * - Centered layout with prominent styling
 */
export const CallToAction: Block = {
  slug: 'callToAction',
  labels: {
    singular: 'Call to Action',
    plural: 'Calls to Action',
  },
  interfaceName: 'CallToActionBlock',
  fields: [
    // Heading field
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      required: true,
      admin: {
        description: 'Main heading text for the call to action',
      },
    },
    // Subheading field
    {
      name: 'subheading',
      type: 'text',
      label: 'Subheading',
      admin: {
        description: 'Optional subheading text below the main heading',
      },
    },
    // Rich text content
    {
      name: 'richText',
      type: 'richText',
      label: 'Content',
      admin: {
        description: 'Optional rich text content for additional details',
      },
    },
    // Buttons array
    {
      name: 'buttons',
      type: 'array',
      label: 'Buttons',
      minRows: 1,
      maxRows: 3,
      admin: {
        description: 'Add up to 3 call to action buttons',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Button Label',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          label: 'Button Link',
          required: true,
          admin: {
            description: 'URL or path for the button link',
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
          admin: {
            description: 'Visual style of the button',
          },
        },
      ],
    },
    // Background style options
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Background Style',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Muted', value: 'muted' },
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Accent', value: 'accent' },
      ],
      admin: {
        description: 'Background color/style for the section',
      },
    },
  ],
}

export default CallToAction
