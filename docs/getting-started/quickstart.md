---
sidebar_position: 2
description: Configure the Harbor client and list events from a workspace.
---

# Quickstart

This guide initializes the Harbor client and retrieves recent events from a workspace. You need a secret API key with the `events:read` scope.

## Create a client

Create `list-events.ts`:

```typescript
import { Harbor } from '@harbor/sdk';

const harbor = new Harbor({
  secretKey: process.env.HARBOR_SECRET_KEY,
});

const events = await harbor.events.list({
  workspaceId: 'ws_018f3a2e4b9c',
  limit: 5,
});

for (const event of events.data) {
  console.log(event.id, event.type);
}
```

Load `HARBOR_SECRET_KEY` from your environment. Do not commit keys to source control.

Run the script:

```bash
npx tsx list-events.ts
```

## Handle errors

Failed requests throw a `HarborError` with a stable `code` field:

```typescript
import { Harbor, isHarborError } from '@harbor/sdk';

try {
  await harbor.events.list({ workspaceId: 'ws_018f3a2e4b9c' });
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

Point the client at Harbor's sandbox host while developing:

```typescript
const harbor = new Harbor({
  secretKey: process.env.HARBOR_SECRET_KEY,
  host: 'https://sandbox.api.harbor.dev',
});
```

Sandbox keys use the `hb_test_` prefix. Production keys use `hb_live_`.

## Next steps

- [Event lifecycle](../concepts/event-lifecycle) to understand what you are listing
- [Managing API keys](../guides/managing-api-keys) for scopes and rotation
- [Creating events](../guides/creating-events) to write your first event
- [Client reference](../sdk-reference/client) for configuration options
