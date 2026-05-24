---
sidebar_position: 2
description: How Harbor signs, delivers, and retries webhook notifications.
---

# Webhook delivery

When an event matches a registered endpoint's filter, Harbor sends an HTTPS `POST` to your URL. Deliveries are signed, retried on failure, and logged in the dashboard.

## Delivery flow

```mermaid
flowchart LR
    A[Event created] --> B{Matching endpoints?}
    B -->|Yes| C[Build payload]
    B -->|No| D[Done]
    C --> E[Sign with endpoint secret]
    E --> F[POST to your URL]
    F --> G{2xx response?}
    G -->|Yes| H[Mark delivered]
    G -->|No| I[Schedule retry]
    I --> F
```

Each delivery is independent. If you register three endpoints for `invoice.paid`, Harbor sends three requests.

## Delivery payload

Harbor wraps the event in an envelope:

```json
{
  "id": "del_0193f1a2c001",
  "type": "event.created",
  "created_at": "2026-05-25T12:00:01Z",
  "data": {
    "id": "evt_01hzy9q7x8f4",
    "type": "invoice.paid",
    "workspace_id": "ws_018f3a2e4b9c",
    "payload": {
      "invoice_id": "inv_0192ac4e8b1d",
      "amount_cents": 4200
    },
    "created_at": "2026-05-25T12:00:00Z"
  }
}
```

Use `data.id` for deduplication. The delivery ID (`del_` prefix) identifies a specific attempt sequence, not the underlying event.

## Headers

| Header | Purpose |
| ------ | ------- |
| `Harbor-Signature` | HMAC signature of `{timestamp}.{body}` |
| `Harbor-Timestamp` | Unix timestamp when Harbor signed the payload |
| `Harbor-Delivery-Id` | Unique ID for this delivery attempt |

Verify signatures before parsing JSON. Full handler example in [Webhooks](../guides/webhooks).

## Retries and timeouts

Harbor waits up to 10 seconds for a response. Non-`2xx` status codes and connection failures trigger retries with exponential backoff for up to 72 hours.

Your endpoint must be idempotent: the same event may arrive more than once after retries or manual replay.

## At-least-once semantics

Harbor guarantees **at-least-once** delivery, not exactly-once. Store processed event IDs in your database and skip duplicates:

```typescript
async function handleDelivery(envelope: DeliveryEnvelope) {
  const eventId = envelope.data.id;
  if (await db.processedEvents.has(eventId)) return;
  await processEvent(envelope.data);
  await db.processedEvents.add(eventId);
}
```

## Next steps

- [Webhooks](../guides/webhooks) to register endpoints and verify signatures
- [Event lifecycle](./event-lifecycle) for how events enter the pipeline
- [Common errors](../troubleshooting/common-errors) when verification fails
