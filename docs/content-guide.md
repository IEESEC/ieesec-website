# Content and localization guide

The repository is currently the source of truth for website content. Every content change goes through a pull request and the same review and test process as code.

## General rules

- Write clear, direct copy for current and prospective IHU students.
- Update Greek and English content in the same pull request.
- Use stable identifiers in code; translate only user-visible labels.
- Use real dates and links. Do not present placeholder cards as published articles or completed projects.
- Obtain permission before adding a person's name, photograph, biography or profile links.
- Never add applicant data to the repository.

## Translation workflow

User-visible copy lives in `messages/el.json` and `messages/en.json`. Both files must have the same object and array structure.

1. Choose the existing namespace that owns the UI.
2. Add the same key to both dictionaries.
3. Use `useTranslations` in Client Components or `getTranslations` in Server Components.
4. Use locale-aware `Link` from `src/i18n/navigation.ts` for internal navigation.
5. Run `pnpm test:unit --grep "dictionaries structurally aligned"` and relevant browser tests.
6. Review both languages at compact mobile and desktop widths; Greek and English strings have different lengths.

Do not concatenate translated sentence fragments when a complete sentence can be translated as one value. Keep product names such as GitHub and Discord unchanged.

## Add or update a team member

Member identity and profile data live in `src/components/sections/team/Member.ts`. Localized role and biography content lives under `team.members` in both dictionaries.

1. Obtain the member's approval for the displayed information and image.
2. Add a stable lowercase member ID to the `Member["id"]` union.
3. Add the member object with first name, last name, image and approved social links.
4. Add matching `role` and `bio` entries under `team.members.<id>` in both dictionaries.
5. Store approved images under `public/images/members/`. A remote image host must be explicitly allowed in `next.config.ts`.
6. Verify alt text, card layout, profile links and both themes.

The `MemberCard` public prop is `{ member: Member }`; do not copy the removed, stale component README examples.

## Add a technology

Technology data lives in `src/components/sections/tech-stack/data.ts`.

1. Import an icon already available through the project's icon dependencies.
2. Add a `TechItem` with a concise name and an existing category.
3. If a category is new, update its type and both `sections.filters` dictionaries.
4. Verify mobile disclosure order and desktop visibility with `tests/e2e/tech-stack.spec.ts`.

Only list technologies the community actively uses or intentionally teaches. The section is product content, not a dependency inventory.

## Add a blog card

Blog metadata lives in `src/components/sections/blog/BlogPost.ts`; title, excerpt and tags live under `blog.posts` in both dictionaries.

1. Add a stable post ID to `BlogPostId` and a metadata entry with slug, local image, ISO `YYYY-MM-DD` date and realistic read time.
2. Add matching translated content in both dictionaries.
3. Optimise the image before placing it under `public/images` and provide meaningful visible context through the title.
4. Verify date formatting and card height in both locales.

The current site displays preview cards only. There are no `/blog/[slug]` article routes and the cards are not links. Do not imply that an article is published until the article route, content source, sitemap entry and tests are implemented.

## Projects and events

`ProjectsSection` and `EventsSection` currently contain headings and introductory copy only. Before publishing entries, define a typed content model that includes stable ID, status/date, links, image and localized copy. Add the route or detail interaction, sitemap behavior and tests in the same feature pull request.

Do not add one-off hard-coded cards directly inside the section component; establish the shared data shape first.

## Images, logos and video

- Place versioned assets in a descriptive subdirectory of `public/`.
- Use lowercase, meaningful filenames without spaces.
- Preserve aspect ratios and set responsive `sizes` for `next/image`.
- Provide useful alt text for informative images and empty alt text for truly decorative images.
- Do not overwrite official brand files with visually similar exports.
- Keep join-video and poster assets within the budgets enforced by `tests/unit/media-assets.spec.ts`.
- Confirm that the team has permission to publish every photograph and logo.

## Publishing checklist

- [ ] Content owner approved accuracy and publication.
- [ ] Greek and English keys match and were reviewed.
- [ ] Names, dates, links and contact details were verified.
- [ ] Personal images and profile links have consent.
- [ ] Layout works on compact mobile and desktop in both themes.
- [ ] Accessibility, metadata and sitemap behavior are correct.
- [ ] Relevant tests and the production build pass.
