import { type NextRequest, NextResponse } from "next/server";

/**
 * Edge middleware that injects a strict, nonce-based Content-Security-Policy on
 * every navigation request, plus the security headers that benefit from being
 * set as early as possible.
 *
 * The nonce is regenerated per request and forwarded to the app via a request
 * header (`x-nonce`) so that `app/layout.tsx` can apply it to inline <script>
 * tags emitted by Next.js. We never use 'unsafe-inline' for scripts.
 */
export function middleware(request: NextRequest): NextResponse {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV !== "production";

  // In dev, Next.js needs 'unsafe-eval' for React Fast Refresh. Never in prod.
  const scriptSrc = isDev
    ? `'self' 'nonce-${nonce}' 'unsafe-eval'`
    : `'self' 'nonce-${nonce}' 'strict-dynamic'`;

  const csp = [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    // Tailwind/Next inject styles; nonce them and allow self.
    `style-src 'self' 'nonce-${nonce}'`,
    "img-src 'self' blob: data: https://images.aircloud.com.pl https://cdn.aircloud.com.pl",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "frame-src 'none'",
    "manifest-src 'self'",
    "worker-src 'self' blob:",
    "upgrade-insecure-requests",
  ].join("; ");

  // Forward the nonce to the rendering pipeline.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  );
  return response;
}

export const config = {
  /**
   * Run on everything except static assets and image optimization, where the
   * CSP nonce is irrelevant and the per-request cost is pure overhead.
   */
  matcher: [
    {
      source:
        "/((?!api/health|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
