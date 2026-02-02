/**
 * Seed Script for Payload CMS
 *
 * This script populates the database with demo content.
 * It is idempotent - can be run multiple times safely.
 *
 * Usage: pnpm seed
 *
 * Seeds:
 * - Admin user (admin@example.com)
 * - Sample categories
 * - Sample pages (Home, About)
 * - Sample posts (3 blog posts)
 * - Header global (navigation)
 * - Footer global (links and copyright)
 * - SiteSettings global (site info)
 */

import { getPayload } from 'payload'
import config from '@payload-config'

// Seed data types
interface SeedCategory {
  title: string
  slug: string
}

interface SeedPage {
  title: string
  slug: string
  heroType: 'none' | 'highImpact' | 'mediumImpact' | 'lowImpact'
  heroHeading?: string
  heroSubheading?: string
}

interface SeedPost {
  title: string
  slug: string
  excerpt: string
  categorySlug: string
}

// Seed data constants
const ADMIN_EMAIL = 'admin@example.com'
const ADMIN_PASSWORD = 'admin123'
const ADMIN_NAME = 'Admin User'

const CATEGORIES: SeedCategory[] = [
  { title: 'Technology', slug: 'technology' },
  { title: 'Design', slug: 'design' },
  { title: 'Business', slug: 'business' },
]

const PAGES: SeedPage[] = [
  {
    title: 'Home',
    slug: 'home',
    heroType: 'highImpact',
    heroHeading: 'Welcome to Our Website',
    heroSubheading: 'Built with Next.js and Payload CMS',
  },
  {
    title: 'About',
    slug: 'about',
    heroType: 'lowImpact',
    heroHeading: 'About Us',
    heroSubheading: 'Learn more about our mission and team',
  },
]

const POSTS: SeedPost[] = [
  {
    title: 'Getting Started with Payload CMS',
    slug: 'getting-started-with-payload-cms',
    excerpt:
      'Learn how to set up and configure Payload CMS for your Next.js project.',
    categorySlug: 'technology',
  },
  {
    title: 'Building Modern Web Applications',
    slug: 'building-modern-web-applications',
    excerpt:
      'Discover best practices for creating scalable and maintainable web applications.',
    categorySlug: 'technology',
  },
  {
    title: 'Design Principles for Developers',
    slug: 'design-principles-for-developers',
    excerpt:
      'Essential design principles every developer should know to create better user interfaces.',
    categorySlug: 'design',
  },
]

/**
 * Rich text content type matching Payload's Lexical editor format
 */
interface RichTextContent {
  root: {
    type: string
    children: {
      type: string
      version: number
      [k: string]: unknown
    }[]
    direction: 'ltr' | 'rtl' | null
    format: '' | 'left' | 'start' | 'center' | 'right' | 'end' | 'justify'
    indent: number
    version: number
  }
  [k: string]: unknown
}

/**
 * Create Lexical rich text content from plain text
 */
function createRichText(text: string): RichTextContent {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'text',
              format: 0,
              mode: 'normal',
              style: '',
              version: 1,
              text: text,
              detail: 0,
            },
          ],
          textFormat: 0,
          direction: 'ltr',
        },
      ],
      direction: 'ltr',
    },
  }
}

/**
 * Main seed function
 */
async function seed(): Promise<void> {
  console.log('🌱 Starting seed script...\n')

  // Initialize Payload
  const payload = await getPayload({ config })

  // Track created IDs for relationships
  // Payload with PostgreSQL uses numeric IDs
  let adminUserId: number | null = null
  const categoryIds: Record<string, number> = {}

  // 1. Seed admin user
  console.log('👤 Seeding admin user...')
  try {
    const existingUsers = await payload.find({
      collection: 'users',
      where: { email: { equals: ADMIN_EMAIL } },
      limit: 1,
    })

    if (existingUsers.docs.length > 0) {
      console.log('   Admin user already exists, skipping...')
      adminUserId = existingUsers.docs[0].id
    } else {
      const adminUser = await payload.create({
        collection: 'users',
        data: {
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          name: ADMIN_NAME,
          role: 'admin',
        },
      })
      adminUserId = adminUser.id
      console.log('   ✓ Admin user created')
    }
  } catch (error) {
    console.error('   ✗ Failed to seed admin user:', error)
  }

  // 2. Seed categories
  console.log('\n📁 Seeding categories...')
  for (const category of CATEGORIES) {
    try {
      const existingCategories = await payload.find({
        collection: 'categories',
        where: { slug: { equals: category.slug } },
        limit: 1,
      })

      if (existingCategories.docs.length > 0) {
        console.log(`   Category "${category.title}" already exists, skipping...`)
        categoryIds[category.slug] = existingCategories.docs[0].id
      } else {
        const createdCategory = await payload.create({
          collection: 'categories',
          data: {
            title: category.title,
            slug: category.slug,
          },
        })
        categoryIds[category.slug] = createdCategory.id
        console.log(`   ✓ Category "${category.title}" created`)
      }
    } catch (error) {
      console.error(`   ✗ Failed to seed category "${category.title}":`, error)
    }
  }

  // 3. Seed pages
  console.log('\n📄 Seeding pages...')
  for (const page of PAGES) {
    try {
      const existingPages = await payload.find({
        collection: 'pages',
        where: { slug: { equals: page.slug } },
        limit: 1,
      })

      if (existingPages.docs.length > 0) {
        console.log(`   Page "${page.title}" already exists, skipping...`)
      } else {
        await payload.create({
          collection: 'pages',
          data: {
            title: page.title,
            slug: page.slug,
            hero: {
              type: page.heroType,
              heading: page.heroHeading,
              subheading: page.heroSubheading,
            },
            layout: [
              {
                blockType: 'content',
                columns: '1',
                columnOne: createRichText(
                  `This is the ${page.title} page. Edit this content in the Payload CMS admin panel.`
                ),
              },
            ],
            _status: 'published',
            publishedAt: new Date().toISOString(),
          },
        })
        console.log(`   ✓ Page "${page.title}" created`)
      }
    } catch (error) {
      console.error(`   ✗ Failed to seed page "${page.title}":`, error)
    }
  }

  // 4. Seed posts
  console.log('\n📝 Seeding posts...')
  if (!adminUserId) {
    console.log('   ⚠ Skipping posts - no admin user available as author')
  } else {
    for (const post of POSTS) {
      try {
        const existingPosts = await payload.find({
          collection: 'posts',
          where: { slug: { equals: post.slug } },
          limit: 1,
        })

        if (existingPosts.docs.length > 0) {
          console.log(`   Post "${post.title}" already exists, skipping...`)
        } else {
          const categoryId = categoryIds[post.categorySlug]
          await payload.create({
            collection: 'posts',
            data: {
              title: post.title,
              slug: post.slug,
              excerpt: post.excerpt,
              content: createRichText(
                `${post.excerpt}\n\nThis is sample content for the blog post. You can edit this in the Payload CMS admin panel to add your own content.`
              ),
              author: adminUserId,
              categories: categoryId ? [categoryId] : [],
              _status: 'published',
              publishedAt: new Date().toISOString(),
            },
          })
          console.log(`   ✓ Post "${post.title}" created`)
        }
      } catch (error) {
        console.error(`   ✗ Failed to seed post "${post.title}":`, error)
      }
    }
  }

  // 5. Seed Header global
  console.log('\n🎯 Seeding Header global...')
  try {
    const existingHeader = await payload.findGlobal({
      slug: 'header',
    })

    // Check if header has been configured (has nav items)
    if (existingHeader.navItems && existingHeader.navItems.length > 0) {
      console.log('   Header already configured, skipping...')
    } else {
      await payload.updateGlobal({
        slug: 'header',
        data: {
          navItems: [
            { label: 'Home', link: '/' },
            { label: 'About', link: '/about' },
            { label: 'Blog', link: '/posts' },
          ],
          ctaButton: {
            label: 'Contact Us',
            link: '/contact',
            variant: 'default',
          },
        },
      })
      console.log('   ✓ Header global configured')
    }
  } catch (error) {
    console.error('   ✗ Failed to seed Header global:', error)
  }

  // 6. Seed Footer global
  console.log('\n🦶 Seeding Footer global...')
  try {
    const existingFooter = await payload.findGlobal({
      slug: 'footer',
    })

    // Check if footer has been configured (has columns or copyright)
    if (
      (existingFooter.columns && existingFooter.columns.length > 0) ||
      existingFooter.copyright
    ) {
      console.log('   Footer already configured, skipping...')
    } else {
      await payload.updateGlobal({
        slug: 'footer',
        data: {
          columns: [
            {
              title: 'Navigation',
              links: [
                { label: 'Home', link: '/' },
                { label: 'About', link: '/about' },
                { label: 'Blog', link: '/posts' },
              ],
            },
            {
              title: 'Resources',
              links: [
                { label: 'Documentation', link: '/docs' },
                { label: 'Support', link: '/support' },
              ],
            },
          ],
          socialLinks: [
            { platform: 'twitter', url: 'https://twitter.com/example' },
            { platform: 'github', url: 'https://github.com/example' },
          ],
          copyright: `© ${new Date().getFullYear()} My Website. All rights reserved.`,
        },
      })
      console.log('   ✓ Footer global configured')
    }
  } catch (error) {
    console.error('   ✗ Failed to seed Footer global:', error)
  }

  // 7. Seed SiteSettings global
  console.log('\n⚙️  Seeding SiteSettings global...')
  try {
    const existingSiteSettings = await payload.findGlobal({
      slug: 'site-settings',
    })

    // Check if site settings have been customized
    if (
      existingSiteSettings.general?.siteName &&
      existingSiteSettings.general.siteName !== 'My Website'
    ) {
      console.log('   SiteSettings already customized, skipping...')
    } else {
      await payload.updateGlobal({
        slug: 'site-settings',
        data: {
          general: {
            siteName: 'My Website',
            siteDescription:
              'A modern website built with Next.js and Payload CMS',
          },
          contact: {
            email: 'contact@example.com',
            phone: '+1 (555) 123-4567',
            address: '123 Main Street\nCity, State 12345',
          },
          socialLinks: [
            { platform: 'twitter', url: 'https://twitter.com/example' },
            { platform: 'github', url: 'https://github.com/example' },
            { platform: 'linkedin', url: 'https://linkedin.com/company/example' },
          ],
        },
      })
      console.log('   ✓ SiteSettings global configured')
    }
  } catch (error) {
    console.error('   ✗ Failed to seed SiteSettings global:', error)
  }

  console.log('\n✅ Seed script completed!\n')
  console.log('You can now log in to the admin panel with:')
  console.log(`   Email: ${ADMIN_EMAIL}`)
  console.log(`   Password: ${ADMIN_PASSWORD}`)
  console.log('\nAdmin panel: http://localhost:3000/admin\n')

  process.exit(0)
}

// Run the seed function
seed().catch((error) => {
  console.error('❌ Seed script failed:', error)
  process.exit(1)
})
