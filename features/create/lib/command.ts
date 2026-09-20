import {
  APIS,
  AUTHS,
  BACKENDS,
  type CreateFlags,
  DATABASES,
  DB_SETUPS,
  FLAG_GROUPS,
  type FlagGroup,
  FRONTENDS,
  LINTERS,
  ORMS,
  PAYMENTS,
  UIS,
} from '../types/stack';
import { isOptionEnabled, isRelationalGroup, YES_DEFAULTS } from './compat';

export const DEFAULT_PROJECT_NAME = 'my-gb-app';
export const DEFAULT_COMMAND = 'npx create-gb-app my-gb-app';

const PRESET_PREFIX = 'g1';

const VOCAB_BY_GROUP: Record<FlagGroup, readonly string[]> = {
  frontend: FRONTENDS,
  backend: BACKENDS,
  api: APIS,
  database: DATABASES,
  orm: ORMS,
  dbSetup: DB_SETUPS,
  auth: AUTHS,
  payments: PAYMENTS,
  ui: UIS,
  linter: LINTERS,
};

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

export function encodePreset(flags: CreateFlags): string | null {
  const pairs: string[] = [];

  for (let groupIndex = 0; groupIndex < FLAG_GROUPS.length; groupIndex += 1) {
    const group = FLAG_GROUPS[groupIndex];
    if (flags.backend === 'convex' && isRelationalGroup(group)) {
      continue;
    }
    const value = flags[group];
    if (value === YES_DEFAULTS[group]) {
      continue;
    }
    const valueIndex = VOCAB_BY_GROUP[group].indexOf(value);
    if (valueIndex < 0) {
      continue;
    }
    pairs.push(`${groupIndex}${valueIndex}`);
  }

  if (pairs.length === 0) {
    return null;
  }

  return `${PRESET_PREFIX}${pairs.join('')}`;
}

export function buildCommand(
  flags: CreateFlags,
  projectName = DEFAULT_PROJECT_NAME
): string {
  const dir = shellQuote(resolveProjectName(projectName));
  const parts = ['npx', 'create-gb-app', dir];
  const preset = encodePreset(flags);
  if (preset) {
    parts.push('--preset', preset);
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
