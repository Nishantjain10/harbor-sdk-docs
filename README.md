# Harbor Docs

This repo powers the developer documentation for **Harbor**, a fictional event routing platform. Harbor helps backend teams emit events, deliver webhooks, and manage API keys. The site is built with [Docusaurus](https://docusaurus.io/) v3 and ships as a static site to Vercel.

Harbor is not a real product. The content shows how a production-style SDK docs site can be structured, versioned, and kept healthy in CI.

## Get started locally

You need **Node.js 20**. If you use nvm:

```bash
nvm use
```

Then install and run the dev server:

```bash
pnpm install
pnpm start
```

Open [http://localhost:3000](http://localhost:3000). Edits to Markdown files reload automatically.

### Useful commands

| Command | What it does |
| ------- | ------------ |
| `pnpm start` | Dev server with hot reload |
| `pnpm build` | Production build into `build/` |
| `pnpm check` | Full validation before a PR (see below) |
| `pnpm lint:md` | Markdown lint only |
| `pnpm lint` | ESLint on site config files |

Run `pnpm check` before opening a pull request. That is the same command CI runs.

## What is in the docs

The sidebar follows a deliberate learning path: understand the platform first, then integrate.

| Section | What you will find |
| ------- | ------------------ |
| **Overview** | Platform summary, architecture diagram, SDK vs REST |
| **Get started** | Install, quickstart, v1 to v2 migration |
| **Concepts** | Event lifecycle and webhook delivery (with Mermaid diagrams) |
| **Guides** | Task walkthroughs with TypeScript, JavaScript, and cURL tabs |
| **SDK reference** | Client, events, workspaces, webhooks |
| **REST API** | HTTP conventions for non-Node integrations |
| **Troubleshooting** | Error codes, rate limits, sample JSON responses |

Content lives under `docs/`. A frozen **1.0.0** snapshot lives in `versioned_docs/version-1.0.0/` for the version dropdown in the navbar.

## Versioning

| Navbar label | Source folder | Contents |
| ------------ | ------------- | -------- |
| **Next (Unreleased)** | `docs/` | Full current site |
| **1.0.0** | `versioned_docs/version-1.0.0/` | Intro and get-started only (older SDK) |

The [Migrating from v1.0](docs/getting-started/migrating-from-1-0.md) page explains what changed between versions.

## How we test this repo

There are no unit tests. For a docs-only project, the build pipeline is the test suite:

1. **markdownlint** checks Markdown style in `docs/` and `versioned_docs/`
2. **ESLint** checks `docusaurus.config.ts`, `sidebars.ts`, and `src/`
3. **Docusaurus build** compiles every page and fails on broken internal links (`onBrokenLinks: 'throw'`)

GitHub Actions runs `pnpm check` on every pull request and push to `main`. If it passes locally, it should pass in CI.

## Deployment

The site deploys to Vercel from the connected GitHub repo.

| Setting | Value |
| ------- | ----- |
| Install command | `pnpm install --frozen-lockfile` |
| Build command | `pnpm build` |
| Output directory | `build` |

Optional environment variables: `DOCS_URL`, `ORGANIZATION_NAME`, `PROJECT_NAME`.

## Why it is built this way

- **Concepts before guides:** Readers should understand event immutability and at-least-once delivery before writing integration code.
- **SDK and REST paths:** Node teams use the SDK. Everyone else uses HTTP. Both paths are documented without duplicating every page.
- **Native Docusaurus only:** Tabs, admonitions, Mermaid, and collapsible sections. No custom React components, so the site stays easy to maintain.
- **Versioning with a thinner v1:** Proves the setup is real, not copy-pasted. Shows how migration docs fit into a versioned site.
- **Strict link checking:** Dead links fail the build. That catches the most common docs regression before merge.

## Contributing

Want to add or edit a page? Read [CONTRIBUTING.md](./CONTRIBUTING.md) for the workflow, file conventions, and PR checklist.

## With more time

- External link checking (lychee) on a nightly schedule
- OpenAPI spec when the endpoint surface grows beyond a single overview page
- Algolia DocSearch once page count justifies full-text search

## Assumptions

- Readers are backend developers integrating an event platform API
- Docs are English-only and maintained in GitHub
- Harbor is fictional; examples demonstrate documentation patterns, not a live API
