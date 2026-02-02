import { seoPlugin } from '@payloadcms/plugin-seo'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import type { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { getServerSideURL } from '../utilities/getURL'

/**
 * Document interface for SEO generation
 * Using a generic interface to avoid dependency on generated types
 */
interface SeoDocument {
  title?: string
  slug?: string
}

/**
 * Generate SEO title from page/post title
 */
const generateTitle: GenerateTitle<SeoDocument> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Site Name` : 'Site Name'
}

/**
 * Generate canonical URL for SEO
 */
const generateURL: GenerateURL<SeoDocument> = ({ doc, collectionSlug }) => {
  const url = getServerSideURL()

  if (collectionSlug === 'pages') {
    // Home page is at root, other pages at /slug
    return doc?.slug === 'home' ? url : `${url}/${doc?.slug || ''}`
  }

  if (collectionSlug === 'posts') {
    return `${url}/posts/${doc?.slug || ''}`
  }

  return url
}

/**
 * Payload CMS Plugins Configuration
 *
 * This module exports an array of configured Payload plugins:
 *
 * 1. SEO Plugin (@payloadcms/plugin-seo)
 *    - Adds meta title, description, and image fields to specified collections
 *    - Provides auto-generation of titles and URLs
 *    - Applied to Pages and Posts collections
 *
 * 2. Redirects Plugin (@payloadcms/plugin-redirects)
 *    - Manages URL redirects within the CMS
 *    - Supports 301/302 redirect types
 *    - Can reference pages and posts as redirect targets
 *
 * 3. Nested Docs Plugin (@payloadcms/plugin-nested-docs)
 *    - Adds hierarchical structure to collections
 *    - Auto-generates breadcrumbs
 *    - Applied to Categories collection
 */
export const plugins = [
  // SEO Plugin - adds meta fields to Pages and Posts
  seoPlugin({
    collections: ['pages', 'posts'],
    generateTitle,
    generateURL,
    // SEO fields will be added in a group named 'meta'
    // These fields include: title, description, image (upload)
    uploadsCollection: 'media',
    // Use the existing 'meta' group structure - plugin will add its fields there
    tabbedUI: true,
  }),

  // Redirects Plugin - manages URL redirects
  redirectsPlugin({
    collections: ['pages', 'posts'],
    // Redirects collection will be auto-generated
    overrides: {
      // Customize the Redirects collection
      labels: {
        singular: 'Redirect',
        plural: 'Redirects',
      },
      admin: {
        group: 'Settings',
      },
    },
  }),

  // Nested Docs Plugin - hierarchical structure for Categories
  nestedDocsPlugin({
    collections: ['categories'],
    // Generate breadcrumbs based on the category hierarchy
    generateLabel: (_, doc) => doc.title as string,
    generateURL: (docs) =>
      docs.reduce((url, doc) => `${url}/${doc.slug as string}`, '/categories'),
    // Use the existing parent field for hierarchy
    parentFieldSlug: 'parent',
    // Use the existing breadcrumbs field
    breadcrumbsFieldSlug: 'breadcrumbs',
  }),
]

export default plugins
