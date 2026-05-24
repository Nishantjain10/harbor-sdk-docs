---
sidebar_position: 1
---

# Installation

Add `@harbor/sdk` to a Node.js project with your preferred package manager.

## Requirements

| Requirement | Version |
| ----------- | ------- |
| Node.js     | 18.x or later |

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

Generate a starter config file for a new integration:

```bash
npx @harbor/sdk init
```

This creates `harbor.config.js` with sandbox defaults and a sample `.env.example`.

## Verify the install

Print the installed SDK version:

```bash
node -e "console.log(require('@harbor/sdk/package.json').version)"
```

You should see `1.0.x`. Continue to [Quickstart](./quickstart) to configure credentials and send a request.
