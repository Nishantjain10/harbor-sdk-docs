---
sidebar_position: 2
---

# Quickstart

This guide initializes the Harbor client and retrieves recent events from a workspace. You need an API key with read access to events.

## Create a client

Create `list-events.js`:

```javascript
const { Harbor } = require('@harbor/sdk');

const harbor = new Harbor({
  apiKey: process.env.HARBOR_API_KEY,
});

async function main() {
  const { data } = await harbor.events.list({
    workspaceId: 'ws_018f3a2e4b9c',
    limit: 5,
  });

  for (const event of data) {
    console.log(event.id, event.type);
  }
}

main().catch(console.error);
```

Load `HARBOR_API_KEY` from your environment. Do not commit keys to source control.

Run the script:

```bash
node list-events.js
```

## Handle errors

Failed requests include a `code` property on the error object:

```javascript
try {
  await harbor.events.list({ workspaceId: 'ws_018f3a2e4b9c' });
} catch (error) {
  console.error(error.code, error.message);
}
```

Common codes include `authentication_failed` and `rate_limit_exceeded`.

## Next steps

Confirm your API key permissions in the Harbor dashboard before deploying to production.
