# CLAUDE.md

Guidance for Claude Code (and humans) working in this repository.

## What this is

A production-grade **Next.js 15** frontend template: App Router, **React 19**,
**TypeScript strict**, **pnpm**, **Tailwind CSS v4**, shadcn/ui-style
components, **TanStack Query**, **Zod**, and server actions. Linting/formatting
is **Biome**; tests are **Vitest + React Testing Library** (unit) and
**Playwright + @axe-core/playwright** (e2e + accessibility), with **Lighthouse
CI** budgets.

## Commands (these are real and must stay in sync)

```bash
pnpm install --frozen-lockfile   # install deps
pnpm dev                         # dev server
pnpm build                       # production build (standalone output)
pnpm start                       # run the built server
pnpm lint                        # Biome lint
pnpm format                      # Biome format (write)
pnpm typecheck                   # tsc --noEmit
pnpm test                        # Vitest unit tests
pnpm test:coverage               # unit tests + coverage gate
pnpm e2e                         # Playwright e2e + a11y
pnpm lighthouse                  # Lighthouse CI budgets
```

`make help` lists the same gates: `setup, lint, format, typecheck, test, e2e,
build, run, security, sbom, image, clean`.

## Architecture

- `app/` — App Router. `layout.tsx`, `page.tsx`, `error.tsx`, `not-found.tsx`,
  `loading.tsx`, the `(marketing)` route group, and `app/api/health/route.ts`.
- `components/ui/*` — presentational primitives (Button, Card).
- `lib/*` — `utils.ts`, `providers.tsx` (TanStack Query), `schemas.ts` (Zod),
  `actions.ts` (server actions).
- `middleware.ts` — injects a per-request nonce-based CSP and security headers.
- `env.ts` — Zod-validated env (t3-env style); `env.server` throws if read in
  the browser.
- `next.config.ts` — `output: "standalone"`, image allowlist, static security
  headers.

## Hard rules (do not violate)

1. **Never** use `dangerouslySetInnerHTML`. Biome enforces this.
2. **Never** add `'unsafe-inline'` to `script-src`. The CSP is nonce-based.
3. New external image/script origins require an explicit allowlist update in
   **both** `middleware.ts` (CSP) and `next.config.ts` (`images.remotePatterns`).
4. Keep `tsconfig` strict flags on. No `any`, no non-null `!`, no unused vars.
5. Secrets never go in the client bundle. Public config must be `NEXT_PUBLIC_*`
   and declared in `env.ts`.
6. Validate all external/server-action input with Zod (`lib/schemas.ts`).

## Conventions

- Conventional Commits; releases are automated via release-please.
- Commits must be **signed (verified)**. See `docs/BRANCH-PROTECTION.md`.
- Pin every GitHub Action to a full commit SHA with a version comment.

## Before opening a PR

Run `pnpm lint && pnpm typecheck && pnpm test:coverage` and, for UI changes,
`pnpm e2e`. CI runs these as required status checks.
