import type { FlagGroup, StudioFlags } from '../types/stack';
import { isOptionEnabled, isRelationalGroup, YES_DEFAULTS } from './compat';

export const PROJECT_NAME = 'my-app';
export const DEFAULT_COMMAND = 'npx create-gb-app my-app --yes';

const CLI_FLAGS: { key: FlagGroup; flag: string }[] = [
  { key: 'frontend', flag: '--frontend' },
  { key: 'backend', flag: '--backend' },
  { key: 'api', flag: '--api' },
  { key: 'database', flag: '--database' },
  { key: 'orm', flag: '--orm' },
  { key: 'dbSetup', flag: '--db-setup' },
  { key: 'auth', flag: '--auth' },
  { key: 'payments', flag: '--payments' },
  { key: 'ui', flag: '--ui' },
  { key: 'linter', flag: '--linter' },
];

export function buildCommand(flags: StudioFlags): string {
  const parts = ['npx', 'create-gb-app', PROJECT_NAME, '--yes'];

  for (const { key, flag } of CLI_FLAGS) {
    if (flags.backend === 'convex' && isRelationalGroup(key)) {
      continue;
    }
    const value = flags[key];
    if (value === YES_DEFAULTS[key]) {
      continue;
    }
    parts.push(flag, value);
  }

  return parts.join(' ');
}

export function isSelectable(
  flags: StudioFlags,
  group: FlagGroup,
  value: string
): boolean {
  return isOptionEnabled(flags, group, value);
}
