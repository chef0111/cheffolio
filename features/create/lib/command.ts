import type { CreateFlags, FlagGroup } from '../types/stack';
import { isOptionEnabled, isRelationalGroup, YES_DEFAULTS } from './compat';

export const DEFAULT_PROJECT_NAME = 'my-gb-app';
export const DEFAULT_COMMAND = 'npx create-gb-app my-gb-app --yes';

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

export function resolveProjectName(name: string): string {
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed : DEFAULT_PROJECT_NAME;
}

function shellQuote(value: string): string {
  if (/^[A-Za-z0-9._@/=+-]+$/.test(value)) {
    return value;
  }
  return `'${value.replaceAll("'", `'\\''`)}'`;
}

export function buildCommand(
  flags: CreateFlags,
  projectName = DEFAULT_PROJECT_NAME
): string {
  const dir = shellQuote(resolveProjectName(projectName));
  const parts = ['npx', 'create-gb-app', dir, '--yes'];

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
  flags: CreateFlags,
  group: FlagGroup,
  value: string
): boolean {
  return isOptionEnabled(flags, group, value);
}
