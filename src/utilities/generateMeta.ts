import type { Metadata } from 'next'

import { getServerSideURL } from './getURL'
import { mergeOpenGraph } from './mergeOpenGraph'

/**
 * Interface for documents that have SEO meta fields.
 * Matches the meta group structure used in Pages and Posts collections.
 */
interface DocumentWithMeta {
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
  title?: string | null
  slug?: string | null
}

/**
 * Configuration options for metadata generation.
 */
interface GenerateMetaArgs {
  doc?: DocumentWithMeta | null
  collectionSlug?: string
}

/**
 * Generates Next.js Metadata object from a Payload document's meta fields.
 * Handles image URLs (both relative and absolute), and provides fallbacks.
 *
 * @param args - The document and optional collection slug
 * @returns Next.js Metadata object
 */
export function generateMeta(args: GenerateMetaArgs): Metadata {
  const { doc, collectionSlug } = args

  const title = doc?.meta?.title ?? doc?.title ?? 'Payload CMS'
  const description = doc?.meta?.description ?? ''

  // Build the canonical URL
  const serverURL = getServerSideURL()
  let url = serverURL
  if (collectionSlug && doc?.slug) {
    url = `${serverURL}/${collectionSlug}/${doc.slug}`
  } else if (doc?.slug && doc.slug !== 'home') {
    url = `${serverURL}/${doc.slug}`
  }

  // Handle image - can be populated object or string ID
  let ogImage: string | undefined
  let ogImageAlt: string | undefined
  let ogImageWidth: number | undefined
  let ogImageHeight: number | undefined

  if (doc?.meta?.image && typeof doc.meta.image === 'object') {
    const imageUrl = doc.meta.image.url
    if (imageUrl) {
      // If it's a relative URL, prepend the server URL
      ogImage = imageUrl.startsWith('http') ? imageUrl : `${serverURL}${imageUrl}`
      ogImageAlt = doc.meta.image.alt ?? undefined
      ogImageWidth = doc.meta.image.width ?? undefined
      ogImageHeight = doc.meta.image.height ?? undefined
    }
  }

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: mergeOpenGraph({
      title,
      description: description || undefined,
      url,
      images: ogImage
        ? [
            {
              url: ogImage,
              alt: ogImageAlt,
              width: ogImageWidth,
              height: ogImageHeight,
            },
          ]
        : undefined,
    }),
    twitter: {
      card: 'summary_large_image',
      title,
      description: description || undefined,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}
