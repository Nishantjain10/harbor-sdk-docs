---
sidebar_position: 1
slug: /
---

# Harbor SDK

Harbor is a backend platform for managing workspaces, events, and outbound webhooks. The `@harbor/sdk` package wraps the Harbor REST API with request helpers and consistent error handling for Node.js applications.

## When to use the SDK

Use the SDK when you are building server-side software that creates or reads Harbor resources. It targets Node.js 18 and later in JavaScript projects.

## What the SDK handles

Raw HTTP integration requires you to manage authentication headers, pagination, and retries in every service. The SDK provides a single client configuration, cursor pagination on list endpoints, and structured errors you can log or map to application responses.

## Next steps

Install the package in [Installation](./getting-started/installation), then follow [Quickstart](./getting-started/quickstart) to send your first request.
