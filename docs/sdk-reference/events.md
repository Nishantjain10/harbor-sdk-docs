---
sidebar_position: 2
description: Create, retrieve, and list events through the Harbor SDK.
---

# Events

Events represent immutable activity records within a workspace. The SDK exposes `create`, `retrieve`, and `list` methods under `harbor.events`.

## create

```typescript
harbor.events.create({
  workspaceId: 'ws_018f3a2e4b9c',
  type: 'user.invited',
  payload: { email: 'dev@example.com' },
});
```

**Returns:** `Event` with fields `id`, `type`, `payload`, `workspaceId`, and `createdAt`.

**Options:** pass `{ idempotencyKey: string }` as the second argument to deduplicate retries.

**Required scope:** `events:write`

## retrieve

```typescript
harbor.events.retrieve('evt_01hzy9q7x8f4');
```

**Returns:** `Event`

**Required scope:** `events:read`

## list

```typescript
harbor.events.list({
  workspaceId: 'ws_018f3a2e4b9c',
  limit: 25,
  startingAfter: 'evt_01hzy9q7x8f4', // optional cursor
});
```

**Returns:** `Page<Event>` with `data`, `hasMore`, and `endCursor`.

**Required scope:** `events:read`

For iterator-based paging, use `listAuto`. See [Pagination guide](../guides/pagination).

## Replay

The SDK does not expose a `replay` method. Use `retrieve` to fetch the canonical payload for an event ID before reprocessing during a backfill. Webhook replay is a dashboard action. See [Event lifecycle § Event replay](../concepts/event-lifecycle#event-replay).

## Event object

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | string | Event ID (`evt_` prefix) |
| `type` | string | Namespaced event name |
| `payload` | object | Event-specific JSON |
| `workspaceId` | string | Owning workspace |
| `createdAt` | string | ISO 8601 timestamp |

## Next steps

See [Creating events guide](../guides/creating-events) for a full walkthrough. Idempotency details in [Event lifecycle](../concepts/event-lifecycle).
