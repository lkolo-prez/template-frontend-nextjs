# Security Policy

## Supported versions

| Version | Supported |
| ------- | --------- |
| latest `main` and most recent minor | Yes |
| older minors | Best effort |

## Reporting a vulnerability

**Please do not open public issues for security problems.**

Report privately via **GitHub Security Advisories**:
<https://github.com/aircloud/template-frontend-nextjs/security/advisories/new>

If you cannot use GitHub advisories, email **security@aircloud.com.pl** and
encrypt sensitive details where possible. Our machine-readable contact info is
published at
<https://aircloud.com.pl/.well-known/security.txt> (see also the pointer in
[`/.well-known/security.txt`](./.well-known/security.txt) shipped with this
repo).

### What to include

- A description of the issue and its impact.
- Steps to reproduce or a proof of concept.
- Affected version / commit SHA and environment.

## Response SLA

| Stage                       | Target                |
| --------------------------- | --------------------- |
| Acknowledge receipt         | within **2 business days** |
| Initial assessment / triage | within **5 business days** |
| Fix or mitigation plan      | within **30 days** (severity-dependent) |
| Coordinated disclosure      | by mutual agreement   |

We follow **coordinated disclosure**. Please give us a reasonable window to
remediate before any public disclosure. We credit reporters who wish to be
acknowledged.

## Scope

This repository (application code, CI/CD, container build). Third-party
dependencies should be reported upstream; we will update affected pins promptly.

## Our safeguards

Nonce-based CSP, full security headers, no `dangerouslySetInnerHTML`, image
domain allowlist, Zod input validation, pinned dependencies and Actions,
keyless image signing, SBOM + provenance attestation, and continuous scanning
(CodeQL, Semgrep, Trivy, gitleaks, OpenSSF Scorecard).
