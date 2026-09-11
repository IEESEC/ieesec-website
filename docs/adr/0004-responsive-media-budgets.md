# ADR 0004: Maintain responsive media performance budgets

- Status: Accepted
- Date: 2026-09-11

## Context

The image-led design and scroll-controlled join video can create long loads, memory pressure and poor behavior on compact or resource-constrained devices.

## Decision

Provide mobile, standard and large video tiers plus a poster fallback. Enforce transfer sizes, dimensions, fast-start layout and seek characteristics in tests. Respect reduced-motion and data-saver preferences and defer non-critical homepage rendering.

## Consequences

- Media changes require optimisation and automated budget checks.
- Multiple video outputs increase repository size and content-production work.
- The experience remains usable when motion is reduced or video cannot be loaded.
- Budget increases require measured evidence rather than visual preference alone.

## Revisit when

Real-user monitoring, delivery infrastructure or a different interaction design justifies a new format or budget. Preserve accessible static content during migration.
