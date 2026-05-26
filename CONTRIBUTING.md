# Contributing to Harbor Docs

Thanks for helping improve the docs. This guide covers local setup, where files live, and what to run before opening a pull request.

Harbor is a fictional product. Treat the content like realistic SDK documentation, not placeholder text.

## Prerequisites

- Node.js 20 (see `.nvmrc`)
- [pnpm](https://pnpm.io/) 10.x (see `packageManager` in `package.json`)
- Optional: [lychee](https://github.com/lycheeorg/lychee) for local external link checks (`brew install lychee`)

## Local setup

```bash
git clone https://github.com/Nishantjain10/harbor-sdk-docs.git
cd harbor-sdk-docs
nvm use          # optional, if you use nvm
pnpm install
pnpm start
```

The dev server runs at [http://localhost:3000](http://localhost:3000).

If install fails with an outdated lockfile error after a dependency change, run:

```bash
pnpm install --no-frozen-lockfile
```

Avoid `CI=true pnpm install` locally — that enables frozen-lockfile mode and will fail when `pnpm-lock.yaml` is out of date.

## Site layout

The site has two entry points:

| URL | What it is |
| --- | ---------- |
| `/` | Lightweight landing page (`src/pages/index.tsx`) with hero, onboarding paths, and a platform diagram |
| `/intro` | Platform overview doc (`docs/intro.md`) — workspaces, SDK vs REST, quick links |

Docs content lives under the same routes as before (`/get-started`, `/guides`, etc.). The homepage is separate from the docs intro on purpose: first impression vs. reference content.

## Where to edit

| You want to change... | Edit this |
| --------------------- | --------- |
| Page content | `docs/**/*.md` or `versioned_docs/**/*.md` |
| Left navigation | `sidebars.ts` (current) or `versioned_sidebars/*.json` (released versions) |
| Top navigation | `docusaurus.config.ts` → `themeConfig.navbar` |
| Site title, URL, versioning, Mermaid | `docusaurus.config.ts` |
| Homepage landing page | `src/pages/index.tsx` and `src/pages/index.module.css` |
| Theme colors, GitHub nav icon | `src/css/custom.css` |
| Static assets (images, favicons) | `static/` |
| Released version list | `versions.json` |
| External link check rules | `.lychee.toml` |
| Accessibility smoke test | `.pa11yci.json` and `scripts/check-a11y.mjs` |
| Validation scripts | `scripts/check-links.sh`, `scripts/check-a11y.mjs` |
| CI workflow | `.github/workflows/docs-ci.yml` |

See [FOLDER-STRUCTURE.md](./FOLDER-STRUCTURE.md) for the full repository tree.

## Adding a new page

1. Create the Markdown file under the right folder in `docs/` (for example `docs/guides/my-new-guide.md`).
2. Add the page to `sidebars.ts` under the correct category.
3. Link to it from related pages where it helps the reader flow.
4. If it is a primary onboarding path, consider linking it from the homepage in `src/pages/index.tsx`.
5. Run `pnpm check` locally.

### Page conventions

- Use front matter for `sidebar_position`, `description`, and `slug` when needed.
- Do not set `slug: /` on doc pages — the homepage is `src/pages/index.tsx`.
- Prefer second-person voice ("you") and short paragraphs.
- Use native Docusaurus features: tabs, admonitions, Mermaid, `<details>` blocks.
- Cross-link related pages instead of repeating the same explanation.
- Keep custom React minimal. The homepage uses the standard Docusaurus page layout only — no shared component library.

### Category folders

Each docs section uses a `_category_.json` file to control the sidebar label and generated index page. Keep category labels consistent with the navbar tone.

## Working with versions

- **Current / unreleased docs** live in `docs/` and appear as **Next (Unreleased)** in the navbar.
- **Released snapshots** live in `versioned_docs/version-X.Y.Z/` with a matching file in `versioned_sidebars/`.
- Update `versions.json` when you cut a new released version.

When you change behavior between SDK versions, update the [Migrating from v1.0](docs/getting-started/migrating-from-1-0.md) page and the frozen v1 snapshot if the difference is user-facing.

## Before you open a PR

Run the full validation suite:

```bash
pnpm check
```

This runs, in order:

| Step | Command | What it validates |
| ---- | ------- | ----------------- |
| Markdown lint | `pnpm lint:md` | Heading hierarchy, list formatting, trailing whitespace |
| Config lint | `pnpm lint` | `docusaurus.config.ts`, `sidebars.ts`, `src/pages/` |
| TypeScript | `pnpm typecheck` | Typed config and pages (`tsc --noEmit`) |
| Production build | `pnpm build` | Full static build + **internal link integrity** |
| External links | `pnpm check:links` | Outbound URLs in Markdown via lychee (skips if not installed locally) |
| Accessibility | `pnpm check:a11y` | Axe smoke test on key routes via pa11y-ci |

Individual steps can also be run on their own: `pnpm typecheck`, `pnpm check:links`, `pnpm check:a11y`.

### Internal links (build-time)

The production build fails if any **internal** link is broken. Docusaurus is configured with `onBrokenLinks: 'throw'` in `docusaurus.config.ts`, so broken `./page` references, navbar routes, and cross-doc links are caught automatically — you do not need to click through the site to find them.

Markdown link targets are also checked via `onBrokenMarkdownLinks: 'throw'`.

### External links

Outbound links in `docs/`, `versioned_docs/`, `README.md`, and `CONTRIBUTING.md` are checked by [lychee](https://github.com/lycheeorg/lychee). Fictional API hostnames in code samples (for example `api.harbor.dev`) are excluded in `.lychee.toml` so examples stay realistic without flaky CI.

CI always runs lychee in a dedicated job. Locally, install lychee if you want the same check outside CI.

### Accessibility smoke test

`pnpm check:a11y` builds on the production output, serves it locally, and runs pa11y-ci with the axe runner on four key routes: homepage, get started, installation, and guides.

Syntax-highlighting contrast in code blocks is excluded intentionally — Prism token colors produce false positives. Mermaid diagrams are hidden during the scan to avoid lazy-load timing issues under `docusaurus serve`.

Fix markdownlint issues in the files you touched. Common rules are configured in `.markdownlint.json`.

## Pull request checklist

- [ ] `pnpm check` passes locally
- [ ] New pages are listed in `sidebars.ts` (or the correct versioned sidebar)
- [ ] Internal links resolve (the build enforces this)
- [ ] Homepage CTAs and navbar still point to valid routes (if you changed routing)
- [ ] Content reads clearly for a backend developer audience
- [ ] Version-specific changes are reflected in migration docs when relevant

## CI

GitHub Actions runs on pull requests and pushes to `main`:

1. **Quality checks** — `pnpm install --frozen-lockfile`, then `pnpm check` (markdownlint, ESLint, TypeScript, build, accessibility smoke test; lychee when installed on the runner).
2. **External links** — a dedicated job runs lychee against Markdown sources so outbound link failures are easy to spot in CI logs.

See `.github/workflows/docs-ci.yml` for the workflow definition.

## Deployment

Merging to `main` triggers a Vercel deployment when the repo is connected. No manual deploy step is required for contributors.

## Questions

For this assessment project, Harbor is fictional and the repo is a documentation sample. In a real team, doc changes would go through the same PR review process as code: clarity, accuracy, and maintainability matter more than volume.
