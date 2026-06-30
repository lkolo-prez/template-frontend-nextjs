# Developer entry points. Mirrors the CI pipeline so "works on my machine"
# means "works in CI". Requires Node 22 + pnpm (corepack enable).

IMAGE ?= ghcr.io/aircloud/template-frontend-nextjs
TAG   ?= dev

.DEFAULT_GOAL := help
.PHONY: help setup lint format typecheck test e2e build run security sbom image clean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

setup: ## Install toolchain and dependencies + git hooks
	corepack enable
	pnpm install --frozen-lockfile
	pnpm exec playwright install --with-deps
	pnpm run prepare

lint: ## Lint with Biome
	pnpm run lint

format: ## Auto-format with Biome
	pnpm run format

typecheck: ## TypeScript type checking (no emit)
	pnpm run typecheck

test: ## Unit tests with coverage gate
	pnpm run test:coverage

e2e: ## Playwright e2e + accessibility tests
	pnpm run e2e

build: ## Production build (standalone output)
	pnpm run build

run: ## Run the production server locally
	pnpm run build && pnpm run start

security: ## Aggregate local security gates
	pnpm run lint
	pnpm dlx gitleaks@8.21.2 detect --no-banner --redact || true
	pnpm audit --audit-level=high || true
	@echo "Run 'make sbom' and 'trivy fs .' for full coverage."

sbom: ## Generate a CycloneDX SBOM with Syft
	syft dir:. -o cyclonedx-json=sbom.cdx.json
	@echo "Wrote sbom.cdx.json"

image: ## Build the container image locally
	docker build -t $(IMAGE):$(TAG) .

clean: ## Remove build artifacts
	rm -rf .next coverage playwright-report test-results sbom.cdx.json node_modules/.cache
