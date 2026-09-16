import { expect, test } from 'bun:test';

import compat from '../data/compat.json';
import { FLAG_GROUPS, type FlagGroup, type StudioFlags } from '../types/stack';
import { buildCommand } from './command';
import {
  disabledRuleId,
  isGroupVisible,
  isRelationalGroup,
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
    for (const group of FLAG_GROUPS) {
      if (!(group in legal.stack)) {
        continue;
      }
      if (!isGroupVisible(flags, group)) {
        continue;
      }
      expect(flags[group]).toBe(legal.stack[group as keyof typeof legal.stack]);
    }

    const command = buildCommand(flags);
    expect(command.startsWith('npx create-gb-app my-app --yes')).toBe(true);
    for (const [key, value] of Object.entries(legal.flags)) {
      if (key === 'backend' && value !== YES_DEFAULTS.backend) {
        expect(command).toContain(`--backend ${value}`);
      }
    }
  });
}

for (const illegal of compat.illegal) {
  test(illegal.name, () => {
    const patch = illegal.flags as Partial<StudioFlags>;
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
      } as StudioFlags;
      return disabledRuleId(probe, group, value);
    });
    expect(hits).toContain(illegal.ruleId as RuleId);

    const flags = { ...YES_DEFAULTS, ...patch } as StudioFlags;
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
