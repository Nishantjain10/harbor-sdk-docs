# Harbor Docs

Documentation site for **Harbor**, a fictional event routing platform. Harbor covers workspaces, events, outbound webhooks, and API keys. The site uses Docusaurus v3 with versioned docs, native MDX (tabs, admonitions, Mermaid), and a small CI pipeline deployed to Vercel.

## Local setup

Requires Node.js 20 (`nvm use` reads `.nvmrc`).

```bash
pnpm install
pnpm start    # dev server at http://localhost:3000
pnpm build    # production build; catches broken links
pnpm check    # markdownlint + ESLint + build
```

## Documentation structure

| Section | Purpose |
| ------- | ------- |
| **Overview** | Platform summary, architecture diagram, SDK vs REST |
| **Get started** | Install, quickstart, v1 → v2 migration |
| **Concepts** | Event lifecycle, webhook delivery (Mermaid diagrams) |
| **Guides** | Task walkthroughs with TS/JS/cURL tabs |
| **SDK reference** | Client, events, workspaces, webhooks |
| **REST API** | HTTP conventions for non-Node integrations |
| **Troubleshooting** | Error codes, rate limits, sample JSON responses |

```
docs/
  intro.md
  getting-started/
  concepts/
  guides/
  sdk-reference/
  rest-api/
  troubleshooting/
versioned_docs/version-1.0.0/   # frozen 1.0.0 snapshot
```

Content uses native Docusaurus only: category indexes, tabs, admonitions, Mermaid, collapsible `<details>`, and cross-links. No custom React components.

## Versioning

| Label | Source | What it includes |
| ----- | ------ | ---------------- |
| Next (Unreleased) | `docs/` | Full site including concepts, REST API, migration guide |
| 1.0.0 | `versioned_docs/version-1.0.0/` | Intro and get-started only; JavaScript, no `--typescript` init |

The [Migrating from v1.0](docs/getting-started/migrating-from-1-0.md) page documents differences between versions.

## Decisions

**Information architecture** places concepts before guides so readers understand event immutability and at-least-once delivery before writing integration code.

**Dual access paths** (SDK + REST overview) reflect how real platforms serve Node.js teams and everyone else without duplicating every page.

**Mermaid diagrams** on intro and concept pages explain flows that prose alone would bury.

**CI** runs `pnpm check` on pull requests: markdownlint, ESLint on site config, production build with `onBrokenLinks: 'throw'`.

**Vercel** deploys from the connected GitHub repo.

## Deployment

- **Install command:** `pnpm install --frozen-lockfile`
- **Build command:** `pnpm build`
- **Output directory:** `build`

Optional env vars: `DOCS_URL`, `ORGANIZATION_NAME`, `PROJECT_NAME`.

## With more time

- External link checking (lychee) on a nightly schedule
- OpenAPI spec when the endpoint surface grows beyond a single overview page
- Algolia DocSearch once page count justifies full-text search

## Assumptions

- Readers are backend developers integrating an event platform API
- Harbor is fictional; examples show documentation patterns, not a live product
