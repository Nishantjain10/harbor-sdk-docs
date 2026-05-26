# Harbor Docs

Developer documentation for **Harbor**, a fictional event routing platform. Harbor covers workspaces, events, outbound webhooks, and API keys. The site is a Docusaurus v3 project with versioned docs, a small CI pipeline, and deployment on Vercel.

Harbor is not a real product. The content is realistic enough to show how I would structure and maintain SDK documentation.

## Local setup

Requires Node.js 20 (`nvm use` reads `.nvmrc`).

```bash
pnpm install
pnpm start    # dev server at http://localhost:3000
pnpm build    # production build
pnpm check    # full validation suite (see below)
```

If install fails with an outdated lockfile error, run `pnpm install --no-frozen-lockfile` once to refresh `pnpm-lock.yaml`, then use `pnpm install` normally. Avoid `CI=true pnpm install` locally — that enables frozen-lockfile mode.

Run `pnpm check` before opening a PR. That is what CI runs locally.

## What I built

The docs follow a simple path: overview, get started, concepts, guides, SDK reference, REST API, and troubleshooting. I put concepts before guides on purpose. You need to understand how events and webhook delivery work before writing integration code.

The site opens on a lightweight homepage with clear entry points into onboarding. Docs content uses native Docusaurus features: tabs (TypeScript / JavaScript / cURL), admonitions, Mermaid diagrams, and cross-links. The homepage uses the standard Docusaurus page layout pattern only — no custom component library.

Current docs live in `docs/` and show up as **Next (Unreleased)** in the navbar. A frozen **1.0.0** snapshot in `versioned_docs/` is intentionally smaller (intro and get-started only, older JavaScript SDK). The migration page explains what changed. I wanted versioning to feel real, not like a checkbox.

## Quality checks

`pnpm check` runs a deliberately small but high-signal pipeline:

| Step | Command | What it validates | Why it matters for docs |
| ---- | ------- | ----------------- | ----------------------- |
| Markdown lint | `pnpm lint:md` | Heading hierarchy, list formatting, trailing whitespace | Keeps diffs readable and prevents structural markdown drift across many pages |
| Config lint | `pnpm lint` | TypeScript config files (`docusaurus.config.ts`, `sidebars.ts`, pages) | Catches routing and navigation mistakes before build time |
| TypeScript | `pnpm typecheck` (`tsc --noEmit`) | Typed site configuration without emitting JS | Docs platforms still have typed config; this catches schema and import errors early |
| Production build | `pnpm build` | Full Docusaurus build, including internal link integrity | **`onBrokenLinks: 'throw'`** means broken internal doc links fail the build automatically — navigation integrity is enforced, not left to manual review |
| External links | `pnpm check:links` | Markdown links to third-party URLs via [lychee](https://github.com/lycheeorg/lychee) | Docs depend on external references (package managers, repos, standards). Dead outbound links erode trust even when the site builds |
| Accessibility smoke test | `pnpm check:a11y` | Axe-powered checks on key routes via [pa11y-ci](https://github.com/pa11y/pa11y-ci) | Documentation is UI. A lightweight smoke test catches missing page structure and navigation semantics. Syntax-highlighting contrast is excluded intentionally — Prism token colors produce false positives |

The pipeline stays lightweight on purpose: one primary CI job runs `pnpm check`, and external links also run in a dedicated GitHub Actions job for readable failures. Fictional API hostnames in code samples are excluded from link checking so examples stay realistic without flaky CI.

Install lychee locally if you want external link validation outside CI: `brew install lychee` (or see the project README).

## Decisions

**Docusaurus v3** because versioning, MDX, and static output are already solved problems. Config is in TypeScript so mistakes show up at build time.

**pnpm** for faster installs and a strict lockfile in CI (`pnpm install --frozen-lockfile`).

**SDK + REST docs** without duplicating everything. Node teams use the SDK. Everyone else needs HTTP patterns. Both paths are covered, but not twice.

**Broken internal links fail the build** (`onBrokenLinks: 'throw'` in `docusaurus.config.ts`). Any broken `./page` reference or navbar route breaks CI immediately. That is the highest-value integrity check for a static docs site.

**One primary CI job** that runs `pnpm check`, plus a separate lychee job for outbound links. Simple to run locally, simple to debug when something breaks.

**Vercel** connected to GitHub. Push to `main`, site rebuilds. I skipped wiring deploy tokens into CI since Vercel handles that cleanly for this scope.

## Assumptions

I wrote for backend developers integrating an event platform API. English only, GitHub-based workflow, no auth or analytics on the docs site. Examples are illustrative, not tied to a live backend.

## With more time

OpenAPI-generated API reference, Algolia search, Playwright smoke tests for the version dropdown, and per-PR preview deploys. I would also add Vale or a prose lint step if this were a team repo with a style guide.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for where to edit files and what to run before a PR.

---

<p align="center">
  Built with care by <strong>Nishant</strong>
</p>
