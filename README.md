# Vibecode Next.js Template

An AI-first Next.js template designed for building production-grade web applications with Claude Code. This template enforces quality through automated testing, linting, and type checking, making it safe for AI-driven development.

## What is Vibecoding?

Vibecoding is a development approach where:
- **You describe what you want** (the "vibe")
- **Claude Code writes the code** (follows strict patterns)
- **The system enforces quality** (tests, types, linting)

No coding knowledge required. Just describe your idea, and Claude handles the implementation.

## Tech Stack

- **Next.js 16** - React framework with App Router
- **React 19** - Latest React with Server Components
- **Payload CMS 3.x** - Headless CMS with admin panel
- **PostgreSQL** - Database for content storage
- **TypeScript** - Type-safe code (strict mode)
- **Tailwind CSS v4** - Utility-first styling
- **shadcn/ui** - 53+ pre-built components
- **Vitest** - Fast unit testing
- **ESLint** - Code quality enforcement
- **pnpm** - Fast, disk-efficient package manager

## Prerequisites

Before you start, you need:

1. **Node.js 20 or higher**
   ```bash
   node --version  # Should be v20.x.x or higher
   ```
   Download from [nodejs.org](https://nodejs.org/)

2. **pnpm package manager**
   ```bash
   corepack enable  # Enables pnpm
   pnpm --version   # Should be v10.x.x or higher
   ```

3. **PostgreSQL database**
   - Local: Install via Homebrew (`brew install postgresql`) or [postgresql.org](https://www.postgresql.org/download/)
   - Cloud: [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
   - Docker: `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password postgres`

4. **Git**
   ```bash
   git --version
   ```

5. **Claude Code** (optional but recommended)
   - Install from [claude.com/claude-code](https://claude.com/claude-code)
   - Provides AI-powered development assistance

6. **Vercel Account** (for deployment)
   - Sign up at [vercel.com](https://vercel.com)
   - Connect your GitHub repository

## Getting Started

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd vibecode-next-template

# Install dependencies
pnpm install
```

### 2. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.local
```

Edit `.env.local` with your settings:

```bash
# Required: PostgreSQL connection string
DATABASE_URL=postgresql://postgres:password@localhost:5432/payload

# Required: Secret key for Payload (generate with: openssl rand -base64 32)
PAYLOAD_SECRET=your-secret-key-here

# Application URL (use localhost for development)
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Application name (optional)
NEXT_PUBLIC_APP_NAME=My App
```

### 3. Set Up Database

```bash
# Create the database (if using local PostgreSQL)
createdb payload

# Or with psql:
psql -c "CREATE DATABASE payload;"
```

### 4. Start Development

```bash
# Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

### 5. Seed Demo Content (Optional)

```bash
# Populate database with sample content
pnpm seed
```

This creates:
- Admin user (admin@example.com / admin123)
- Sample pages (Home, About)
- Sample blog posts
- Sample categories
- Header and Footer configuration

**Important**: Change the admin password immediately in production!

### 6. Verify Everything Works

```bash
# Run all quality checks
pnpm verify
```

This runs:
- ✓ ESLint (code quality)
- ✓ TypeScript (type checking)
- ✓ Vitest (all tests)

## Available Commands

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server

# Quality checks
pnpm lint         # Run ESLint
pnpm lint:fix     # Auto-fix linting issues
pnpm typecheck    # Run TypeScript compiler
pnpm test         # Run tests once
pnpm test:watch   # Run tests in watch mode
pnpm verify       # Run ALL checks (lint + typecheck + test)

# Payload CMS
pnpm seed         # Seed database with demo content
pnpm payload      # Run Payload CLI commands
pnpm generate:types  # Generate TypeScript types from Payload schema
```

## Project Structure

```
vibecode-next-template/
├── src/
│   ├── app/
│   │   ├── (frontend)/    # Public pages (/, /[slug], /posts, etc.)
│   │   └── (payload)/     # Admin panel and API routes
│   ├── access/            # Payload access control functions
│   ├── blocks/            # Content blocks (Content, MediaBlock, CallToAction)
│   ├── collections/       # Payload collections (Users, Media, Pages, Posts, Categories)
│   ├── components/        # Shared React components
│   │   └── ui/            # shadcn/ui components (53 components)
│   ├── Footer/            # Footer global config and component
│   ├── globals/           # Payload globals (SiteSettings)
│   ├── Header/            # Header global config and component
│   ├── hooks/             # React and Payload hooks
│   ├── lib/               # Utilities and shared logic
│   ├── plugins/           # Payload plugins configuration
│   ├── seed/              # Database seed scripts
│   └── utilities/         # Helper functions
├── public/                # Static assets
├── CLAUDE.md              # AI behavior guidelines (IMPORTANT!)
└── vercel.json            # Deployment configuration
```

## Working with Claude Code

This template includes `CLAUDE.md`, which contains strict guidelines that Claude Code follows. Key behaviors:

- **Incremental development** - Large features are broken into small chunks
- **Tests are mandatory** - Every feature gets tests before completion
- **Quality checks** - Lint, typecheck, and test after every change
- **No guessing** - Claude asks questions when requirements are unclear

### Example Prompts

```
"Add a contact form to the homepage"
"Create a navbar with dark mode toggle"
"Build a blog with markdown support"
```

Claude will:
1. Break down the task into steps
2. Implement one step at a time
3. Write tests for each step
4. Verify everything passes
5. Show you progress and ask for confirmation

## Payload CMS

This template includes Payload CMS 3.x, a powerful headless CMS that provides:

- **Admin Panel** - Full-featured content management UI
- **REST API** - Automatic REST endpoints for all collections
- **GraphQL API** - GraphQL endpoint for flexible queries
- **Authentication** - Built-in user authentication system
- **Media Management** - Image uploads with automatic optimization
- **Rich Text Editor** - Lexical-based rich text editing

### Accessing the Admin Panel

After starting the dev server:

1. Open [http://localhost:3000/admin](http://localhost:3000/admin)
2. Create your first admin user (or use seeded credentials)
3. Start managing content!

**Seeded admin credentials** (if you ran `pnpm seed`):
- Email: `admin@example.com`
- Password: `admin123`

### Content Structure

| Collection | Description |
|------------|-------------|
| **Users** | Admin users with roles (admin, editor, user) |
| **Media** | Images and files with automatic optimization |
| **Pages** | Static pages with hero and content blocks |
| **Posts** | Blog posts with featured images and categories |
| **Categories** | Hierarchical categories for organizing posts |

| Global | Description |
|--------|-------------|
| **Header** | Site navigation, logo, and CTA button |
| **Footer** | Multi-column footer with social links |
| **Site Settings** | Site name, description, contact info, analytics |

### Content Blocks

Pages can use these content blocks:

- **Content Block** - Rich text with 1-3 column layouts
- **Media Block** - Images with captions and positioning
- **Call to Action** - Promotional sections with buttons

### API Endpoints

- **REST API**: `GET /api/pages`, `GET /api/posts`, etc.
- **GraphQL**: `POST /api/graphql`
- **Admin**: `/admin`

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `PAYLOAD_SECRET` | Yes | Secret key for encryption (32+ chars) |
| `NEXT_PUBLIC_SERVER_URL` | No | Application URL (default: http://localhost:3000) |
| `NEXT_PUBLIC_APP_NAME` | No | Display name for your app |

### Development Workflow

1. **Start the dev server**: `pnpm dev`
2. **Edit content** in the admin panel at `/admin`
3. **Create collections** in `src/collections/`
4. **Create globals** in `src/globals/` or standalone directories
5. **Create blocks** in `src/blocks/`
6. **Generate types** after schema changes: `pnpm generate:types`

### Database Management

```bash
# Seed demo content
pnpm seed

# Run Payload CLI
pnpm payload

# Generate TypeScript types
pnpm generate:types
```

## Deployment

This template auto-deploys to Vercel when you push to `main`:

1. **Connect to Vercel**
   - Import your GitHub repo to Vercel
   - Vercel auto-detects Next.js settings

2. **Push to Deploy**
   ```bash
   git add .
   git commit -m "feat: your changes"
   git push origin main
   ```

3. **Vercel Build Process**
   - Runs `pnpm verify` (all quality checks)
   - Runs `pnpm build` (production build)
   - Deploys to global CDN
   - Provides production URL

**Note**: Deployments fail if tests, linting, or type checking fails. This is intentional - it keeps production quality high.

## Quality Guarantees

Every deployment must pass:

- ✅ **No ESLint errors or warnings** - Code quality enforced
- ✅ **No TypeScript errors** - 100% type-safe
- ✅ **All tests passing** - Behavior verified
- ✅ **Successful production build** - No runtime issues

If any check fails, the deployment is blocked.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vitest Testing](https://vitest.dev)

## Support

- Check `CLAUDE.md` for detailed development guidelines
- Check `docs/PROJECT_OVERVIEW.md` for architecture details
- Open an issue on GitHub for bugs or questions

---

**Built for vibecoders. Powered by Claude Code.**

## Created By

This template was created by the **JigJoy team**.

- 🌐 Website: [jigjoy.io](https://jigjoy.io)
- 💬 Discord: [Join our community](https://discord.gg/xQR6DNtY)
- 🐙 GitHub: [jigjoy-io](https://github.com/jigjoy-io)
