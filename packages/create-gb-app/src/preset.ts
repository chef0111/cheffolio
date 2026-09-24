import { ParseError } from '#/stack/parse-error';
import { YES_DEFAULTS } from '#/stack/resolve';
import type { FlagGroup } from '#/stack/vocab';
import { FLAG_GROUPS, VOCAB_BY_GROUP } from '#/stack/vocab';
import type { PresetFields, RawFlags } from '#/types/stack';

export { YES_DEFAULTS } from '#/stack/resolve';
export type { FlagGroup } from '#/stack/vocab';
export {
  APIS,
  AUTHS,
  BACKENDS,
  DATABASES,
  DB_SETUPS,
  FLAG_GROUPS,
  FRONTENDS,
  LINTERS,
  ORMS,
  PAYMENTS,
  RELATIONAL_GROUPS,
  VOCAB_BY_GROUP,
} from '#/stack/vocab';
export type { PresetFields as CreateFlags } from '#/types/stack';
export type {
  Api,
  Auth,
  Backend,
  Database,
  DbSetup,
  Frontend,
  Linter,
  Orm,
  Payments,
  PresetFields,
  RawFlags,
} from '#/types/stack';

export type PresetCode = string;

const PRESET_PREFIX = 'gb';
const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const GOLDEN_PRESETS = {
  nest: {
    ...YES_DEFAULTS,
    backend: 'nest',
    api: 'orpc',
    linter: 'biome',
  },
  start: {
    ...YES_DEFAULTS,
    frontend: 'tanstack-start',
    api: 'trpc',
    linter: 'oxlint',
  },
  convex: {
    ...YES_DEFAULTS,
    backend: 'convex',
    api: 'none',
    database: 'none',
    orm: 'none',
    dbSetup: 'none',
  },
} as const satisfies Record<string, PresetFields>;

export type GoldenName = keyof typeof GOLDEN_PRESETS;

const ZERO = BigInt(0);
const ONE = BigInt(1);
const BASE = BigInt(62);

function fieldBits(length: number): number {
  return Math.max(1, Math.ceil(Math.log2(length)));
}

function encodeBase62(value: bigint): string {
  if (value === ZERO) {
    return '0';
  }
  const digits: string[] = [];
  let current = value;
  while (current > ZERO) {
    digits.push(BASE62[Number(current % BASE)] ?? '');
    current /= BASE;
  }
  return digits.reverse().join('');
}

function decodeBase62(payload: string): bigint {
  let value = ZERO;
  for (const char of payload) {
    const index = BASE62.indexOf(char);
    if (index < 0) {
      throw new ParseError(`invalid preset "${PRESET_PREFIX}${payload}"`);
    }
    value = value * BASE + BigInt(index);
  }
  return value;
}

export function rawFlagsFromPreset(fields: PresetFields): RawFlags {
  const raw: RawFlags = {};

  for (const group of FLAG_GROUPS) {
    const value = fields[group];
    if (value === YES_DEFAULTS[group]) {
      continue;
    }
    assignRaw(raw, group, value);
  }

  return raw;
}

export function encodePreset(fields: PresetFields): PresetCode {
  let packed = ZERO;
  let shift = 0;

  for (const group of FLAG_GROUPS) {
    const vocab = VOCAB_BY_GROUP[group];
    const bits = fieldBits(vocab.length);
    const index = (vocab as readonly string[]).indexOf(fields[group]);
    if (index < 0) {
      throw new ParseError(`unencodable ${group} "${fields[group]}"`);
    }
    packed |= BigInt(index) << BigInt(shift);
    shift += bits;
  }

  return `${PRESET_PREFIX}${encodeBase62(packed)}`;
}

export function decodePreset(code: string): PresetFields {
  if (!code.startsWith(PRESET_PREFIX)) {
    throw new ParseError(`invalid preset "${code}"`);
  }
  const payload = code.slice(PRESET_PREFIX.length);
  if (payload.length === 0 || payload !== encodeBase62(decodeBase62(payload))) {
    throw new ParseError(`invalid preset "${code}"`);
  }

  const totalBits = FLAG_GROUPS.reduce(
    (sum, group) => sum + fieldBits(VOCAB_BY_GROUP[group].length),
    0
  );
  const packed = decodeBase62(payload);
  if (packed >= ONE << BigInt(totalBits)) {
    throw new ParseError(`invalid preset "${code}"`);
  }

  const fields = {} as PresetFields;
  let shift = 0;
  for (const group of FLAG_GROUPS) {
    const vocab = VOCAB_BY_GROUP[group];
    const bits = fieldBits(vocab.length);
    const mask = (ONE << BigInt(bits)) - ONE;
    const index = Number((packed >> BigInt(shift)) & mask);
    const value = vocab[index];
    if (value === undefined) {
      throw new ParseError(`invalid preset "${code}"`);
    }
    assignField(fields, group, value);
    shift += bits;
  }

  return fields;
}

export function parsePresetToken(token: string): RawFlags {
  if (Object.hasOwn(GOLDEN_PRESETS, token)) {
    return rawFlagsFromPreset(GOLDEN_PRESETS[token as GoldenName]);
  }
  if (token.startsWith(PRESET_PREFIX)) {
    return decodePreset(token);
  }
  throw new ParseError(`unknown preset "${token}"`);
}

export function overlayRawFlags(base: RawFlags, explicit: RawFlags): RawFlags {
  const next: RawFlags = { ...base };
  for (const key of Object.keys(explicit) as Array<keyof RawFlags>) {
    if (key === 'preset') {
      continue;
    }
    const value = explicit[key];
    if (value !== undefined) {
      next[key] = value as never;
    }
  }
  if (base.preset !== undefined) {
    next.preset = base.preset;
  }
  return next;
}

function assignRaw(
  raw: RawFlags,
  group: FlagGroup,
  value: PresetFields[FlagGroup]
): void {
  assignField(raw, group, value);
}

function assignField(
  target: PresetFields | RawFlags,
  group: FlagGroup,
  value: string
): void {
  switch (group) {
    case 'frontend':
      target.frontend = value as PresetFields['frontend'];
      return;
    case 'backend':
      target.backend = value as PresetFields['backend'];
      return;
    case 'api':
      target.api = value as PresetFields['api'];
      return;
    case 'database':
      target.database = value as PresetFields['database'];
      return;
    case 'orm':
      target.orm = value as PresetFields['orm'];
      return;
    case 'dbSetup':
      target.dbSetup = value as PresetFields['dbSetup'];
      return;
    case 'auth':
      target.auth = value as PresetFields['auth'];
      return;
    case 'payments':
      target.payments = value as PresetFields['payments'];
      return;
    case 'linter':
      target.linter = value as PresetFields['linter'];
      return;
    default: {
      const _exhaustive: never = group;
      throw new Error(`unhandled group: ${_exhaustive}`);
    }
  }
}
