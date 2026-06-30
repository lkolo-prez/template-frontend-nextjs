<!--
  Title must follow Conventional Commits, e.g. "feat: add contact form".
  PRs are squash-merged; the PR title becomes the commit message.
-->

## Summary

<!-- What does this change and why? Link the issue: Closes #123 -->

## Type of change

- [ ] feat — new feature
- [ ] fix — bug fix
- [ ] docs — documentation only
- [ ] refactor — no behavior change
- [ ] perf — performance
- [ ] test — tests only
- [ ] build / ci — tooling
- [ ] BREAKING CHANGE

## Checklist

- [ ] Conventional Commits title.
- [ ] `pnpm lint && pnpm typecheck && pnpm test` pass locally.
- [ ] Added/updated unit tests; e2e/a11y updated if UI changed.
- [ ] No `dangerouslySetInnerHTML`; no new external image/script domains
      without updating the CSP allowlist.
- [ ] No secrets, tokens, or `.env` files committed.
- [ ] Docs / runbooks updated where relevant.
- [ ] Commits are signed (verified) — see docs/BRANCH-PROTECTION.md.

## Screenshots / recordings

<!-- For UI changes, attach before/after. -->

## Notes for reviewers

<!-- Anything that needs special attention. -->
