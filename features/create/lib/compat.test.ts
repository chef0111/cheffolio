import { expect, test } from 'bun:test';

import compat from '../data/compat.json';
import { type CreateFlags, FLAG_GROUPS, type FlagGroup } from '../types/stack';
import { buildCommand } from './command';
import {
  applyFlagChange,
  disabledRuleId,
  isGroupVisible,
  isRelationalGroup,
  normalizeFlags,
  type RuleId,
  YES_DEFAULTS,
} from './compat';

test('vendored yesDefault is the picker default', () => {
  const { monorepo, ...flags } = compat.yesDefault;
  expect(monorepo).toBe(false);
  expect(flags).toEqual(YES_DEFAULTS);
});

test('nest plus default eslint side-effects to biome', () => {
  const next = applyFlagChange(YES_DEFAULTS, 'backend', 'nest');
  expect(next).toEqual({
    ...YES_DEFAULTS,
    backend: 'nest',
    linter: 'biome',
  });
  expect(normalizeFlags({ ...YES_DEFAULTS, backend: 'nest' })).toEqual(next);
  expect(disabledRuleId(next, 'linter', 'eslint')).toBe('nest-eslint');
  expect(disabledRuleId(next, 'linter', 'biome')).toBeNull();
  expect(disabledRuleId(next, 'linter', 'oxlint')).toBe('nest-oxlint');
});

test('nest plus oxlint side-effects to biome', () => {
  const next = applyFlagChange(
    { ...YES_DEFAULTS, linter: 'oxlint' },
    'backend',
    'nest'
  );
  expect(next.linter).toBe('biome');
  expect(
    normalizeFlags({ ...YES_DEFAULTS, backend: 'nest', linter: 'oxlint' })
  ).toEqual(next);
});

for (const legal of compat.legal) {
  test(legal.name, () => {
    const flags = { ...YES_DEFAULTS, ...legal.flags } as CreateFlags;
    for (const group of FLAG_GROUPS) {
      if (!(group in legal.stack)) {
        continue;
      }
      if (!isGroupVisible(flags, group)) {
        continue;
      }
      const expected = legal.stack[group as keyof typeof legal.stack];
      if (typeof expected !== 'string') {
        continue;
      }
      expect(flags[group] as string).toBe(expected);
    }

    const command = buildCommand(flags);
    expect(command.startsWith('npx create-gb-app my-gb-app')).toBe(true);
    expect(command).not.toContain('--yes');
    if (Object.keys(legal.flags).length > 0) {
      expect(command).toContain('--preset');
    }
  });
}

for (const illegal of compat.illegal) {
  test(illegal.name, () => {
    const patch = illegal.flags as Partial<CreateFlags>;
    const groups = (Object.keys(patch) as FlagGroup[]).filter(
      (group) => patch[group] !== undefined
    );
    expect(groups.length).toBeGreaterThan(0);

    const hits = groups.map((group) => {
      const value = patch[group];
      if (value === undefined) {
        return null;
      }
      const probe = {
        ...YES_DEFAULTS,
        ...patch,
        [group]: YES_DEFAULTS[group],
      } as CreateFlags;
      return disabledRuleId(probe, group, value);
    });
    expect(hits).toContain(illegal.ruleId as RuleId);

    const flags = { ...YES_DEFAULTS, ...patch } as CreateFlags;
    if (flags.backend !== 'convex') {
      return;
    }
    for (const group of groups) {
      if (!isRelationalGroup(group)) {
        continue;
      }
      expect(isGroupVisible(flags, group)).toBe(false);
    }
  });
}
