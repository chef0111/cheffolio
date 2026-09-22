import {
  type Auth,
  type Backend,
  type CreateFlags,
  type Database,
  type DbSetup,
  FLAG_GROUPS,
  type FlagGroup,
  type Payments,
  VOCAB_BY_GROUP,
  YES_DEFAULTS,
} from 'create-gb-app/preset';

export { YES_DEFAULTS };

export const RULE_IDS = {
  nestTrpc: 'nest-trpc',
  nestEslint: 'nest-eslint',
  nestOxlint: 'nest-oxlint',
  polarRequiresBetterAuth: 'polar-requires-better-auth',
  paymentsRequireAuth: 'payments-require-auth',
  convexDatabaseOff: 'convex-database-off',
  convexApiOff: 'convex-api-off',
  convexOrmOff: 'convex-orm-off',
  convexDbSetupOff: 'convex-db-setup-off',
  sqliteDockerForbidden: 'sqlite-docker-forbidden',
  neonRequiresPostgres: 'neon-requires-postgres',
  supabaseRequiresPostgres: 'supabase-requires-postgres',
  clerkPolarForbidden: 'clerk-polar-forbidden',
  betterAuthRequiresDatabase: 'better-auth-requires-database',
  databaseRequiresOrm: 'database-requires-orm',
  ormRequiresDatabase: 'orm-requires-database',
  dbSetupRequiresDatabase: 'db-setup-requires-database',
} as const;

export type RuleId = (typeof RULE_IDS)[keyof typeof RULE_IDS];

export const RULE_MESSAGES: Record<RuleId, string> = {
  'nest-trpc': 'Nest tRPC generate is not implemented yet',
  'nest-eslint': 'Nest ESLint generate is not implemented yet',
  'nest-oxlint': 'Nest Oxlint generate is not implemented yet',
  'polar-requires-better-auth': 'Polar requires Better Auth',
  'payments-require-auth': 'Payments require auth',
  'convex-database-off': 'Convex cannot use a database',
  'convex-api-off': 'Convex cannot use an API layer',
  'convex-orm-off': 'Convex cannot use an ORM',
  'convex-db-setup-off': 'Convex cannot use db-setup',
  'sqlite-docker-forbidden': 'SQLite cannot use docker',
  'neon-requires-postgres': 'Neon requires Postgres',
  'supabase-requires-postgres': 'Supabase requires Postgres',
  'clerk-polar-forbidden': 'Clerk cannot be used with Polar',
  'better-auth-requires-database': 'Better Auth requires a database',
  'database-requires-orm': 'A database requires an ORM',
  'orm-requires-database': 'An ORM requires a database',
  'db-setup-requires-database': 'Database setup requires a database',
};

const RELATIONAL_GROUPS = new Set<FlagGroup>([
  'api',
  'database',
  'orm',
  'dbSetup',
]);

export function isRelationalGroup(group: FlagGroup): boolean {
  return RELATIONAL_GROUPS.has(group);
}

export function isGroupVisible(flags: CreateFlags, group: FlagGroup): boolean {
  return Object.hasOwn(flags, group);
}

export function disabledRuleId(
  flags: CreateFlags,
  group: FlagGroup,
  value: string
): RuleId | null {
  return disabledRule(flags, group, value);
}

export function isOptionEnabled(
  flags: CreateFlags,
  group: FlagGroup,
  value: string
): boolean {
  return disabledRule(flags, group, value) === null;
}

export function disabledReason(
  flags: CreateFlags,
  group: FlagGroup,
  value: string
): string | null {
  const ruleId = disabledRule(flags, group, value);
  return ruleId ? RULE_MESSAGES[ruleId] : null;
}

function convexRelationalRule(group: FlagGroup): RuleId | null {
  switch (group) {
    case 'api':
      return RULE_IDS.convexApiOff;
    case 'database':
      return RULE_IDS.convexDatabaseOff;
    case 'orm':
      return RULE_IDS.convexOrmOff;
    case 'dbSetup':
      return RULE_IDS.convexDbSetupOff;
    case 'frontend':
    case 'backend':
    case 'auth':
    case 'payments':
    case 'linter':
      return null;
    default: {
      const _exhaustive: never = group;
      throw new Error(`unhandled flag group: ${_exhaustive}`);
    }
  }
}

function disabledRule(
  flags: CreateFlags,
  group: FlagGroup,
  value: string
): RuleId | null {
  if (flags.backend === 'convex' && value !== 'none') {
    const convexRule = convexRelationalRule(group);
    if (convexRule) {
      return convexRule;
    }
  }

  if (group === 'api' && flags.backend === 'nest' && value === 'trpc') {
    return RULE_IDS.nestTrpc;
  }

  if (group === 'linter' && flags.backend === 'nest') {
    if (value === 'eslint') {
      return RULE_IDS.nestEslint;
    }
    if (value === 'oxlint') {
      return RULE_IDS.nestOxlint;
    }
  }

  if (
    group === 'orm' &&
    flags.backend !== 'convex' &&
    flags.database !== 'none' &&
    value === 'none'
  ) {
    return RULE_IDS.databaseRequiresOrm;
  }

  if (
    group === 'orm' &&
    flags.backend !== 'convex' &&
    flags.database === 'none' &&
    value !== 'none'
  ) {
    return RULE_IDS.ormRequiresDatabase;
  }

  if (
    group === 'auth' &&
    value === 'better-auth' &&
    flags.backend !== 'convex' &&
    flags.database === 'none'
  ) {
    return RULE_IDS.betterAuthRequiresDatabase;
  }

  if (group === 'dbSetup' && flags.database === 'none' && value !== 'none') {
    return RULE_IDS.dbSetupRequiresDatabase;
  }

  if (group === 'dbSetup' && flags.database !== 'none') {
    if (value === 'docker' && flags.database === 'sqlite') {
      return RULE_IDS.sqliteDockerForbidden;
    }
    if (value === 'neon' && flags.database !== 'postgres') {
      return RULE_IDS.neonRequiresPostgres;
    }
    if (value === 'supabase' && flags.database !== 'postgres') {
      return RULE_IDS.supabaseRequiresPostgres;
    }
  }

  if (group === 'database' && value !== 'none') {
    if (
      (flags.dbSetup === 'neon' || flags.dbSetup === 'supabase') &&
      value !== 'postgres'
    ) {
      return flags.dbSetup === 'neon'
        ? RULE_IDS.neonRequiresPostgres
        : RULE_IDS.supabaseRequiresPostgres;
    }
  }

  if (group === 'payments') {
    if (value === 'polar' && flags.auth === 'clerk') {
      return RULE_IDS.clerkPolarForbidden;
    }
    if (value === 'polar' && flags.auth !== 'better-auth') {
      return RULE_IDS.polarRequiresBetterAuth;
    }
    if (value !== 'none' && flags.auth === 'none') {
      return RULE_IDS.paymentsRequireAuth;
    }
  }

  if (group === 'auth') {
    if (value === 'clerk' && flags.payments === 'polar') {
      return RULE_IDS.clerkPolarForbidden;
    }
    if (value !== 'better-auth' && flags.payments === 'polar') {
      return RULE_IDS.polarRequiresBetterAuth;
    }
    if (value === 'none' && flags.payments !== 'none') {
      return RULE_IDS.paymentsRequireAuth;
    }
  }

  return null;
}

export function applyFlagChange<K extends FlagGroup>(
  flags: CreateFlags,
  key: K,
  value: CreateFlags[K]
): CreateFlags {
  const next: CreateFlags = { ...flags, [key]: value };

  switch (key) {
    case 'backend':
      return applyBackendSideEffects(next, value as Backend);
    case 'database':
      return applyDatabaseSideEffects(next, value as Database);
    case 'auth':
      return applyAuthSideEffects(next, value as Auth);
    case 'payments':
      return applyPaymentsSideEffects(next, value as Payments);
    case 'dbSetup':
      return applyDbSetupSideEffects(next, value as DbSetup);
    case 'frontend':
    case 'api':
    case 'orm':
    case 'linter':
      return next;
    default: {
      const _exhaustive: never = key;
      throw new Error(`unhandled flag group: ${_exhaustive}`);
    }
  }
}

function enabledFallback(
  flags: CreateFlags,
  group: FlagGroup
): CreateFlags[FlagGroup] {
  const preferred = YES_DEFAULTS[group];
  if (isOptionEnabled(flags, group, preferred)) {
    return preferred;
  }
  const vocab = VOCAB_BY_GROUP[group];
  if (
    (vocab as readonly string[]).includes('none') &&
    isOptionEnabled(flags, group, 'none')
  ) {
    return 'none' as CreateFlags[FlagGroup];
  }
  for (const value of vocab) {
    if (isOptionEnabled(flags, group, value)) {
      return value as CreateFlags[FlagGroup];
    }
  }
  return preferred;
}

export function normalizeFlags(flags: CreateFlags): CreateFlags {
  let next = flags;

  for (const group of FLAG_GROUPS) {
    if (isOptionEnabled(next, group, next[group])) {
      continue;
    }
    next = applyFlagChange(next, group, enabledFallback(next, group));
  }

  return next;
}

function applyBackendSideEffects(
  flags: CreateFlags,
  backend: Backend
): CreateFlags {
  switch (backend) {
    case 'nest':
      return { ...flags, linter: 'biome' };
    case 'convex':
      return {
        ...flags,
        api: 'none',
        database: 'none',
        orm: 'none',
        dbSetup: 'none',
      };
    case 'self':
      return flags;
    default: {
      const _exhaustive: never = backend;
      throw new Error(`unhandled backend: ${_exhaustive}`);
    }
  }
}

function applyDatabaseSideEffects(
  flags: CreateFlags,
  database: Database
): CreateFlags {
  if (database === 'none') {
    const next: CreateFlags = { ...flags, orm: 'none', dbSetup: 'none' };
    if (next.backend !== 'convex' && next.auth === 'better-auth') {
      return { ...next, auth: 'none', payments: 'none' };
    }
    return next;
  }
  if (database === 'sqlite' && flags.dbSetup === 'docker') {
    return { ...flags, dbSetup: 'none' };
  }
  if (
    database !== 'postgres' &&
    (flags.dbSetup === 'neon' || flags.dbSetup === 'supabase')
  ) {
    return { ...flags, dbSetup: 'none' };
  }
  if (flags.orm === 'none') {
    return { ...flags, orm: 'prisma' };
  }
  return flags;
}

function applyAuthSideEffects(flags: CreateFlags, auth: Auth): CreateFlags {
  if (auth === 'none') {
    return { ...flags, payments: 'none' };
  }
  if (auth !== 'better-auth' && flags.payments === 'polar') {
    return { ...flags, payments: 'none' };
  }
  return flags;
}

function applyPaymentsSideEffects(
  flags: CreateFlags,
  payments: Payments
): CreateFlags {
  if (payments !== 'none' && flags.auth === 'none') {
    return { ...flags, payments: 'none' };
  }
  if (payments === 'polar' && flags.auth !== 'better-auth') {
    return { ...flags, payments: 'none' };
  }
  return flags;
}

function applyDbSetupSideEffects(
  flags: CreateFlags,
  dbSetup: DbSetup
): CreateFlags {
  if (flags.database === 'none' && dbSetup !== 'none') {
    return { ...flags, dbSetup: 'none' };
  }
  if (dbSetup === 'docker' && flags.database === 'sqlite') {
    return { ...flags, dbSetup: 'none' };
  }
  if (
    (dbSetup === 'neon' || dbSetup === 'supabase') &&
    flags.database !== 'postgres'
  ) {
    return { ...flags, dbSetup: 'none' };
  }
  return flags;
}
