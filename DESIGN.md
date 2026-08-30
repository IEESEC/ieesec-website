# IEESEC Design System

## Visual Direction

An image-led student engineering community site built around IHU campus photography, steel-blue accents, deep navy ink, and direct geometric typography. Light mode uses crisp opaque surfaces; dark mode uses restrained translucency over deep navy.

## Color

- Brand primary: `#508CA4`, represented by the `--primary` OKLCH token.
- Accent: cobalt blue through `--accent` for selected states and primary calls to action.
- Light surfaces: neutral near-white `--background` and `--card`, separated with `--border` rather than diffuse shadows.
- Dark surfaces: deep navy `--background` with slightly raised cards.
- Text on brand fills uses the dark ink token in light mode and near-white in dark mode.
- Normal text and placeholders must reach 4.5:1 contrast; large text and essential control boundaries must reach 3:1.

## Typography

- Inter is the primary body family.
- Geist Sans supports display typography; Geist Mono is reserved for compact technical metadata.
- Headings use strong weight and tight but readable tracking. Body copy remains comfortably spaced and concise.

## Layout

- Full-width, image-led hero followed by single-purpose viewport sections.
- Content aligns to the existing `max-w-7xl` page frame.
- Cards use 10–16px structural radii unless a control is intentionally pill-shaped.
- Maintain the existing desktop and mobile breakpoints and avoid horizontal overflow.

## Components

- Navbar: stable near-opaque light surface; restrained translucent dark surface; active item uses the primary fill.
- Cards: solid token surfaces with visible boundaries. Avoid border-plus-wide-shadow decoration.
- Forms: opaque light controls, visible borders, clear focus rings, and dark progress chrome over the video background.
- Hero: photography remains darkened for white headline legibility; the terminal fade stays dark in light mode and blends into the dark page in dark mode.

## Motion

- Keep the existing carousel and purposeful micro-interactions.
- Theme changes disable transitions to prevent mixed-theme frames.
- Respect `prefers-reduced-motion` and keep content visible without animation.
