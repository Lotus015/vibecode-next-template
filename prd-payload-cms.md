# Project: vibecode-next-template + Payload CMS

Branch: main
Description: Extend vibecode-next-template with Payload CMS 3.x integration. This template will serve as a foundation for building CMS-powered websites with Next.js 16, React 19, and PostgreSQL. The template should build and pass all checks without requiring a database connection - database setup happens when the template is used to create a real project.

## Technical Stack
- Next.js 16 with App Router
- React 19
- TypeScript (strict mode)
- Payload CMS 3.x (latest)
- PostgreSQL database adapter (configured but not required for build)
- shadcn/ui components (already installed)
- Tailwind CSS v4
- Vitest for testing
- pnpm package manager

## Architecture Notes
- Template must build successfully WITHOUT a database connection
- All Payload data fetching must have try/catch with fallback defaults
- Admin panel at /admin route (inside (payload) route group)
- Frontend pages in (frontend) route group
- Collections and globals defined but empty until seeded

## Reference Implementation
Use auto-plus project at ~/Desktop/auto-plus as reference for working Payload CMS patterns.

---

## User Stories

### S1: Install Payload CMS Dependencies
Priority: 1
Description: Install Payload CMS 3.x and all required dependencies. Update package.json scripts and configuration for Payload support.

Acceptance Criteria:
- payload ^3.74.0 installed
- @payloadcms/db-postgres installed
- @payloadcms/next installed
- @payloadcms/richtext-lexical installed
- @payloadcms/ui installed
- graphql package installed
- sharp package installed for image processing
- sass package installed for admin styles
- tsx package installed for running TypeScript scripts
- package.json has "type": "module"
- package.json scripts include: "generate:types": "payload generate:types", "payload": "payload", "seed": "tsx src/seed/index.ts"

Tests: pnpm install && pnpm build
Status: pending

---

### S2: Create Source Directory Structure
Priority: 2
Description: Reorganize project to use src/ directory structure matching Payload conventions. Move existing code and create placeholder directories.

Acceptance Criteria:
- src/ directory created as main source folder
- src/app/ directory for Next.js app router
- src/collections/ directory for Payload collections
- src/globals/ directory for Payload globals
- src/blocks/ directory for content blocks
- src/components/ directory (move existing components)
- src/lib/ directory (move existing lib)
- src/hooks/ directory for Payload hooks
- src/access/ directory for access control functions
- src/utilities/ directory for helper functions
- src/seed/ directory for seed scripts
- src/plugins/ directory for Payload plugins
- tsconfig.json paths updated for src/ structure
- next.config.ts updated if needed

Tests: pnpm build
Status: pending

---

### S3: Create Payload Configuration File
Priority: 3
Description: Create the main Payload configuration file with PostgreSQL adapter, Lexical editor, and basic settings. Configuration should work without database for builds.

Acceptance Criteria:
- src/payload.config.ts created with buildConfig
- PostgreSQL adapter configured via DATABASE_URL
- Lexical rich text editor configured
- Admin panel configuration with meta title
- TypeScript types output to src/payload-types.ts
- PAYLOAD_SECRET configured via environment variable
- importMap configuration for admin components
- Empty collections and globals arrays (to be populated later)

Tests: pnpm build
Status: pending

---

### S4: Create App Directory with Route Groups
Priority: 4
Description: Create the Next.js app directory structure with (payload) and (frontend) route groups. Set up admin panel routes.

Acceptance Criteria:
- src/app/(payload)/ route group for admin panel
- src/app/(payload)/admin/[[...segments]]/page.tsx for admin UI
- src/app/(payload)/api/[[...slug]]/route.ts for REST API
- src/app/(payload)/api/graphql/route.ts for GraphQL API
- src/app/(payload)/layout.tsx with RootLayout
- src/app/(payload)/custom.scss for admin customization (empty)
- src/app/(frontend)/ route group for public pages
- src/app/(frontend)/layout.tsx with frontend layout
- src/app/(frontend)/page.tsx as homepage
- src/app/(frontend)/globals.css moved from app/

Tests: pnpm build
Status: pending

---

### S5: Create Users Collection
Priority: 5
Description: Create the Users collection for authentication. This is required for Payload admin access.

Acceptance Criteria:
- src/collections/Users/index.ts with CollectionConfig
- Fields: email (required), password (auth), name, role (admin/editor/user)
- Auth configuration enabled
- Admin access restricted to admin role
- TypeScript types exported

Tests: pnpm build
Status: pending

---

### S6: Create Media Collection
Priority: 6
Description: Create the Media collection for file uploads with image optimization settings.

Acceptance Criteria:
- src/collections/Media.ts with CollectionConfig
- Upload configuration with mimeTypes filter for images
- Fields: alt (text), caption (text)
- Image sizes defined (thumbnail, card, hero)
- Admin thumbnail configuration

Tests: pnpm build
Status: pending

---

### S7: Create Pages Collection
Priority: 7
Description: Create the Pages collection for static pages with hero section and content blocks.

Acceptance Criteria:
- src/collections/Pages/index.ts with CollectionConfig
- Fields: title, slug (unique, indexed), publishedAt
- Hero group field with: type (select), heading, subheading, media (relationship), richText
- Layout field (blocks array - to be populated with blocks later)
- Meta group for SEO (title, description, image)
- Hooks for slug generation and revalidation
- Access control: published pages are public

Tests: pnpm build
Status: pending

---

### S8: Create Posts Collection
Priority: 8
Description: Create the Posts collection for blog posts with rich text content.

Acceptance Criteria:
- src/collections/Posts/index.ts with CollectionConfig
- Fields: title, slug (unique), excerpt (textarea), content (richText)
- featuredImage (relationship to Media)
- categories (relationship to Categories - hasMany)
- author (relationship to Users)
- publishedAt (date)
- Meta group for SEO
- Access control: published posts are public

Tests: pnpm build
Status: pending

---

### S9: Create Categories Collection
Priority: 9
Description: Create the Categories collection for organizing posts with nested category support.

Acceptance Criteria:
- src/collections/Categories.ts with CollectionConfig
- Fields: title, slug
- parent (relationship to self for nested categories)
- Breadcrumbs field for nested docs plugin compatibility
- Proper indexing on slug

Tests: pnpm build
Status: pending

---

### S10: Create Header Global
Priority: 10
Description: Create the Header global configuration for site navigation.

Acceptance Criteria:
- src/Header/config.ts with GlobalConfig
- Fields: logo (upload to Media), navItems (array with label, link)
- CTA button field (label, link, variant)
- src/Header/Component.tsx React component
- Component fetches data from global and renders navigation
- Mobile-responsive with hamburger menu
- Hooks for revalidation

Tests: pnpm build
Status: pending

---

### S11: Create Footer Global
Priority: 11
Description: Create the Footer global configuration for site footer.

Acceptance Criteria:
- src/Footer/config.ts with GlobalConfig
- Fields: logo, columns (array with title and links array), socialLinks (array), copyright
- src/Footer/Component.tsx React component
- Component renders multi-column footer layout
- Social links with icons
- Hooks for revalidation

Tests: pnpm build
Status: pending

---

### S12: Create SiteSettings Global
Priority: 12
Description: Create the SiteSettings global for site-wide configuration.

Acceptance Criteria:
- src/globals/SiteSettings.ts with GlobalConfig
- Fields: siteName, siteDescription, defaultOgImage (upload)
- Contact fields: email, phone, address
- Social links array
- Analytics IDs (optional text fields)
- Default values for required fields

Tests: pnpm build
Status: pending

---

### S13: Create Content Block
Priority: 13
Description: Create the Content block for rich text content sections.

Acceptance Criteria:
- src/blocks/Content/config.ts with Block definition
- Fields: columns (select 1/2/3), columnOne (richText), columnTwo (richText), columnThree (richText)
- src/blocks/Content/Component.tsx for rendering
- Responsive grid layout based on column count

Tests: pnpm build
Status: pending

---

### S14: Create MediaBlock
Priority: 14
Description: Create the MediaBlock for image/video content with captions.

Acceptance Criteria:
- src/blocks/MediaBlock/config.ts with Block definition
- Fields: media (upload), caption (text), position (left/center/right)
- src/blocks/MediaBlock/Component.tsx for rendering
- Responsive image with next/image
- Optional caption display

Tests: pnpm build
Status: pending

---

### S15: Create CallToAction Block
Priority: 15
Description: Create the CallToAction block for promotional sections.

Acceptance Criteria:
- src/blocks/CallToAction/config.ts with Block definition
- Fields: heading, subheading, richText content, buttons array (label, link, variant)
- Background color/style options
- src/blocks/CallToAction/Component.tsx for rendering
- Centered layout with prominent styling

Tests: pnpm build
Status: pending

---

### S16: Create RenderBlocks Component
Priority: 16
Description: Create the component that renders an array of blocks dynamically.

Acceptance Criteria:
- src/blocks/RenderBlocks.tsx component
- Maps block types to components (Content, MediaBlock, CallToAction)
- Handles unknown block types gracefully
- TypeScript type safety for block rendering
- Export block configs from src/blocks/index.ts

Tests: pnpm build
Status: pending

---

### S17: Register Collections and Globals in Config
Priority: 17
Description: Update payload.config.ts to register all collections and globals.

Acceptance Criteria:
- All collections imported and registered: Users, Media, Pages, Posts, Categories
- All globals imported and registered: Header, Footer, SiteSettings
- Collections array properly typed
- Globals array properly typed
- Build succeeds with all registrations

Tests: pnpm build
Status: pending

---

### S18: Create Access Control Functions
Priority: 18
Description: Create reusable access control functions for collections.

Acceptance Criteria:
- src/access/authenticated.ts - requires authenticated user
- src/access/authenticatedOrPublished.ts - public read for published, auth for edit
- src/access/admins.ts - admin role only
- src/access/adminsOrSelf.ts - admins or the user themselves
- Functions properly typed with Access type from Payload
- Apply to relevant collections

Tests: pnpm build
Status: pending

---

### S19: Create Utility Functions
Priority: 19
Description: Create utility functions for data fetching and helpers.

Acceptance Criteria:
- src/utilities/getURL.ts - server/client URL helpers (getServerSideURL, getClientSideURL)
- src/utilities/generateMeta.ts - SEO metadata generation from page/post data
- src/utilities/mergeOpenGraph.ts - merge OG meta objects
- src/utilities/formatDateTime.ts - date formatting helper
- src/utilities/cn.ts - className utility (if not already in lib)
- All functions properly typed and exported

Tests: pnpm build
Status: pending

---

### S20: Create Payload Hooks
Priority: 20
Description: Create Payload hooks for common operations.

Acceptance Criteria:
- src/hooks/revalidatePath.ts - revalidate Next.js paths after changes
- src/hooks/populatePublishedAt.ts - auto-set publishedAt on first publish
- src/hooks/formatSlug.ts - generate slug from title
- Hooks properly typed with CollectionAfterChangeHook etc.
- Apply hooks to relevant collections

Tests: pnpm build
Status: pending

---

### S21: Create Frontend Layout Components
Priority: 21
Description: Create the main layout wrapper that uses Header and Footer components.

Acceptance Criteria:
- src/app/(frontend)/layout.tsx fetches Header, Footer, SiteSettings
- Passes data to Header and Footer components
- Includes providers (if any needed)
- try/catch with fallbacks for all Payload fetches
- Proper TypeScript types for layout props

Tests: pnpm build
Status: pending

---

### S22: Create Homepage with Data Fetching
Priority: 22
Description: Create the homepage that fetches page data from Payload CMS.

Acceptance Criteria:
- src/app/(frontend)/page.tsx fetches homepage from Pages collection
- Renders hero section from page data
- Renders content blocks using RenderBlocks
- try/catch with fallback content when no data
- generateMetadata function for SEO
- Server Component for data fetching

Tests: pnpm build
Status: pending

---

### S23: Create Dynamic Page Route
Priority: 23
Description: Create the [slug] dynamic route for rendering any page.

Acceptance Criteria:
- src/app/(frontend)/[slug]/page.tsx for dynamic pages
- Fetches page by slug from Pages collection
- Renders hero and blocks
- notFound() for missing pages
- generateStaticParams for static generation
- generateMetadata for SEO

Tests: pnpm build
Status: pending

---

### S24: Create Blog Listing Page
Priority: 24
Description: Create the blog listing page showing all posts.

Acceptance Criteria:
- src/app/(frontend)/posts/page.tsx for blog listing
- Fetches posts from Posts collection
- Displays posts in grid/list layout
- Shows featured image, title, excerpt, date
- Links to individual post pages
- Pagination support (basic)

Tests: pnpm build
Status: pending

---

### S25: Create Blog Post Detail Page
Priority: 25
Description: Create the individual blog post page.

Acceptance Criteria:
- src/app/(frontend)/posts/[slug]/page.tsx for post detail
- Fetches post by slug from Posts collection
- Renders title, featured image, content (richText)
- Shows author and date
- Related posts section (optional)
- generateMetadata for SEO
- notFound() for missing posts

Tests: pnpm build
Status: pending

---

### S26: Add Payload Plugins
Priority: 26
Description: Add and configure Payload plugins for SEO, redirects, and nested docs.

Acceptance Criteria:
- @payloadcms/plugin-seo installed and configured
- @payloadcms/plugin-redirects installed and configured
- @payloadcms/plugin-nested-docs installed and configured
- src/plugins/index.ts exports plugins array
- Plugins registered in payload.config.ts
- SEO fields added to Pages and Posts collections

Tests: pnpm build
Status: pending

---

### S27: Create Environment Configuration
Priority: 27
Description: Set up environment variables and type declarations.

Acceptance Criteria:
- .env.example with all required variables: DATABASE_URL, PAYLOAD_SECRET, NEXT_PUBLIC_SERVER_URL
- src/env.ts for environment validation (or update existing lib/env.ts)
- TypeScript declarations for environment variables
- vercel.json updated for deployment
- .gitignore includes .env

Tests: pnpm build
Status: pending

---

### S28: Create Seed Script
Priority: 28
Description: Create a seed script to populate the database with demo content.

Acceptance Criteria:
- src/seed/index.ts main seed script
- Seeds admin user (admin@example.com)
- Seeds sample pages (Home, About)
- Seeds sample posts (2-3 posts)
- Seeds sample categories
- Seeds Header, Footer, SiteSettings globals
- Idempotent - can run multiple times safely
- Uses Payload Local API for seeding
- Runnable via pnpm seed (requires DATABASE_URL)

Tests: pnpm build (seed itself requires database)
Status: pending

---

### S29: Update Tests for Payload Integration
Priority: 29
Description: Update existing tests and add new tests for Payload components.

Acceptance Criteria:
- Existing tests still pass with new structure
- Tests for utility functions
- Tests for block components (Content, MediaBlock, CallToAction)
- Tests for RenderBlocks component
- Mock Payload data in tests where needed
- All tests pass: pnpm test

Tests: pnpm test
Status: pending

---

### S30: Update Documentation
Priority: 30
Description: Update README and CLAUDE.md with Payload CMS documentation.

Acceptance Criteria:
- README.md updated with Payload CMS section
- Database setup instructions
- Environment variables documentation
- Admin panel access instructions
- Seed script usage
- Development workflow
- CLAUDE.md updated with CMS patterns and guidelines
- Collection and global documentation

Tests: Files exist and contain expected content
Status: pending

---

## Environment Variables Reference

```
# Database (required for runtime, not for build)
DATABASE_URL=postgresql://user:password@localhost:5432/vibecode

# Payload (required)
PAYLOAD_SECRET=your-secret-key-at-least-32-characters-long

# Site URL
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

## Success Criteria

The project is complete when:
1. `pnpm build` succeeds WITHOUT a database connection
2. `pnpm test` passes all tests
3. `pnpm lint` passes with no errors
4. `pnpm typecheck` passes with no errors
5. Admin panel is accessible at /admin (when database connected)
6. Frontend pages render correctly (when database connected and seeded)
7. Seed script populates demo content successfully
8. Documentation is complete and accurate
