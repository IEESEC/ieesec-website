# Security policy

## Supported version

Security fixes are applied to the latest code on `main`. Older deployments and unmerged branches are not supported.

## Report a vulnerability privately

Do not open a public issue for vulnerabilities, exposed credentials, applicant information or other sensitive material.

Email **ieesec.ihu@gmail.com** with:

- A concise description and potential impact.
- Reproduction steps or a proof of concept.
- The affected URL, route or commit when known.
- Any suggested mitigation.
- A safe way to contact you for follow-up.

Do not include real applicant data. Use synthetic examples and redact webhook tokens, cookies, IP addresses and other credentials.

The team aims to acknowledge reports within three working days. Timing for validation and remediation depends on severity and maintainer availability. Please allow a reasonable remediation period before public disclosure.

## Secret handling

- Store `DISCORD_JOIN_WEBHOOK_URL` only in local untracked environment files and the Vercel encrypted environment configuration.
- Never paste a webhook token into issues, pull requests, screenshots, logs or chat transcripts.
- Rotate the webhook immediately if it may have been exposed, then review Discord and deployment activity.
- Give application-channel access only to members who review applications or maintain the service.

Operational response steps are documented in [docs/operations.md](docs/operations.md).
