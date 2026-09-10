# Operations and join applications

## Ownership

- Deployment owner: project maintainers with access to the Vercel project.
- Join-service owner: the community chair or delegated application coordinator.
- Security and privacy contact: `ieesec.ihu@gmail.com`.
- Discord access: only members who review applications or operate the integration.

Review access whenever responsibilities change and at least once per academic term.

## Environments

| Environment       | Purpose                 | Secret requirement                                                           |
| ----------------- | ----------------------- | ---------------------------------------------------------------------------- |
| Local             | Development and tests   | Webhook optional; use a private test channel if delivery is required         |
| Vercel Preview    | Pull request validation | No production webhook; configure a separate test webhook only when necessary |
| Vercel Production | Public site             | Production webhook for the restricted application channel                    |

The only application secret is `DISCORD_JOIN_WEBHOOK_URL`. It must contain a Discord HTTPS webhook URL and must never use a `NEXT_PUBLIC_` prefix.

## Configure or rotate the webhook

1. Create a private Discord channel restricted to approved reviewers.
2. Create a dedicated webhook named `IEESEC Applications` for that channel.
3. Add the URL to the appropriate Vercel environment as `DISCORD_JOIN_WEBHOOK_URL`.
4. Redeploy that environment; environment changes do not alter an already-built deployment.
5. Submit one synthetic application and confirm delivery, formatting and disabled mentions.
6. Delete the synthetic message.
7. Delete the old webhook after a rotation and verify it can no longer post.

If a webhook is exposed, rotate it immediately. Do not paste the old or new value into an issue, pull request, log or screenshot.

## Deployment

Pull requests target `dev` and receive preview deployments. Release pull requests merge the tested `dev` state into `main`; production deployment should follow the protected `main` branch.

Before release:

```bash
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm test:unit
pnpm build
pnpm test:e2e --project=desktop
```

After release, verify `/el`, `/en`, `/el/join`, `/en/join`, both privacy routes, `robots.txt` and `sitemap.xml`. Use synthetic information for a delivery check and delete it afterwards.

## Rollback

1. Confirm whether the problem is code, configuration or an external Discord failure.
2. If code caused the incident, promote the last known-good Vercel deployment or revert the responsible commit through a reviewed pull request.
3. If configuration caused it, correct the environment value and redeploy.
4. Re-run the smoke checks and a synthetic application.
5. Record the incident and follow-up action without applicant data or secrets.

Do not disable validation, origin checks or rate limits as a quick production workaround.

## API contract

`POST /api/join-application` accepts `application/json` from the same browser origin.

Required fields:

- `fullName`, `email`, `year`, `github`, `discord`
- At least one `interests` value
- `experience` from 1 through 5
- A rating for every participation preference
- `consent: true`

Optional fields are `linkedin`, `motivation` and `builtSomething`. Short text fields are limited to 160 characters, free-text fields to 300 characters and the encoded request body to 16 KiB. Canonical enum values are defined in `src/components/sections/join/data.ts` and `src/types/join.ts`.

Success response:

```json
{ "ok": true }
```

Error responses use `{ "ok": false, "code": "..." }`:

| HTTP | Code                     | Operator meaning                                     |
| ---- | ------------------------ | ---------------------------------------------------- |
| 400  | `invalid-application`    | Malformed JSON, invalid fields or failed validation  |
| 403  | `invalid-origin`         | Browser request came from a different origin         |
| 413  | `invalid-application`    | Body exceeded 16 KiB                                 |
| 415  | `unsupported-media-type` | Request was not JSON                                 |
| 429  | `rate-limited`           | A request, IP or applicant limit was exceeded        |
| 500  | `service-unavailable`    | Webhook configuration is absent or invalid           |
| 502  | `service-unavailable`    | Discord rejected the payload or could not be reached |

## Abuse controls

Current in-memory limits are:

- 20 requests per client identifier per minute.
- 4 valid submissions per client identifier per hour.
- 2 valid submissions per applicant identifier per 24 hours.

Client identification prefers Vercel/forwarded IP headers. Applicant identifiers are derived from lower-cased email, GitHub and Discord values, then hashed before use as in-memory keys.

Because serverless instances do not share memory, these limits are approximate. If abuse becomes material, enable Vercel WAF/CAPTCHA or use a privacy-reviewed shared rate-limit store. Document the new data flow before deployment.

## Troubleshooting

### Every submission returns 500

- Confirm the production environment contains `DISCORD_JOIN_WEBHOOK_URL`.
- Confirm the URL uses `https://discord.com/api/webhooks/...` or `https://discordapp.com/api/webhooks/...`.
- Redeploy after changing the environment.

### Submissions return 502

- Check Discord service health and channel/webhook existence.
- Confirm the webhook was not rotated or deleted.
- Test with a synthetic payload from a controlled environment.
- Rotate the webhook if its integrity is uncertain.

### Legitimate applicant receives 429

- Wait for the relevant window to expire.
- Check for shared network traffic or repeated submissions.
- Never collect the applicant's full payload in a public issue.

### Spam reaches Discord

- Preserve evidence without exposing personal data.
- Tighten platform-level protection before changing application semantics.
- Review channel permissions and webhook activity.
- Record the chosen mitigation in an ADR if it changes architecture.

## Monitoring and privacy operations

Vercel should alert maintainers to deployment failures and elevated server errors. Discord delivery should be checked after releases and when application traffic unexpectedly stops. Logs must contain error categories and status codes, not raw form bodies or webhook URLs.

The application coordinator must review the private channel at least quarterly and delete messages older than 12 months. Process verified access, correction or deletion requests sent to `ieesec.ihu@gmail.com`. Record only the completion of a privacy request, not a duplicate of the applicant's data.

The public privacy notice describes this operating policy. Any change to collection, destination, access or retention requires a matching privacy-notice and runbook update before release.
