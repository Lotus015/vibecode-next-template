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

3. **Git**
   ```bash
   git --version
   ```

4. **Claude Code** (optional but recommended)
   - Install from [claude.com/claude-code](https://claude.com/claude-code)
   - Provides AI-powered development assistance

5. **Vercel Account** (for deployment)
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

### 2. Start Development

```bash
# Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

### 3. Verify Everything Works

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
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm lint:fix     # Auto-fix linting issues
pnpm typecheck    # Run TypeScript compiler
pnpm test         # Run tests once
pnpm test:watch   # Run tests in watch mode
pnpm verify       # Run ALL checks (lint + typecheck + test)
```

## Project Structure

```
vibecode-next-template/
├── app/                    # Next.js pages (routing only)
├── components/
│   ├── ui/                # shadcn/ui components (53 components)
│   └── layout/            # Layout components (header, footer, nav)
├── features/              # Feature modules (business logic goes here)
├── lib/                   # Utilities and shared logic
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
