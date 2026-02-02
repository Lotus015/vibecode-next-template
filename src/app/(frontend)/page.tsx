import type { Metadata } from 'next'
import * as React from 'react'

import { Hero, type HeroData } from '@/components/Hero'
import { RenderBlocks, type Block } from '@/blocks/RenderBlocks'
import { getPayload } from '@/utilities'
import { generateMeta } from '@/utilities/generateMeta'

/**
 * Page data structure matching the Pages collection
 */
interface PageData {
  id: string
  title: string
  slug: string
  hero?: HeroData | null
  layout?: Block[] | null
  meta?: {
    title?: string | null
    description?: string | null
    image?: {
      url?: string | null
      alt?: string | null
      width?: number | null
      height?: number | null
    } | string | null
  } | null
}

/**
 * Fetches the homepage from Payload CMS
 * Homepage is identified by slug: 'home'
 */
async function getHomepage(): Promise<PageData | null> {
  try {
    const payload = await getPayload()
    const pages = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'home',
        },
      },
      depth: 2,
      limit: 1,
    })

    if (pages.docs.length > 0) {
      return pages.docs[0] as unknown as PageData
    }

    return null
  } catch (error) {
    console.error('Failed to fetch homepage:', error)
    return null
  }
}

/**
 * Generate metadata for SEO
 * Uses page meta fields or falls back to defaults
 */
export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomepage()

  if (page) {
    return generateMeta({ doc: page })
  }

  // Fallback metadata when no homepage exists
  return {
    title: 'Home',
    description: 'Welcome to our website',
  }
}

/**
 * Fallback content component shown when no homepage data exists
 */
function FallbackContent(): React.JSX.Element {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-4xl font-bold tracking-tight">Welcome</h1>
      <p className="max-w-md text-lg text-muted-foreground">
        Create a page with the slug &quot;home&quot; in the admin panel to customize this homepage.
      </p>
    </div>
  )
}

/**
 * Homepage Component
 *
 * Server Component that fetches page data from Payload CMS.
 * Renders hero section and content blocks from the page layout.
 *
 * Features:
 * - Fetches homepage by slug 'home' from Pages collection
 * - Renders hero section from page data
 * - Renders content blocks using RenderBlocks component
 * - Fallback content when no homepage exists
 * - SEO metadata generation
 */
export default async function HomePage(): Promise<React.JSX.Element> {
  const page = await getHomepage()

  // Show fallback content if no homepage found
  if (!page) {
    return (
      <main>
        <FallbackContent />
      </main>
    )
  }

  return (
    <main>
      {/* Hero Section */}
      <Hero hero={page.hero} />

      {/* Content Blocks */}
      <RenderBlocks blocks={page.layout} />
    </main>
  )
}
