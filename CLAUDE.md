# CLAUDE.md — Next.js Application

## Project Overview

This is a Next.js 16.1 application using the App Router (with Pages Router support for hybrid/migration scenarios). Follow these instructions for every task involving this project.

**Stack:** TypeScript, Next.js 16.1, React 19.2, Tailwind CSS, Shadcn/ui, CSS Modules, Prisma, MongoDB/Mongoose, Zod, TanStack Query, Zustand

---

## Next.js 16.1 — Critical Rules

### Routing & Architecture

- **App Router is primary.** All new features go in `app/`. Pages Router (`pages/`) is for legacy routes only — never add new pages there unless explicitly migrating.
- **`proxy.ts` replaces `middleware.ts`** in Next.js 16. The exported function must be named `proxy`, not `middleware`. This file handles the network boundary (auth checks, redirects, rewrites). Do NOT put heavy business logic here.
- **Params and searchParams are async.** Always `await` them:
  ```typescript
  export default async function Page(props: PageProps<'/blog/[slug]'>) {
    const { slug } = await props.params
    const query = await props.searchParams
  }
  ```
- **Turbopack is the default bundler.** Do not add webpack-specific config unless there's an explicit reason. Use `turbopack.resolveAlias` for module resolution issues instead of webpack `resolve.fallback`.
- **React Compiler is available** (`reactCompiler: true` in next.config.ts). It handles automatic memoization — do NOT manually add `useMemo`, `useCallback`, or `React.memo` unless profiling shows a specific performance issue.

### Caching (Next.js 16 Cache Components)

- **Caching is opt-in.** All dynamic code runs at request time by default. Do NOT assume anything is cached.
- **Use the `"use cache"` directive** to explicitly cache pages, components, or functions:
  ```typescript
  "use cache"
  import { cacheLife, cacheTag } from 'next/cache'

  export default async function ProductList() {
    cacheLife('hours')
    cacheTag('products')
    const products = await db.products.findMany()
    return <ProductGrid products={products} />
  }
  ```
- **`cacheLife` profiles:** Use built-in profiles (`'max'`, `'hours'`, `'days'`) or define custom ones in `next.config.ts`.
- **`revalidateTag()` now requires a cacheLife profile** as second argument:
  ```typescript
  revalidateTag('products', 'max')
  ```
- **`updateTag()`** is for instant client reflection (forms, user settings). **`revalidateTag()`** is for background SWR revalidation.
- **`refresh()`** refreshes the client router from Server Actions — use it after mutations that affect displayed data.
- **NEVER use the old `unstable_cache` or `export const revalidate`** patterns. They are deprecated.

### Server Components vs Client Components

- **Server Components are the default.** Every component in `app/` is a Server Component unless marked with `"use client"`.
- **NEVER add `"use client"` to a file unless it uses:** `useState`, `useEffect`, `useRef`, browser APIs, event handlers (`onClick`, `onChange`, etc.), or third-party client-only libraries.
- **Push `"use client"` as deep as possible.** Wrap only the interactive leaf component, not the parent. Extract client interactivity into small dedicated components.
- **NEVER import a Server Component into a Client Component.** Pass Server Components as `children` or props instead:
  ```typescript
  // ✅ CORRECT
  <ClientWrapper>
    <ServerComponent />
  </ClientWrapper>

  // ❌ WRONG
  'use client'
  import ServerComponent from './ServerComponent' // This forces it to become client
  ```
- **Server Actions use `"use server"`.** Define them in separate files under `app/_actions/` or inline in Server Components. Never define them in `"use client"` files.
- **Data fetching happens in Server Components.** Pass data down as props. Never fetch in Client Components unless using TanStack Query for client-side interactivity.

---

## Directory Structure

```
├── app/                          # App Router (primary)
│   ├── (auth)/                   # Route group for auth pages
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/              # Route group for dashboard
│   │   ├── layout.tsx
│   │   └── [feature]/
│   ├── api/                      # Route handlers
│   │   └── [resource]/
│   │       └── route.ts
│   ├── _actions/                 # Server Actions
│   ├── _components/              # Shared app-level components
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   ├── proxy.ts                  # Network proxy (was middleware)
│   ├── error.tsx                 # Global error boundary
│   ├── not-found.tsx             # 404 page
│   └── loading.tsx               # Global loading UI
├── components/                   # Shared components (used across app/ and pages/)
│   ├── ui/                       # Shadcn/ui components
│   └── [domain]/                 # Domain-specific components
├── lib/                          # Utilities, configs, shared logic
│   ├── db.ts                     # Database client (Prisma / Mongoose)
│   ├── auth.ts                   # Auth configuration
│   ├── validations/              # Zod schemas
│   └── utils.ts                  # General utilities
├── hooks/                        # Custom React hooks (client-side)
├── stores/                       # Zustand stores
├── types/                        # Shared TypeScript types
├── messages/                     # i18n translation files
│   ├── en.json
│   └── [locale].json
├── pages/                        # Pages Router (legacy/migration only)
├── prisma/                       # Prisma schema and migrations
├── public/                       # Static assets
├── packages/                     # Monorepo shared packages (if Turborepo)
└── tests/                        # E2E tests (Playwright/Cypress)
    ├── e2e/
    └── fixtures/
```

### Naming Conventions

- **Files:** `kebab-case.ts` / `kebab-case.tsx`
- **Components:** `PascalCase` for the component, `kebab-case` for the file (e.g., `user-profile.tsx` exports `UserProfile`)
- **Server Actions:** `kebab-case.ts` in `app/_actions/`, function names as `verbNoun` (e.g., `createUser`, `updatePost`)
- **Route handlers:** always `route.ts` inside the appropriate API path
- **Zod schemas:** `kebab-case.ts` in `lib/validations/`, export as `entitySchema` (e.g., `userSchema`, `postCreateSchema`)
- **Zustand stores:** `use-[name]-store.ts` (e.g., `use-sidebar-store.ts`)
- **Hooks:** `use-[name].ts` (e.g., `use-debounce.ts`)

---

## Styling

### Tailwind CSS + Shadcn/ui (Primary)

- Use Tailwind utility classes for all styling. Do NOT write custom CSS unless absolutely necessary.
- Use Shadcn/ui components as the base for UI elements. Customize via the component file, not external CSS.
- Follow the Shadcn/ui pattern: components live in `components/ui/` and are fully owned by the project (not node_modules).
- Use `cn()` utility (from `lib/utils.ts`) for conditional class merging:
  ```typescript
  import { cn } from '@/lib/utils'
  <div className={cn('base-classes', isActive && 'active-classes')} />
  ```
- **Design tokens** should come from `tailwind.config.ts` — colors, spacing, fonts. Never hardcode hex values or pixel sizes in components.

### CSS Modules (Secondary)

- Use CSS Modules only when Tailwind can't express the styling (complex animations, third-party component overrides).
- File naming: `[component-name].module.css` colocated with the component.
- Never use global CSS files except in `app/globals.css` for base resets and font imports.

---

## Data Layer

### Prisma (SQL Databases)

- Schema lives in `prisma/schema.prisma`.
- Always run `npx prisma generate` after schema changes.
- Use a singleton client in `lib/db.ts`:
  ```typescript
  import { PrismaClient } from '@prisma/client'
  const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
  export const prisma = globalForPrisma.prisma ?? new PrismaClient()
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
  ```
- Write migrations with `npx prisma migrate dev --name descriptive-name`.
- NEVER use `prisma db push` in production. Migrations only.

### MongoDB / Mongoose (Document Databases)

- Models live in `lib/models/[entity].ts`.
- Connection singleton in `lib/db.ts` using `mongoose.connect()` with connection caching.
- Always define TypeScript interfaces for document shapes alongside Mongoose schemas.
- Use `lean()` for read-only queries to get plain objects instead of Mongoose documents.

### General Database Rules

- All database calls happen in Server Components, Server Actions, or Route Handlers. NEVER call the database from Client Components.
- Use transactions for multi-step mutations.
- Always handle connection errors gracefully.

---

## State Management & Data Fetching

### Server Data (RSC + Server Actions)

- **Primary method.** Fetch data in Server Components and pass it down.
- Server Actions for mutations — define in `app/_actions/` with `"use server"`.
- Always validate inputs with Zod in Server Actions before processing:
  ```typescript
  'use server'
  import { userCreateSchema } from '@/lib/validations/user'

  export async function createUser(formData: FormData) {
    const parsed = userCreateSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) return { error: parsed.error.flatten() }
    // ... proceed
  }
  ```

### Client Async State (TanStack Query)

- Use for data that needs: background refetching, optimistic updates, pagination, infinite scroll, or real-time polling.
- Query keys should be descriptive arrays: `['users', userId, 'posts']`.
- Configure the `QueryClientProvider` in the root layout's client wrapper.
- Mutations should invalidate relevant queries on success.
- Prefetch on the server when possible using `HydrationBoundary`.

### Client UI State (Zustand)

- Use for UI-only state: sidebar open/close, modals, active tabs, theme, user preferences.
- Keep stores small and focused — one store per domain concern.
- NEVER put server data in Zustand. That's TanStack Query's job.
- Store files go in `stores/use-[name]-store.ts`.

---

## API Routes & Validation (Zod)

### Route Handlers

- All Route Handlers in `app/api/` must validate input with Zod.
- Always return proper HTTP status codes and typed response bodies.
- Pattern:
  ```typescript
  import { NextRequest, NextResponse } from 'next/server'
  import { entitySchema } from '@/lib/validations/entity'

  export async function POST(request: NextRequest) {
    try {
      const body = await request.json()
      const parsed = entitySchema.safeParse(body)

      if (!parsed.success) {
        return NextResponse.json(
          { error: 'Validation failed', details: parsed.error.flatten() },
          { status: 400 }
        )
      }

      // ... process parsed.data
      return NextResponse.json(result, { status: 201 })
    } catch (error) {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
  ```

### Zod Schemas

- Store in `lib/validations/[entity].ts`.
- Export separate schemas for create, update, and query params:
  ```typescript
  export const userCreateSchema = z.object({ ... })
  export const userUpdateSchema = userCreateSchema.partial()
  export const userQuerySchema = z.object({ ... })
  ```
- Reuse schemas between Route Handlers and Server Actions. Single source of truth.
- Derive TypeScript types from schemas: `type UserCreate = z.infer<typeof userCreateSchema>`

---

## Authentication

This project may use NextAuth.js/Auth.js, Clerk, Supabase Auth, or custom JWT depending on the specific app. Follow whichever is configured.

### General Auth Rules

- Auth checks in `proxy.ts` for route protection (redirect unauthenticated users).
- Session retrieval in Server Components for data-level authorization.
- NEVER trust client-side auth state alone for sensitive operations. Always verify server-side.
- Protect Server Actions and Route Handlers independently — don't assume the proxy already checked.
- Store auth config in `lib/auth.ts`.
- Sensitive tokens and secrets go in environment variables only.

---

## Internationalization (i18n)

- Use `next-intl` or the project's configured i18n library.
- Translation files live in `messages/[locale].json`.
- Default locale configuration goes in `next.config.ts` and `lib/i18n.ts`.
- All user-facing strings must use translation keys. NEVER hardcode user-facing text in components.
- Use the `useTranslations` hook in Client Components and `getTranslations` in Server Components.
- URL structure: `[locale]/[...rest]` via a `[locale]` dynamic segment in `app/`.
- Date, number, and currency formatting must be locale-aware.

---

## Monorepo (Turborepo)

If this project is a monorepo:

- Shared packages live in `packages/`.
- Each app has its own `CLAUDE.md` for app-specific instructions.
- Use `turbo.json` for pipeline configuration. Never run builds in the wrong order.
- Shared TypeScript config: `packages/tsconfig/` with app-specific extensions.
- Shared UI components: `packages/ui/` (if components are shared across apps).
- Internal packages use `"main": "./src/index.ts"` with TypeScript path aliases — no build step needed for internal packages.
- Run tasks from the root: `turbo run build`, `turbo run test`, `turbo run lint`.

---

## Testing

Follow the Next.js official testing guide. The project supports four testing tools:

### Vitest (Unit & Component Tests — Primary)

- Config: `vitest.config.ts` at project root.
- Test files: `[name].test.ts` or `[name].test.tsx`, colocated with source files.
- Use for testing utilities, hooks, Zod schemas, Server Actions (mocking the DB), and component rendering.
- Use `@testing-library/react` for component tests.
- Run: `npx vitest` (watch) or `npx vitest run` (CI).

### Jest (Unit & Snapshot Tests — Alternative)

- Config: `jest.config.ts` with `next/jest` preset.
- Use `@testing-library/react` and `@testing-library/jest-dom`.
- Snapshot tests for UI components that should not change unexpectedly.
- Run: `npx jest` or `npm test`.

### Playwright (E2E Tests — Primary)

- Config: `playwright.config.ts`.
- Test files: `tests/e2e/[flow].spec.ts`.
- Test real user flows: sign up, login, CRUD operations, navigation.
- Use Page Object Model pattern for maintainable tests.
- Run: `npx playwright test`.

### Cypress (E2E & Component Tests — Alternative)

- Config: `cypress.config.ts`.
- E2E tests: `cypress/e2e/`.
- Component tests: `cypress/component/`.
- Run: `npx cypress run` (headless) or `npx cypress open` (interactive).

### General Testing Rules

- Every new feature must include at least: happy path test + one error/edge case.
- Server Components: prefer E2E tests since unit testing async RSC has limited tooling support.
- Client Components: unit test with Vitest/Jest + React Testing Library.
- Server Actions: test with mocked database calls.
- API Routes: test with direct HTTP calls in E2E or integration tests.
- Do NOT mock everything — use real implementations where practical.
- CI must run all test suites before merge.

---

## Deployment

This project may deploy to any of these platforms. Follow the configured deployment strategy:

### Vercel

- Push to deploy. Vercel auto-detects Next.js.
- Use Vercel environment variables for secrets.
- Preview deployments on PRs are automatic.
- Use `vercel.json` only for custom config (redirects, headers, crons).

### AWS (Amplify / ECS / Lambda)

- Use `output: 'standalone'` in `next.config.ts` for containerized deployments.
- Docker multi-stage builds for ECS.
- Lambda@Edge or OpenNext adapter for serverless.
- Store secrets in AWS Secrets Manager or SSM Parameter Store.

### Docker / Self-Hosted

- Multi-stage Dockerfile with `output: 'standalone'`.
- Pin Node.js version (minimum 20.9.0 for Next.js 16).
- Use `.dockerignore` for node_modules, .next, .git.
- Health check endpoint at `/api/health`.

### Cloudflare Pages

- Use the `@cloudflare/next-on-pages` adapter.
- Be mindful of Edge Runtime limitations (no Node.js APIs like `fs`, `crypto`).
- Use Cloudflare KV or D1 for data persistence at the edge.

### General Deployment Rules

- Environment variables must NEVER be hardcoded. Use `.env.local` locally, platform secrets in production.
- Always test the production build locally before deploying: `next build && next start`.
- Pin all dependency versions. No `latest` tags in Dockerfiles or CI.
- Deployment configs must be versioned in the repo.

---

## Commands

```bash
# Development
npm run dev                          # Start dev server (Turbopack)
next dev --inspect                   # Dev with Node.js debugger

# Build & Production
npm run build                        # Production build
npm run start                        # Start production server

# Testing
npx vitest                           # Unit tests (watch mode)
npx vitest run                       # Unit tests (CI)
npx playwright test                  # E2E tests
npx cypress run                      # E2E tests (Cypress)

# Database
npx prisma generate                  # Generate Prisma client
npx prisma migrate dev --name <name> # Create migration
npx prisma studio                    # Open Prisma Studio

# Code Quality
npx tsc --noEmit                     # Type check
npm run lint                         # Lint

# Monorepo (if Turborepo)
turbo run build                      # Build all packages
turbo run test                       # Test all packages
turbo run lint                       # Lint all packages

# Upgrade
npx @next/codemod@canary upgrade latest  # Upgrade Next.js
```

---

## What NOT to Do

- Do NOT add `"use client"` unnecessarily. Default to Server Components.
- Do NOT use `getServerSideProps`, `getStaticProps`, or `getInitialProps` in App Router. Those are Pages Router only.
- Do NOT use `middleware.ts`. It's `proxy.ts` in Next.js 16.
- Do NOT use the old implicit caching (`export const revalidate`, `unstable_cache`). Use `"use cache"` + `cacheLife` + `cacheTag`.
- Do NOT manually `useMemo`/`useCallback`/`React.memo` when React Compiler is enabled.
- Do NOT fetch data in Client Components unless using TanStack Query for interactive/real-time needs.
- Do NOT put server data in Zustand stores. Zustand is for UI state only.
- Do NOT hardcode user-facing strings. Use i18n translation keys.
- Do NOT skip Zod validation on any API Route or Server Action.
- Do NOT add dependencies without justification. Prefer built-in Next.js/React APIs first.
- Do NOT import Server Components into Client Components. Pass them as children.
- Do NOT commit `.env`, `node_modules`, `.next`, or build artifacts.