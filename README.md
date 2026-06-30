# template-frontend-nextjs

[![CI](https://github.com/aircloud/template-frontend-nextjs/actions/workflows/ci.yml/badge.svg)](https://github.com/aircloud/template-frontend-nextjs/actions/workflows/ci.yml)
[![CodeQL](https://github.com/aircloud/template-frontend-nextjs/actions/workflows/codeql.yml/badge.svg)](https://github.com/aircloud/template-frontend-nextjs/actions/workflows/codeql.yml)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/aircloud/template-frontend-nextjs/badge)](https://securityscorecards.dev/viewer/?uri=github.com/aircloud/template-frontend-nextjs)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](./LICENSE)

A production-grade, security-hardened **Next.js 15** frontend template.

> This is a **template repository**. The org `aircloud`, registry
> `ghcr.io/aircloud`, and Azure prefix `aircloud` are **examples** — replace
> them with your own when you copy this repo. Target year: **2026**.

## Stack

| Concern        | Choice                                                  |
| -------------- | ------------------------------------------------------- |
| Framework      | Next.js 15 (App Router) + React 19                      |
| Language       | TypeScript (strict)                                     |
| Package mgr    | pnpm                                                    |
| Styling        | Tailwind CSS v4 + shadcn/ui-style components            |
| Data           | TanStack Query + Zod + server actions                   |
| Lint / format  | Biome                                                   |
| Unit tests     | Vitest + React Testing Library                          |
| E2E / a11y     | Playwright + @axe-core/playwright                       |
| Perf budgets   | Lighthouse CI                                           |
| Container      | Multi-stage → `gcr.io/distroless/nodejs22:nonroot`      |

## Quick start

```bash
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev            # http://localhost:3000
```

Common tasks (see `make help`):

```bash
pnpm dev | build | start
pnpm lint | format | typecheck
pnpm test | test:coverage | e2e | lighthouse
pnpm verify:headers   # assert security headers on a running instance
```

## Project layout

```
app/                 App Router: layout, page, error, not-found, loading,
                     (marketing) route group, api/health
components/ui/       UI primitives (Button, Card)
lib/                 utils, providers (TanStack Query), schemas (Zod), actions
middleware.ts        Per-request nonce CSP + security headers
env.ts               Zod-validated public/server env (t3-env style)
next.config.ts       standalone output, image allowlist, static headers
```

See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for the diagram and
runbooks.

## Security

- **Strict CSP** with a per-request nonce (`middleware.ts`); no `'unsafe-inline'`
  for scripts. HSTS, `X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy`, and `Permissions-Policy` set in middleware + `next.config`.
  See [`docs/SECURITY-HEADERS.md`](./docs/SECURITY-HEADERS.md) for every header
  and CSP directive. Verify a running instance with `pnpm verify:headers`
  (`scripts/check-security-headers.mjs`).
- **No `dangerouslySetInnerHTML`** (enforced by Biome). Image domain allowlist.
- **Supply chain**: SBOM (Syft → CycloneDX), keyless **cosign** signing, SLSA
  build-provenance attestation, **Trivy**, **CodeQL**, **Semgrep**, gitleaks,
  dependency-review, OpenSSF **Scorecard**, Dependabot + Renovate.
- **Cloud auth via GitHub OIDC** (azure/login federated credentials). No
  long-lived secrets in CI.

Report vulnerabilities privately — see [`SECURITY.md`](./SECURITY.md).

## Deployment

- **Container** (recommended for self-hosting / Azure Container Apps / AKS):
  build with the provided `Dockerfile` (Next standalone output, distroless,
  non-root). See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).
- **Vercel**: this app deploys to Vercel as-is. The `output: "standalone"`
  setting is ignored there; the security headers in `middleware.ts` and
  `next.config.ts` still apply. Set the env vars from `.env.example` in the
  Vercel project.
- **Static export** is **not** supported because the app uses middleware and
  server actions. Remove those if you need `output: "export"`.

## Contributing

Read [`CONTRIBUTING.md`](./CONTRIBUTING.md). We use Conventional Commits,
require **signed (verified)** commits, and enforce branch protection via a
GitHub Ruleset — see [`docs/BRANCH-PROTECTION.md`](./docs/BRANCH-PROTECTION.md).

## License

[Apache-2.0](./LICENSE)
