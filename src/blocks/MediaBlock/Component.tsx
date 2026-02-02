import * as React from 'react'
import Image from 'next/image'

/**
 * Media type from Payload (can be populated object or string ID)
 */
interface MediaType {
  id?: string
  url?: string
  alt?: string
  width?: number
  height?: number
  filename?: string
}

/**
 * Media Block props type
 */
export interface MediaBlockProps {
  media: MediaType | string
  caption?: string | null
  position?: 'left' | 'center' | 'right'
  blockType?: 'mediaBlock'
  id?: string
}

/**
 * Media Block Component
 *
 * Renders an image with optional caption and configurable positioning.
 * Uses next/image for optimized, responsive images.
 *
 * Position behavior:
 * - left: align to start with auto right margin
 * - center: centered with auto margins
 * - right: align to end with auto left margin
 */
export function MediaBlockComponent({
  media,
  caption,
  position = 'center',
}: MediaBlockProps): React.JSX.Element | null {
  // Handle both populated (object) and unpopulated (string ID) media
  const mediaData = typeof media === 'string' ? null : media

  // If media is not populated or has no URL, don't render
  if (!mediaData?.url) {
    return null
  }

  // Determine alignment classes based on position
  const alignmentClasses: Record<string, string> = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  }

  const alignmentClass = alignmentClasses[position] || alignmentClasses.center

  // Text alignment for caption
  const textAlignClasses: Record<string, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  const textAlignClass = textAlignClasses[position] || textAlignClasses.center

  // Use provided dimensions or defaults
  const width = mediaData.width || 1200
  const height = mediaData.height || 800
  const alt = mediaData.alt || mediaData.filename || 'Image'

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <figure className={`max-w-4xl ${alignmentClass}`}>
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src={mediaData.url}
              alt={alt}
              width={width}
              height={height}
              className="h-auto w-full object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
            />
          </div>
          {caption && (
            <figcaption
              className={`mt-3 text-sm text-muted-foreground ${textAlignClass}`}
            >
              {caption}
            </figcaption>
          )}
        </figure>
      </div>
    </section>
  )
}

export default MediaBlockComponent
