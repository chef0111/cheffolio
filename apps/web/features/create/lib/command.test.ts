import { expect, test } from 'bun:test';

import { convertNpmCommand } from '@/lib/convert-npm-command';

import { buildCommand, encodePreset, isSelectable } from './command';
import { applyFlagChange, YES_DEFAULTS } from './compat';

test('default command omits --yes and --preset', () => {
  expect(buildCommand(YES_DEFAULTS)).toBe('npx create-gb-app my-gb-app');
  expect(encodePreset(YES_DEFAULTS)).toBeNull();
});

test('custom project name is quoted in the command', () => {
  expect(buildCommand(YES_DEFAULTS, 'my app')).toBe(
    "npx create-gb-app 'my app'"
  );
});

test('convertNpmCommand maps the default command', () => {
  expect(convertNpmCommand('npx create-gb-app my-gb-app')).toEqual({
    pnpm: 'pnpm create gb-app my-gb-app',
    yarn: 'yarn create gb-app my-gb-app',
    npm: 'npx create-gb-app my-gb-app',
    bun: 'bunx --bun create-gb-app my-gb-app',
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

test('tanstack-start copies a packed --preset', () => {
  expect(buildCommand({ ...YES_DEFAULTS, frontend: 'tanstack-start' })).toBe(
    'npx create-gb-app my-gb-app --preset g101'
  );
});

test('nest copies a packed --preset', () => {
  expect(buildCommand(applyFlagChange(YES_DEFAULTS, 'backend', 'nest'))).toBe(
    'npx create-gb-app my-gb-app --preset g11191'
  );
});

test('convex copies a packed --preset without relational flags', () => {
  expect(
    buildCommand({
      ...YES_DEFAULTS,
      backend: 'convex',
      database: 'mysql',
      api: 'trpc',
    })
  ).toBe('npx create-gb-app my-gb-app --preset g112');
});
