# Contributing

Thanks for contributing! This guide covers local setup, quality gates, and the
commit/PR conventions enforced by CI and branch protection.

## Prerequisites

- Node.js **22** (see `.nvmrc`) and **pnpm 9** (`corepack enable`).
- Optional: Docker (container build), `pre-commit`, `gitleaks`, `trivy`, `syft`.

## Setup

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm run prepare                    # installs Husky git hooks
pnpm exec playwright install --with-deps   # for e2e
pre-commit install                  # optional, language-agnostic hooks
```

## Development loop

```bash
pnpm dev            # start dev server
pnpm lint           # Biome lint
pnpm format         # Biome format (write)
pnpm typecheck      # tsc --noEmit
pnpm test           # Vitest (watch: pnpm test:watch)
pnpm e2e            # Playwright e2e + a11y
```

Run the full gate before pushing:

```bash
pnpm lint && pnpm format:check && pnpm typecheck && pnpm test:coverage
```

## Commit conventions

- **Conventional Commits** are mandatory (`feat:`, `fix:`, `docs:`, `chore:`,
  …). commitlint runs in the `commit-msg` hook and CI.
- Versioning and changelogs are automated by **release-please** (SemVer).
- A `feat:` triggers a minor bump, `fix:` a patch; `feat!:` or a
  `BREAKING CHANGE:` footer triggers a major.

## Signed commits (required)

All commits to `main` must be **signed and show as "Verified"** on GitHub.

```bash
# One-time, using SSH signing (recommended):
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
```

Add the public key to GitHub under *Settings → SSH and GPG keys → New signing
key*. See [`docs/BRANCH-PROTECTION.md`](./docs/BRANCH-PROTECTION.md).

## Pull requests

1. Branch from `main`: `git switch -c feat/short-description`.
2. Keep PRs focused; fill in the PR template.
3. PR **title** must be a Conventional Commit (PRs are squash-merged).
4. Required status checks must pass: CI (lint, typecheck, unit + coverage,
   build), E2E, CodeQL, and Security scans.
5. At least **two** approving reviews, including **CODEOWNERS**, are required.

## Security

Never commit secrets or `.env` files. Report vulnerabilities privately per
[`SECURITY.md`](./SECURITY.md) — do not open a public issue.

## Code of Conduct

Participation is governed by our
[Code of Conduct](./CODE_OF_CONDUCT.md).
