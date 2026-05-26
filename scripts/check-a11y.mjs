import {execSync, spawn} from 'node:child_process';
import {existsSync, mkdtempSync, readFileSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

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

function resolveChromePath() {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    process.env.CHROME_PATH,
    process.env.CHROME_BIN,
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  for (const command of [
    'google-chrome-stable',
    'google-chrome',
    'chromium-browser',
    'chromium',
  ]) {
    try {
      const resolved = execSync(`command -v ${command}`, {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();

      if (resolved && existsSync(resolved)) {
        return resolved;
      }
    } catch {
      // Try the next browser binary.
    }
  }

  return null;
}

function createPa11yConfig(chromePath) {
  const baseConfig = JSON.parse(readFileSync('.pa11yci.json', 'utf8'));
  const configDir = mkdtempSync(join(tmpdir(), 'pa11y-config-'));
  const configPath = join(configDir, 'config.json');

  writeFileSync(
    configPath,
    JSON.stringify({
      ...baseConfig,
      defaults: {
        ...baseConfig.defaults,
        chromeLaunchConfig: {
          ...baseConfig.defaults.chromeLaunchConfig,
          executablePath: chromePath,
        },
      },
    }),
  );

  return configPath;
}

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

const chromePath = resolveChromePath();

if (!chromePath) {
  console.log('Chrome/Chromium not found; skipping accessibility smoke test.');
  console.log('Install Chrome locally or rely on CI with browser-actions/setup-chrome.');
  process.exit(0);
}

const pa11yConfigPath = createPa11yConfig(chromePath);

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
  execSync(`pnpm exec pa11y-ci --config ${pa11yConfigPath} ${urls}`, {
    stdio: 'inherit',
    env: {
      ...process.env,
      PUPPETEER_EXECUTABLE_PATH: chromePath,
      CHROME_PATH: chromePath,
    },
  });
} finally {
  stopServer();
}
