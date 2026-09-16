import { expect, test } from 'bun:test';

import compat from '../data/compat.json';
import type { FlagGroup, StudioFlags } from '../types/stack';
import { buildCommand } from './command';
import {
  disabledRuleId,
  isGroupVisible,
  RULE_IDS,
  type RuleId,
  YES_DEFAULTS,
} from './compat';

test('vendored yesDefault is the picker default', () => {
  const { monorepo: _, ...flags } = compat.yesDefault;
  expect(flags).toEqual(YES_DEFAULTS);
});

for (const legal of compat.legal) {
  test(legal.name, () => {
    const flags = { ...YES_DEFAULTS, ...legal.flags } as StudioFlags;
    if (legal.flags.backend === 'nest') {
      expect(buildCommand(flags)).toBe(
        'npx create-gb-app my-app --yes --backend nest'
      );
      return;
    }
    if (legal.flags.backend === 'convex') {
      expect(buildCommand(flags)).toBe(
        'npx create-gb-app my-app --yes --backend convex'
      );
      expect(isGroupVisible(flags, 'api')).toBe(false);
      expect(isGroupVisible(flags, 'database')).toBe(false);
      return;
    }
    throw new Error(`unhandled legal backend ${String(legal.flags.backend)}`);
  });
}

function convexHideGroup(ruleId: RuleId): FlagGroup {
  switch (ruleId) {
    case RULE_IDS.convexApiOff:
      return 'api';
    case RULE_IDS.convexDatabaseOff:
      return 'database';
    case RULE_IDS.convexOrmOff:
      return 'orm';
    case RULE_IDS.convexDbSetupOff:
      return 'dbSetup';
    case RULE_IDS.nestRequiresOrpc:
    case RULE_IDS.polarRequiresBetterAuth:
    case RULE_IDS.paymentsRequireAuth:
    case RULE_IDS.sqliteDockerForbidden:
    case RULE_IDS.neonRequiresPostgres:
    case RULE_IDS.supabaseRequiresPostgres:
    case RULE_IDS.clerkPolarForbidden:
      throw new Error(`not a convex hide rule: ${ruleId}`);
    default: {
      const _exhaustive: never = ruleId;
      throw new Error(`unhandled ruleId: ${_exhaustive}`);
    }
  }
}

for (const illegal of compat.illegal) {
  test(illegal.name, () => {
    const ruleId = illegal.ruleId as RuleId;
    switch (ruleId) {
      case RULE_IDS.nestRequiresOrpc:
        expect(
          disabledRuleId({ ...YES_DEFAULTS, backend: 'nest' }, 'api', 'trpc')
        ).toBe(ruleId);
        return;
      case RULE_IDS.polarRequiresBetterAuth:
        expect(
          disabledRuleId({ ...YES_DEFAULTS, auth: 'none' }, 'payments', 'polar')
        ).toBe(ruleId);
        return;
      case RULE_IDS.paymentsRequireAuth:
        expect(
          disabledRuleId(
            { ...YES_DEFAULTS, auth: 'none' },
            'payments',
            'stripe'
          )
        ).toBe(ruleId);
        return;
      case RULE_IDS.convexDatabaseOff:
      case RULE_IDS.convexApiOff:
      case RULE_IDS.convexOrmOff:
      case RULE_IDS.convexDbSetupOff: {
        const flags = { ...YES_DEFAULTS, backend: 'convex' as const };
        const group = convexHideGroup(ruleId);
        expect(isGroupVisible(flags, group)).toBe(false);
        expect(disabledRuleId(flags, group, YES_DEFAULTS[group])).toBe(ruleId);
        return;
      }
      case RULE_IDS.sqliteDockerForbidden:
        expect(
          disabledRuleId(
            { ...YES_DEFAULTS, database: 'sqlite' },
            'dbSetup',
            'docker'
          )
        ).toBe(ruleId);
        return;
      case RULE_IDS.neonRequiresPostgres:
        expect(
          disabledRuleId(
            { ...YES_DEFAULTS, dbSetup: 'neon' },
            'database',
            'mysql'
          )
        ).toBe(ruleId);
        return;
      case RULE_IDS.supabaseRequiresPostgres:
        expect(
          disabledRuleId(
            { ...YES_DEFAULTS, dbSetup: 'supabase' },
            'database',
            'mysql'
          )
        ).toBe(ruleId);
        return;
      case RULE_IDS.clerkPolarForbidden:
        expect(
          disabledRuleId(
            { ...YES_DEFAULTS, auth: 'clerk' },
            'payments',
            'polar'
          )
        ).toBe(ruleId);
        return;
      default: {
        const _exhaustive: never = ruleId;
        throw new Error(`unhandled vendored ruleId: ${_exhaustive}`);
      }
    }
  });
}
