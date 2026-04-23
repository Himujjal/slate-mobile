const fs = require('node:fs');
const path = require('node:path');

const HOOK_DIR = path.join(process.cwd(), '.git', 'hooks');
const HOOK_NAME = 'pre-commit';

const SOURCE_CONTENT = `
#!/bin/sh
# Pre-commit hook

echo "Running pre-commit checks..."

# Run type check
echo "Running TypeScript check..."
npx tsc --noEmit
if [ $? -ne 0 ]; then
  echo "TypeScript check failed!"
  exit 1
fi

# Run lint
echo "Running Biome lint..."
npx biome check .
if [ $? -ne 0 ]; then
  echo "Lint check failed! Run 'npm run lint:fix' to fix issues."
  exit 1
fi

# Run commitlint
echo "Running commitlint..."
npx commitlint --from HEAD~1 --to HEAD --verbose
if [ $? -ne 0 ]; then
  echo "Commit message check failed!"
  exit 1
fi

echo "All pre-commit checks passed!"
exit 0
`;

fs.writeFileSync(path.join(HOOK_DIR, HOOK_NAME), SOURCE_CONTENT);

console.log('Git hooks installed successfully.');
