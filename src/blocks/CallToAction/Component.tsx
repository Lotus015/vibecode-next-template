import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { RichText, type RichTextContent } from '@/components/RichText'

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
 * Uses the official Payload RichText component for proper rendering of
 * all Lexical node types.
 *
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
