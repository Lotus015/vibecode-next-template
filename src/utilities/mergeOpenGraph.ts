import type { Metadata } from 'next'

import { getServerSideURL } from './getURL'

type OpenGraphType = NonNullable<Metadata['openGraph']>

const defaultOpenGraph: OpenGraphType = {
  type: 'website',
  description: 'A Next.js website with Payload CMS',
  images: [
    {
      url: `${getServerSideURL()}/og-image.png`,
    },
  ],
  siteName: 'Payload CMS',
  title: 'Payload CMS',
}

/**
 * Merges custom OpenGraph metadata with default values.
 * Custom values override defaults, but default values are used as fallbacks.
 *
 * @param og - Custom OpenGraph metadata to merge with defaults
 * @returns Merged OpenGraph metadata
 */
export function mergeOpenGraph(og?: Metadata['openGraph']): OpenGraphType {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
