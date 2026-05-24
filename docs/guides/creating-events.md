---
sidebar_position: 1
description: Create and retrieve events in a Harbor workspace.
---

# Creating events

Events record activity inside a workspace. Each event has a type string (for example, `invoice.paid`) and a JSON payload. Events are immutable after creation.

You need a secret key with the `events:write` scope. See [Event lifecycle](../concepts/event-lifecycle) for how events flow to webhooks.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="lang">
  <TabItem value="ts" label="TypeScript" default>

```typescript
import { Harbor } from '@harbor/sdk';

const harbor = new Harbor({ secretKey: process.env.HARBOR_SECRET_KEY });

const event = await harbor.events.create({
  workspaceId: 'ws_018f3a2e4b9c',
  type: 'invoice.paid',
  payload: {
    invoiceId: 'inv_0192ac4e8b1d',
    amountCents: 4200,
  },
});

console.log(event.id); // evt_01hzy9q7x8f4
```

  </TabItem>
  <TabItem value="js" label="JavaScript">

```javascript
const { Harbor } = require('@harbor/sdk');

const harbor = new Harbor({ secretKey: process.env.HARBOR_SECRET_KEY });

const event = await harbor.events.create({
  workspaceId: 'ws_018f3a2e4b9c',
  type: 'invoice.paid',
  payload: {
    invoiceId: 'inv_0192ac4e8b1d',
    amountCents: 4200,
  },
});

console.log(event.id);
```

  </TabItem>
  <TabItem value="curl" label="cURL">

```bash
curl https://api.harbor.dev/v1/events \
  -X POST \
  -H "Authorization: Bearer hb_live_xxxx" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: inv_0192ac4e8b1d-paid" \
  -d '{
    "workspace_id": "ws_018f3a2e4b9c",
    "type": "invoice.paid",
    "payload": {
      "invoice_id": "inv_0192ac4e8b1d",
      "amount_cents": 4200
    }
  }'
```

  </TabItem>
</Tabs>

## Idempotency

Pass an idempotency key when retries could create duplicate events:

```typescript
await harbor.events.create(
  {
    workspaceId: 'ws_018f3a2e4b9c',
    type: 'invoice.paid',
    payload: { invoiceId: 'inv_0192ac4e8b1d', amountCents: 4200 },
  },
  { idempotencyKey: 'inv_0192ac4e8b1d-paid' },
);
```

Harbor returns the same event if you replay the request with the same key within 24 hours. After expiry, the key can be reused for a new event.

<details>
<summary>Sample response (201 Created)</summary>

```json
{
  "id": "evt_01hzy9q7x8f4",
  "type": "invoice.paid",
  "workspace_id": "ws_018f3a2e4b9c",
  "payload": {
    "invoice_id": "inv_0192ac4e8b1d",
    "amount_cents": 4200
  },
  "created_at": "2026-05-25T12:00:00Z"
}
```

</details>

## Retrieve an event

```typescript
const event = await harbor.events.retrieve('evt_01hzy9q7x8f4');
```

Use retrieval to confirm persistence after a write or to audit payload contents before replaying to a consumer.

## Backfill and replay

If a downstream system missed events, list from a cursor and re-process payloads locally. For webhook-only setups, replay individual deliveries from the dashboard. See [Event lifecycle](../concepts/event-lifecycle#event-replay).

:::tip
Event types are plain strings. Document your team's naming convention (for example, `resource.action`) so webhook filters stay predictable.
:::

## Common mistakes

- Creating events in the wrong workspace. Always pass the workspace ID explicitly.
- Omitting `events:write` on restricted keys. See [Managing API keys](./managing-api-keys).
- Sending payloads larger than 256 KB. Store blobs elsewhere and reference them by ID.
- Retrying `create` without an idempotency key after a timeout. You may duplicate events.

## Next steps

- [Webhook delivery](../concepts/webhook-delivery) for what happens after creation
- [Pagination](./pagination) when listing events across large workspaces
- [Webhooks](./webhooks) to notify external systems
- [Events SDK reference](../sdk-reference/events) for method signatures
