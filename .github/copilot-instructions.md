# GitHub Copilot — repository custom instructions

This is a **Next.js 15 (App Router, React 19)** frontend in **TypeScript
strict** mode, managed with **pnpm** and styled with **Tailwind CSS v4**. Data
fetching uses **TanStack Query** and **Zod**; forms/mutations use **server
actions**. Lint/format is **Biome** (not ESLint/Prettier).

When generating or editing code in this repo:

- Prefer **Server Components**; add `"use client"` only when hooks, state, or
  browser APIs are required.
- Use **TypeScript strict** patterns: no `any`, no non-null `!`, handle
  `undefined` from `noUncheckedIndexedAccess`.
- Validate all external and server-action input with **Zod** schemas from
  `lib/schemas.ts`.
- Style with Tailwind utility classes and the `cn()` helper from `lib/utils.ts`.
  Reuse `components/ui/*` primitives instead of re-implementing them.
- Read env via `env.ts`. Public values are `NEXT_PUBLIC_*`; never reference
  `env.server` from client components.

Security — these are non-negotiable:

- **Never** emit `dangerouslySetInnerHTML`.
- **Never** weaken the CSP. It is nonce-based in `middleware.ts`; do not add
  `'unsafe-inline'` to `script-src`.
- New external image/script hosts must be allowlisted in **both**
  `middleware.ts` and `next.config.ts`.

Testing:

- Unit tests with **Vitest + React Testing Library**, colocated as
  `*.test.tsx`. Query by role/label, not test IDs.
- E2E and accessibility with **Playwright + @axe-core/playwright** in `e2e/`.

Commits follow **Conventional Commits**; releases are automated via
release-please.
