# Admin dashboard prototype

## Scope

The `/admin` route is a frontend-only dashboard and CMS prototype. It has no database, API client, route handlers, file upload, identity provider or security enforcement. Demo roles only alter visible navigation and actions.

The first MVP slice contains:

- typed DTO-like project, post, homepage, media and member shapes;
- deterministic asynchronous mock repository interfaces;
- development scenarios selected from the shell or the `scenario` query parameter;
- a responsive admin shell with simulated roles;
- an overview dashboard with projects, editorial review, deadlines and activity;
- a searchable posts workspace with status and translation filters;
- a bilingual post editor with a compact rich-text toolbar, preview and metadata inspector;
- browser-local draft persistence and simulated submit/approve transitions;
- a project portfolio with list/board views and local create/edit flows;
- a bilingual homepage composition manager with ordering and responsive preview;
- a media library with asset filters and bilingual alt-text editing;
- member and role management with project coverage signals;
- workspace settings with local workflow and interface preferences;
- shadcn/ui primitives for common cards, tables, tabs, dialogs, selects and controls.

## Reference extraction

The implementation combines the structural restraint of the supplied Efferd dashboard with the denser product patterns of the Shadcn UI Kit project-management dashboard. It translates those systems rather than copying their branding or assets:

1. A persistent, theme-aware left rail owns workspace identity, search and grouped navigation.
2. The page header is compact and separated with a thin structural border.
3. The main content opens with a wide workspace title, date context and export action.
4. KPI values use independent bordered cards with a clear heading/value/signal hierarchy.
5. A dense 12-column grid pairs primary operational surfaces with smaller support panels without empty cells.
6. Tables and lists use separators, subtle hover states and compact metadata.
7. Corners stay restrained at 8–12 px; wide decorative shadows and glass effects are avoided.
8. Typography relies on strong headings, quiet supporting copy and monospaced operational data.
9. Colour is functional: IEESEC steel blue marks actions and progress, while semantic tones identify attention states.
10. The delivery chart answers a real question about update and review rhythm instead of acting as decoration.
11. GSAP adds restrained entry and scroll-linked hierarchy with a reduced-motion fallback.
12. On compact screens the rail becomes a scroll-locked overlay and dashboard grids return to document flow.
13. The editorial surface borrows the dense command-bar and uninterrupted document canvas pattern from Shadcn Editor while keeping publication metadata in a separate IEESEC inspector.

## Reuse map

- Existing CSS semantic tokens remain the colour, border, focus and surface source of truth.
- Existing Inter, Geist and Geist Mono font variables are reused by the separate admin root layout.
- Existing IEESEC wordmark assets and `ThemeProvider` are reused.
- Public `Card` and navigation components remain unchanged because their softer, image-led treatment serves a different context.
- Dashboard panels are feature-local compositions built from semantic tokens; no second global design system is introduced.

## Mock data and scenarios

`src/features/admin/types.ts` defines the future API-facing seam. `src/mocks/admin-repositories.ts` implements the same contracts with stable fixtures and Promise-based reads.

Post drafts are additionally stored under a versioned `localStorage` key so save, preview and workflow actions can be demonstrated without pretending a server write occurred. Resetting a draft removes only that browser-local copy.

Available scenarios:

- `default`
- `empty-projects`
- `empty-posts`
- `loading`
- `recoverable-error`
- `long-greek-copy`
- `incomplete-translations`
- `editor-conflict`

In development, the shell exposes scenario and reset controls. Production builds do not display the scenario control.

## Future API seam

Replace each mock repository object with an implementation that fulfils the matching interface. Pages and feature components should continue consuming typed repository results rather than importing fixture arrays. A real backend, authentication and authorization remain separate future work and must not be inferred from the demo role switcher.

## Next slices

1. Replace browser-local persistence with authenticated repository adapters.
2. Connect approved upload, identity and publishing services.
3. Complete production authorization, audit history and full browser verification.
