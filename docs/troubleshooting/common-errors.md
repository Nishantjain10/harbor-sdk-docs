---
sidebar_position: 1
description: Harbor API error codes, sample responses, and fixes.
---

# Common errors

Harbor returns structured errors with a stable `code` field. The SDK surfaces them as `HarborError` instances. Include `error.requestId` (or `request_id` in JSON) when contacting support.

## authentication_failed

The API key is missing, revoked, expired, or malformed.

```json
{
  "error": {
    "code": "authentication_failed",
    "message": "Invalid API key provided.",
    "request_id": "req_0193f1a2b4c5"
  }
}
```

**Fix:** Confirm `HARBOR_SECRET_KEY` is set in the runtime environment. Regenerate the key if it was revoked. Match sandbox keys (`hb_test_`) to the sandbox host. See [Managing API keys](../guides/managing-api-keys).

## permission_denied

The key lacks scope for the operation.

```json
{
  "error": {
    "code": "permission_denied",
    "message": "API key missing required scope: events:write.",
    "request_id": "req_0193f1a2b4d6"
  }
}
```

**Fix:** Create a restricted key with the required scope or use an unrestricted secret. A read-only key cannot call `POST /v1/events`.

## resource_not_found

The requested workspace, event, or webhook does not exist for your organization.

```json
{
  "error": {
    "code": "resource_not_found",
    "message": "No workspace found with id ws_018f3a2e4b9c.",
    "request_id": "req_0193f1a2b4e7"
  }
}
```

**Fix:** Verify the ID in the dashboard. Copy-paste errors in workspace IDs are the most common cause during initial integration.

## idempotency_conflict

You reused an idempotency key with a different request body within the 24-hour window.

```json
{
  "error": {
    "code": "idempotency_conflict",
    "message": "Idempotency-Key inv_0192ac4e8b1d-paid was already used with a different payload.",
    "request_id": "req_0193f1a2b500"
  }
}
```

**Fix:** Generate a new key per distinct operation, or wait for the key to expire. See [Creating events](../guides/creating-events#idempotency).

## webhook_signature_invalid

Your handler rejected a delivery because signature verification failed. Harbor logs this on the delivery attempt, not as an API error response to your outbound calls.

**Fix:** Verify against the **endpoint secret**, not the API key. Use the raw request body before JSON parsing. Reject timestamps older than five minutes. Details in [Webhooks](../guides/webhooks).

## invalid_request (pagination)

```json
{
  "error": {
    "code": "invalid_request",
    "message": "Cursor expired. Start a new pagination sequence.",
    "request_id": "req_0193f1a2b4f8"
  }
}
```

**Fix:** Do not reuse cursors older than 24 hours. See [Pagination](../guides/pagination).

## workspace_suspended

Writes and deliveries pause when a workspace is suspended (billing or policy).

```json
{
  "error": {
    "code": "workspace_suspended",
    "message": "Workspace ws_018f3a2e4b9c is suspended.",
    "request_id": "req_0193f1a2b510"
  }
}
```

**Fix:** Contact your organization admin or Harbor support. Reads may still work depending on suspension reason.

## Next steps

- [Rate limits](./rate-limits) for `rate_limit_exceeded`
- [Client reference](../sdk-reference/client) for retry configuration
- [Webhook delivery](../concepts/webhook-delivery) for delivery-side debugging
