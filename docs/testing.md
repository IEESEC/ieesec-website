# Testing and quality

## Test strategy

The project uses Playwright for pure TypeScript checks and browser-level tests. Fast tests run in the `unit` project without a web server. E2E projects start the Next.js development server and exercise the site in Chromium-compatible desktop and mobile contexts.

| Layer            | Location     | Purpose                                                                                            |
| ---------------- | ------------ | -------------------------------------------------------------------------------------------------- |
| Unit-style       | `tests/unit` | Routing logic, form flow, API validation, asset constraints and source-level performance contracts |
| Desktop E2E      | `tests/e2e`  | Rendering, navigation, accessibility, metadata, themes and complete interactions at 1280×720       |
| Mobile E2E       | `tests/e2e`  | Compact, standard, short and landscape touch layouts                                               |
| Production build | `pnpm build` | Type checking, route generation and production compilation                                         |

## First-time setup

```bash
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
```

On Linux CI or a fresh Linux workstation:

```bash
pnpm exec playwright install --with-deps chromium
```

## Commands

```bash
pnpm test:unit
pnpm test:e2e --project=desktop
pnpm test
pnpm lint
pnpm format:check
pnpm build
```

`PLAYWRIGHT_BASE_URL` may point E2E tests at an already-running environment. Otherwise Playwright starts the local Next.js server at `http://localhost:3000`. CI retries failed tests twice; local runs do not retry.

## Viewport matrix

| Project            | Viewport | Input model    |
| ------------------ | -------- | -------------- |
| `desktop`          | 1280×720 | Mouse/keyboard |
| `mobile-compact`   | 320×568  | Touch          |
| `mobile-standard`  | 390×844  | Touch          |
| `mobile-short`     | 390×500  | Touch          |
| `mobile-landscape` | 844×390  | Touch          |

Use the complete matrix for changes to layout, navigation, the join wizard, scroll behavior, responsive media or localized copy.

## What the suite protects

- Greek-default routing, locale switching and dictionary parity.
- Keyboard focus management, skip navigation and mobile menu behavior.
- Readability without JavaScript and reduced-motion fallbacks.
- Dark/light theme contrast and visual state behavior.
- Responsive video selection, seek behavior and poster fallback.
- Join-form step gating, data retention between steps and API error contracts.
- SEO metadata, robots and localized sitemap entries.
- Media transfer sizes, dimensions and seek-friendly MP4 structure.

## Performance and media budgets

`tests/unit/media-assets.spec.ts` is the source of truth for binary asset limits:

- Mobile join video: at most 2.3 MB.
- Standard join video: at most 4.0 MB.
- Large join video: at most 6.5 MB and exactly 1280×720.
- Join poster: at most 150 KB and exactly 1280×720.
- The large MP4 must keep its metadata before media data and preserve the expected sync-sample structure.

`tests/unit/performance-budget.spec.ts` protects initial image quality settings, lazy homepage sections and limited ambient rays. Update a budget only with measured evidence and a clear explanation in the pull request.

## Writing tests

- Write the failing test before production code for new behavior or bug fixes.
- Test user-visible outcomes and stable contracts, not incidental implementation details.
- Prefer roles, labels and test IDs to generated CSS selectors.
- Keep tests independent and safe to run in parallel.
- Never use real applicant information or the production webhook.
- Add both-locales coverage when text, routes or metadata differ by locale.
- Add reduced-motion and keyboard cases for interactive UI.

## Pull request evidence

The PR body should state which commands ran and the relevant results. Visible changes should include before/after screenshots as PR attachments, not committed files. On failure, Playwright stores screenshots and traces under ignored output directories; review them locally and do not stage them.

## Documentation verification

CI checks Markdown links. Reviewers must also execute changed setup and operations commands where practical. Any code change that invalidates an example, route, limit or data flow must update its documentation in the same pull request.
