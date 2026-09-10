# IEESEC Website

The public website of IEESEC, the Software Engineering student community of the Department of Information and Electronic Engineering at the International Hellenic University (IHU).

The site presents the community, its members and technical interests, and provides a bilingual application flow for prospective members.

![IEESEC project identity](public/images/metadata/og-image.png)

## Live site

- Production: <https://ieesec-website.vercel.app>
- Greek: <https://ieesec-website.vercel.app/el>
- English: <https://ieesec-website.vercel.app/en>

## Technology

- Next.js 16 App Router and React 19
- TypeScript and Tailwind CSS 4
- `next-intl` with Greek and English routes
- Playwright for unit-style and browser tests
- Vercel hosting and a server-side Discord webhook for join applications

## Prerequisites

- Node.js 20.9 or newer
- pnpm 11.19.0
- A Discord webhook URL only when testing successful application delivery

pnpm is the canonical package manager. Do not create or commit npm, Yarn or Bun lockfiles.

## Local setup

```bash
git clone https://github.com/IEESEC/ieesec-website.git
cd ieesec-website
corepack enable
corepack prepare pnpm@11.19.0 --activate
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

On PowerShell, replace the copy command with `Copy-Item .env.example .env.local`.

Open <http://localhost:3000>. The middleware redirects unprefixed URLs to the default Greek locale.

`DISCORD_JOIN_WEBHOOK_URL` may remain empty for ordinary UI work. A valid secret is required for a successful join-form submission; never commit a real webhook.

## Routes

| Route                         | Purpose                          |
| ----------------------------- | -------------------------------- |
| `/el`, `/en`                  | Localized home page              |
| `/el/join`, `/en/join`        | Join application                 |
| `/el/privacy`, `/en/privacy`  | Join-application privacy notice  |
| `/api/join-application`       | Server-side application endpoint |
| `/robots.txt`, `/sitemap.xml` | Crawler metadata                 |

## Commands

| Command                           | Purpose                                    |
| --------------------------------- | ------------------------------------------ |
| `pnpm dev`                        | Start the development server               |
| `pnpm build`                      | Create a production build                  |
| `pnpm start`                      | Serve the production build                 |
| `pnpm lint`                       | Run oxlint                                 |
| `pnpm format:check`               | Verify formatting                          |
| `pnpm format`                     | Format the repository                      |
| `pnpm test:unit`                  | Run fast Playwright unit-style tests       |
| `pnpm test:e2e --project=desktop` | Run desktop browser tests                  |
| `pnpm test`                       | Run the complete Playwright project matrix |

Install Chromium before the first E2E run with `pnpm exec playwright install chromium`. On Linux CI or a fresh Linux workstation, use `pnpm exec playwright install --with-deps chromium`.

## Repository map

```text
messages/                 Greek and English translation dictionaries
public/                   Versioned images, logos and video assets
src/app/[locale]/         Localized App Router pages
src/app/api/              Server-side route handlers
src/components/           Shared UI and homepage sections
src/i18n/                 Locale routing and navigation helpers
tests/unit/               Pure logic, configuration and asset checks
tests/e2e/                Browser-level behavior and accessibility checks
docs/                     Architecture, operations and team guides
```

## Documentation

- [Contributing](CONTRIBUTING.md)
- [Architecture](docs/architecture.md)
- [Content and localization](docs/content-guide.md)
- [Testing and quality](docs/testing.md)
- [Operations and join applications](docs/operations.md)
- [Product direction](PRODUCT.md)
- [Design system](DESIGN.md)
- [Security policy](SECURITY.md)
- [Support](SUPPORT.md)
- [Architecture decisions](docs/adr/README.md)

## Contributing and security

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request. Do not report suspected security vulnerabilities or exposed secrets in public issues; follow [SECURITY.md](SECURITY.md).

## License

Source code is available under the [MIT License](LICENSE). IEESEC names, logos, photographs and other brand assets remain the property of their respective owners unless explicitly stated otherwise.
