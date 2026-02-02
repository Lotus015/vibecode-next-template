import * as React from 'react'
import { ContentComponent, type ContentBlockProps } from './Content'
import { MediaBlockComponent, type MediaBlockProps } from './MediaBlock'
import { CallToActionComponent, type CallToActionBlockProps } from './CallToAction'

/**
 * Block type union - discriminated union based on blockType
 */
export type Block =
  | (ContentBlockProps & { blockType: 'content' })
  | (MediaBlockProps & { blockType: 'mediaBlock' })
  | (CallToActionBlockProps & { blockType: 'callToAction' })

/**
 * Props for the RenderBlocks component
 */
export interface RenderBlocksProps {
  blocks?: Block[] | null
}

/**
 * Render a single block based on its type
 * Uses discriminated union pattern for type safety
 */
function renderBlock(block: Block, index: number): React.JSX.Element | null {
  const blockKey = block.id || `block-${index}`

  switch (block.blockType) {
    case 'content': {
      const { blockType: _, ...props } = block
      return <ContentComponent key={blockKey} {...props} />
    }
    case 'mediaBlock': {
      const { blockType: _, ...props } = block
      return <MediaBlockComponent key={blockKey} {...props} />
    }
    case 'callToAction': {
      const { blockType: _, ...props } = block
      return <CallToActionComponent key={blockKey} {...props} />
    }
    default: {
      // Handle unknown block types gracefully
      // TypeScript will infer `never` here if all cases are covered
      const unknownBlock = block as { blockType: string }
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Unknown block type: "${unknownBlock.blockType}"`)
      }
      return null
    }
  }
}

/**
 * RenderBlocks Component
 *
 * Dynamically renders an array of blocks based on their blockType.
 * Maps block types to their corresponding React components.
 *
 * Features:
 * - Type-safe block rendering with discriminated union
 * - Graceful handling of unknown block types
 * - Unique keys for each block using id or index fallback
 *
 * Usage:
 * ```tsx
 * <RenderBlocks blocks={page.layout} />
 * ```
 */
export function RenderBlocks({ blocks }: RenderBlocksProps): React.JSX.Element | null {
  // Return null if no blocks provided
  if (!blocks || blocks.length === 0) {
    return null
  }

  return (
    <div className="render-blocks">
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  )
}

export default RenderBlocks
