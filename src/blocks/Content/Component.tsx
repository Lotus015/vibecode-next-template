import * as React from 'react'

/**
 * Serialized Lexical Node type
 * Represents the structure of rich text content from Payload's Lexical editor
 */
interface SerializedLexicalNode {
  type: string
  version: number
  children?: SerializedLexicalNode[]
  text?: string
  format?: number
  tag?: string
  listType?: string
  direction?: 'ltr' | 'rtl' | null
  indent?: number
}

/**
 * Rich Text content structure from Payload
 */
interface RichTextContent {
  root?: {
    type: string
    children?: SerializedLexicalNode[]
    direction?: 'ltr' | 'rtl' | null
    format?: string
    indent?: number
    version?: number
  }
}

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
 * Format flags for text styling
 */
const IS_BOLD = 1
const IS_ITALIC = 2
const IS_STRIKETHROUGH = 4
const IS_UNDERLINE = 8
const IS_CODE = 16

/**
 * Render text with formatting
 */
function renderFormattedText(text: string, format?: number): React.ReactNode {
  if (!format) return text

  let result: React.ReactNode = text

  if (format & IS_BOLD) {
    result = <strong>{result}</strong>
  }
  if (format & IS_ITALIC) {
    result = <em>{result}</em>
  }
  if (format & IS_STRIKETHROUGH) {
    result = <s>{result}</s>
  }
  if (format & IS_UNDERLINE) {
    result = <u>{result}</u>
  }
  if (format & IS_CODE) {
    result = <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm">{result}</code>
  }

  return result
}

/**
 * Render a single Lexical node recursively
 */
function renderNode(node: SerializedLexicalNode, index: number): React.ReactNode {
  const key = `${node.type}-${index}`

  // Text node
  if (node.type === 'text' && node.text !== undefined) {
    return <React.Fragment key={key}>{renderFormattedText(node.text, node.format)}</React.Fragment>
  }

  // Paragraph
  if (node.type === 'paragraph') {
    return (
      <p key={key} className="mb-4 last:mb-0">
        {node.children?.map((child, i) => renderNode(child, i))}
      </p>
    )
  }

  // Headings
  if (node.type === 'heading') {
    const HeadingTag = (node.tag || 'h2') as keyof Pick<
      React.JSX.IntrinsicElements,
      'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    >
    const headingClasses: Record<string, string> = {
      h1: 'mb-4 text-4xl font-bold tracking-tight',
      h2: 'mb-3 text-3xl font-semibold tracking-tight',
      h3: 'mb-3 text-2xl font-semibold',
      h4: 'mb-2 text-xl font-semibold',
      h5: 'mb-2 text-lg font-medium',
      h6: 'mb-2 text-base font-medium',
    }
    return (
      <HeadingTag key={key} className={headingClasses[HeadingTag] || headingClasses.h2}>
        {node.children?.map((child, i) => renderNode(child, i))}
      </HeadingTag>
    )
  }

  // Lists
  if (node.type === 'list') {
    const ListTag = node.listType === 'number' ? 'ol' : 'ul'
    const listClass = node.listType === 'number' ? 'mb-4 list-decimal pl-6' : 'mb-4 list-disc pl-6'
    return (
      <ListTag key={key} className={listClass}>
        {node.children?.map((child, i) => renderNode(child, i))}
      </ListTag>
    )
  }

  // List item
  if (node.type === 'listitem') {
    return <li key={key}>{node.children?.map((child, i) => renderNode(child, i))}</li>
  }

  // Quote/blockquote
  if (node.type === 'quote') {
    return (
      <blockquote key={key} className="mb-4 border-l-4 border-muted-foreground/30 pl-4 italic">
        {node.children?.map((child, i) => renderNode(child, i))}
      </blockquote>
    )
  }

  // Link
  if (node.type === 'link') {
    return (
      <a
        key={key}
        href="#"
        className="text-primary underline underline-offset-4 hover:text-primary/80"
      >
        {node.children?.map((child, i) => renderNode(child, i))}
      </a>
    )
  }

  // Linebreak
  if (node.type === 'linebreak') {
    return <br key={key} />
  }

  // Default: render children if they exist
  if (node.children && node.children.length > 0) {
    return (
      <React.Fragment key={key}>
        {node.children.map((child, i) => renderNode(child, i))}
      </React.Fragment>
    )
  }

  return null
}

/**
 * Render rich text content from Lexical
 */
function RichText({ content }: { content?: RichTextContent | null }): React.JSX.Element | null {
  if (!content?.root?.children) {
    return null
  }

  return <div className="prose">{content.root.children.map((node, i) => renderNode(node, i))}</div>
}

/**
 * Content Block Component
 *
 * Renders a content block with 1, 2, or 3 columns of rich text content.
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
