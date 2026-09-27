import { expect, test } from 'bun:test';
import { YES_DEFAULTS } from 'create-gb-app/preset';

import { applyFlagChange, disabledRuleId, normalizeFlags } from '../compat';
import { getDatabaseSetupGuidance } from '../database-setup-guidance';

test('Create enforces hosted engine constraints and clears hosts when prerequisites change', () => {
  expect(disabledRuleId(YES_DEFAULTS, 'dbSetup', 'turso')).toBe(
    'turso-requires-sqlite'
  );
  expect(
    disabledRuleId(
      { ...YES_DEFAULTS, database: 'sqlite' },
      'dbSetup',
      'planetscale'
    )
  ).toBe('planetscale-requires-postgres-or-mysql');
  expect(
    disabledRuleId(
      { ...YES_DEFAULTS, database: 'mysql' },
      'dbSetup',
      'prisma-postgres'
    )
  ).toBe('prisma-postgres-requires-postgres');
  expect(
    applyFlagChange(
      { ...YES_DEFAULTS, database: 'sqlite', dbSetup: 'turso' },
      'database',
      'postgres'
    ).dbSetup
  ).toBe('none');
  expect(
    normalizeFlags({ ...YES_DEFAULTS, database: 'mysql', dbSetup: 'turso' })
      .dbSetup
  ).toBe('none');
});

test('hosted setup guidance uses manager commands from the root and names the actual owner', () => {
  const [turso] = getDatabaseSetupGuidance(
    {
      ...YES_DEFAULTS,
      database: 'sqlite',
      dbSetup: 'turso',
      structure: 'turborepo',
    },
    'pnpm'
  );
  expect(turso.description).toContain('apps/web/.env');
  expect(turso.commands).toEqual([
    'pnpm run db:generate',
    'pnpm run db:migrate',
  ]);
  const [postgres] = getDatabaseSetupGuidance(
    {
      ...YES_DEFAULTS,
      backend: 'hono',
      dbSetup: 'prisma-postgres',
      structure: 'turborepo',
      orm: 'drizzle',
    },
    'yarn'
  );
  expect(postgres.description).toContain('apps/server/.env');
  expect(postgres.description).toContain('DIRECT_URL');
  expect(postgres.commands).toEqual(['yarn run db:push']);
});
