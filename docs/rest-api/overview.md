---
sidebar_position: 1
description: Base URLs, authentication, and request conventions for the Harbor REST API.
---

# REST API overview

Harbor exposes a JSON REST API for workspaces, events, and webhooks. Use it directly when the Node.js SDK is not available or for quick debugging with cURL.

The SDK is recommended for application code. It handles pagination cursors, retries, and typed errors. See the [Client reference](../sdk-reference/client).

## Base URLs

| Environment | Base URL |
| ----------- | -------- |
| Production | `https://api.harbor.dev/v1` |
| Sandbox | `https://sandbox.api.harbor.dev/v1` |

Sandbox and production data are isolated. Use `hb_test_` keys against sandbox.

## Authentication

Send your secret key as a Bearer token:

```bash
curl https://api.harbor.dev/v1/workspaces/ws_018f3a2e4b9c \
  -H "Authorization: Bearer hb_live_xxxx"
```

Restricted keys work the same way. Harbor enforces scopes server-side. See [Managing API keys](../guides/managing-api-keys).

## Request conventions

| Convention | Detail |
| ---------- | ------ |
| Request body | JSON with `Content-Type: application/json` |
| Response body | JSON object or paginated list |
| IDs | Prefixed strings (`ws_`, `evt_`, `wh_`, `del_`) |
| Timestamps | ISO 8601 UTC |
| Idempotency | `Idempotency-Key` header on `POST` requests |

Field names in JSON use `snake_case`. The SDK maps to `camelCase` in TypeScript.

## Pagination

List endpoints return:

```json
{
  "data": [ ... ],
  "has_more": true,
  "end_cursor": "evt_01hzy9q7x8f4"
}
```

Pass `?starting_after={end_cursor}` on the next request. Details in [Pagination](../guides/pagination).

## Errors

Errors use a consistent envelope:

```json
{
  "error": {
    "code": "permission_denied",
    "message": "API key missing required scope: events:write.",
    "request_id": "req_0193f1a2b4d6"
  }
}
```

HTTP status codes follow common REST semantics: `401` for auth failures, `403` for scope issues, `404` for missing resources, `429` for rate limits.

## Common endpoints

| Method | Path | Description |
| ------ | ---- | ----------- |
| `GET` | `/workspaces/{id}` | Retrieve workspace metadata |
| `POST` | `/events` | Create an event |
| `GET` | `/events/{id}` | Retrieve an event |
| `GET` | `/events` | List events in a workspace |
| `POST` | `/webhooks` | Register a webhook endpoint |

Task-oriented examples live in [Guides](../guides/creating-events). Interactive exploration is available in the Harbor dashboard under **Developers → API explorer**.

## Next steps

- [Creating events](../guides/creating-events) with cURL tab examples
- [Rate limits](../troubleshooting/rate-limits) and response headers
- [Quickstart](../getting-started/quickstart) to compare SDK and raw HTTP workflows
