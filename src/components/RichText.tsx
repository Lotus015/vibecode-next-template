import * as React from 'react'
import {
  RichText as PayloadRichText,
  type JSXConvertersFunction,
} from '@payloadcms/richtext-lexical/react'

/**
 * Serialized Lexical node structure
 * This type represents the nodes in a Lexical editor state
 */
interface SerializedLexicalNode {
  type: string
  version: number
  [key: string]: unknown
}

/**
 * Root node structure for Lexical editor state
 * This matches the structure returned by Payload's Lexical editor
 */
interface SerializedRootNode {
  type: 'root'
  children: SerializedLexicalNode[]
  direction: 'ltr' | 'rtl' | null
  format: '' | 'left' | 'center' | 'right' | 'justify' | 'start' | 'end'
  indent: number
  version: number
}

/**
 * Serialized editor state structure
 * This matches the Lexical SerializedEditorState type
 */
interface SerializedEditorState {
  root: SerializedRootNode
}

/**
 * Rich Text content structure from Payload CMS
 *
 * This matches the structure returned by Payload's Lexical editor.
 * The 'root' property contains the serialized editor state.
 */
export interface RichTextContent {
  root?: SerializedRootNode | null
}

/**
 * Props for the RichText wrapper component
 */
interface RichTextProps {
  /** Rich text content from Payload CMS */
  content?: RichTextContent | null
  /** Additional CSS classes for the wrapper */
  className?: string
  /** Custom JSX converters for node types */
  converters?: JSXConvertersFunction
  /** If true, removes the container div wrapper */
  disableContainer?: boolean
}

/**
 * Custom converters that extend the default converters with custom styling
 */
const customConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  // You can customize converters here if needed
  // For example, to add custom styling to links:
  // link: ({ node, nodesToJSX }) => {
  //   return (
  //     <a
  //       href={node.fields?.url || '#'}
  //       className="text-primary underline underline-offset-4 hover:text-primary/80"
  //       target={node.fields?.newTab ? '_blank' : undefined}
  //       rel={node.fields?.newTab ? 'noopener noreferrer' : undefined}
  //     >
  //       {nodesToJSX({ nodes: node.children })}
  //     </a>
  //   )
  // },
})

/**
 * RichText Component
 *
 * A wrapper around Payload CMS's official RichText component from
 * @payloadcms/richtext-lexical/react. This provides consistent rich text
 * rendering across the application with proper handling of all Lexical
 * node types including:
 *
 * - Text formatting (bold, italic, strikethrough, underline, code)
 * - Paragraphs and headings (h1-h6)
 * - Lists (ordered and unordered)
 * - Blockquotes
 * - Links (internal and external)
 * - Horizontal rules
 * - Tables
 * - Uploads/images
 * - Custom blocks
 *
 * @param content - Rich text content from Payload CMS
 * @param className - Additional CSS classes for the wrapper
 * @param converters - Custom JSX converters (defaults to customConverters)
 * @param disableContainer - If true, removes the container div wrapper
 *
 * @example
 * ```tsx
 * import { RichText } from '@/components/RichText'
 *
 * function MyComponent({ content }) {
 *   return <RichText content={content} className="prose-lg" />
 * }
 * ```
 */
export function RichText({
  content,
  className = '',
  converters = customConverters,
  disableContainer = false,
}: RichTextProps): React.JSX.Element | null {
  // Return null if no content or no root children
  if (!content?.root?.children || content.root.children.length === 0) {
    return null
  }

  // Cast to SerializedEditorState for the official component
  // The content.root structure matches what Payload's Lexical editor produces
  const data = {
    root: content.root,
  } as SerializedEditorState

  return (
    <PayloadRichText
      data={data}
      converters={converters}
      className={`prose prose-slate max-w-none dark:prose-invert ${className}`.trim()}
      disableContainer={disableContainer}
    />
  )
}

export default RichText
