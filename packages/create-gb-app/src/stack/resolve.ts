import type {
  Auth,
  Database,
  DbSetup,
  Payments,
  PresetFields,
  ProjectStructure,
  RawFlags,
  Stack,
} from '#/types/stack';

import { CompatError, RULE_IDS } from './errors';

export const YES_DEFAULTS = {
  frontend: 'next',
  backend: 'self',
  structure: 'single',
  api: 'orpc',
  database: 'postgres',
  orm: 'prisma',
  dbSetup: 'none',
  auth: 'better-auth',
  payments: 'none',
  linter: 'eslint',
} as const satisfies PresetFields;

export function defaultStructureForBackend(
  backend: PresetFields['backend']
): ProjectStructure {
  return backend === 'nest' || backend === 'hono' ? 'turborepo' : 'single';
}

function assertPayments(auth: Auth, payments: Payments): void {
  if (auth === 'clerk' && payments === 'polar') {
    throw new CompatError(RULE_IDS.clerkPolarForbidden);
  }
  if (payments === 'polar' && auth !== 'better-auth') {
    throw new CompatError(RULE_IDS.polarRequiresBetterAuth);
  }
  if (payments !== 'none' && auth === 'none') {
    throw new CompatError(RULE_IDS.paymentsRequireAuth);
  }
}

export function databaseSetupRule(
  database: string,
  dbSetup: string
): (typeof RULE_IDS)[keyof typeof RULE_IDS] | null {
  if (database === 'none' && dbSetup !== 'none')
    return RULE_IDS.dbSetupRequiresDatabase;
  if (database === 'sqlite' && dbSetup === 'docker')
    return RULE_IDS.sqliteDockerForbidden;
  if (dbSetup === 'neon' && database !== 'postgres')
    return RULE_IDS.neonRequiresPostgres;
  if (dbSetup === 'supabase' && database !== 'postgres')
    return RULE_IDS.supabaseRequiresPostgres;
  return null;
}

function assertDbSetup(database: Database, dbSetup: DbSetup): void {
  const rule = databaseSetupRule(database, dbSetup);
  if (rule) throw new CompatError(rule);
}

function assertOrm(database: Database, orm: PresetFields['orm']): void {
  if (database === 'none' && orm !== 'none') {
    throw new CompatError(RULE_IDS.ormRequiresDatabase);
  }
  if (database !== 'none' && orm === 'none') {
    throw new CompatError(RULE_IDS.databaseRequiresOrm);
  }
}

function rejectUnlessNone(
  value: string | undefined,
  ruleId: (typeof RULE_IDS)[keyof typeof RULE_IDS]
): void {
  if (value !== undefined && value !== 'none') {
    throw new CompatError(ruleId);
  }
}

export function resolveStack(raw: RawFlags): Stack {
  const frontend = raw.frontend ?? YES_DEFAULTS.frontend;
  const backend = raw.backend ?? YES_DEFAULTS.backend;
  const structure = raw.structure ?? defaultStructureForBackend(backend);
  const auth = raw.auth ?? YES_DEFAULTS.auth;
  const payments = raw.payments ?? YES_DEFAULTS.payments;
  const linter = raw.linter ?? YES_DEFAULTS.linter;

  if ((backend === 'nest' || backend === 'hono') && structure !== 'turborepo') {
    throw new CompatError(RULE_IDS.backendRequiresTurborepo);
  }

  if ((backend === 'self' || backend === 'convex') && structure === 'turborepo') {
    throw new CompatError(RULE_IDS.optionalTurborepoUnavailable);
  }

  if (backend === 'convex') {
    rejectUnlessNone(raw.database, RULE_IDS.convexDatabaseOff);
    rejectUnlessNone(raw.api, RULE_IDS.convexApiOff);
    rejectUnlessNone(raw.orm, RULE_IDS.convexOrmOff);
    rejectUnlessNone(raw.dbSetup, RULE_IDS.convexDbSetupOff);
    assertPayments(auth, payments);
    return {
      frontend,
      backend: 'convex',
      auth,
      payments,
      linter,
      structure,
    };
  }

  const api = raw.api ?? YES_DEFAULTS.api;
  const database = raw.database ?? YES_DEFAULTS.database;
  const orm = raw.orm ?? (database === 'none' ? 'none' : YES_DEFAULTS.orm);
  const dbSetup =
    raw.dbSetup ?? (database === 'none' ? 'none' : YES_DEFAULTS.dbSetup);

  assertPayments(auth, payments);
  assertOrm(database, orm);
  assertDbSetup(database, dbSetup);
  if (auth === 'better-auth' && database === 'none') {
    throw new CompatError(RULE_IDS.betterAuthRequiresDatabase);
  }

  if (backend === 'nest' || backend === 'hono') {
    return {
      frontend,
      backend,
      api,
      database,
      orm,
      dbSetup,
      auth,
      payments,
      linter,
      structure: 'turborepo',
    };
  }

  if (backend === 'self') {
    return {
      frontend,
      backend: 'self',
      api,
      database,
      orm,
      dbSetup,
      auth,
      payments,
      linter,
      structure,
    };
  }

  const _exhaustive: never = backend;
  throw new Error(`unhandled backend: ${_exhaustive}`);
}
