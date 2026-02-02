import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
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
 * Page params from the dynamic route
 */
interface PageParams {
  slug: string
}

/**
 * Fetches a page by slug from Payload CMS
 *
 * @param slug - The URL slug of the page
 * @returns The page data or null if not found
 */
async function getPageBySlug(slug: string): Promise<PageData | null> {
  try {
    const payload = await getPayload()
    const pages = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: slug,
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
    console.error(`Failed to fetch page with slug "${slug}":`, error)
    return null
  }
}

/**
 * Fetches all page slugs for static generation
 *
 * @returns Array of page params with slugs
 */
export async function generateStaticParams(): Promise<PageParams[]> {
  try {
    const payload = await getPayload()
    const pages = await payload.find({
      collection: 'pages',
      depth: 0,
      limit: 1000,
      select: {
        slug: true,
      },
    })

    return pages.docs
      .filter((page) => page.slug && page.slug !== 'home') // Exclude homepage
      .map((page) => ({
        slug: page.slug as string,
      }))
  } catch (error) {
    console.error('Failed to fetch page slugs for static generation:', error)
    return []
  }
}

/**
 * Generate metadata for SEO
 *
 * @param params - Page params containing the slug
 * @returns Next.js Metadata object
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>
}): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  if (page) {
    return generateMeta({ doc: page })
  }

  // Return minimal metadata if page not found (will show 404)
  return {
    title: 'Page Not Found',
    description: 'The requested page could not be found.',
  }
}

/**
 * Dynamic Page Component
 *
 * Server Component that fetches page data from Payload CMS by slug.
 * Renders hero section and content blocks from the page layout.
 *
 * Features:
 * - Fetches page by slug from Pages collection
 * - Renders hero section from page data
 * - Renders content blocks using RenderBlocks component
 * - Returns notFound() for missing pages
 * - SEO metadata generation
 * - Static generation with generateStaticParams
 */
export default async function Page({
  params,
}: {
  params: Promise<PageParams>
}): Promise<React.JSX.Element> {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  // Return 404 if page not found
  if (!page) {
    notFound()
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
