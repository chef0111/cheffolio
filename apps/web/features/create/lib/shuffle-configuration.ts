import {
  type CreateFlags,
  FLAG_GROUPS,
  VOCAB_BY_GROUP,
  YES_DEFAULTS,
} from 'create-gb-app/preset';

import { applyFlagChange, isOptionEnabled, normalizeFlags } from './compat';

function sameConfiguration(left: CreateFlags, right: CreateFlags): boolean {
  return FLAG_GROUPS.every((group) => left[group] === right[group]);
}

function canGenerate(flags: CreateFlags): boolean {
  return (
    flags.linter !== 'biome' &&
    !(
      flags.frontend === 'tanstack-start' &&
      flags.backend === 'self' &&
      flags.api === 'orpc'
    )
  );
}

export function shuffleConfiguration(
  current: CreateFlags,
  random: () => number = Math.random
): CreateFlags {
  for (let attempt = 0; attempt < 20; attempt++) {
    let next: CreateFlags = { ...YES_DEFAULTS };

    for (const group of FLAG_GROUPS) {
      const choices = VOCAB_BY_GROUP[group].filter((value) =>
        isOptionEnabled(next, group, value)
      );
      const value = choices[Math.floor(random() * choices.length)];
      if (value !== undefined) {
        next = applyFlagChange(next, group, value);
      }
    }

    next = normalizeFlags(next);
    if (canGenerate(next) && !sameConfiguration(current, next)) {
      return next;
    }
  }

  return normalizeFlags({
    ...current,
    linter: current.linter === 'eslint' ? 'oxlint' : 'eslint',
  });
}
