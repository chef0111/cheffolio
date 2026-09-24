export const FRONTENDS = ['next', 'tanstack-start'] as const;
export const BACKENDS = ['self', 'nest', 'convex', 'hono'] as const;
export const APIS = ['orpc', 'trpc', 'none'] as const;
export const DATABASES = ['postgres', 'sqlite', 'mysql', 'none'] as const;
export const ORMS = ['prisma', 'drizzle', 'none'] as const;
export const DB_SETUPS = ['none', 'docker', 'neon', 'supabase'] as const;
export const AUTHS = ['better-auth', 'clerk', 'none'] as const;
export const PAYMENTS = ['none', 'stripe', 'polar'] as const;
export const LINTERS = ['eslint', 'biome', 'oxlint'] as const;

export const FLAG_GROUPS = [
  'frontend',
  'backend',
  'api',
  'database',
  'orm',
  'dbSetup',
  'auth',
  'payments',
  'linter',
] as const;

export type FlagGroup = (typeof FLAG_GROUPS)[number];

export const VOCAB_BY_GROUP = {
  frontend: FRONTENDS,
  backend: BACKENDS,
  api: APIS,
  database: DATABASES,
  orm: ORMS,
  dbSetup: DB_SETUPS,
  auth: AUTHS,
  payments: PAYMENTS,
  linter: LINTERS,
} as const satisfies Record<FlagGroup, readonly string[]>;

export const RELATIONAL_GROUPS = ['api', 'database', 'orm', 'dbSetup'] as const;

export const STACK_CLI_FLAGS: { key: FlagGroup; flag: string }[] = [
  { key: 'frontend', flag: '--frontend' },
  { key: 'backend', flag: '--backend' },
  { key: 'api', flag: '--api' },
  { key: 'database', flag: '--database' },
  { key: 'orm', flag: '--orm' },
  { key: 'dbSetup', flag: '--db-setup' },
  { key: 'auth', flag: '--auth' },
  { key: 'payments', flag: '--payments' },
  { key: 'linter', flag: '--linter' },
];
