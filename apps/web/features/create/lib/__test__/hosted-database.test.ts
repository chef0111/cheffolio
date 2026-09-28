import { expect, test } from 'bun:test';
import { YES_DEFAULTS } from 'create-gb-app/preset';

import { applyFlagChange, disabledRuleId, normalizeFlags } from '../compat';

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
