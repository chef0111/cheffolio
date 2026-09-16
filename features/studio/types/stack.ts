export const FRONTENDS = ['next', 'tanstack-start'] as const;
export const BACKENDS = ['self', 'nest', 'convex'] as const;
export const APIS = ['orpc', 'trpc'] as const;
export const DATABASES = ['postgres', 'sqlite', 'mysql'] as const;
export const ORMS = ['prisma', 'drizzle'] as const;
export const DB_SETUPS = ['none', 'docker', 'neon', 'supabase'] as const;
export const AUTHS = ['none', 'better-auth', 'clerk'] as const;
export const PAYMENTS = ['none', 'stripe', 'polar'] as const;
export const UIS = ['shadcn', 'none'] as const;
export const LINTERS = ['eslint', 'biome', 'oxlint'] as const;

export type Frontend = (typeof FRONTENDS)[number];
export type Backend = (typeof BACKENDS)[number];
export type Api = (typeof APIS)[number];
export type Database = (typeof DATABASES)[number];
export type Orm = (typeof ORMS)[number];
export type DbSetup = (typeof DB_SETUPS)[number];
export type Auth = (typeof AUTHS)[number];
export type Payments = (typeof PAYMENTS)[number];
export type Ui = (typeof UIS)[number];
export type Linter = (typeof LINTERS)[number];

export const FLAG_GROUPS = [
  'frontend',
  'backend',
  'api',
  'database',
  'orm',
  'dbSetup',
  'auth',
  'payments',
  'ui',
  'linter',
] as const;

export type FlagGroup = (typeof FLAG_GROUPS)[number];

export type StudioFlags = {
  frontend: Frontend;
  backend: Backend;
  api: Api;
  database: Database;
  orm: Orm;
  dbSetup: DbSetup;
  auth: Auth;
  payments: Payments;
  ui: Ui;
  linter: Linter;
};
