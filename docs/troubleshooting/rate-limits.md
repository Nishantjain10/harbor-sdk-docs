---
sidebar_position: 2
description: Harbor rate limits, headers, and retry behavior.
---

# Rate limits

Harbor applies rate limits per API key and workspace. Limits protect shared infrastructure and encourage efficient pagination.

## Default limits

| Environment | Requests per minute | Burst |
| ----------- | ------------------- | ----- |
| Sandbox | 120 | 30 |
| Production | 600 | 60 |

Write endpoints (`POST`, `PUT`, `DELETE`) count toward the same quota as reads.

## Response headers

Successful responses include:

| Header | Meaning |
| ------ | ------- |
| `Harbor-RateLimit-Limit` | Maximum requests in the current window |
| `Harbor-RateLimit-Remaining` | Requests left in the window |
| `Harbor-RateLimit-Reset` | Unix timestamp when the window resets |

When you exceed the limit, Harbor returns HTTP `429`:

```json
{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Too many requests. Retry after 2 seconds.",
    "request_id": "req_0193f1a2b501",
    "retry_after_ms": 2000
  }
}
```

## SDK retry behavior

The SDK retries idempotent requests when `rate_limit_exceeded` or certain `5xx` errors occur. Configure attempts on the client:

```typescript
const harbor = new Harbor({
  secretKey: process.env.HARBOR_SECRET_KEY,
  maxRetries: 3,
});
```

Non-idempotent writes (for example, `events.create` without an idempotency key) are not automatically retried.

:::warning
Tight loops that list every event without `listAuto` can exhaust quota quickly. Prefer cursor pagination with reasonable `limit` values.
:::

## Integration patterns

- **Batch exports:** use `listAuto` and backoff when `retryAfterMs` is present.
- **Webhook handlers:** respond with `2xx` promptly; rate limits apply to outbound API calls, not inbound deliveries.
- **Shared keys:** split read and write services onto restricted keys so one runaway job does not block critical writes.

## Next steps

See [Pagination guide](../guides/pagination) to reduce list call volume. Other failure codes in [Common errors](./common-errors).
