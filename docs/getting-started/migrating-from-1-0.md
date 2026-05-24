---
sidebar_position: 3
description: Upgrade from Harbor SDK v1.0.x to v2.x.
---

# Migrating from v1.0

Harbor SDK v2 (documented in **Next**) introduces typed configuration, scoped secret keys, and renamed client options. SDK v1.0.x remains available in the **1.0.0** docs version dropdown.

## Breaking changes

| v1.0 | v2.x (Next) |
| ---- | ----------- |
| `apiKey` constructor option | `secretKey` |
| `harbor.config.js` from `init` | `harbor.config.ts` with `--typescript` |
| `Harbor` client in CommonJS only docs | First-class TypeScript types |
| Undocumented scopes | Explicit scopes (`events:read`, etc.) |
| Manual pagination loops | `listAuto` iterator helper |

## Update client initialization

**v1.0:**

```javascript
const harbor = new Harbor({
  apiKey: process.env.HARBOR_API_KEY,
});
```

**v2.x:**

```typescript
const harbor = new Harbor({
  secretKey: process.env.HARBOR_SECRET_KEY,
});
```

Rename the environment variable in your deployment config when you migrate.

## Update event listing

v2 returns a paginated object instead of a bare array:

```typescript
// v2
const page = await harbor.events.list({
  workspaceId: 'ws_018f3a2e4b9c',
  limit: 25,
});

for (const event of page.data) {
  console.log(event.id);
}
```

Use [Pagination](../guides/pagination) for cursor handling or `listAuto` in batch jobs.

## Webhook verification

v2 ships `verifyWebhookSignature()` in `@harbor/sdk`. If you implemented HMAC verification manually in v1, switch to the helper to stay aligned with header format changes.

## Recommended migration path

1. Upgrade the package: `pnpm add @harbor/sdk@latest`
2. Run `npx @harbor/sdk init --typescript` in a branch and merge the config template.
3. Replace `apiKey` with `secretKey` and update env var names.
4. Test against sandbox with a `hb_test_` key.
5. Update pagination call sites to use `page.data`.
6. Deploy to staging before rotating production keys.

:::tip
Compare behavior side by side using the docs version dropdown: **1.0.0** for the old quickstart, **Next** for the current guides.
:::

## Next steps

- [Installation](./installation) for v2 setup
- [Managing API keys](../guides/managing-api-keys) for scoped credentials
- [Event lifecycle](../concepts/event-lifecycle) for idempotency and replay behavior
