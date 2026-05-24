# Contributing to Harbor Docs

Thanks for helping improve the docs. This guide covers local setup, where files live, and what to run before opening a pull request.

Harbor is a fictional product. Treat the content like realistic SDK documentation, not placeholder text.

## Prerequisites

- Node.js 20 (see `.nvmrc`)
- [pnpm](https://pnpm.io/) 10.x (see `packageManager` in `package.json`)

## Local setup

```bash
git clone https://github.com/Nishantjain10/harbor-sdk-docs.git
cd harbor-sdk-docs
nvm use          # optional, if you use nvm
pnpm install
pnpm start
```

The dev server runs at [http://localhost:3000](http://localhost:3000).

## Where to edit

| You want to change... | Edit this |
| --------------------- | --------- |
| Page content | `docs/**/*.md` or `versioned_docs/**/*.md` |
| Left navigation | `sidebars.ts` (current) or `versioned_sidebars/*.json` (released versions) |
| Site title, URL, versioning, Mermaid | `docusaurus.config.ts` |
| Theme colors, GitHub nav icon | `src/css/custom.css` |
| Static assets (images, favicons) | `static/` |
| Released version list | `versions.json` |

## Adding a new page

1. Create the Markdown file under the right folder in `docs/` (for example `docs/guides/my-new-guide.md`).
2. Add the page to `sidebars.ts` under the correct category.
3. Link to it from related pages where it helps the reader flow.
4. Run `pnpm check` locally.

### Page conventions

- Use front matter for `sidebar_position`, `description`, and `slug` when needed.
- Prefer second-person voice ("you") and short paragraphs.
- Use native Docusaurus features: tabs, admonitions, Mermaid, `<details>` blocks.
- Cross-link related pages instead of repeating the same explanation.
- Do not add custom React components unless there is a strong reason.

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

This runs markdownlint, ESLint, and a production build. The build fails if any internal link is broken.

Fix markdownlint issues in the files you touched. Common rules are configured in `.markdownlint.json`.

## Pull request checklist

- [ ] `pnpm check` passes locally
- [ ] New pages are listed in `sidebars.ts` (or the correct versioned sidebar)
- [ ] Internal links resolve (the build enforces this)
- [ ] Content reads clearly for a backend developer audience
- [ ] Version-specific changes are reflected in migration docs when relevant

## CI

GitHub Actions runs on pull requests and pushes to `main`:

1. Install dependencies with `pnpm install --frozen-lockfile`
2. Run `pnpm check`

See `.github/workflows/docs-ci.yml` for the workflow definition.

## Deployment

Merging to `main` triggers a Vercel deployment when the repo is connected. No manual deploy step is required for contributors.

## Questions

For this assessment project, Harbor is fictional and the repo is a documentation sample. In a real team, doc changes would go through the same PR review process as code: clarity, accuracy, and maintainability matter more than volume.
