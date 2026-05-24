---
sidebar_position: 2
description: Configure the Harbor client, create an event, and confirm it was persisted.
pagination_prev: getting-started/installation
pagination_next: concepts/event-lifecycle
---

# Quickstart

This guide creates an event in a workspace and confirms it was persisted. You need an API key with the `events:write` and `events:read` scopes.

## Before you code

1. Create a sandbox API key in the Harbor dashboard (**Settings → API keys**, `hb_test_` prefix, scopes `events:write` and `events:read`).
2. Copy your workspace ID from **Settings → General** (starts with `ws_`).
3. Export the key: `export HARBOR_SECRET_KEY=hb_test_…`
4. Install the SDK: `pnpm add @harbor/sdk` (see [Installation](./installation)).
5. Run the example below.

## Create and confirm an event

Create `emit-event.ts`:

```typescript
import { Harbor } from '@harbor/sdk';

const harbor = new Harbor({
  secretKey: process.env.HARBOR_SECRET_KEY,
});

const created = await harbor.events.create({
  workspaceId: 'ws_018f3a2e4b9c',
  type: 'order.shipped',
  payload: {
    orderId: 'ord_0192be7a3c4f',
    carrier: 'ups',
  },
});

console.log('Created:', created.id);

const confirmed = await harbor.events.retrieve(created.id);
console.log('Confirmed:', confirmed.type, confirmed.createdAt);
```

Load `HARBOR_SECRET_KEY` from your environment. Do not commit keys to source control.

Run the script:

```bash
npx tsx emit-event.ts
```

You should see the same event ID in both log lines. Harbor routes matching events to subscribed webhook endpoints asynchronously.

## Handle errors

Failed requests throw a `HarborError` with a stable `code` field:

```typescript
import { Harbor, isHarborError } from '@harbor/sdk';

try {
  await harbor.events.create({
    workspaceId: 'ws_018f3a2e4b9c',
    type: 'order.shipped',
    payload: { orderId: 'ord_0192be7a3c4f', carrier: 'ups' },
  });
} catch (error) {
  if (isHarborError(error)) {
    console.error(error.code, error.message);
    if (error.code === 'rate_limit_exceeded') {
      console.error(`Retry after ${error.retryAfterMs}ms`);
    }
  } else {
    throw error;
  }
}
```

See [Common errors](../troubleshooting/common-errors) for response examples and fixes.

## Test against sandbox

The SDK selects the sandbox host automatically when your key uses the `hb_test_` prefix. Override explicitly if needed:

```typescript
const harbor = new Harbor({
  secretKey: process.env.HARBOR_SECRET_KEY,
  host: 'https://sandbox.api.harbor.dev',
});
```

Sandbox keys use the `hb_test_` prefix. Production keys use `hb_live_`.

## Next steps

Continue to [Event lifecycle](../concepts/event-lifecycle). For REST/cURL examples, see [Creating events](../guides/creating-events).
