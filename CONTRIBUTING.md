# Contributing to the IEESEC website

Thank you for helping improve the IEESEC website. This guide is the human contributor workflow; `AGENTS.md` adds instructions for coding agents but does not replace this document.

## Before starting

1. Search existing issues and pull requests.
2. Open or claim an issue with a clear Definition of Done.
3. For security-sensitive reports, stop and follow [SECURITY.md](SECURITY.md).
4. For large architectural or product changes, agree on the approach in the issue before implementation.

## Branch model

- `main` is the production-ready branch.
- `dev` is the integration branch for ordinary work.
- Create a short-lived branch from the current `dev` branch.
- Use a Conventional Commit type in the branch name: `feat/`, `fix/`, `perf/`, `refactor/`, `test/`, `docs/`, `chore/` or `build/`.

Examples: `feat/member-directory`, `fix/join-validation`, `docs/onboarding`.

Urgent production fixes may branch from `main`, but must be merged back into `dev` after release.

## Local workflow

```bash
corepack enable
corepack prepare pnpm@11.19.0 --activate
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

Use pnpm only. The repository intentionally tracks a single `pnpm-lock.yaml`.

## Implementation expectations

- Keep changes focused on the issue's Definition of Done.
- Add or update tests before changing production behavior.
- Keep Greek and English translation dictionaries structurally aligned.
- Preserve keyboard navigation, reduced-motion behavior and WCAG 2.2 AA contrast targets.
- Follow [DESIGN.md](DESIGN.md) for visible changes and [docs/content-guide.md](docs/content-guide.md) for content changes.
- Never commit secrets, `.env` files, applicant data, test traces, screenshots, audit reports or generated build output.

## Commits

Every commit must follow Conventional Commits:

```text
type(scope): imperative summary
```

Examples:

- `feat(privacy): add localized notice`
- `fix(join): preserve form values on back navigation`
- `docs(contributing): document review workflow`

Husky runs formatting and lint fixes before a commit and commitlint validates the message. Review hook changes before completing the commit.

## Required checks

Run at least:

```bash
pnpm format:check
pnpm lint
pnpm test:unit
pnpm build
pnpm test:e2e --project=desktop
```

Run the complete `pnpm test` matrix for changes involving responsive behavior, touch input, navigation, accessibility, themes or media.

## Pull requests

- Target `dev` unless the change is an approved release or urgent production fix.
- Use a Conventional Commit-style PR title.
- Complete the Greek pull request template and select exactly one task type.
- Link the issue and describe testing evidence.
- Add before/after screenshots for visible changes, but do not commit verification screenshots to the repository.
- Request at least one review from a code owner.
- The PR author must not approve their own change.
- Resolve review threads or explain why no change is required.

## Definition of Done

A change is done when:

- Its acceptance criteria are met and relevant tests pass.
- Formatting, linting, type/build checks and required CI checks pass.
- Both locales, responsive layouts and accessibility states were considered.
- Documentation and operational runbooks were updated when behavior changed.
- No secret, applicant data or generated verification artifact is included.
- At least one other member reviewed the change.
- The change is merged into the correct branch and, when released, verified in production.

## Review standard

Review correctness, security, accessibility, maintainability, tests and documentation. Prefer small, actionable comments. Authors should respond with a change, a question or a reasoned explanation rather than silently resolving feedback.
