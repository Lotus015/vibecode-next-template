import type { Metadata } from 'next'
import * as React from 'react'

import { PostCard, type PostCardData } from '@/components/PostCard'
import { Pagination } from '@/components/Pagination'
import { getPayload } from '@/utilities'
import { demoPosts } from '@/data/demo-content'

/** Number of posts to display per page */
const POSTS_PER_PAGE = 9

/**
 * Page props with searchParams for pagination
 */
interface PostsPageProps {
  searchParams: Promise<{
    page?: string
  }>
}

/**
 * Paginated posts response structure
 */
interface PostsResponse {
  posts: PostCardData[]
  totalPages: number
  currentPage: number
  totalDocs: number
}

/**
 * Fetches paginated posts from Payload CMS
 *
 * @param page - Page number (1-indexed)
 * @returns Posts array with pagination info
 */
async function getPosts(page: number = 1): Promise<PostsResponse> {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'posts',
      where: {
        _status: {
          equals: 'published',
        },
      },
      sort: '-publishedAt',
      limit: POSTS_PER_PAGE,
      page,
      depth: 1, // Populate featuredImage
    })

    return {
      posts: result.docs as unknown as PostCardData[],
      totalPages: result.totalPages,
      currentPage: result.page || 1,
      totalDocs: result.totalDocs,
    }
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    // Return demo posts when CMS is unavailable
    return {
      posts: demoPosts,
      totalPages: 1,
      currentPage: 1,
      totalDocs: demoPosts.length,
    }
  }
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Blog',
    description: 'Read our latest blog posts and articles.',
    openGraph: {
      title: 'Blog',
      description: 'Read our latest blog posts and articles.',
    },
  }
}

/**
 * Empty state component shown when no posts exist
 */
function EmptyState(): React.JSX.Element {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="mb-4 text-2xl font-semibold">No posts yet</h2>
      <p className="max-w-md text-muted-foreground">
        There are no published posts at the moment. Check back later for new
        content.
      </p>
    </div>
  )
}

/**
 * Blog Listing Page
 *
 * Server Component that displays a paginated list of blog posts.
 *
 * Features:
 * - Fetches posts from Posts collection
 * - Grid layout displaying post cards
 * - Shows featured image, title, excerpt, and date
 * - Links to individual post pages
 * - URL-based pagination support
 * - SEO metadata
 */
export default async function PostsPage({
  searchParams,
}: PostsPageProps): Promise<React.JSX.Element> {
  // Next.js 16 uses async searchParams
  const params = await searchParams
  const page = Number(params.page) || 1

  const { posts, totalPages, currentPage } = await getPosts(page)

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Latest posts and articles
        </p>
      </div>

      {/* Posts Grid or Empty State */}
      {posts.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/posts"
          />
        </>
      ) : (
        <EmptyState />
      )}
    </main>
  )
}
