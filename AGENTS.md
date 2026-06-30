# AGENTS.md

This file follows the [agents.md](https://agents.md) open standard and applies
to any AI coding agent (Codex, and others). It complements `CLAUDE.md` and
`.github/copilot-instructions.md`, which share the same rules.

## Project

Production-grade Next.js 15 (App Router, React 19) frontend in TypeScript
strict mode. Package manager: **pnpm**. Styling: **Tailwind CSS v4**. Data:
**TanStack Query** + **Zod** + server actions. Lint/format: **Biome**.

## Setup commands

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm exec playwright install --with-deps   # only needed for e2e
```

## Dev / build

```bash
pnpm dev        # http://localhost:3000
pnpm build      # standalone production build
pnpm start      # serve the build
```

## Validation (run before committing)

```bash
pnpm lint            # Biome
pnpm format:check    # Biome format check
pnpm typecheck       # tsc --noEmit
pnpm test:coverage   # Vitest + coverage gate
pnpm e2e             # Playwright e2e + axe a11y (UI changes)
```

All of the above are required CI status checks.

## Code style

- TypeScript strict; no `any`, no non-null assertions, no unused symbols.
- Formatting and import organization are owned by Biome — do not hand-format.
- Double quotes, semicolons, trailing commas (see `biome.json`).

## Security constraints (must hold)

- No `dangerouslySetInnerHTML`.
- CSP is nonce-based in `middleware.ts`; never add `'unsafe-inline'` to scripts.
- New remote image/script hosts must be added to the allowlist in BOTH
  `middleware.ts` and `next.config.ts`.
- Validate all untrusted input with Zod schemas from `lib/schemas.ts`.
- No secrets in client code; public env must be `NEXT_PUBLIC_*` via `env.ts`.

## Commits & PRs

- Use Conventional Commits. Releases are automated (release-please).
- Sign your commits (verified). Keep PRs focused and small.
- Pin GitHub Actions to full SHAs.

## Where things live

| Area              | Path                          |
| ----------------- | ----------------------------- |
| Routes / pages    | `app/`                        |
| UI primitives     | `components/ui/`              |
| Utilities / data  | `lib/`                        |
| Env validation    | `env.ts`                      |
| Security headers  | `middleware.ts`, `next.config.ts` |
| Tests             | `*.test.tsx`, `e2e/`         |
