import { ParseError } from '#/stack/parse-error';
import { defaultStructureForBackend, YES_DEFAULTS } from '#/stack/resolve';
import type { FlagGroup } from '#/stack/vocab';
import { FLAG_GROUPS } from '#/stack/vocab';
import type { PresetFields, RawFlags } from '#/types/stack';

export {
  databaseSetupRule,
  defaultStructureForBackend,
  YES_DEFAULTS,
} from '#/stack/resolve';
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
  PROJECT_STRUCTURES,
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
  ProjectStructure,
  RawFlags,
} from '#/types/stack';

export type PresetCode = string;

const LEGACY_PREFIX = 'gb';
const VERSIONED_PREFIX = 'gb-v1-';
const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

// These positions and values describe codes issued before preset versioning.
const LEGACY_FLAG_GROUPS = [
  'frontend',
  'backend',
  'api',
  'database',
  'orm',
  'dbSetup',
  'auth',
  'payments',
  'linter',
] as const satisfies readonly FlagGroup[];

const LEGACY_VOCAB_BY_GROUP = {
  frontend: ['next', 'tanstack-start'],
  backend: ['self', 'nest', 'convex', 'hono'],
  api: ['orpc', 'trpc', 'none'],
  database: ['postgres', 'sqlite', 'mysql', 'none'],
  orm: ['prisma', 'drizzle', 'none'],
  dbSetup: ['none', 'docker', 'neon', 'supabase'],
  auth: ['better-auth', 'clerk', 'none'],
  payments: ['none', 'stripe', 'polar'],
  linter: ['eslint', 'biome', 'oxlint'],
} as const satisfies Record<
  (typeof LEGACY_FLAG_GROUPS)[number],
  readonly string[]
>;

// Version 1 assigns stable bytes; slots 10 and 11 remain reserved.
const VERSIONED_FLAG_GROUPS = [
  'frontend',
  'backend',
  'api',
  'database',
  'orm',
  'dbSetup',
  'auth',
  'payments',
  'linter',
] as const satisfies readonly FlagGroup[];
const VERSIONED_VOCAB_BY_GROUP = {
  frontend: ['next', 'tanstack-start'],
  backend: ['self', 'nest', 'convex', 'hono'],
  api: ['orpc', 'trpc', 'none'],
  database: ['postgres', 'sqlite', 'mysql', 'none'],
  orm: ['prisma', 'drizzle', 'none'],
  dbSetup: ['none', 'docker', 'neon', 'supabase'],
  auth: ['better-auth', 'clerk', 'none'],
  payments: ['none', 'stripe', 'polar'],
  linter: ['eslint', 'biome', 'oxlint'],
} as const satisfies Record<
  (typeof VERSIONED_FLAG_GROUPS)[number],
  readonly string[]
>;
const VERSIONED_SLOT_COUNT = 12;
const VERSIONED_SLOT_BITS = BigInt(8);
const STRUCTURE_SLOT = 9;

export const GOLDEN_PRESETS = {
  nest: {
    ...YES_DEFAULTS,
    backend: 'nest',
    structure: 'turborepo',
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

function decodeBase62(payload: string, code: string): bigint {
  let value = ZERO;
  for (const char of payload) {
    const index = BASE62.indexOf(char);
    if (index < 0) {
      throw new ParseError(`invalid preset "${code}"`);
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

  for (const [slot, group] of VERSIONED_FLAG_GROUPS.entries()) {
    const vocab = VERSIONED_VOCAB_BY_GROUP[group];
    const index = (vocab as readonly string[]).indexOf(fields[group]);
    if (index < 0) {
      throw new ParseError(`unencodable ${group} "${fields[group]}"`);
    }
    packed |= BigInt(index) << (BigInt(slot) * VERSIONED_SLOT_BITS);
  }

  const historical = defaultStructureForBackend(fields.backend);
  const structureId =
    fields.structure === historical
      ? 0
      : fields.structure === 'turborepo'
        ? 1
        : fields.structure === 'single'
          ? 2
          : -1;
  if (structureId < 0) {
    throw new ParseError(`unencodable structure "${fields.structure}"`);
  }
  packed |=
    BigInt(structureId) << (BigInt(STRUCTURE_SLOT) * VERSIONED_SLOT_BITS);

  return `${VERSIONED_PREFIX}${encodeBase62(packed)}`;
}

export function decodePreset(code: string): PresetFields {
  if (code.startsWith(VERSIONED_PREFIX)) {
    return decodeVersionedPreset(code);
  }
  if (/^gb-v\d+-/.test(code)) {
    throw new ParseError(`unsupported preset version "${code}"`);
  }
  if (!code.startsWith(LEGACY_PREFIX)) {
    throw new ParseError(`invalid preset "${code}"`);
  }
  const packed = parsePayload(code.slice(LEGACY_PREFIX.length), code);

  const totalBits = LEGACY_FLAG_GROUPS.reduce(
    (sum, group) => sum + fieldBits(LEGACY_VOCAB_BY_GROUP[group].length),
    0
  );
  if (packed >= ONE << BigInt(totalBits)) {
    throw new ParseError(`invalid preset "${code}"`);
  }

  const fields = {} as PresetFields;
  let shift = 0;
  for (const group of LEGACY_FLAG_GROUPS) {
    const vocab = LEGACY_VOCAB_BY_GROUP[group];
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

  fields.structure = defaultStructureForBackend(fields.backend);

  return fields;
}

function parsePayload(payload: string, code: string): bigint {
  if (payload.length === 0 || payload.length > 17) {
    throw new ParseError(`invalid preset "${code}"`);
  }
  const packed = decodeBase62(payload, code);
  if (payload !== encodeBase62(packed)) {
    throw new ParseError(`invalid preset "${code}"`);
  }
  return packed;
}

function decodeVersionedPreset(code: string): PresetFields {
  const packed = parsePayload(code.slice(VERSIONED_PREFIX.length), code);
  if (packed >= ONE << (BigInt(VERSIONED_SLOT_COUNT) * VERSIONED_SLOT_BITS)) {
    throw new ParseError(`invalid preset "${code}"`);
  }
  // Unassigned slots must be zero until a later schema defines their meaning.
  if (packed >> (BigInt(STRUCTURE_SLOT + 1) * VERSIONED_SLOT_BITS)) {
    throw new ParseError(`invalid preset "${code}"`);
  }

  const fields = {} as PresetFields;
  for (const [slot, group] of VERSIONED_FLAG_GROUPS.entries()) {
    const vocab = VERSIONED_VOCAB_BY_GROUP[group];
    const index = Number(
      (packed >> (BigInt(slot) * VERSIONED_SLOT_BITS)) & BigInt(255)
    );
    const value = vocab[index];
    if (value === undefined) {
      throw new ParseError(`invalid preset "${code}"`);
    }
    assignField(fields, group, value);
  }

  const structureId = Number(
    (packed >> (BigInt(STRUCTURE_SLOT) * VERSIONED_SLOT_BITS)) & BigInt(255)
  );
  switch (structureId) {
    case 0:
      fields.structure = defaultStructureForBackend(fields.backend);
      break;
    case 1:
      fields.structure = 'turborepo';
      break;
    case 2:
      fields.structure = 'single';
      break;
    default:
      throw new ParseError(`invalid preset "${code}"`);
  }

  return fields;
}

export function parsePresetToken(token: string): RawFlags {
  if (Object.hasOwn(GOLDEN_PRESETS, token)) {
    return rawFlagsFromPreset(GOLDEN_PRESETS[token as GoldenName]);
  }
  if (token.startsWith(LEGACY_PREFIX)) {
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
    case 'structure':
      target.structure = value as PresetFields['structure'];
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
