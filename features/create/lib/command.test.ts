import { expect, test } from 'bun:test';

import { convertNpmCommand } from '@/lib/convert-npm-command';

import { buildCommand, isSelectable } from './command';
import { YES_DEFAULTS } from './compat';

test('literal --yes command', () => {
  expect(buildCommand(YES_DEFAULTS)).toBe('npx create-gb-app my-app --yes');
});

test('custom project name is quoted in the command', () => {
  expect(buildCommand(YES_DEFAULTS, 'my app')).toBe(
    "npx create-gb-app 'my app' --yes"
  );
});

test('convertNpmCommand maps the default command', () => {
  expect(convertNpmCommand('npx create-gb-app my-app --yes')).toEqual({
    pnpm: 'pnpm create gb-app my-app --yes',
    yarn: 'yarn create gb-app my-app --yes',
    npm: 'npx create-gb-app my-app --yes',
    bun: 'bunx --bun create-gb-app my-app --yes',
  });
});

test('polar plus clerk is not selectable', () => {
  expect(
    isSelectable({ ...YES_DEFAULTS, auth: 'clerk' }, 'payments', 'polar')
  ).toBe(false);
  expect(
    isSelectable({ ...YES_DEFAULTS, payments: 'polar' }, 'auth', 'clerk')
  ).toBe(false);
});

test('nest adds --backend nest', () => {
  expect(buildCommand({ ...YES_DEFAULTS, backend: 'nest' })).toBe(
    'npx create-gb-app my-app --yes --backend nest'
  );
});

test('convex adds --backend convex without database flags', () => {
  expect(
    buildCommand({
      ...YES_DEFAULTS,
      backend: 'convex',
      database: 'mysql',
      api: 'trpc',
    })
  ).toBe('npx create-gb-app my-app --yes --backend convex');
});
