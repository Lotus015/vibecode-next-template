import * as React from 'react'
import Link from 'next/link'

import { cn } from '@/utilities'

interface PaginationProps {
  /** Current page number (1-indexed) */
  currentPage: number
  /** Total number of pages */
  totalPages: number
  /** Base URL for pagination links (page number will be appended) */
  basePath: string
}

/**
 * Pagination Component
 *
 * Displays pagination controls for navigating between pages.
 * Uses URL-based pagination (e.g., /posts?page=2).
 *
 * Features:
 * - Previous/Next navigation buttons
 * - Page number display
 * - Disabled state for first/last pages
 * - Accessible navigation
 */
export function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps): React.JSX.Element | null {
  // Don't render pagination if only one page
  if (totalPages <= 1) {
    return null
  }

  const hasPrevious = currentPage > 1
  const hasNext = currentPage < totalPages

  const previousUrl = hasPrevious
    ? `${basePath}${currentPage - 1 === 1 ? '' : `?page=${currentPage - 1}`}`
    : null
  const nextUrl = hasNext ? `${basePath}?page=${currentPage + 1}` : null

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-2 py-8"
    >
      {/* Previous button */}
      {hasPrevious && previousUrl ? (
        <Link
          href={previousUrl}
          className={cn(
            'inline-flex items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium transition-colors',
            'hover:bg-accent hover:text-accent-foreground'
          )}
        >
          ← Previous
        </Link>
      ) : (
        <span
          className={cn(
            'inline-flex items-center justify-center rounded-md border bg-muted px-4 py-2 text-sm font-medium text-muted-foreground',
            'cursor-not-allowed'
          )}
        >
          ← Previous
        </span>
      )}

      {/* Page indicator */}
      <span className="px-4 text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next button */}
      {hasNext && nextUrl ? (
        <Link
          href={nextUrl}
          className={cn(
            'inline-flex items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium transition-colors',
            'hover:bg-accent hover:text-accent-foreground'
          )}
        >
          Next →
        </Link>
      ) : (
        <span
          className={cn(
            'inline-flex items-center justify-center rounded-md border bg-muted px-4 py-2 text-sm font-medium text-muted-foreground',
            'cursor-not-allowed'
          )}
        >
          Next →
        </span>
      )}
    </nav>
  )
}

export default Pagination
