#!/usr/bin/env bash
set -euo pipefail

if ! command -v lychee >/dev/null 2>&1; then
  echo "lychee is not installed locally; skipping external link check."
  echo "Install from https://github.com/lycheeorg/lychee or rely on CI."
  exit 0
fi

lychee \
  --config .lychee.toml \
  --no-progress \
  'docs/**/*.md' \
  'versioned_docs/**/*.md' \
  'README.md' \
  'CONTRIBUTING.md'
