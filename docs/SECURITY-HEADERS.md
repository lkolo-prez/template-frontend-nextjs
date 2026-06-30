# Security headers

This document is the reference for every HTTP security header this application
emits, where it is set, and why. It mirrors the actual code; if you change a
header, update both the code and this file.

## Where headers are set

| Source            | Set how                  | Scope                                                |
| ----------------- | ------------------------ | ---------------------------------------------------- |
| `middleware.ts`   | per-request (Edge)       | Routes matched by `config.matcher` (navigations)     |
| `next.config.ts`  | static, build-time       | Every response (`source: "/:path*"`), incl. assets   |

The **Content-Security-Policy** is set in `middleware.ts` because it embeds a
per-request nonce. The remaining headers are static and live in
`next.config.ts` so they apply even on routes the middleware matcher skips
(`_next/static`, `_next/image`, `favicon.ico`, `robots.txt`, `sitemap.xml`,
`api/health`). A subset of headers is **also** re-asserted in `middleware.ts`
so they are present as early as possible on matched routes.

Verify a running instance with:

```bash
pnpm verify:headers                 # checks http://localhost:3000
TARGET_URL=https://app.aircloud.com.pl pnpm verify:headers
```

## Header inventory

### Content-Security-Policy (per-request, `middleware.ts`)

A strict, nonce-based policy. No `'unsafe-inline'` for scripts — ever.

| Directive                   | Value                                                                                  | Rationale                                                                 |
| --------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `default-src`               | `'self'`                                                                                | Default fallback: only same-origin.                                       |
| `script-src`                | prod: `'self' 'nonce-…' 'strict-dynamic'` · dev: `'self' 'nonce-…' 'unsafe-eval'`       | Nonce per request; `'strict-dynamic'` lets nonced scripts load deps. `'unsafe-eval'` is **dev-only** (React Fast Refresh). |
| `style-src`                 | `'self' 'nonce-…'`                                                                      | Tailwind/Next inject styles; nonce them plus same-origin.                 |
| `img-src`                   | `'self' blob: data: https://images.aircloud.com.pl https://cdn.aircloud.com.pl`        | Same-origin, blobs/data URIs, and the two allowlisted image CDNs.         |
| `font-src`                  | `'self'`                                                                                | Self-hosted fonts only.                                                   |
| `connect-src`               | `'self'`                                                                                | XHR/fetch/WebSocket to same-origin only.                                  |
| `object-src`                | `'none'`                                                                                | Block plugins (`<object>`/`<embed>`).                                     |
| `base-uri`                  | `'none'`                                                                                | Prevent `<base>` tag hijacking.                                           |
| `form-action`               | `'self'`                                                                                | Forms may only post to same-origin.                                       |
| `frame-ancestors`           | `'none'`                                                                                | Clickjacking protection (modern equivalent of `X-Frame-Options: DENY`).  |
| `frame-src`                 | `'none'`                                                                                | No embedded frames.                                                       |
| `manifest-src`              | `'self'`                                                                                | `site.webmanifest` served same-origin.                                    |
| `worker-src`                | `'self' blob:`                                                                          | Web/Service workers from self and blob URLs.                              |
| `upgrade-insecure-requests` | (flag)                                                                                  | Upgrade any `http:` subresource to `https:`.                              |

The nonce is `base64(crypto.randomUUID())`, regenerated per request, forwarded
to the render pipeline via the `x-nonce` request header, and read in
`app/layout.tsx` so Next.js can stamp it onto the inline scripts it emits.

> Adding a new external image or script origin requires updating **both** the
> CSP here (`middleware.ts`) and `images.remotePatterns` in `next.config.ts`.

### Strict-Transport-Security (static, `next.config.ts`)

```
max-age=63072000; includeSubDomains; preload
```

Two years, applies to subdomains, and eligible for the browser preload list.
Only meaningful over HTTPS (terminate TLS at the platform/ingress).

### X-Content-Type-Options (`next.config.ts` + `middleware.ts`)

```
nosniff
```

Disables MIME-type sniffing.

### X-Frame-Options (`next.config.ts` + `middleware.ts`)

```
DENY
```

Legacy clickjacking protection; complements CSP `frame-ancestors 'none'` for
older browsers.

### Referrer-Policy (`next.config.ts` + `middleware.ts`)

```
strict-origin-when-cross-origin
```

Send the full URL same-origin, only the origin cross-origin over HTTPS, and
nothing on downgrade to HTTP.

### Permissions-Policy (`next.config.ts` + `middleware.ts`)

```
camera=(), microphone=(), geolocation=(), browsing-topics=()
```

Disables powerful features by default, including opting the site out of the
Topics API.

### X-DNS-Prefetch-Control (static, `next.config.ts`)

```
off
```

Prevents speculative DNS prefetching that could leak browsing context.

### Cross-Origin-Opener-Policy (static, `next.config.ts`)

```
same-origin
```

Isolates the browsing context group; mitigates cross-origin attacks (XS-Leaks)
and enables cross-origin isolation.

### Cross-Origin-Resource-Policy (static, `next.config.ts`)

```
same-origin
```

Prevents other origins from embedding this app's resources.

## Header → source matrix

| Header                        | `next.config.ts` | `middleware.ts` |
| ----------------------------- | :--------------: | :-------------: |
| `Content-Security-Policy`     |                  |       Yes       |
| `Strict-Transport-Security`   |       Yes        |                 |
| `X-Content-Type-Options`      |       Yes        |       Yes       |
| `X-Frame-Options`             |       Yes        |       Yes       |
| `Referrer-Policy`             |       Yes        |       Yes       |
| `Permissions-Policy`          |       Yes        |       Yes       |
| `X-DNS-Prefetch-Control`      |       Yes        |                 |
| `Cross-Origin-Opener-Policy`  |       Yes        |                 |
| `Cross-Origin-Resource-Policy`|       Yes        |                 |

## Related

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — the request/nonce flow diagram.
- [`/.well-known/security.txt`](../.well-known/security.txt) — vulnerability
  reporting contact (RFC 9116).
- [`SECURITY.md`](../SECURITY.md) — disclosure policy and SLAs.
