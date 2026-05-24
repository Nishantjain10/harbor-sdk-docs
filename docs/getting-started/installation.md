---
sidebar_position: 1
description: Install @harbor/sdk and verify your local environment.
pagination_prev: intro
pagination_next: getting-started/quickstart
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

## Verify the install

Import the client in a one-line check:

```typescript
import { Harbor } from '@harbor/sdk';
console.log(typeof Harbor); // 'function'
```

Or print the installed version:

```bash
node -e "console.log(require('@harbor/sdk/package.json').version)"
```

You should see a semver such as `2.1.0`. Continue to [Quickstart](./quickstart) to configure credentials and send your first event.

## Next steps

Continue to [Quickstart](./quickstart) to create and confirm your first event.
