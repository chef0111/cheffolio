import { expect, test } from 'bun:test';
import { decodePreset, YES_DEFAULTS } from 'create-gb-app/preset';

import { convertNpmCommand } from '@/lib/convert-npm-command';

import { buildCommand, encodePreset, isSelectable } from '../command';
import { applyFlagChange, disabledRuleId, normalizeFlags } from '../compat';

test('default command copies --preset gb0', () => {
  expect(buildCommand(YES_DEFAULTS)).toBe(
    'npx create-gb-app my-gb-app --preset gb0'
  );
  expect(encodePreset(YES_DEFAULTS)).toBe('gb0');
  expect(decodePreset('gb0')).toEqual(YES_DEFAULTS);
});

test('custom project name is quoted in the command', () => {
  expect(buildCommand(YES_DEFAULTS, 'my app')).toBe(
    "npx create-gb-app 'my app' --preset gb0"
  );
});

test('convertNpmCommand maps the default command', () => {
  expect(convertNpmCommand('npx create-gb-app my-gb-app --preset gb0')).toEqual(
    {
      pnpm: 'pnpm create gb-app my-gb-app --preset gb0',
      yarn: 'yarn create gb-app my-gb-app --preset gb0',
      npm: 'npx create-gb-app my-gb-app --preset gb0',
      bun: 'bunx --bun create-gb-app my-gb-app --preset gb0',
    }
  );
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
    'npx create-gb-app my-gb-app --preset gb1'
  );
  expect(decodePreset('gb1').frontend).toBe('tanstack-start');
});

test('nest plus start copies a packed --preset', () => {
  const flags = applyFlagChange(
    applyFlagChange(YES_DEFAULTS, 'backend', 'nest'),
    'frontend',
    'tanstack-start'
  );
  expect(flags.linter).toBe('eslint');
  expect(flags.frontend).toBe('tanstack-start');
  expect(disabledRuleId(flags, 'api', 'trpc')).toBe('nest-trpc');
  const command = buildCommand(flags);
  expect(command.startsWith('npx create-gb-app my-gb-app --preset ')).toBe(
    true
  );
  const code = command.slice('npx create-gb-app my-gb-app --preset '.length);
  expect(decodePreset(code)).toEqual(flags);
});

test('nest copies a packed --preset', () => {
  const flags = applyFlagChange(YES_DEFAULTS, 'backend', 'nest');
  expect(flags.linter).toBe('eslint');
  expect(buildCommand(flags)).toBe('npx create-gb-app my-gb-app --preset gb2');
  expect(decodePreset('gb2')).toEqual(flags);
});

test('hono copies a packed --preset and leaves gb0 alone', () => {
  const flags = applyFlagChange(YES_DEFAULTS, 'backend', 'hono');
  expect(flags.linter).toBe('eslint');
  expect(flags.api).toBe('orpc');
  expect(buildCommand(flags)).toBe('npx create-gb-app my-gb-app --preset gb6');
  expect(decodePreset('gb6')).toEqual(flags);
  expect(buildCommand(YES_DEFAULTS)).toBe(
    'npx create-gb-app my-gb-app --preset gb0'
  );
});

test('convex copies a packed --preset with relational groups forced to none', () => {
  const flags = normalizeFlags({
    ...YES_DEFAULTS,
    backend: 'convex',
    database: 'mysql',
    api: 'trpc',
  });
  expect(flags.api).toBe('none');
  expect(flags.database).toBe('none');
  expect(flags.orm).toBe('none');
  expect(flags.dbSetup).toBe('none');
  expect(buildCommand(flags)).toBe('npx create-gb-app my-gb-app --preset gb60');
  expect(decodePreset('gb60')).toEqual(flags);
});
