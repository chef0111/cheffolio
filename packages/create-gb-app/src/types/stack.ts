import type {
  APIS,
  AUTHS,
  BACKENDS,
  DATABASES,
  DB_SETUPS,
  FORMS,
  FRONTENDS,
  LINTERS,
  ORMS,
  PAYMENTS,
  PROJECT_STRUCTURES,
} from '#/stack/vocab';

export type Frontend = (typeof FRONTENDS)[number];
export type Backend = (typeof BACKENDS)[number];
export type ProjectStructure = (typeof PROJECT_STRUCTURES)[number];
export type Api = (typeof APIS)[number];
export type Database = (typeof DATABASES)[number];
export type Orm = (typeof ORMS)[number];
export type DbSetup = (typeof DB_SETUPS)[number];
export type Auth = (typeof AUTHS)[number];
export type Payments = (typeof PAYMENTS)[number];
export type Linter = (typeof LINTERS)[number];
export type Form = (typeof FORMS)[number];

export type PresetFields = {
  frontend: Frontend;
  backend: Backend;
  structure: ProjectStructure;
  api: Api;
  database: Database;
  orm: Orm;
  dbSetup: DbSetup;
  auth: Auth;
  payments: Payments;
  linter: Linter;
  form: Form;
};

export type RawFlags = {
  help?: boolean;
  version?: boolean;
  yes?: boolean;
  preset?: string;
  frontend?: Frontend;
  backend?: Backend;
  structure?: ProjectStructure;
  api?: Api;
  database?: Database;
  orm?: Orm;
  dbSetup?: DbSetup;
  auth?: Auth;
  payments?: Payments;
  linter?: Linter;
  form?: Form;
  noGit?: boolean;
  noInstall?: boolean;
  projectName?: string;
};

type Shared = {
  frontend: Frontend;
  auth: Auth;
  payments: Payments;
  linter: Linter;
  form: Form;
};

type Relational = {
  database: Database;
  orm: Orm;
  dbSetup: DbSetup;
};

export type SelfStack = Shared &
  Relational & {
    backend: 'self';
    api: Api;
    structure: ProjectStructure;
  };

export type NestStack = Shared &
  Relational & {
    backend: 'nest';
    api: Api;
    structure: 'turborepo';
  };

export type HonoStack = Shared &
  Relational & {
    backend: 'hono';
    api: Api;
    structure: 'turborepo';
  };

export type ConvexStack = Shared & {
  backend: 'convex';
  structure: ProjectStructure;
};

export type Stack = SelfStack | NestStack | HonoStack | ConvexStack;
