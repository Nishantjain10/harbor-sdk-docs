import {execSync, spawn} from 'node:child_process';

const PORT = 3456;
const HOST = '127.0.0.1';
const BASE_URL = `http://${HOST}:${PORT}`;
const STARTUP_TIMEOUT_MS = 30_000;
const PATHS = [
  '/',
  '/get-started',
  '/getting-started/installation',
  '/guides',
];

function waitForServer() {
  const deadline = Date.now() + STARTUP_TIMEOUT_MS;

  return new Promise((resolve, reject) => {
    const poll = () => {
      fetch(`${BASE_URL}/`)
        .then((response) => {
          if (response.ok) {
            resolve();
            return;
          }

          if (Date.now() >= deadline) {
            reject(new Error(`Docs server responded with ${response.status}.`));
            return;
          }

          setTimeout(poll, 500);
        })
        .catch(() => {
          if (Date.now() >= deadline) {
            reject(new Error('Timed out waiting for docs server.'));
            return;
          }

          setTimeout(poll, 500);
        });
    };

    poll();
  });
}

const serve = spawn(
  'pnpm',
  ['exec', 'docusaurus', 'serve', '--port', String(PORT), '--host', HOST],
  {
    stdio: 'ignore',
    detached: true,
  },
);

if (!serve.pid) {
  throw new Error('Failed to start docs server for accessibility checks.');
}

const stopServer = () => {
  try {
    process.kill(-serve.pid, 'SIGTERM');
  } catch {
    // Server may already be stopped.
  }
};

process.on('exit', stopServer);
process.on('SIGINT', () => {
  stopServer();
  process.exit(1);
});
process.on('SIGTERM', () => {
  stopServer();
  process.exit(1);
});

try {
  await waitForServer();
  // Allow lazy-loaded doc chunks to settle before scanning.
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const urls = PATHS.map((path) => `${BASE_URL}${path}`).join(' ');
  execSync(`pnpm exec pa11y-ci --config .pa11yci.json ${urls}`, {
    stdio: 'inherit',
  });
} finally {
  stopServer();
}
