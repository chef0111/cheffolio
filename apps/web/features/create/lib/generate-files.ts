import 'server-only';

import {
  buildTree,
  CompatError,
  GenerateError,
  type RawFlags,
  resolveStack,
} from 'create-gb-app/generate';
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
} from 'create-gb-app/preset';

import { resolveProjectName } from './command';

const VOCAB: Record<FlagGroup, ReadonlySet<string>> = {
  frontend: new Set(FRONTENDS),
  backend: new Set(BACKENDS),
  api: new Set(APIS),
  database: new Set(DATABASES),
  orm: new Set(ORMS),
  dbSetup: new Set(DB_SETUPS),
  auth: new Set(AUTHS),
  payments: new Set(PAYMENTS),
  linter: new Set(LINTERS),
};

export function isCreateFlags(value: unknown): value is CreateFlags {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  for (const group of FLAG_GROUPS) {
    const current = record[group];
    if (typeof current !== 'string' || !VOCAB[group].has(current)) {
      return false;
    }
  }
  return true;
}

export type CreateFileMapResult =
  | { ok: true; files: Record<string, string> }
  | { ok: false; message: string; code: string };

export function flagsToRaw(flags: CreateFlags): RawFlags {
  return {
    frontend: flags.frontend,
    backend: flags.backend,
    api: flags.api,
    database: flags.database,
    orm: flags.orm,
    dbSetup: flags.dbSetup,
    auth: flags.auth,
    payments: flags.payments,
    linter: flags.linter,
  };
}

export function buildCreateFileMap(
  flags: CreateFlags,
  projectName: string
): CreateFileMapResult {
  try {
    const files = buildTree(resolveStack(flagsToRaw(flags)), {
      projectName: resolveProjectName(projectName),
      packageManager: 'bun',
    });
    return { ok: true, files };
  } catch (error) {
    if (error instanceof GenerateError) {
      return { ok: false, message: error.message, code: error.code };
    }
    if (error instanceof CompatError) {
      return { ok: false, message: error.message, code: error.ruleId };
    }
    const message = error instanceof Error ? error.message : 'generate failed';
    return { ok: false, message, code: 'unknown' };
  }
}
