# Website audit and optimization

## Completed

- Preserved the campus imagery, color identity, themes, content, localized routes, and application business logic.
- Fixed Greek headline clipping on phones and tablets, short-screen hero clipping, mobile footer columns, member-card text layout, and responsive section spacing.
- Moved the full navigation breakpoint to 1024px. Added drawer focus containment, Escape dismissal, focus restoration, background inertness, scroll locking, and desktop-resize dismissal. The logo now preserves the current locale; section navigation updates the URL and respects modified clicks and reduced motion.
- Exposed carousel controls on phones, enlarged control targets, respected reduced motion, and paused rotation during interaction.
- Replaced custom radio buttons with native radio inputs and 44px label targets. Retained all five application steps, selection values, validation, and submission behavior.
- Corrected dark-theme supporting-text and primary-button contrast, improved dark input boundaries, and added a localized skip link.
- Kept blog cards as non-clickable previews with the user's approval: the three article destinations did not exist and the repository has no full article content.

## Performance and cleanup

- Removed the unused Plus Jakarta Sans font load and repaired the self-referencing body-font variable.
- Prioritized the initial hero image and lazy-loaded subsequent slides.
- Replaced the sole Framer Motion usage with native browser animation and IntersectionObserver. Content is present and visible without JavaScript, and motion cancels for reduced-motion preferences or a hidden tab. Removed Framer Motion and its exclusive motion dependencies from both lockfiles.
- Deferred explicit full-video warming until the application form enters view, rather than warming it immediately on arrival. Retained the seek-friendly encodings and selected the mobile video first for coarse-pointer devices, including wide tablets.
- Removed the unused generic carousel and page-container components and unnecessary memoization of string lengths.
- Corrected the E2E script to include the complete browser suite and made its server command independent of an npm executable on PATH.
- No dependencies were added. Existing optimized-image handling and static route generation remain in place.

## SEO

- Added a sitemap for all four existing localized pages, including language alternatives, and robots.txt with the sitemap location.
- Corrected join-page Open Graph and Twitter metadata so sharing no longer identifies the homepage.
- Added organization JSON-LD using existing site facts and centralized the established production origin.
- Kept a single H1 on the homepage, used H2 section headings and H3 card headings, and corrected footer list markup.
- Preserved localized canonicals and language alternatives. No unsupported article schema or invented content was added.

## Verification

- Clean production build and TypeScript: passed. All four localized pages, robots.txt, and sitemap.xml are statically generated; the application API remains dynamic.
- Lint: zero warnings or errors. Diff whitespace check passed.
- Production regression suite: **96 passed, 50 intentionally skipped**, zero failures. Skips are device-specific cases outside their applicable projects.
- Checked 320px, 390px, 640px, 768px, 844px, 1024px, and 1280px layouts, including short screens, landscape, both languages, both themes, navigation, metadata, reduced motion, and content without JavaScript.
- Both compact and standard phone application flows completed with mocked responses. No application was sent to Discord.
- Reviewed rendered mobile and desktop screenshots. Local production probes of both routes and languages at 390px and 1280px found no console/runtime errors or HTTP failures; discovered internal link destinations returned HTTP 200.
- Eight unthrottled local production samples over their first three seconds recorded LCP of 76–112ms and layout-shift totals of 0–0.00088. Explicit video-warming requests before entering the form: zero. These are local lab observations, not field Core Web Vitals or evidence of a percentage improvement. INP and real mobile-network performance still require deployed-site measurement.
- A stale generated CSS cache was detected by production tests and resolved with a clean rebuild. Deploy from a clean build if cached output disagrees with source changes.

## Remaining risks and follow-up

- The production dependency audit reports **43 existing advisories: 18 high, 21 moderate, 4 low, 0 critical**. Most paths are through the installed shadcn CLI/tooling; additional findings involve Babel and Browserslist. Audit counts do not establish browser or server exploitability. Update and validate those toolchains in a separate dependency-maintenance pass; no forced upgrades were applied.
- The repository has npm and pnpm lockfiles with different resolved versions. Both were updated narrowly for removal of Framer Motion, but package-manager standardization remains advisable. The vulnerability counts above are from the pnpm lockfile.
- Real-device Safari/Firefox, field INP, slower-network measurements, and a full assistive-technology audit remain follow-up work. The completed browser suite uses Chromium; sampled contrast checks do not certify the entire site as WCAG conformant.
- External profile/community links were preserved; their continued availability is outside the local internal-link verification.
- Existing in-memory API rate limiting is per process and is not durable across serverless instances. Live Discord delivery and hosting configuration were not changed or tested by sending messages.
- Full blog articles, projects, and event content require editorial input. Existing content was preserved.
- Confirm the existing Vercel origin remains the intended canonical domain before deploying to a different domain. No site was deployed or published during this audit.

The pre-existing language-toggle edit was preserved. Changes remain local for review.
