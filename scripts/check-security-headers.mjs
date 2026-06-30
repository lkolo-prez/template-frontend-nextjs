#!/usr/bin/env node
// @ts-check
/**
 * check-security-headers.mjs
 *
 * Fetches a URL and asserts that the expected HTTP security headers are present
 * (and, where it makes sense, that their values are sane). This guards against
 * regressions in `middleware.ts` (per-request nonce CSP) and `next.config.ts`
 * (static security headers) — for example a middleware matcher change that
 * silently drops the CSP on a route.
 *
 * Usage:
 *   node scripts/check-security-headers.mjs [url]
 *   TARGET_URL=https://app.aircloud.com.pl node scripts/check-security-headers.mjs
 *
 * Defaults to http://localhost:3000 so it can run against `pnpm start` locally
 * or in CI after the app is up. Exits 0 when all checks pass, 1 otherwise.
 *
 * Dependency-free: uses the global `fetch` available in Node >= 22.
 */

/** @type {string} */
const target =
  process.argv[2] ?? process.env.TARGET_URL ?? "http://localhost:3000";

/**
 * Each check names a header and a predicate over its (lowercased lookup) value.
 * `present` checks only require the header to exist; the others validate the
 * value to catch misconfiguration, not just omission.
 *
 * @type {{ name: string, required: true, test: (value: string | null) => boolean, hint: string }[]}
 */
const CHECKS = [
  {
    name: "content-security-policy",
    required: true,
    // Must exist, must NOT allow inline scripts, and must carry a nonce.
    test: (v) =>
      v !== null &&
      /script-src/i.test(v) &&
      /'nonce-/i.test(v) &&
      !/'unsafe-inline'[^;]*script/i.test(v),
    hint: "expected a nonce-based script-src without 'unsafe-inline' (see middleware.ts)",
  },
  {
    name: "strict-transport-security",
    required: true,
    test: (v) => v !== null && /max-age=\d{5,}/i.test(v),
    hint: "expected HSTS with a long max-age (see next.config.ts)",
  },
  {
    name: "x-content-type-options",
    required: true,
    test: (v) => v?.toLowerCase() === "nosniff",
    hint: "expected 'nosniff'",
  },
  {
    name: "referrer-policy",
    required: true,
    test: (v) => v === "strict-origin-when-cross-origin",
    hint: "expected 'strict-origin-when-cross-origin'",
  },
  {
    name: "permissions-policy",
    required: true,
    test: (v) => v !== null && /camera=\(\)/i.test(v),
    hint: "expected a restrictive Permissions-Policy (camera=(), microphone=(), ...)",
  },
  {
    name: "x-frame-options",
    required: true,
    test: (v) => v?.toUpperCase() === "DENY",
    hint: "expected 'DENY'",
  },
];

async function main() {
  console.log(`Checking security headers at: ${target}\n`);

  let response;
  try {
    // `redirect: "manual"` so we assert headers on the response we actually got,
    // not a followed redirect target.
    response = await fetch(target, { redirect: "manual" });
  } catch (error) {
    console.error(
      `Request failed: ${error instanceof Error ? error.message : String(error)}`,
    );
    console.error("Is the server running? Try `pnpm start` first.");
    process.exit(1);
  }

  let failures = 0;
  for (const check of CHECKS) {
    const value = response.headers.get(check.name);
    const ok = check.test(value);
    const label = ok ? "PASS" : "FAIL";
    console.log(`[${label}] ${check.name}: ${value ?? "(missing)"}`);
    if (!ok) {
      console.log(`        ↳ ${check.hint}`);
      failures += 1;
    }
  }

  console.log("");
  if (failures > 0) {
    console.error(`${failures} security header check(s) failed.`);
    process.exit(1);
  }
  console.log("All security header checks passed.");
}

main();
