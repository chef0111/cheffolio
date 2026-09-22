import { expect, test } from 'bun:test';
import { YES_DEFAULTS } from 'create-gb-app/preset';

import { normalizeFlags } from '../compat';
import {
  buildCreateFileMap,
  flagsToRaw,
  isCreateFlags,
} from '../generate-files';

test('isCreateFlags rejects incomplete payloads', () => {
  expect(isCreateFlags(YES_DEFAULTS)).toBe(true);
  expect(isCreateFlags({ frontend: 'next' })).toBe(false);
  expect(isCreateFlags(null)).toBe(false);
});

test('convex preview keeps relational none and is not convex-database-off', () => {
  const flags = normalizeFlags({ ...YES_DEFAULTS, backend: 'convex' });
  expect(flagsToRaw(flags)).toEqual({
    frontend: 'next',
    backend: 'convex',
    api: 'none',
    database: 'none',
    orm: 'none',
    dbSetup: 'none',
    auth: 'better-auth',
    payments: 'none',
    linter: 'eslint',
  });
  const result = buildCreateFileMap(flags, 'convex-app');
  expect(result.ok).toBe(true);
  if (!result.ok) {
    return;
  }
  expect(result.files['convex/schema.ts']).toBeDefined();
  expect(
    result.files['components/ui/button.tsx'] ??
      result.files['src/components/ui/button.tsx']
  ).toBeDefined();
});

test('database none is a shell without notes', () => {
  const flags = normalizeFlags({
    ...YES_DEFAULTS,
    database: 'none',
    api: 'none',
  });
  const result = buildCreateFileMap(flags, 'shell-app');
  expect(result.ok).toBe(true);
  if (!result.ok) {
    return;
  }
  expect(result.files['package.json']).toContain('"name": "shell-app"');
  expect(result.files['components/ui/button.tsx']).toBeDefined();
  expect(result.files['app/notes/page.tsx']).toBeUndefined();
  expect(result.files['prisma/schema.prisma']).toBeUndefined();
});

test('api none emits notes without an RPC router', () => {
  const flags = normalizeFlags({ ...YES_DEFAULTS, api: 'none' });
  const result = buildCreateFileMap(flags, 'actions-app');
  expect(result.ok).toBe(true);
  if (!result.ok) {
    return;
  }
  expect(result.files['app/notes/actions.ts']).toContain('"use server"');
  expect(result.files['router.ts']).toBeUndefined();
});

test('default generate includes package.json', () => {
  const result = buildCreateFileMap(YES_DEFAULTS, 'my-gb-app');
  expect(result.ok).toBe(true);
  if (!result.ok) {
    return;
  }
  expect(result.files['package.json']).toContain('"name": "my-gb-app"');
  expect(Object.keys(result.files)).toContain('.gitignore');
  expect(Object.keys(result.files)).toContain('README.md');
  expect(Object.keys(result.files).length).toBe(32);
});

test('nest plus eslint is a generate gap', () => {
  const result = buildCreateFileMap(
    { ...YES_DEFAULTS, backend: 'nest' },
    'nest-app'
  );
  expect(result.ok).toBe(false);
  if (result.ok) {
    return;
  }
  expect(result.code).toBe('nest-eslint');
});
