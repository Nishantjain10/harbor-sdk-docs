# Project Folder Structure

Complete layout of the Harbor Docs repository. Paths are relative to the project root.

Legend:

- **Generated** — created by install or build; listed in `.gitignore`

---

## Tree

```
harbor-sdk-docs/
├── .github/
│   └── workflows/
│       └── docs-ci.yml              # GitHub Actions: lint + build on PR/push
│
├── docs/                            # Current docs → "Next (Unreleased)" in navbar
│   ├── intro.md                     # Homepage (/)
│   │
│   ├── getting-started/
│   │   ├── _category_.json
│   │   ├── installation.md
│   │   ├── quickstart.md
│   │   └── migrating-from-1-0.md
│   │
│   ├── concepts/
│   │   ├── _category_.json
│   │   ├── event-lifecycle.md
│   │   └── webhook-delivery.md
│   │
│   ├── guides/
│   │   ├── _category_.json
│   │   ├── creating-events.md
│   │   ├── webhooks.md
│   │   ├── managing-api-keys.md
│   │   └── pagination.md
│   │
│   ├── sdk-reference/
│   │   ├── _category_.json
│   │   ├── client.md
│   │   ├── events.md
│   │   ├── workspaces.md
│   │   └── webhooks.md
│   │
│   ├── rest-api/
│   │   ├── _category_.json
│   │   └── overview.md
│   │
│   └── troubleshooting/
│       ├── _category_.json
│       ├── common-errors.md
│       └── rate-limits.md
│
├── versioned_docs/
│   └── version-1.0.0/               # Frozen docs → "1.0.0" in navbar
│       ├── intro.md
│       └── getting-started/
│           ├── installation.md
│           └── quickstart.md
│
├── versioned_sidebars/
│   └── version-1.0.0-sidebars.json  # Sidebar for v1.0.0
│
├── src/
│   └── css/
│       └── custom.css               # Theme overrides (colors, GitHub nav icon)
│
├── static/
│   └── img/
│       └── .gitkeep                 # Placeholder for static assets
│
├── .docusaurus/                     # Generated — Docusaurus cache
├── build/                           # Generated — production output (deploy this)
├── node_modules/                    # Generated — dependencies
│
├── .eslintrc.cjs                    # ESLint config for TS site files
├── .gitignore
├── .markdownlint.json               # Markdown lint rules
├── .nvmrc                           # Node version pin (20)
├── babel.config.js                  # Babel preset for Docusaurus
├── docusaurus.config.ts             # Main site config (TypeScript)
├── sidebars.ts                      # Left navigation structure
├── tsconfig.json                    # TypeScript compiler options
├── package.json                     # Dependencies and scripts
├── pnpm-lock.yaml                   # Locked dependency versions
├── versions.json                    # Released doc versions: ["1.0.0"]
├── vercel.json                      # Vercel build/output settings
│
├── FOLDER-STRUCTURE.md              # This file — repository layout reference
└── README.md                        # Project overview
```

---

## File counts (source only)

| Area | Files |
| ---- | ----- |
| Current docs (`docs/`) | 17 Markdown pages + 6 `_category_.json` |
| Versioned docs (`versioned_docs/version-1.0.0/`) | 3 Markdown pages |
| Config / root | 13 files |
| CI | 1 workflow |
| Styles | 1 CSS file |

---

## What each top-level area does

| Path | Purpose |
| ---- | ------- |
| `docs/` | Live documentation content (unreleased / Next version) |
| `versioned_docs/` | Snapshots of older doc versions |
| `versioned_sidebars/` | Sidebar JSON per released version |
| `src/css/` | Small theme customizations |
| `static/` | Files copied as-is to the site root (images, etc.) |
| `.github/workflows/` | CI automation |
| `docusaurus.config.ts` | Site metadata, versioning, plugins, themes |
| `sidebars.ts` | Defines the left nav for the current version |

---

## Generated folders (do not commit)

These appear after `pnpm install` or `pnpm build`:

```
.docusaurus/
build/
node_modules/
.vercel/          # if you link Vercel CLI locally
```

All are listed in `.gitignore`.

---

## Scripts (from `package.json`)

| Command | What it runs |
| ------- | ------------ |
| `pnpm start` | Local dev server |
| `pnpm build` | Production static site → `build/` |
| `pnpm check` | `lint:md` + `lint` + `build` |
| `pnpm lint:md` | markdownlint on `docs/` and `versioned_docs/` |
| `pnpm lint` | ESLint on `docusaurus.config.ts`, `sidebars.ts`, `src/` |

---

## Related docs

- [README.md](./README.md) — Summary for GitHub reviewers
