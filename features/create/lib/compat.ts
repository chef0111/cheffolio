import {
  type Auth,
  type Backend,
  type CreateFlags,
  type Database,
  type DbSetup,
  FLAG_GROUPS,
  type FlagGroup,
  type Payments,
} from '../types/stack';

export const RULE_IDS = {
  nestRequiresOrpc: 'nest-requires-orpc',
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
} as const;

export type RuleId = (typeof RULE_IDS)[keyof typeof RULE_IDS];

export const RULE_MESSAGES: Record<RuleId, string> = {
  'nest-requires-orpc': 'Nest requires oRPC',
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
};

export const YES_DEFAULTS: CreateFlags = {
  frontend: 'next',
  backend: 'self',
  api: 'orpc',
  database: 'postgres',
  orm: 'prisma',
  dbSetup: 'none',
  auth: 'better-auth',
  payments: 'none',
  ui: 'shadcn',
  linter: 'eslint',
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
  if (flags.backend === 'convex' && isRelationalGroup(group)) {
    return false;
  }
  return true;
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
    case 'ui':
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
  if (flags.backend === 'convex') {
    const convexRule = convexRelationalRule(group);
    if (convexRule) {
      return convexRule;
    }
  }

  if (group === 'api' && flags.backend === 'nest' && value === 'trpc') {
    return RULE_IDS.nestRequiresOrpc;
  }

  if (group === 'linter' && flags.backend === 'nest') {
    if (value === 'eslint') {
      return RULE_IDS.nestEslint;
    }
    if (value === 'oxlint') {
      return RULE_IDS.nestOxlint;
    }
  }

  if (group === 'dbSetup') {
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

  if (group === 'database') {
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
    case 'ui':
    case 'linter':
      return next;
    default: {
      const _exhaustive: never = key;
      throw new Error(`unhandled flag group: ${_exhaustive}`);
    }
  }
}

export function normalizeFlags(flags: CreateFlags): CreateFlags {
  let next = flags;

  for (const group of FLAG_GROUPS) {
    if (isOptionEnabled(next, group, next[group])) {
      continue;
    }
    next = applyFlagChange(next, group, YES_DEFAULTS[group]);
  }

  if (next.backend === 'nest') {
    if (next.api !== 'orpc') {
      next = { ...next, api: 'orpc' };
    }
    if (next.linter !== 'biome') {
      next = { ...next, linter: 'biome' };
    }
  }

  if (next.backend === 'convex') {
    if (
      next.api !== YES_DEFAULTS.api ||
      next.database !== YES_DEFAULTS.database ||
      next.orm !== YES_DEFAULTS.orm ||
      next.dbSetup !== YES_DEFAULTS.dbSetup
    ) {
      next = {
        ...next,
        api: YES_DEFAULTS.api,
        database: YES_DEFAULTS.database,
        orm: YES_DEFAULTS.orm,
        dbSetup: YES_DEFAULTS.dbSetup,
      };
    }
  }

  return next;
}

function applyBackendSideEffects(
  flags: CreateFlags,
  backend: Backend
): CreateFlags {
  switch (backend) {
    case 'nest':
      return { ...flags, api: 'orpc', linter: 'biome' };
    case 'convex':
      return {
        ...flags,
        api: YES_DEFAULTS.api,
        database: YES_DEFAULTS.database,
        orm: YES_DEFAULTS.orm,
        dbSetup: YES_DEFAULTS.dbSetup,
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
  if (database === 'sqlite' && flags.dbSetup === 'docker') {
    return { ...flags, dbSetup: 'none' };
  }
  if (
    database !== 'postgres' &&
    (flags.dbSetup === 'neon' || flags.dbSetup === 'supabase')
  ) {
    return { ...flags, dbSetup: 'none' };
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
