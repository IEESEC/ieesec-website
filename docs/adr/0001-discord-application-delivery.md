# ADR 0001: Deliver join applications through Discord

- Status: Accepted
- Date: 2026-09-11

## Context

IEESEC needs a low-overhead way for authorised team members to review website join applications. The project does not otherwise require a database or administrative application.

## Decision

The server validates each application and forwards a sanitised Discord embed through a server-only webhook to a private, access-controlled channel. Discord mentions are disabled. The website does not persist an applicant database.

## Consequences

- Review fits the team's existing coordination workflow and has little operating overhead.
- Discord becomes an external processor and service dependency.
- Channel access, webhook rotation, retention and deletion require explicit operations.
- Delivery failure returns a service error; there is no durable queue or retry mechanism.
- Applicant data must never be copied into public channels, repository artifacts or logs.

## Revisit when

Application volume, audit needs, access control, deletion guarantees or service reliability require structured storage or a dedicated review workflow. Any replacement requires a privacy and threat review before collecting data.
