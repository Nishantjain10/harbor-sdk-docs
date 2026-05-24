---
sidebar_position: 2
description: Register webhook endpoints and verify signed delivery payloads.
---

# Webhooks

Harbor delivers event notifications to HTTPS endpoints you register on a workspace. Each delivery includes a signed payload your server must verify before processing.

You need a secret key with `webhooks:manage` to register endpoints. Store the endpoint `secret` for signature verification (not your API key).

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
  events: ['invoice.paid', 'user.invited'],
});

console.log(endpoint.id);   // wh_0193f1a2d001
console.log(endpoint.secret); // save to HARBOR_WEBHOOK_SECRET
```

  </TabItem>
  <TabItem value="js" label="JavaScript">

```javascript
const { Harbor } = require('@harbor/sdk');

const harbor = new Harbor({ secretKey: process.env.HARBOR_SECRET_KEY });

const endpoint = await harbor.webhooks.create({
  workspaceId: 'ws_018f3a2e4b9c',
  url: 'https://api.example.com/harbor/webhooks',
  events: ['invoice.paid', 'user.invited'],
});
```

  </TabItem>
  <TabItem value="curl" label="cURL">

```bash
curl https://api.harbor.dev/v1/webhooks \
  -X POST \
  -H "Authorization: Bearer hb_live_xxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "workspace_id": "ws_018f3a2e4b9c",
    "url": "https://api.example.com/harbor/webhooks",
    "events": ["invoice.paid", "user.invited"]
  }'
```

  </TabItem>
</Tabs>

:::warning
The endpoint URL must be publicly reachable over HTTPS. Local development typically uses a tunnel (for example, ngrok) or the Harbor CLI forwarder.
:::

## Verify signatures

Harbor sends `Harbor-Signature`, `Harbor-Timestamp`, and `Harbor-Delivery-Id` headers. Reject requests older than five minutes to limit replay attacks.

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
  await queue.enqueue(envelope.data.id, envelope.data);
  return new Response('ok', { status: 200 });
}
```

Return `2xx` after the delivery is accepted for processing, not after all downstream work completes. Harbor retries non-`2xx` responses for up to 72 hours.

## Handle duplicate deliveries

Deliveries are at-least-once. The same `evt_01hzy9q7x8f4` may arrive twice after retries or manual replay. Deduplicate on `envelope.data.id` before side effects.

## Delivery retries

| Attempt | Typical delay |
| ------- | ------------- |
| 1 | Immediate |
| 2 | 5 minutes |
| 3 | 30 minutes |
| 4+ | Up to 24 hours between attempts |

Inspect attempts in the dashboard under **Webhooks → Deliveries**. Replay failed deliveries after fixing your handler.

## Common mistakes

- Verifying with the API key instead of the endpoint secret.
- Parsing JSON before signature verification (always verify the raw body).
- Running long jobs before returning `2xx`. Acknowledge first, process async.
- Subscribing to `*` event types in production. Filter to events you actually handle.

## Next steps

- [Webhook delivery](../concepts/webhook-delivery) for payload schema and flow diagram
- [Creating events](./creating-events) for the events that trigger deliveries
- [Webhooks SDK reference](../sdk-reference/webhooks) for endpoint management methods
- [Common errors](../troubleshooting/common-errors) for signature and timeout issues
