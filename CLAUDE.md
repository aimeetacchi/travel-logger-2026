# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## IMPORTANT: Always consult /docs first

**Before writing any code, always check the `/docs` directory for a relevant guide.** The `/docs` directory contains project-specific documentation that takes precedence over general knowledge. If a relevant doc exists, read it before proceeding — do not rely solely on training data or `node_modules` docs:

- /docs/ui.md
- /docs/data-fetching.md
- /docs/data-mutations.md
- /docs/auth.md

## Commands

```bash
npm run dev      # start dev server at http://localhost:3000
npm run build    # production build
npm run lint     # run ESLint (note: `eslint`, not `next lint`)
```

No test runner is configured yet.

## Architecture

This is a Next.js 16.2.6 / React 19.2.4 app using the **App Router** with TypeScript and Tailwind CSS v4.

- `app/layout.tsx` — root layout; sets Geist fonts via CSS variables, applies dark mode
- `app/page.tsx` — home page (Server Component by default)
- `app/globals.css` — Tailwind v4 entry (`@import "tailwindcss"`) plus CSS custom properties for light/dark themes

## Breaking changes in this version of Next.js

**Always read `node_modules/next/dist/docs/` before writing code** — this version differs from training data in several ways:

- **`params` is a Promise.** Dynamic route props (`params`, `searchParams`) must be awaited: `const { slug } = await params`. Passing the Promise to a cached child component and resolving with `.then()` lets the parent stay uncached.
- **Server Components by default.** All layouts and pages are Server Components unless marked with `'use client'`. Add `'use client'` only when you need state, event handlers, lifecycle hooks, or browser APIs.
- **Server Functions / Server Actions.** Data mutation uses `'use server'`-annotated async functions, not API routes. Always verify auth inside every Server Function — they are reachable via direct POST requests.
- **Instant navigation requires `unstable_instant`.** Wrapping uncached data in `<Suspense>` alone is not sufficient. Export `unstable_instant` from any route that should navigate instantly; this also validates the caching structure at dev/build time. See `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.md`.
- **Tailwind CSS v4.** Use `@import "tailwindcss"` (not `@tailwind base/components/utilities`). Theme tokens are set with `@theme inline { ... }` blocks in CSS.
- **`use cache` directive.** Mark async server functions or components with `'use cache'` to cache their output. Replaces the old `fetch` cache options and `revalidate` exports for most use cases.
