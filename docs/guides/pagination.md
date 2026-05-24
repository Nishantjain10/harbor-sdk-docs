---
sidebar_position: 4
description: Cursor-based pagination for Harbor list endpoints.
---

# Pagination

List methods in the Harbor SDK return a page of results plus a cursor for the next page. All list endpoints use the same cursor pattern.

## Basic usage

```typescript
import { Harbor } from '@harbor/sdk';

const harbor = new Harbor({ secretKey: process.env.HARBOR_SECRET_KEY });

const page = await harbor.events.list({
  workspaceId: 'ws_018f3a2e4b9c',
  limit: 25,
});

for (const event of page.data) {
  console.log(event.id);
}

if (page.hasMore) {
  const next = await harbor.events.list({
    workspaceId: 'ws_018f3a2e4b9c',
    limit: 25,
    startingAfter: page.endCursor,
  });
}
```

## Auto-pagination helper

For batch jobs, use the async iterator so you do not manage cursors manually:

```typescript
for await (const event of harbor.events.listAuto({
  workspaceId: 'ws_018f3a2e4b9c',
  limit: 100,
})) {
  await archiveEvent(event);
}
```

The helper respects rate limits and retries transient failures between pages.

## Response shape

| Field | Description |
| ----- | ----------- |
| `data` | Array of resources for this page |
| `hasMore` | `true` when another page exists |
| `endCursor` | Pass as `startingAfter` on the next request |

Default `limit` is 20. Maximum is 100.

## Sort order

List endpoints return newest resources first unless documented otherwise. You cannot sort by arbitrary fields through the public API.

:::tip
When syncing to a data warehouse, persist `endCursor` after each successful page so a failed job can resume without re-fetching earlier rows.
:::

## Common mistakes

- **Reusing an expired cursor.** Cursors expire after 24 hours. Restart from the beginning or from a saved checkpoint timestamp.
- **Setting `limit` above 100.** Requests above the maximum return `invalid_request`.
- **Parallel page fetches.** Harbor list endpoints are cursor-sequential. Fetch one page at a time.

## Next steps

See [Events (SDK reference)](../sdk-reference/events) for list options. Watch [Rate limits](../troubleshooting/rate-limits) when iterating large datasets.
