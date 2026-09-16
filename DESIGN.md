# IEESEC design system

## Visual direction

An image-led student engineering community site built around IHU campus photography, steel-blue accents, deep navy ink and direct geometric typography. Light mode uses crisp opaque surfaces; dark mode uses restrained translucency over deep navy.

## Design tokens

Implementation tokens are CSS custom properties in `src/app/globals.css`. Components must consume semantic tokens instead of introducing one-off colours.

- Brand primary: `#508CA4`, represented by `--primary`.
- Accent: cobalt blue through `--accent` for selected states and primary calls to action.
- Surfaces: `--background`, `--card`, `--secondary` and `--muted`.
- Text: `--foreground`, `--card-foreground` and `--muted-foreground`.
- Structure and focus: `--border`, `--input` and `--ring`.
- Structural radii: normally 10–16 px; use pill shapes only for controls or compact status elements.

Do not duplicate token values in component documentation. The stylesheet is the source of truth.

## Typography

- Inter is the primary body family and includes Latin and Greek subsets.
- Geist Sans supports display typography.
- Geist Mono is reserved for compact technical metadata, counters and labels.
- Headings use strong weight and tight but readable tracking.
- Body copy uses comfortable line height and avoids unnecessarily wide measures.

## Layout and breakpoints

Tailwind responsive prefixes define behavior:

| Prefix | Minimum width | Expected use                                        |
| ------ | ------------: | --------------------------------------------------- |
| Base   |          0 px | Compact mobile first                                |
| `sm`   |        640 px | Larger phones and small tablets                     |
| `md`   |        768 px | Tablet layout and desktop join interaction boundary |
| `lg`   |       1024 px | Desktop navigation and multi-column composition     |
| `xl`   |       1280 px | Maximum-width content framing                       |

- Align primary content to the existing `max-w-7xl` frame; long legal or editorial text should use a narrower readable measure.
- Avoid horizontal overflow at every Playwright viewport, including 320×568 and 844×390.
- Home sections may use viewport-scale composition, but content must remain readable on short screens.
- Use normal document flow on touch layouts; scroll-controlled interactions must have keyboard and reduced-motion alternatives.

## Component states

Every interactive component must define:

- Default, hover and active/selected appearance.
- Visible `focus-visible` treatment with sufficient contrast.
- Disabled state that remains readable and communicates non-interactivity.
- Loading, success and error feedback when asynchronous.
- Light and dark theme behavior.
- Reduced-motion behavior for transforms or animated transitions.

Forms use opaque controls, visible borders, associated labels, clear required/optional language and errors near the affected interaction. Do not use placeholder text as the only label.

## Core components

- Navbar: near-opaque light surface, restrained translucent dark surface and clear active item. Mobile navigation traps focus and closes with Escape.
- Cards: solid semantic surfaces with visible boundaries. Avoid decorative border-plus-wide-shadow combinations.
- Join form: progressive five-step flow, persistent progress feedback and normal document flow on touch devices.
- Hero: photography remains darkened for white headline legibility. Controls expose carousel status and pause/play behavior.
- Privacy/editorial pages: narrow readable text column, hierarchical headings and direct navigation back to the related task.

## Accessibility

- Normal text and placeholders must reach 4.5:1 contrast.
- Large text and essential control boundaries must reach 3:1.
- Use one descriptive `<h1>` per page and logical heading levels thereafter.
- Preserve the `#main-content` skip target and semantic landmarks.
- Interactive targets should be at least 44×44 CSS pixels where practical.
- Do not encode meaning through colour, motion or position alone.
- Content must remain available when JavaScript or animation is unavailable.

The browser tests in `tests/e2e/light-theme.spec.ts`, `site-audit.spec.ts`, `join-responsive.spec.ts` and `privacy.spec.ts` enforce part of this contract.

## Motion

- Keep the carousel and purposeful micro-interactions, but avoid continuous motion without controls.
- Theme changes disable transitions to prevent mixed-theme frames.
- Respect `prefers-reduced-motion`; background video remains on its poster frame.
- Animation must not delay access to content or keyboard focus.

## Asset rules

- Use approved, real campus and community photography.
- Preserve official SVG logos and their clear space; do not recreate them from screenshots.
- Provide informative alt text based on the image's purpose in context.
- Export responsive images and video tiers rather than sending desktop media to every device.
- Follow the binary size and dimension budgets documented in [docs/testing.md](docs/testing.md).
- Confirm publication rights and member consent before adding assets.

## Review checklist

- [ ] Both themes and both locales were reviewed.
- [ ] Compact mobile, short mobile, landscape and desktop layouts work.
- [ ] Keyboard order, focus visibility and Escape behavior are correct.
- [ ] Reduced-motion and no-JavaScript fallbacks preserve content.
- [ ] Contrast and target sizes meet the stated requirements.
- [ ] Assets are approved, optimised and within performance budgets.
- [ ] Relevant Playwright tests pass.
