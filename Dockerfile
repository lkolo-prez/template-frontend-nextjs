# syntax=docker/dockerfile:1.12
# ----------------------------------------------------------------------------
# Multi-stage build producing a minimal, non-root, distroless runtime image
# from the Next.js standalone output. Hadolint-clean.
# ----------------------------------------------------------------------------

# --- Dependencies -----------------------------------------------------------
# Pin the builder by digest in real use; tag shown for readability.
FROM node:26.9.0-bookworm-slim AS deps
WORKDIR /app
ENV CI=true \
    PNPM_HOME="/pnpm" \
    PATH="/pnpm:$PATH"
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
# Cache the pnpm store between builds; fail on any lockfile drift.
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# --- Build ------------------------------------------------------------------
FROM node:26.9.0-bookworm-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production \
    PNPM_HOME="/pnpm" \
    PATH="/pnpm:$PATH"
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# --- Runtime ----------------------------------------------------------------
# Distroless Node 22, non-root by default, no shell, read-only-rootfs friendly.
FROM gcr.io/distroless/nodejs22-debian12:nonroot AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# The standalone output bundles only what the server needs at runtime.
COPY --from=builder --chown=nonroot:nonroot /app/public ./public
COPY --from=builder --chown=nonroot:nonroot /app/.next/standalone ./
COPY --from=builder --chown=nonroot:nonroot /app/.next/static ./.next/static

USER nonroot
EXPOSE 3000

# Distroless has no shell; use the exec-form Node probe against /api/health.
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD ["/nodejs/bin/node", "-e", "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]

# `node server.js` is the entrypoint produced by Next standalone output.
CMD ["server.js"]
