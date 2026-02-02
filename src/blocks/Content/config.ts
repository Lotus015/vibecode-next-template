import type { Block } from 'payload'

/**
 * Content Block
 *
 * A flexible content block for rich text sections with 1, 2, or 3 columns.
 *
 * Features:
 * - Column count selection (1, 2, or 3 columns)
 * - Rich text editor for each column
 * - Conditional fields based on column count selection
 * - Responsive grid layout on frontend
 */
export const Content: Block = {
  slug: 'content',
  labels: {
    singular: 'Content Block',
    plural: 'Content Blocks',
  },
  interfaceName: 'ContentBlock',
  fields: [
    // Column count selector
    {
      name: 'columns',
      type: 'select',
      label: 'Number of Columns',
      defaultValue: '1',
      required: true,
      options: [
        { label: 'One Column', value: '1' },
        { label: 'Two Columns', value: '2' },
        { label: 'Three Columns', value: '3' },
      ],
      admin: {
        description: 'Select the number of columns for this content section',
      },
    },
    // Column One (always visible)
    {
      name: 'columnOne',
      type: 'richText',
      label: 'Column One',
      admin: {
        description: 'Content for the first column',
      },
    },
    // Column Two (visible for 2 or 3 columns)
    {
      name: 'columnTwo',
      type: 'richText',
      label: 'Column Two',
      admin: {
        description: 'Content for the second column',
        condition: (_, siblingData) =>
          siblingData?.columns === '2' || siblingData?.columns === '3',
      },
    },
    // Column Three (visible for 3 columns only)
    {
      name: 'columnThree',
      type: 'richText',
      label: 'Column Three',
      admin: {
        description: 'Content for the third column',
        condition: (_, siblingData) => siblingData?.columns === '3',
      },
    },
  ],
}

export default Content
