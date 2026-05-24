# Harbor Docs

Developer documentation for **Harbor**, a fictional event routing platform. Harbor covers workspaces, events, outbound webhooks, and API keys. The site is a Docusaurus v3 project with versioned docs, a small CI pipeline, and deployment on Vercel.

Harbor is not a real product. The content is realistic enough to show how I would structure and maintain SDK documentation.

<img width="2534" height="1554" alt="Harbor Docs site preview" src="https://github.com/user-attachments/assets/7a76ef5e-942c-48cf-808e-6956390db8ac" />

## Local setup

Requires Node.js 20 (`nvm use` reads `.nvmrc`).

```bash
pnpm install
pnpm start    # dev server at http://localhost:3000
pnpm build    # production build
pnpm check    # markdownlint + eslint + build
```

Run `pnpm check` before opening a PR. That is what CI runs.

## What I built

The docs follow a simple path: overview, get started, concepts, guides, SDK reference, REST API, and troubleshooting. I put concepts before guides on purpose. You need to understand how events and webhook delivery work before writing integration code.

Pages use native Docusaurus features only: tabs (TypeScript / JavaScript / cURL), admonitions, Mermaid diagrams, and cross-links. No custom React components. That keeps the repo easy to hand off to another docs contributor.

Current docs live in `docs/` and show up as **Next (Unreleased)** in the navbar. A frozen **1.0.0** snapshot in `versioned_docs/` is intentionally smaller (intro and get-started only, older JavaScript SDK). The migration page explains what changed. I wanted versioning to feel real, not like a checkbox.

## Decisions

**Docusaurus v3** because versioning, MDX, and static output are already solved problems. Config is in TypeScript so mistakes show up at build time.

**pnpm** for faster installs and a strict lockfile in CI (`pnpm install --frozen-lockfile`).

**SDK + REST docs** without duplicating everything. Node teams use the SDK. Everyone else needs HTTP patterns. Both paths are covered, but not twice.

**Broken links fail the build** (`onBrokenLinks: 'throw'`). For a docs repo, that is the most useful single check I could add.

**One CI job** that runs `pnpm check`: markdownlint, ESLint on site config, then a full production build. Simple to run locally, simple to debug when it breaks.

**Vercel** connected to GitHub. Push to `main`, site rebuilds. I skipped wiring deploy tokens into CI since Vercel handles that cleanly for this scope.

## Assumptions

I wrote for backend developers integrating an event platform API. English only, GitHub-based workflow, no auth or analytics on the docs site. Examples are illustrative, not tied to a live backend.

## With more time

External link checking (lychee), OpenAPI-generated API reference, Algolia search, Playwright smoke tests for the version dropdown, and per-PR preview deploys. I would also add Vale or a prose lint step if this were a team repo with a style guide.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for where to edit files and what to run before a PR.

---

<p align="center">
  Built with care by <strong>Nishant</strong>
</p>
