import { NextResponse } from "next/server";

/**
 * Liveness/readiness probe used by the container HEALTHCHECK and the platform
 * load balancer. Kept dependency-free and side-effect-free so it cannot fail
 * for reasons unrelated to the process being up.
 *
 * Excluded from the CSP middleware matcher so probes stay cheap.
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function GET() {
  return NextResponse.json(
    {
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION ?? "dev",
    },
    {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
