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
  url?: string
  newTab?: boolean
  fields?: {
    url?: string
    newTab?: boolean
    linkType?: string
    doc?: {
      value?: string | number
      relationTo?: string
    }
  }
}

/**
 * Rich Text content structure from Payload
 */
export interface RichTextContent {
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
 * Format flags for text styling (Lexical format bitflags)
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
    result = (
      <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm">
        {result}
      </code>
    )
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
    return (
      <React.Fragment key={key}>
        {renderFormattedText(node.text, node.format)}
      </React.Fragment>
    )
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
      <HeadingTag
        key={key}
        className={headingClasses[HeadingTag] || headingClasses.h2}
      >
        {node.children?.map((child, i) => renderNode(child, i))}
      </HeadingTag>
    )
  }

  // Lists
  if (node.type === 'list') {
    const ListTag = node.listType === 'number' ? 'ol' : 'ul'
    const listClass =
      node.listType === 'number'
        ? 'mb-4 list-decimal pl-6'
        : 'mb-4 list-disc pl-6'
    return (
      <ListTag key={key} className={listClass}>
        {node.children?.map((child, i) => renderNode(child, i))}
      </ListTag>
    )
  }

  // List item
  if (node.type === 'listitem') {
    return (
      <li key={key}>{node.children?.map((child, i) => renderNode(child, i))}</li>
    )
  }

  // Quote/blockquote
  if (node.type === 'quote') {
    return (
      <blockquote
        key={key}
        className="mb-4 border-l-4 border-muted-foreground/30 pl-4 italic"
      >
        {node.children?.map((child, i) => renderNode(child, i))}
      </blockquote>
    )
  }

  // Link
  if (node.type === 'link') {
    const url = node.fields?.url || node.url || '#'
    const newTab = node.fields?.newTab || node.newTab
    return (
      <a
        key={key}
        href={url}
        className="text-primary underline underline-offset-4 hover:text-primary/80"
        {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
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

interface RichTextProps {
  content?: RichTextContent | null
  className?: string
}

/**
 * RichText Component
 *
 * Renders rich text content from Payload's Lexical editor.
 * Handles common node types: paragraphs, headings, lists, blockquotes, links, and text formatting.
 *
 * @param content - Rich text content from Payload CMS
 * @param className - Additional CSS classes for the wrapper
 */
export function RichText({
  content,
  className = '',
}: RichTextProps): React.JSX.Element | null {
  if (!content?.root?.children) {
    return null
  }

  return (
    <div className={`prose prose-slate max-w-none dark:prose-invert ${className}`}>
      {content.root.children.map((node, i) => renderNode(node, i))}
    </div>
  )
}

export default RichText
