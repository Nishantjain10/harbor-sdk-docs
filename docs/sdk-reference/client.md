---
sidebar_position: 1
description: Harbor client constructor, configuration, and global options.
---

# Client

The `Harbor` class is the entry point for the SDK. One client instance can serve an entire process; create separate instances only when credentials or hosts differ.

## Constructor

```typescript
import { Harbor } from '@harbor/sdk';

const harbor = new Harbor({
  secretKey: process.env.HARBOR_SECRET_KEY,
  host: 'https://api.harbor.dev', // optional override
  timeoutMs: 30_000,              // default 30s
  maxRetries: 2,                  // default 2 for idempotent requests
});
```

| Option | Default | Description |
| ------ | ------- | ----------- |
| `secretKey` | required | Secret API key (`hb_test_` or `hb_live_`) |
| `host` | inferred from key | API base URL |
| `timeoutMs` | `30000` | Request timeout |
| `maxRetries` | `2` | Retries for idempotent GETs and rate-limited responses |

## Resource namespaces

The client exposes namespaced methods:

```typescript
harbor.workspaces.retrieve('ws_018f3a2e4b9c');
harbor.events.create({ ... });
harbor.events.list({ ... });
harbor.webhooks.create({ ... });
```

See [Events](./events), [Workspaces](./workspaces), and [Webhook endpoints](./webhooks) for per-resource details.

## Errors

Failed requests throw `HarborError`:

```typescript
import { isHarborError } from '@harbor/sdk';

try {
  await harbor.workspaces.retrieve('ws_invalid');
} catch (error) {
  if (isHarborError(error)) {
    console.log(error.code, error.status, error.requestId);
  }
}
```

Stable `code` values include `authentication_failed`, `permission_denied`, `resource_not_found`, and `rate_limit_exceeded`. See [Common errors](../troubleshooting/common-errors).

## Logging

Attach a logger to trace requests without printing secrets:

```typescript
const harbor = new Harbor({
  secretKey: process.env.HARBOR_SECRET_KEY,
  logger: {
    debug: (msg, meta) => console.debug(msg, meta),
  },
});
```

Log lines include `requestId` for correlation with Harbor support.

## verifyWebhookSignature

Validates an inbound webhook delivery using the endpoint secret from `harbor.webhooks.create()`. Import it separately from the client class:

```typescript
import { verifyWebhookSignature } from '@harbor/sdk';

const valid = verifyWebhookSignature({
  payload: rawBody,       // raw request body string
  signature,                // Harbor-Signature header
  timestamp,                // Harbor-Timestamp header
  secret: endpointSecret,   // endpoint secret, not your API key
});
```

| Parameter | Description |
| --------- | ----------- |
| `payload` | Raw request body (before JSON parsing) |
| `signature` | Value of the `Harbor-Signature` header |
| `timestamp` | Value of the `Harbor-Timestamp` header |
| `secret` | Endpoint signing secret |

Returns `true` when the signature is valid and the timestamp is within five minutes. See [Webhooks guide](../guides/webhooks) for a full handler example.

## Next steps

See [Events](./events) method reference. Credential setup in [Managing API keys](../guides/managing-api-keys).
