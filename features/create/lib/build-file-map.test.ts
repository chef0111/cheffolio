import { expect, test } from 'bun:test';

import { YES_DEFAULTS } from './compat';
import {
  buildCreateFileMap,
  flagsToRaw,
  isCreateFlags,
} from './generate-files';

test('isCreateFlags rejects incomplete payloads', () => {
  expect(isCreateFlags(YES_DEFAULTS)).toBe(true);
  expect(isCreateFlags({ frontend: 'next' })).toBe(false);
  expect(isCreateFlags(null)).toBe(false);
});

test('flagsToRaw omits convex relational groups', () => {
  expect(
    flagsToRaw({
      ...YES_DEFAULTS,
      backend: 'convex',
      database: 'mysql',
      api: 'trpc',
    })
  ).toEqual({
    frontend: 'next',
    backend: 'convex',
    auth: 'better-auth',
    payments: 'none',
    ui: 'shadcn',
    linter: 'eslint',
  });
});

test('default generate includes package.json', () => {
  const result = buildCreateFileMap(YES_DEFAULTS, 'my-gb-app');
  expect(result.ok).toBe(true);
  if (!result.ok) {
    return;
  }
  expect(result.files['package.json']).toContain('"name": "my-gb-app"');
  expect(Object.keys(result.files)).toContain('.gitignore');
  expect(Object.keys(result.files).length).toBe(31);
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
