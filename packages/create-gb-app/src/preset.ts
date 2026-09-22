import { ParseError } from "#/stack/parse-error";
import { YES_DEFAULTS } from "#/stack/resolve";
import type { FlagGroup } from "#/stack/vocab";
import {
  FLAG_GROUPS,
  RELATIONAL_GROUPS,
  VOCAB_BY_GROUP,
} from "#/stack/vocab";
import type { PresetFields, RawFlags } from "#/stack/types";

export type PresetCode = string & { readonly __presetVersion: "g1" };

const PRESET_PREFIX = "g1";

const RELATIONAL_SET = new Set<string>(RELATIONAL_GROUPS);

export const GOLDEN_PRESETS = {
  nest: {
    ...YES_DEFAULTS,
    backend: "nest",
    api: "orpc",
    linter: "biome",
  },
  start: {
    ...YES_DEFAULTS,
    frontend: "tanstack-start",
    api: "trpc",
    linter: "oxlint",
  },
  convex: {
    ...YES_DEFAULTS,
    backend: "convex",
  },
} as const satisfies Record<string, PresetFields>;

export type GoldenName = keyof typeof GOLDEN_PRESETS;

export function rawFlagsFromPreset(fields: PresetFields): RawFlags {
  const raw: RawFlags = {};
  const omitRelational = fields.backend === "convex";

  for (const group of FLAG_GROUPS) {
    if (omitRelational && RELATIONAL_SET.has(group)) {
      continue;
    }
    const value = fields[group];
    if (value === YES_DEFAULTS[group]) {
      continue;
    }
    assignRaw(raw, group, value);
  }

  return raw;
}

export function encodePreset(fields: PresetFields): PresetCode | null {
  const sparse = rawFlagsFromPreset(fields);
  const pairs: string[] = [];

  for (let groupIndex = 0; groupIndex < FLAG_GROUPS.length; groupIndex++) {
    const group = FLAG_GROUPS[groupIndex];
    const value = sparse[group];
    if (value === undefined) {
      continue;
    }
    const vocab = VOCAB_BY_GROUP[group];
    const valueIndex = (vocab as readonly string[]).indexOf(value);
    if (valueIndex < 0) {
      throw new ParseError(`unencodable ${group} "${value}"`);
    }
    pairs.push(`${groupIndex}${valueIndex}`);
  }

  if (pairs.length === 0) {
    return null;
  }

  return `${PRESET_PREFIX}${pairs.join("")}` as PresetCode;
}

export function decodePreset(code: string): RawFlags {
  if (!code.startsWith(PRESET_PREFIX)) {
    throw new ParseError(`invalid preset "${code}"`);
  }
  const payload = code.slice(PRESET_PREFIX.length);
  if (payload.length === 0 || payload.length % 2 !== 0) {
    throw new ParseError(`invalid preset "${code}"`);
  }

  const raw: RawFlags = {};
  for (let i = 0; i < payload.length; i += 2) {
    const groupDigit = payload[i];
    const valueDigit = payload[i + 1];
    if (
      groupDigit < "0" ||
      groupDigit > "9" ||
      valueDigit < "0" ||
      valueDigit > "9"
    ) {
      throw new ParseError(`invalid preset "${code}"`);
    }
    const groupIndex = Number(groupDigit);
    const valueIndex = Number(valueDigit);
    if (groupIndex >= FLAG_GROUPS.length) {
      throw new ParseError(`invalid preset "${code}"`);
    }
    const group = FLAG_GROUPS[groupIndex];
    const vocab = VOCAB_BY_GROUP[group];
    const value = vocab[valueIndex];
    if (value === undefined) {
      throw new ParseError(`invalid preset "${code}"`);
    }
    assignRaw(raw, group, value);
  }

  return raw;
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
    if (key === "preset") {
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
  value: PresetFields[FlagGroup],
): void {
  switch (group) {
    case "frontend":
      raw.frontend = value as PresetFields["frontend"];
      return;
    case "backend":
      raw.backend = value as PresetFields["backend"];
      return;
    case "api":
      raw.api = value as PresetFields["api"];
      return;
    case "database":
      raw.database = value as PresetFields["database"];
      return;
    case "orm":
      raw.orm = value as PresetFields["orm"];
      return;
    case "dbSetup":
      raw.dbSetup = value as PresetFields["dbSetup"];
      return;
    case "auth":
      raw.auth = value as PresetFields["auth"];
      return;
    case "payments":
      raw.payments = value as PresetFields["payments"];
      return;
    case "ui":
      raw.ui = value as PresetFields["ui"];
      return;
    case "linter":
      raw.linter = value as PresetFields["linter"];
      return;
    default: {
      const _exhaustive: never = group;
      throw new Error(`unhandled group: ${_exhaustive}`);
    }
  }
}
