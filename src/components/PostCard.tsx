import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { formatDateTime } from '@/utilities'

/**
 * Media data structure for featured images
 */
interface MediaData {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

/**
 * Post data structure for the card component
 */
export interface PostCardData {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  featuredImage?: MediaData | string | null
  publishedAt?: string | null
}

interface PostCardProps {
  post: PostCardData
}

/**
 * PostCard Component
 *
 * Displays a post preview card with featured image, title, excerpt, and date.
 * Links to the individual post page.
 *
 * Features:
 * - Featured image with responsive sizing
 * - Title with hover effect
 * - Excerpt (truncated)
 * - Formatted published date
 * - Full card is clickable link
 */
export function PostCard({ post }: PostCardProps): React.JSX.Element {
  const { title, slug, excerpt, featuredImage, publishedAt } = post

  // Handle both populated and unpopulated media states
  const imageData =
    typeof featuredImage === 'object' && featuredImage !== null
      ? featuredImage
      : null

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md">
      {/* Featured Image */}
      <Link href={`/posts/${slug}`} className="relative aspect-[16/9] overflow-hidden">
        {imageData?.url ? (
          <Image
            src={imageData.url}
            alt={imageData.alt || title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Date */}
        {publishedAt && (
          <time
            dateTime={publishedAt}
            className="mb-2 text-sm text-muted-foreground"
          >
            {formatDateTime(publishedAt, { includeTime: false })}
          </time>
        )}

        {/* Title */}
        <h2 className="mb-2 text-xl font-semibold leading-tight tracking-tight">
          <Link
            href={`/posts/${slug}`}
            className="hover:text-primary transition-colors"
          >
            {title}
          </Link>
        </h2>

        {/* Excerpt */}
        {excerpt && (
          <p className="line-clamp-3 flex-1 text-muted-foreground">{excerpt}</p>
        )}

        {/* Read more link */}
        <Link
          href={`/posts/${slug}`}
          className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
        >
          Read more →
        </Link>
      </div>
    </article>
  )
}

export default PostCard
