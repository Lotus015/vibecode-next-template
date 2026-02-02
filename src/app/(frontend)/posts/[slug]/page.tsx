import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

import { RichText, type RichTextContent } from '@/components/RichText'
import { PostCard, type PostCardData } from '@/components/PostCard'
import { getPayload, formatDateTime } from '@/utilities'
import { generateMeta } from '@/utilities/generateMeta'

/**
 * Media data structure for images
 */
interface MediaData {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

/**
 * Author data structure
 */
interface AuthorData {
  id: string
  name?: string | null
  email?: string | null
}

/**
 * Category data structure
 */
interface CategoryData {
  id: string
  title: string
  slug: string
}

/**
 * Post data structure matching the Posts collection
 */
interface PostData {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  content: RichTextContent
  featuredImage?: MediaData | string | null
  categories?: (CategoryData | string)[] | null
  author?: AuthorData | string | null
  publishedAt?: string | null
  meta?: {
    title?: string | null
    description?: string | null
    image?: MediaData | string | null
  } | null
}

/**
 * Page params from the dynamic route
 */
interface PageParams {
  slug: string
}

/**
 * Fetches a post by slug from Payload CMS
 *
 * @param slug - The URL slug of the post
 * @returns The post data or null if not found
 */
async function getPostBySlug(slug: string): Promise<PostData | null> {
  try {
    const payload = await getPayload()
    const posts = await payload.find({
      collection: 'posts',
      where: {
        slug: {
          equals: slug,
        },
        _status: {
          equals: 'published',
        },
      },
      depth: 2, // Populate featuredImage, author, and categories
      limit: 1,
    })

    if (posts.docs.length > 0) {
      return posts.docs[0] as unknown as PostData
    }

    return null
  } catch (error) {
    console.error(`Failed to fetch post with slug "${slug}":`, error)
    return null
  }
}

/**
 * Fetches related posts based on categories
 *
 * @param currentPostId - The ID of the current post (to exclude)
 * @param categoryIds - Array of category IDs to filter by
 * @returns Array of related posts
 */
async function getRelatedPosts(
  currentPostId: string,
  categoryIds: string[]
): Promise<PostCardData[]> {
  if (categoryIds.length === 0) {
    return []
  }

  try {
    const payload = await getPayload()
    const posts = await payload.find({
      collection: 'posts',
      where: {
        and: [
          {
            id: {
              not_equals: currentPostId,
            },
          },
          {
            _status: {
              equals: 'published',
            },
          },
          {
            categories: {
              in: categoryIds,
            },
          },
        ],
      },
      depth: 1,
      limit: 3,
      sort: '-publishedAt',
    })

    return posts.docs as unknown as PostCardData[]
  } catch (error) {
    console.error('Failed to fetch related posts:', error)
    return []
  }
}

/**
 * Fetches all post slugs for static generation
 *
 * @returns Array of page params with slugs
 */
export async function generateStaticParams(): Promise<PageParams[]> {
  try {
    const payload = await getPayload()
    const posts = await payload.find({
      collection: 'posts',
      depth: 0,
      limit: 1000,
      select: {
        slug: true,
      },
      where: {
        _status: {
          equals: 'published',
        },
      },
    })

    return posts.docs
      .filter((post) => post.slug)
      .map((post) => ({
        slug: post.slug as string,
      }))
  } catch (error) {
    console.error('Failed to fetch post slugs for static generation:', error)
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
  const post = await getPostBySlug(slug)

  if (post) {
    return generateMeta({ doc: post, collectionSlug: 'posts' })
  }

  // Return minimal metadata if post not found (will show 404)
  return {
    title: 'Post Not Found',
    description: 'The requested blog post could not be found.',
  }
}

/**
 * Blog Post Detail Page
 *
 * Server Component that fetches post data from Payload CMS by slug.
 * Renders the full blog post with title, featured image, content, author, and date.
 *
 * Features:
 * - Fetches post by slug from Posts collection
 * - Renders title, featured image, and rich text content
 * - Shows author name and published date
 * - Related posts section based on shared categories
 * - Returns notFound() for missing posts
 * - SEO metadata generation
 * - Static generation with generateStaticParams
 */
export default async function PostPage({
  params,
}: {
  params: Promise<PageParams>
}): Promise<React.JSX.Element> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  // Return 404 if post not found
  if (!post) {
    notFound()
  }

  // Handle both populated and unpopulated media states
  const featuredImage =
    typeof post.featuredImage === 'object' && post.featuredImage !== null
      ? post.featuredImage
      : null

  // Handle both populated and unpopulated author states
  const author =
    typeof post.author === 'object' && post.author !== null ? post.author : null

  // Get category IDs for related posts
  const categoryIds: string[] = (post.categories || [])
    .map((cat) => (typeof cat === 'object' ? cat.id : cat))
    .filter((id): id is string => typeof id === 'string')

  // Fetch related posts
  const relatedPosts = await getRelatedPosts(post.id, categoryIds)

  // Get populated categories for display
  const categories = (post.categories || []).filter(
    (cat): cat is CategoryData => typeof cat === 'object' && cat !== null
  )

  return (
    <main>
      {/* Featured Image */}
      {featuredImage?.url && (
        <div className="relative aspect-[21/9] w-full">
          <Image
            src={featuredImage.url}
            alt={featuredImage.alt || post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      )}

      {/* Post Content */}
      <article className="container mx-auto px-4 py-8">
        <header className="mx-auto max-w-3xl">
          {/* Categories */}
          {categories.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <span
                  key={category.id}
                  className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground"
                >
                  {category.title}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            {post.title}
          </h1>

          {/* Author and Date */}
          <div className="mb-8 flex items-center gap-4 text-muted-foreground">
            {author?.name && (
              <span className="font-medium text-foreground">{author.name}</span>
            )}
            {author?.name && post.publishedAt && (
              <span className="text-muted-foreground">•</span>
            )}
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                {formatDateTime(post.publishedAt, { includeTime: false })}
              </time>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="mx-auto max-w-3xl">
          <RichText content={post.content} />
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t bg-muted/50 py-12">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-2xl font-semibold tracking-tight">
              Related Posts
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <PostCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/posts"
                className="inline-flex items-center text-primary hover:underline"
              >
                ← Back to all posts
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Back link if no related posts */}
      {relatedPosts.length === 0 && (
        <div className="container mx-auto px-4 pb-12">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/posts"
              className="inline-flex items-center text-primary hover:underline"
            >
              ← Back to all posts
            </Link>
          </div>
        </div>
      )}
    </main>
  )
}
