# ADR 0002: Always prefix localized routes

- Status: Accepted
- Date: 2026-09-11

## Context

The public site serves Greek and English content. Links, metadata and crawlers need an unambiguous locale, while Greek remains the default experience.

## Decision

All user-facing routes include `/el` or `/en`. Greek is the default locale, locale detection is disabled and unprefixed navigation is redirected through the routing middleware. Internal links use the locale-aware navigation helpers.

## Consequences

- Every public URL clearly identifies its language.
- Canonical, alternate and sitemap URLs are deterministic.
- Each new page needs both dictionaries and both-locale tests.
- Hard-coded unprefixed anchors and `next/link` usage can bypass project conventions.

## Revisit when

The product adopts automatic language negotiation, locale-specific domains or more languages. Preserve redirects and canonical URLs during any migration.
