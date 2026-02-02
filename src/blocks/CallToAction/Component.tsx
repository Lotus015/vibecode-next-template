import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

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
 * Button type for CTA buttons
 */
interface CTAButton {
  id?: string
  label: string
  link: string
  variant?: 'default' | 'secondary' | 'outline' | 'ghost'
}

/**
 * CallToAction Block props type
 */
export interface CallToActionBlockProps {
  heading: string
  subheading?: string | null
  richText?: RichTextContent | null
  buttons?: CTAButton[] | null
  backgroundColor?: 'default' | 'muted' | 'primary' | 'secondary' | 'accent'
  blockType?: 'callToAction'
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
    result = <code className="rounded bg-background/50 px-1 py-0.5 font-mono text-sm">{result}</code>
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
    return (
      <HeadingTag key={key} className="mb-3 font-semibold">
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
 * Background style classes mapping
 */
const backgroundClasses: Record<string, string> = {
  default: 'bg-background',
  muted: 'bg-muted',
  primary: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  accent: 'bg-accent text-accent-foreground',
}

/**
 * CallToAction Block Component
 *
 * Renders a promotional call-to-action section with centered layout.
 * Includes heading, subheading, optional rich text, and action buttons.
 *
 * Layout:
 * - Centered content with max-width constraint
 * - Prominent heading and optional subheading
 * - Rich text content below heading
 * - Horizontally centered buttons with gap
 * - Configurable background style
 */
export function CallToActionBlock({
  heading,
  subheading,
  richText,
  buttons,
  backgroundColor = 'default',
}: CallToActionBlockProps): React.JSX.Element {
  const bgClass = backgroundClasses[backgroundColor] || backgroundClasses.default

  return (
    <section className={`py-16 ${bgClass}`}>
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          {/* Heading */}
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {heading}
          </h2>

          {/* Subheading */}
          {subheading && (
            <p className="mb-6 text-lg text-muted-foreground sm:text-xl">
              {subheading}
            </p>
          )}

          {/* Rich Text Content */}
          {richText?.root?.children && richText.root.children.length > 0 && (
            <div className="mb-8">
              <RichText content={richText} />
            </div>
          )}

          {/* Buttons */}
          {buttons && buttons.length > 0 && (
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              {buttons.map((button, index) => (
                <Button
                  key={button.id || index}
                  variant={button.variant || 'default'}
                  size="lg"
                  asChild
                >
                  <Link href={button.link}>{button.label}</Link>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default CallToActionBlock
