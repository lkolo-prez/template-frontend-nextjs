# Architecture

This document describes how the **Next.js 15 (App Router)** frontend is wired
together and how a request flows through the per-request CSP nonce and security
headers. It complements the code in `middleware.ts`, `next.config.ts`,
`app/layout.tsx`, and `env.ts`.

## App Router structure

```
app/
  layout.tsx              Root layout — reads the x-nonce header, mounts <Providers>
  page.tsx                Home route
  error.tsx               Route-segment error boundary
  not-found.tsx           404 boundary
  loading.tsx             Suspense fallback
  globals.css             Tailwind v4 entrypoint
  (marketing)/            Route group (no URL segment)
    about/                /about
  api/
    health/route.ts       GET /api/health — liveness/readiness (CSP-exempt)
components/ui/            Presentational primitives (Button, Card)
lib/                      utils, providers (TanStack Query), schemas (Zod), actions
middleware.ts            Per-request nonce CSP + early security headers
env.ts                   Zod-validated public/server env (t3-env style)
next.config.ts           standalone output, image allowlist, static headers
```

```mermaid
graph TD
  Root["app/layout.tsx<br/>(RootLayout — reads x-nonce)"]
  Providers["lib/providers.tsx<br/>(TanStack Query, client)"]

  Root --> Providers
  Providers --> Page["app/page.tsx<br/>(/)"]
  Providers --> MarketingGroup["app/(marketing)/<br/>(route group, no segment)"]
  MarketingGroup --> About["about/<br/>(/about)"]

  Root -. boundaries .-> ErrorB["error.tsx"]
  Root -. boundaries .-> NotFound["not-found.tsx"]
  Root -. boundaries .-> Loading["loading.tsx"]

  Health["app/api/health/route.ts<br/>(GET /api/health)"]:::exempt

  Page --> Actions["lib/actions.ts<br/>(server actions)"]
  Actions --> Schemas["lib/schemas.ts<br/>(Zod validation)"]
  Page --> UI["components/ui/*"]

  classDef exempt fill:#fff3cd,stroke:#b8860b;
```

`app/api/health` is excluded from the middleware matcher (see `middleware.ts`
`config.matcher`) so probes stay cheap and never pay the per-request nonce cost.

## Request / CSP-nonce / security-headers flow

The Content-Security-Policy is generated **per request** in `middleware.ts`
because it embeds a fresh cryptographic nonce. Static headers that do not vary
per request (HSTS, `X-Frame-Options`, etc.) are also set in `next.config.ts` so
they apply even to routes that bypass the middleware matcher (static assets,
image optimization).

```mermaid
sequenceDiagram
  participant Client
  participant Edge as middleware.ts (Edge)
  participant Render as App Router (layout.tsx → page)
  participant Next as next.config.ts headers()

  Client->>Edge: GET /some-route
  Note over Edge: matcher excludes api/health,<br/>_next/static, _next/image,<br/>favicon.ico, robots.txt, sitemap.xml
  Edge->>Edge: nonce = base64(randomUUID())
  Edge->>Edge: build CSP (script-src 'self' 'nonce-…' 'strict-dynamic')
  Edge->>Render: forward request with x-nonce + CSP request header
  Render->>Render: layout.tsx reads headers()['x-nonce']
  Render->>Render: Next.js applies nonce to inline <script> tags
  Render-->>Edge: rendered response
  Edge->>Edge: set CSP + X-Content-Type-Options + X-Frame-Options<br/>+ Referrer-Policy + Permissions-Policy on the response
  Next-->>Client: static headers (HSTS, COOP, CORP, …) merged in
  Edge-->>Client: 200 with full security-header set
```

Key invariants (enforced by `CLAUDE.md` hard rules):

- The nonce is regenerated on every request and never reused.
- `script-src` never contains `'unsafe-inline'`. In development only,
  `'unsafe-eval'` is added for React Fast Refresh; never in production, where
  `'strict-dynamic'` is used instead.
- Adding an external image/script origin requires updating **both**
  `middleware.ts` (the CSP) and `next.config.ts` (`images.remotePatterns`).

See [`SECURITY-HEADERS.md`](./SECURITY-HEADERS.md) for the full header
inventory and CSP directive-by-directive rationale. The
`scripts/check-security-headers.mjs` verifier (`pnpm verify:headers`) asserts
these headers are present on a running instance.

## Deployment topology

```mermaid
graph LR
  subgraph Build
    Src["Source"] --> NextBuild["next build<br/>(output: standalone)"]
    NextBuild --> Standalone[".next/standalone"]
    Standalone --> Image["Distroless image<br/>gcr.io/distroless/nodejs22:nonroot"]
  end

  subgraph Runtime
    LB["Load balancer / ingress"] --> App["Next.js server (non-root)"]
    App --> Probe["/api/health"]
  end

  Image --> App
```

`output: "standalone"` (in `next.config.ts`) produces a self-contained server
bundle that the multi-stage `Dockerfile` copies into a distroless, non-root
runtime image. On Vercel the standalone output is ignored, but the
`middleware.ts` and `next.config.ts` security headers still apply.
