---
sidebar_position: 3
description: Retrieve workspace metadata through the Harbor SDK.
---

# Workspaces

A workspace is the top-level container for events, webhooks, and API keys. Most integrations store a workspace ID in configuration and pass it to resource methods.

## retrieve

```typescript
const workspace = await harbor.workspaces.retrieve('ws_018f3a2e4b9c');

console.log(workspace.name, workspace.status);
```

**Returns:** `Workspace`

**Required scope:** `workspaces:read`

## Workspace object

| Field | Type | Description |
| ----- | ---- | ----------- |
| `id` | string | Workspace ID (`ws_` prefix) |
| `name` | string | Display name |
| `status` | string | `active`, `suspended`, or `archived` |
| `createdAt` | string | ISO 8601 timestamp |

## Suspended workspaces

Requests against a suspended workspace return `workspace_suspended`:

```json
{
  "error": {
    "code": "workspace_suspended",
    "message": "Workspace ws_018f3a2e4b9c is suspended.",
    "request_id": "req_0193f1a2b4c5"
  }
}
```

Contact Harbor support or your account admin to restore access. Event writes fail until the workspace is `active` again.

## Listing workspaces

Workspace listing is available to organization admins through the dashboard and a separate admin API. The public SDK focuses on single-workspace integrations where the ID is known upfront.

:::info
If you receive `resource_not_found` for a valid-looking ID, confirm the key belongs to the same Harbor organization as the workspace.
:::

## Next steps

- [Quickstart](../getting-started/quickstart) uses a workspace ID in the first list call
- [Managing API keys](../guides/managing-api-keys) scoped to a workspace's resources
- [Common errors](../troubleshooting/common-errors) for invalid workspace IDs
