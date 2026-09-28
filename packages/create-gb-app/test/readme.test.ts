import { expect, test } from 'bun:test';

import { buildTree } from '../src/generate/build-tree';
import { resolveStack, YES_DEFAULTS } from '../src/stack/resolve';

test('README documents the generated scripts and selected manager', () => {
  const files = buildTree(resolveStack(YES_DEFAULTS), {
    projectName: 'sample-app',
    packageManager: 'pnpm',
  });
  const readme = files['README.md'];

  expect(readme).toContain('pnpm install');
  expect(readme).toContain('pnpm run dev');
  expect(readme).toContain('pnpm run db:generate');
  expect(readme).toContain('## Features');
  expect(readme).not.toContain('## Project structure');
  expect(readme).not.toContain('pnpm run db:migrate');
});

test('README keeps hosted setup instructions once', () => {
  const files = buildTree(
    resolveStack({
      ...YES_DEFAULTS,
      database: 'sqlite',
      dbSetup: 'turso',
    }),
    { projectName: 'hosted-app', packageManager: 'bun' }
  );
  const readme = files['README.md'];

  expect(readme.match(/^## Database setup$/gm)).toHaveLength(1);
  expect(readme).toContain('turso db shell');
  expect(readme).toContain('bun run db:migrate');
});
