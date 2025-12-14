# Vibecode Next Template

An AI-safe Next.js template designed for AI-driven development.

## Philosophy

Humans describe intent.
AI writes code.
The system enforces correctness.

## Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** for components
- **Vitest** for testing
- **Zod** for environment validation
- **pnpm** for package management

## Structure

```
vibecode-next-template/
├── app/              # Next.js app router pages
├── components/
│   ├── ui/          # shadcn/ui components
│   └── layout/      # Layout components
├── features/        # Feature-based modules
├── lib/             # Utility functions and shared logic
├── docs/            # Project documentation
└── public/          # Static assets
```

## Getting Started

```bash
pnpm install
pnpm dev
```

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript compiler check
- `pnpm test` - Run tests with Vitest
- `pnpm verify` - Run all checks (lint + typecheck + test)
