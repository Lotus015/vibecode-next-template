import * as React from 'react'
import { RichText, type RichTextContent } from '@/components/RichText'

/**
 * Content Block props type
 */
export interface ContentBlockProps {
  columns: '1' | '2' | '3'
  columnOne?: RichTextContent | null
  columnTwo?: RichTextContent | null
  columnThree?: RichTextContent | null
  blockType?: 'content'
  id?: string
}

/**
 * Content Block Component
 *
 * Renders a content block with 1, 2, or 3 columns of rich text content.
 * Uses the official Payload RichText component for proper rendering of
 * all Lexical node types.
 *
 * Uses responsive grid layout that stacks on mobile and expands on larger screens.
 *
 * Grid behavior:
 * - 1 column: full width
 * - 2 columns: full width on mobile, 2 equal columns on md+
 * - 3 columns: full width on mobile, 3 equal columns on lg+
 */
export function ContentBlock({
  columns,
  columnOne,
  columnTwo,
  columnThree,
}: ContentBlockProps): React.JSX.Element {
  // Determine grid classes based on column count
  const gridClasses: Record<string, string> = {
    '1': 'grid grid-cols-1',
    '2': 'grid grid-cols-1 gap-8 md:grid-cols-2',
    '3': 'grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3',
  }

  const gridClass = gridClasses[columns] || gridClasses['1']

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className={gridClass}>
          {/* Column One - Always rendered */}
          <div className="content-column">
            <RichText content={columnOne} />
          </div>

          {/* Column Two - Rendered for 2 or 3 columns */}
          {(columns === '2' || columns === '3') && (
            <div className="content-column">
              <RichText content={columnTwo} />
            </div>
          )}

          {/* Column Three - Rendered for 3 columns only */}
          {columns === '3' && (
            <div className="content-column">
              <RichText content={columnThree} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ContentBlock
