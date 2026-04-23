const fs = require('node:fs');
const path = require('node:path');

const HOOK_DIR = '.git/hooks';
const SOURCE_DIR = 'githooks';
const HOOK_NAME = 'pre-commit';

if (!fs.existsSync(SOURCE_DIR)) {
  console.log('No githooks directory found. Skipping hook installation.');
  process.exit(0);
}

if (!fs.existsSync(HOOK_DIR)) {
  fs.mkdirSync(HOOK_DIR, { recursive: true });
}

const sourcePath = path.join(SOURCE_DIR, HOOK_NAME);
if (fs.existsSync(sourcePath)) {
  fs.copyFileSync(sourcePath, path.join(HOOK_DIR, HOOK_NAME));
  fs.chmodSync(path.join(HOOK_DIR, HOOK_NAME), '755');
  console.log(`Installed ${HOOK_NAME} hook.`);
} else {
  console.log(`Warning: ${sourcePath} not found.`);
}

console.log('Git hooks installed successfully.');
