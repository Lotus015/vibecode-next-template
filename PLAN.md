STEP 1 — Create a clean Next.js App Router project

From an empty workspace:

npx create-next-app@latest vibecode-next-template


Choose exactly these options:

TypeScript → Yes

ESLint → Yes

Tailwind CSS → Yes

src/ directory → Yes

App Router → Yes

Import alias (@/*) → Yes

Turbopack → Yes or No (either is fine)

Then:

cd vibecode-next-template
git init


✅ You should now have a working Next.js app that runs with:

npm run dev


Do not continue until it runs.

STEP 2 — Normalize package manager (important for AI)

Pick one. I strongly recommend pnpm.

corepack enable
pnpm install


Then delete:

package-lock.json

yarn.lock

Update package.json scripts:

{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "verify": "pnpm lint && pnpm typecheck && pnpm test"
  }
}


✅ You should now have:

pnpm installed deps

no other lockfiles

STEP 3 — Install shadcn/ui (DO NOT customize)

This is important: no creative options.

pnpm dlx shadcn@latest init


Choose:

Style → Default

Base color → Neutral

CSS variables → Yes

React Server Components → Yes

Components dir → src/components/ui

Utils dir → src/lib/utils.ts

Do NOT add components yet.

✅ You should now have:

components.json

src/components/ui

Tailwind config updated

STEP 4 — Enforce Vibecode folder structure

Now we reshape the project.

Create folders:

mkdir -p src/features
mkdir -p src/lib
mkdir -p src/components/layout
mkdir -p docs


Your src/ should now look like:

src/
  app/
  components/
    ui/
    layout/
  features/
  lib/


Now move nothing else yet.

✅ You should now have empty but intentional boundaries.

STEP 5 — Add CLAUDE.md and docs

At the repo root:

touch CLAUDE.md


Paste your full CLAUDE.md (the one we wrote earlier).

Create:

docs/PROJECT_OVERVIEW.md


Minimal content (for now):

# Vibecode Next Template

An AI-safe Next.js template designed for AI-driven development.

Humans describe intent.
AI writes code.
The system enforces correctness.


✅ You should now have:

CLAUDE.md at root

docs folder present

STEP 6 — Make Next.js AI-safe (very important)
6.1 Kill logic in pages early

Open:

src/app/page.tsx


Replace content with something boring:

export default function HomePage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Vibecode</h1>
      <p className="mt-2 text-muted-foreground">
        AI-safe Next.js template
      </p>
    </main>
  )
}


No logic. No fetching.

This sets the tone for AI.

6.2 Add env validation (Vercel-safe)

Create:

src/lib/env.ts

import { z } from "zod"

const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("Vibecode"),
})

export const env = envSchema.parse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
})


Add zod:

pnpm add zod


This prevents “works locally, breaks on Vercel”.

✅ You now have env safety.

STEP 7 — Add Vercel configuration (explicit)

Create at root:

vercel.json

{
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "outputDirectory": ".next"
}


This is non-negotiable for AI safety.

STEP 8 — Add testing foundation (do this now)
pnpm add -D vitest @testing-library/react jsdom


Create:

vitest.config.ts

import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
  },
})


Add to tsconfig.json:

{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}


✅ You now have a testable system.

STEP 9 — First commit (important)
git add .
git commit -m "Initial vibecode Next.js template with Vercel support"


This is your golden baseline.

STOP HERE ✅

At this point, you have:

✅ Next.js App Router

✅ Tailwind + shadcn

✅ CLAUDE.md enforcing AI behavior

✅ Vibecode folder boundaries

✅ Vercel-ready deployment

✅ Env safety

✅ Test infrastructure

Do not add features yet.
Templates should be boring.