/**
 * Blocks Module
 *
 * Central export for all Payload CMS blocks.
 * Exports block configs for use in Payload collections and components for frontend rendering.
 */

// Block configs (for Payload CMS collection configuration)
export { ContentConfig } from './Content'
export { MediaBlockConfig } from './MediaBlock'
export { CallToActionConfig } from './CallToAction'

// Block components (for frontend rendering)
export { ContentComponent, type ContentBlockProps } from './Content'
export { MediaBlockComponent, type MediaBlockProps } from './MediaBlock'
export { CallToActionComponent, type CallToActionBlockProps } from './CallToAction'

// RenderBlocks component and types
export { RenderBlocks, type RenderBlocksProps, type Block } from './RenderBlocks'

// Array of all block configs for easy registration
import { ContentConfig } from './Content'
import { MediaBlockConfig } from './MediaBlock'
import { CallToActionConfig } from './CallToAction'

/**
 * All block configurations for Payload CMS
 * Use this array when registering blocks in collections
 *
 * Example usage in a collection:
 * ```ts
 * import { blockConfigs } from '@/blocks'
 *
 * const Pages: CollectionConfig = {
 *   fields: [
 *     {
 *       name: 'layout',
 *       type: 'blocks',
 *       blocks: blockConfigs,
 *     }
 *   ]
 * }
 * ```
 */
export const blockConfigs = [ContentConfig, MediaBlockConfig, CallToActionConfig]
