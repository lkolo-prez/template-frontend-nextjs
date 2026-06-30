import type { NextConfig } from "next";

/**
 * Security headers applied to every response.
 *
 * Note: the Content-Security-Policy is set per-request in `middleware.ts`
 * because it embeds a cryptographic nonce. The headers below are static and
 * complement the CSP. Keeping HSTS et al. here means they are applied even
 * for routes that bypass the middleware matcher (e.g. static assets).
 */
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  // Produces a self-contained server bundle in `.next/standalone` for the
  // distroless container image. See Dockerfile.
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  // Fail the production build on type errors / lint issues instead of silently
  // shipping them. CI runs these as separate gates too, belt-and-suspenders.
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: true }, // Biome is the linter; no ESLint.
  images: {
    // Strict allowlist — no wildcard remote patterns.
    remotePatterns: [
      { protocol: "https", hostname: "images.aircloud.com.pl" },
      { protocol: "https", hostname: "cdn.aircloud.com.pl" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Tighten which server actions origins are accepted.
    serverActions: {
      allowedOrigins: ["aircloud.com.pl", "*.aircloud.com.pl"],
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
