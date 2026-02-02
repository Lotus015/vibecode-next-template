/**
 * Demo Content
 *
 * Static content displayed when CMS data is unavailable.
 * This allows the template to show a full preview without a database connection.
 */

import type { HeroData } from '@/components/Hero'
import type { HeaderData } from '@/Header/Component'
import type { FooterData } from '@/Footer/Component'
import type { Block } from '@/blocks/RenderBlocks'
import type { PostCardData } from '@/components/PostCard'

/**
 * Demo Header Data
 */
export const demoHeaderData: HeaderData = {
  logo: null,
  navItems: [
    { label: 'Home', link: '/' },
    { label: 'About', link: '/about' },
    { label: 'Services', link: '/services' },
    { label: 'Blog', link: '/posts' },
    { label: 'Contact', link: '/contact' },
  ],
  ctaButton: {
    label: 'Get Started',
    link: '/contact',
    variant: 'default',
  },
}

/**
 * Demo Footer Data
 */
export const demoFooterData: FooterData = {
  logo: null,
  columns: [
    {
      title: 'Company',
      links: [
        { label: 'About Us', link: '/about' },
        { label: 'Careers', link: '/careers' },
        { label: 'Contact', link: '/contact' },
      ],
    },
    {
      title: 'Services',
      links: [
        { label: 'Web Development', link: '/services' },
        { label: 'Design', link: '/services' },
        { label: 'Consulting', link: '/services' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Blog', link: '/posts' },
        { label: 'Documentation', link: '/docs' },
        { label: 'Support', link: '/support' },
      ],
    },
  ],
  socialLinks: [
    { platform: 'twitter', url: 'https://twitter.com' },
    { platform: 'github', url: 'https://github.com' },
    { platform: 'linkedin', url: 'https://linkedin.com' },
  ],
  copyright: '© 2025 Vibecode. All rights reserved.',
}

/**
 * Demo Hero Data
 */
export const demoHeroData: HeroData = {
  type: 'highImpact',
  heading: 'Build Amazing Websites with Payload CMS',
  subheading: 'A modern, type-safe template combining Next.js 16, React 19, and Payload CMS for rapid development.',
  media: null,
}

/**
 * Demo Blocks for Homepage
 * Note: Using type assertion since we know the structure is correct for rendering
 */
export const demoHomeBlocks = [
  {
    id: 'demo-content-1',
    blockType: 'content',
    columns: '3',
    columnOne: {
      root: {
        type: 'root',
        version: 1,
        children: [
          {
            type: 'heading',
            tag: 'h3',
            version: 1,
            children: [{ type: 'text', text: 'Fast Development', version: 1 }],
          },
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                version: 1,
                text: 'Pre-built components and patterns let you focus on your unique features instead of boilerplate.',
              },
            ],
          },
        ],
      },
    },
    columnTwo: {
      root: {
        type: 'root',
        version: 1,
        children: [
          {
            type: 'heading',
            tag: 'h3',
            version: 1,
            children: [{ type: 'text', text: 'Type-Safe CMS', version: 1 }],
          },
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                version: 1,
                text: 'Payload CMS generates TypeScript types automatically, ensuring your content is always correctly typed.',
              },
            ],
          },
        ],
      },
    },
    columnThree: {
      root: {
        type: 'root',
        version: 1,
        children: [
          {
            type: 'heading',
            tag: 'h3',
            version: 1,
            children: [{ type: 'text', text: 'Production Ready', version: 1 }],
          },
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                version: 1,
                text: 'Built with best practices for performance, SEO, and accessibility right out of the box.',
              },
            ],
          },
        ],
      },
    },
  },
  {
    id: 'demo-cta-1',
    blockType: 'callToAction',
    heading: 'Ready to Get Started?',
    subheading: 'Connect your database and start building your next project today.',
    richText: null,
    buttons: [
      { label: 'View Documentation', link: '/docs', variant: 'default' },
      { label: 'GitHub Repository', link: 'https://github.com', variant: 'outline' },
    ],
    backgroundColor: 'muted',
  },
] as Block[]

/**
 * Demo Posts
 */
export const demoPosts: PostCardData[] = [
  {
    id: 'demo-post-1',
    title: 'Getting Started with Payload CMS',
    slug: 'getting-started-payload-cms',
    excerpt: 'Learn how to set up and configure Payload CMS with Next.js for a powerful content management experience.',
    featuredImage: null,
    publishedAt: new Date().toISOString(),
  },
  {
    id: 'demo-post-2',
    title: 'Building Type-Safe APIs',
    slug: 'building-type-safe-apis',
    excerpt: 'Discover how Payload CMS automatically generates TypeScript types for your collections and globals.',
    featuredImage: null,
    publishedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
  },
  {
    id: 'demo-post-3',
    title: 'Deploying to Vercel',
    slug: 'deploying-to-vercel',
    excerpt: 'A step-by-step guide to deploying your Payload CMS application to Vercel with a PostgreSQL database.',
    featuredImage: null,
    publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
]

/**
 * Demo Site Settings
 */
export const demoSiteSettings = {
  general: {
    siteName: 'Vibecode Next Template',
    siteDescription: 'A modern Next.js template with Payload CMS integration',
    defaultOgImage: null,
  },
  contact: {
    email: 'hello@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, City, Country',
  },
  analytics: {
    googleAnalyticsId: null,
    googleTagManagerId: null,
    facebookPixelId: null,
  },
}
