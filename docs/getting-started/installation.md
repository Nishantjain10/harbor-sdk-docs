---
sidebar_position: 1
description: Install @harbor/sdk and verify your local environment.
---

# Installation

Add `@harbor/sdk` to a Node.js project with your preferred package manager.

## Requirements

| Requirement | Version |
| ----------- | ------- |
| Node.js     | 20.x or later |
| Package manager | pnpm 9+, npm 10+, or Yarn 1.x/4.x |

Check your Node version:

```bash
node --version
```

## Install the package

From your project root:

```bash
pnpm add @harbor/sdk
```

```bash
npm install @harbor/sdk
```

```bash
yarn add @harbor/sdk
```

## Scaffold project files

For a new integration, the CLI can generate a starter config and environment template:

```bash
npx @harbor/sdk init --typescript
```

This creates `harbor.config.ts`, adds `.env.example`, and enables strict TypeScript settings. For a JavaScript project, omit the flag:

```bash
npx @harbor/sdk init
```

## Verify the install

Print the installed SDK version:

```bash
node -e "console.log(require('@harbor/sdk/package.json').version)"
```

You should see a semver such as `2.1.0`. Continue to [Quickstart](./quickstart) to configure credentials and send a request.

## Next steps

- [Quickstart](./quickstart) to list events from a workspace
- [Managing API keys](../guides/managing-api-keys) before deploying to production
