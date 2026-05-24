---
sidebar_position: 3
description: Register webhook endpoints and verify signed delivery payloads.
pagination_prev: concepts/webhook-delivery
pagination_next: guides/managing-api-keys
---

# Webhooks

Harbor delivers event notifications to HTTPS endpoints you register on a workspace. Each delivery includes a signed payload your server must verify before processing.

You need an API key with `webhooks:manage` to register endpoints. Store the endpoint `secret` for signature verification (not your API key).

See [Webhook delivery](../concepts/webhook-delivery) for retry semantics and payload envelope format.

## Register an endpoint

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="lang">
  <TabItem value="ts" label="TypeScript" default>

```typescript
import { Harbor } from '@harbor/sdk';

const harbor = new Harbor({ secretKey: process.env.HARBOR_SECRET_KEY });

const endpoint = await harbor.webhooks.create({
  workspaceId: 'ws_018f3a2e4b9c',
  url: 'https://api.example.com/harbor/webhooks',
  events: ['order.shipped', 'invoice.paid'],
});

console.log(endpoint.id);     // wh_0193f1a2d001
console.log(endpoint.secret);   // save securely — shown once at creation
```

  </TabItem>
  <TabItem value="js" label="JavaScript">

```javascript
const { Harbor } = require('@harbor/sdk');

const harbor = new Harbor({ secretKey: process.env.HARBOR_SECRET_KEY });

const endpoint = await harbor.webhooks.create({
  workspaceId: 'ws_018f3a2e4b9c',
  url: 'https://api.example.com/harbor/webhooks',
  events: ['order.shipped', 'invoice.paid'],
});

console.log(endpoint.id);     // wh_0193f1a2d001
console.log(endpoint.secret);   // save securely — shown once at creation
```

  </TabItem>
  <TabItem value="curl" label="cURL">

```bash
curl https://sandbox.api.harbor.dev/v1/webhooks \
  -X POST \
  -H "Authorization: Bearer hb_test_xxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "workspace_id": "ws_018f3a2e4b9c",
    "url": "https://api.example.com/harbor/webhooks",
    "events": ["order.shipped", "invoice.paid"]
  }'
```

  </TabItem>
</Tabs>

:::warning
The endpoint URL must be publicly reachable over HTTPS. Local development typically uses a tunnel such as ngrok.
:::

## Test locally

1. Start a tunnel: `ngrok http 3000`
2. Register the HTTPS URL (for example, `https://abc123.ngrok.io/harbor/webhooks`) using [Register an endpoint](#register-an-endpoint).
3. [Create a test event](./creating-events) that matches your subscription.
4. Confirm a `2xx` response under **Webhooks → Deliveries** in the dashboard.

## Verify signatures

Harbor sends `Harbor-Signature`, `Harbor-Timestamp`, and `Harbor-Delivery-Id` headers. `verifyWebhookSignature()` rejects timestamps older than five minutes to limit replay attacks.

```typescript
import { verifyWebhookSignature } from '@harbor/sdk';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('Harbor-Signature') ?? '';
  const timestamp = request.headers.get('Harbor-Timestamp') ?? '';

  const valid = verifyWebhookSignature({
    payload: body,
    signature,
    timestamp,
    secret: process.env.HARBOR_WEBHOOK_SECRET!,
  });

  if (!valid) {
    return new Response('Invalid signature', { status: 400 });
  }

  const envelope = JSON.parse(body);

  // Application code: defer processing (BullMQ, SQS, in-process worker, etc.)
  setImmediate(() => {
    processWebhookEvent(envelope.data);
  });

  return new Response('ok', { status: 200 });
}
```

Return `2xx` after the delivery is accepted for processing, not after all downstream work completes. Harbor retries non-`2xx` responses for up to 72 hours.

## Handle duplicate deliveries

Harbor delivers events at least once. Deduplicate on `envelope.data.id` before side effects. See [Webhook delivery § At-least-once semantics](../concepts/webhook-delivery#at-least-once-semantics).

## Delivery retries

| Attempt | Typical delay |
| ------- | ------------- |
| 1 | Immediate |
| 2 | 5 minutes |
| 3 | 30 minutes |
| 4+ | Up to 24 hours between attempts |

Harbor stops retrying after **72 hours** total. Inspect attempts in the dashboard under **Webhooks → Deliveries**. Replay failed deliveries after fixing your handler.

## Common mistakes

- Verifying with the API key instead of the endpoint secret.
- Parsing JSON before signature verification (always verify the raw body).
- Running long jobs before returning `2xx`. Acknowledge first, process async.
- Subscribing to `*` event types in production. Filter to events you actually handle.

## Next steps

Review [Managing API keys](./managing-api-keys) before production. Endpoint methods in [Webhook endpoints (SDK reference)](../sdk-reference/webhooks).
