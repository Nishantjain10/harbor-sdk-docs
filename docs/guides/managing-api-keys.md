---
sidebar_position: 3
description: Create, scope, rotate, and revoke Harbor API keys.
---

# Managing API keys

Harbor uses secret API keys for server-side access. Keys are prefixed by environment and can be unrestricted or limited to specific scopes.

## Key types

| Type | Prefix | Typical use |
| ---- | ------ | ----------- |
| Sandbox secret | `hb_test_` | Local development and CI against sandbox |
| Live secret | `hb_live_` | Production backends |
| Restricted | Either prefix | Services that need minimal access |

Create and revoke keys in the Harbor dashboard under **Settings → API keys**.

## Authenticate with a secret key

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="lang">
  <TabItem value="ts" label="TypeScript" default>

```typescript
import { Harbor } from '@harbor/sdk';

const harbor = new Harbor({
  secretKey: process.env.HARBOR_SECRET_KEY,
});
```

  </TabItem>
  <TabItem value="js" label="JavaScript">

```javascript
const { Harbor } = require('@harbor/sdk');

const harbor = new Harbor({
  secretKey: process.env.HARBOR_SECRET_KEY,
});
```

  </TabItem>
  <TabItem value="curl" label="cURL">

```bash
curl https://api.harbor.dev/v1/workspaces/ws_018f3a2e4b9c \
  -H "Authorization: Bearer hb_live_xxxx"
```

  </TabItem>
</Tabs>

The SDK selects `sandbox.api.harbor.dev` or `api.harbor.dev` from the key prefix.

## Restricted keys and scopes

Assign scopes when a service should not use a full secret:

| Scope | Grants |
| ----- | ------ |
| `events:read` | List and retrieve events |
| `events:write` | Create events |
| `webhooks:manage` | Register and update webhook endpoints |
| `workspaces:read` | Read workspace metadata |

A worker that only emits events needs `events:write`, not `webhooks:manage`.

:::info
Calls outside the key's scopes return `permission_denied`. See [Common errors](../troubleshooting/common-errors).
:::

## Rotation

Rotate keys on a schedule or immediately after suspected exposure:

1. Create a new key with the same scopes in the dashboard.
2. Update your deployment secrets (`HARBOR_SECRET_KEY`).
3. Redeploy or reload configuration.
4. Revoke the old key after traffic moves over.

Harbor allows a short overlap window so you can roll out without downtime.

## Separate keys by service

Split credentials so a compromised read worker cannot register webhooks:

| Service | Suggested scopes |
| ------- | ---------------- |
| Event emitter | `events:write` |
| Analytics exporter | `events:read` |
| Webhook provisioner | `webhooks:manage` |
| Admin tooling | Unrestricted (rotate frequently) |

## Environment variables

| Variable | Purpose |
| -------- | ------- |
| `HARBOR_SECRET_KEY` | Server-side API authentication |
| `HARBOR_WEBHOOK_SECRET` | Webhook signature verification (per endpoint) |

Keep secrets out of git. Use your platform's secret manager in staging and production.

## Next steps

- [REST API overview](../rest-api/overview) for Bearer token format
- [Client reference](../sdk-reference/client) for constructor options
- [Creating events](./creating-events) for scope requirements on write paths
- [Rate limits](../troubleshooting/rate-limits) when keys share a workspace quota
