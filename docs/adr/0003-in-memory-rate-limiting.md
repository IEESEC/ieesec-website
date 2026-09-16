# ADR 0003: Use in-memory rate limiting as an initial control

- Status: Accepted
- Date: 2026-09-11

## Context

The public join endpoint needs basic protection against accidental repetition and casual spam, but the small project does not otherwise operate shared state.

## Decision

Maintain hashed, expiring request, client-submission and applicant-submission counters in process memory. Treat these limits as a best-effort control rather than a global security boundary.

## Consequences

- The control requires no new account, database or personal-data store.
- Counters disappear on restart and are not shared between serverless instances.
- A determined actor can bypass the effective global quota.
- Platform WAF, CAPTCHA or a privacy-reviewed shared store remains necessary if abuse becomes material.

## Revisit when

Monitoring shows sustained spam, distributed abuse or legitimate users being blocked. A replacement must document its identifiers, retention, failure behavior and privacy impact.
