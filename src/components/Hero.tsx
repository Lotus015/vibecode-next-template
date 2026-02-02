import Image from 'next/image'
import * as React from 'react'

/**
 * Media type for uploaded images
 */
interface MediaType {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

/**
 * Hero data structure matching the Pages collection hero field
 */
export interface HeroData {
  type?: 'none' | 'highImpact' | 'mediumImpact' | 'lowImpact' | null
  heading?: string | null
  subheading?: string | null
  media?: MediaType | string | null
  richText?: unknown
}

interface HeroProps {
  hero?: HeroData | null
}

/**
 * Hero Component
 *
 * Renders the hero section of a page based on the hero type and data.
 * Supports multiple hero types: highImpact, mediumImpact, lowImpact.
 *
 * Features:
 * - High impact: Full-width background image with overlay text
 * - Medium impact: Split layout with image and text
 * - Low impact: Simple text-only hero
 */
export function Hero({ hero }: HeroProps): React.JSX.Element | null {
  // Don't render if hero is empty or type is 'none'
  if (!hero || hero.type === 'none' || !hero.type) {
    return null
  }

  const { type, heading, subheading, media } = hero

  // Get media URL if available
  const mediaUrl = typeof media === 'object' && media?.url ? media.url : null
  const mediaAlt = typeof media === 'object' && media?.alt ? media.alt : 'Hero image'

  // High Impact Hero - Full-width background with overlay
  if (type === 'highImpact') {
    // Use dark background when no image, light text always
    const hasImage = !!mediaUrl
    return (
      <section className={`relative flex min-h-[60vh] items-center justify-center overflow-hidden ${hasImage ? 'bg-muted' : 'bg-zinc-900'}`}>
        {mediaUrl && (
          <div className="absolute inset-0">
            <Image
              src={mediaUrl}
              alt={mediaAlt}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        )}
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center text-white">
          {heading && (
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              {heading}
            </h1>
          )}
          {subheading && (
            <p className="text-lg text-white/90 sm:text-xl md:text-2xl">{subheading}</p>
          )}
        </div>
      </section>
    )
  }

  // Medium Impact Hero - Split layout
  if (type === 'mediumImpact') {
    return (
      <section className="bg-muted">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              {heading && (
                <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  {heading}
                </h1>
              )}
              {subheading && (
                <p className="text-lg text-muted-foreground sm:text-xl">{subheading}</p>
              )}
            </div>
            {mediaUrl && (
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <Image
                  src={mediaUrl}
                  alt={mediaAlt}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  // Low Impact Hero - Simple text
  if (type === 'lowImpact') {
    return (
      <section className="bg-muted">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:py-16">
          {heading && (
            <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h1>
          )}
          {subheading && (
            <p className="text-lg text-muted-foreground">{subheading}</p>
          )}
        </div>
      </section>
    )
  }

  return null
}

export default Hero
