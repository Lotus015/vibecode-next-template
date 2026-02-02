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
        { label: 'Services', link: '/services' },
        { label: 'Contact', link: '/contact' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Blog', link: '/posts' },
        { label: 'Documentation', link: 'https://github.com/jigjoy-io' },
        { label: 'Discord', link: 'https://discord.gg/xQR6DNtY' },
      ],
    },
  ],
  socialLinks: [
    { platform: 'discord', url: 'https://discord.gg/xQR6DNtY' },
    { platform: 'github', url: 'https://github.com/jigjoy-io' },
    { platform: 'globe', url: 'https://jigjoy.io' },
  ],
  copyright: '© 2025 Jigjoy. All rights reserved.',
}

/**
 * Demo Hero Data
 */
export const demoHeroData: HeroData = {
  type: 'highImpact',
  heading: 'AI-Safe Next.js Template',
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
      { label: 'View on GitHub', link: 'https://github.com/jigjoy-io', variant: 'default' },
      { label: 'Join Discord', link: 'https://discord.gg/xQR6DNtY', variant: 'outline' },
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
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'demo-post-3',
    title: 'Deploying to Vercel',
    slug: 'deploying-to-vercel',
    excerpt: 'A step-by-step guide to deploying your Payload CMS application to Vercel with a PostgreSQL database.',
    featuredImage: null,
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
  },
]

/**
 * Demo Site Settings
 */
export const demoSiteSettings = {
  general: {
    siteName: 'Jigjoy',
    siteDescription: 'AI-safe Next.js template with Payload CMS integration',
    defaultOgImage: null,
  },
  contact: {
    email: 'hello@jigjoy.io',
    discord: 'https://discord.gg/xQR6DNtY',
    github: 'https://github.com/jigjoy-io',
    website: 'https://jigjoy.io',
  },
  analytics: {
    googleAnalyticsId: null,
    googleTagManagerId: null,
    facebookPixelId: null,
  },
}

/**
 * Demo Page Data structure
 */
export interface DemoPageData {
  id: string
  title: string
  slug: string
  hero?: HeroData | null
  layout?: Block[] | null
}

/**
 * Demo Pages for static routes (about, services, contact)
 */
export const demoPages: Record<string, DemoPageData> = {
  about: {
    id: 'demo-about',
    title: 'About Us',
    slug: 'about',
    hero: {
      type: 'lowImpact',
      heading: 'About Jigjoy',
      subheading: 'We build AI-safe templates for modern web development.',
      media: null,
    },
    layout: [
      {
        id: 'about-content-1',
        blockType: 'content',
        columns: '1',
        columnOne: {
          root: {
            type: 'root',
            version: 1,
            children: [
              {
                type: 'heading',
                tag: 'h2',
                version: 1,
                children: [{ type: 'text', text: 'Our Mission', version: 1 }],
              },
              {
                type: 'paragraph',
                version: 1,
                children: [
                  {
                    type: 'text',
                    version: 1,
                    text: 'Jigjoy provides production-ready templates that are designed to work seamlessly with AI coding assistants. Our templates follow strict conventions and patterns that help AI tools understand and extend your codebase safely.',
                  },
                ],
              },
              {
                type: 'paragraph',
                version: 1,
                children: [
                  {
                    type: 'text',
                    version: 1,
                    text: 'Whether you\'re building a SPA, a full-stack Next.js app, a mobile app, or a chatbot, our templates give you a solid foundation with TypeScript, modern tooling, and best practices baked in.',
                  },
                ],
              },
            ],
          },
        },
      },
      {
        id: 'about-cta-1',
        blockType: 'callToAction',
        heading: 'Join Our Community',
        subheading: 'Connect with other developers building with Jigjoy templates.',
        richText: null,
        buttons: [
          { label: 'Join Discord', link: 'https://discord.gg/xQR6DNtY', variant: 'default' },
          { label: 'GitHub', link: 'https://github.com/jigjoy-io', variant: 'outline' },
        ],
        backgroundColor: 'muted',
      },
    ] as unknown as Block[],
  },
  services: {
    id: 'demo-services',
    title: 'Services',
    slug: 'services',
    hero: {
      type: 'lowImpact',
      heading: 'Our Templates',
      subheading: 'Production-ready templates for every use case.',
      media: null,
    },
    layout: [
      {
        id: 'services-content-1',
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
                children: [{ type: 'text', text: 'Next.js Template', version: 1 }],
              },
              {
                type: 'paragraph',
                version: 1,
                children: [
                  {
                    type: 'text',
                    version: 1,
                    text: 'Full-stack Next.js 16 with Payload CMS, PostgreSQL, and TypeScript. Perfect for content-driven websites.',
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
                children: [{ type: 'text', text: 'SPA Template', version: 1 }],
              },
              {
                type: 'paragraph',
                version: 1,
                children: [
                  {
                    type: 'text',
                    version: 1,
                    text: 'Vite + React + Supabase for blazing-fast single-page applications with real-time features.',
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
                children: [{ type: 'text', text: 'Mobile Template', version: 1 }],
              },
              {
                type: 'paragraph',
                version: 1,
                children: [
                  {
                    type: 'text',
                    version: 1,
                    text: 'React Native + Expo for cross-platform mobile apps with native performance.',
                  },
                ],
              },
            ],
          },
        },
      },
    ] as unknown as Block[],
  },
  contact: {
    id: 'demo-contact',
    title: 'Contact',
    slug: 'contact',
    hero: {
      type: 'lowImpact',
      heading: 'Get in Touch',
      subheading: 'Have questions? We\'d love to hear from you.',
      media: null,
    },
    layout: [
      {
        id: 'contact-content-1',
        blockType: 'content',
        columns: '1',
        columnOne: {
          root: {
            type: 'root',
            version: 1,
            children: [
              {
                type: 'heading',
                tag: 'h2',
                version: 1,
                children: [{ type: 'text', text: 'Connect With Us', version: 1 }],
              },
              {
                type: 'paragraph',
                version: 1,
                children: [
                  {
                    type: 'text',
                    version: 1,
                    text: 'The best way to reach us is through our Discord community where you can get help, share your projects, and connect with other developers.',
                  },
                ],
              },
            ],
          },
        },
      },
      {
        id: 'contact-cta-1',
        blockType: 'callToAction',
        heading: 'Join the Community',
        subheading: 'Get support, share ideas, and build together.',
        richText: null,
        buttons: [
          { label: 'Join Discord', link: 'https://discord.gg/xQR6DNtY', variant: 'default' },
          { label: 'Visit Website', link: 'https://jigjoy.io', variant: 'outline' },
        ],
        backgroundColor: 'muted',
      },
    ] as unknown as Block[],
  },
}

/**
 * Get a demo page by slug
 */
export function getDemoPage(slug: string): DemoPageData | null {
  return demoPages[slug] || null
}
