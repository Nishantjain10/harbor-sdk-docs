---
sidebar_position: 4
description: Register and manage webhook endpoints through the Harbor SDK.
---

# Webhooks

The SDK exposes webhook endpoint management under `harbor.webhooks`. Delivery handling happens on your HTTP server; see [Webhook delivery](../concepts/webhook-delivery) for payload shape and retry semantics.

## create

```typescript
harbor.webhooks.create({
  workspaceId: 'ws_018f3a2e4b9c',
  url: 'https://api.example.com/harbor/webhooks',
  events: ['invoice.paid', 'user.invited'],
});
```

**Returns:** `WebhookEndpoint` with `id`, `url`, `events`, and `secret`.

**Required scope:** `webhooks:manage`

Store `secret` immediately. Harbor shows it once at creation.

## retrieve

```typescript
harbor.webhooks.retrieve('wh_0193f1a2d001');
```

**Returns:** `WebhookEndpoint` (secret field omitted)

**Required scope:** `webhooks:manage`

## list

```typescript
harbor.webhooks.list({
  workspaceId: 'ws_018f3a2e4b9c',
  limit: 20,
});
```

**Returns:** `Page<WebhookEndpoint>`

**Required scope:** `webhooks:manage`

## WebhookEndpoint object

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | string | Endpoint ID (`wh_` prefix) |
| `url` | string | HTTPS destination |
| `events` | string[] | Subscribed event types |
| `status` | string | `active` or `disabled` |
| `createdAt` | string | ISO 8601 timestamp |

## Next steps

- [Webhooks guide](../guides/webhooks) for registration and signature verification
- [Webhook delivery](../concepts/webhook-delivery) for retry and deduplication patterns
- [REST API overview](../rest-api/overview) for raw HTTP equivalents
