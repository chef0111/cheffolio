import {
  APIS,
  AUTHS,
  BACKENDS,
  DATABASES,
  DB_SETUPS,
  FRONTENDS,
  LINTERS,
  ORMS,
  PAYMENTS,
  UIS,
} from "./vocab.ts";

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

export type PresetFields = {
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

export type RawFlags = {
  help?: boolean;
  version?: boolean;
  yes?: boolean;
  preset?: string;
  frontend?: Frontend;
  backend?: Backend;
  api?: Api;
  database?: Database;
  orm?: Orm;
  dbSetup?: DbSetup;
  auth?: Auth;
  payments?: Payments;
  ui?: Ui;
  linter?: Linter;
  noGit?: boolean;
  noInstall?: boolean;
  projectName?: string;
};

type Shared = {
  frontend: Frontend;
  auth: Auth;
  payments: Payments;
  ui: Ui;
  linter: Linter;
};

type Relational = {
  database: Database;
  orm: Orm;
  dbSetup: DbSetup;
};

export type SelfStack = Shared &
  Relational & {
    backend: "self";
    api: Api;
    monorepo: false;
  };

export type NestStack = Shared &
  Relational & {
    backend: "nest";
    api: "orpc";
    monorepo: true;
  };

export type ConvexStack = Shared & {
  backend: "convex";
  monorepo: false;
};

export type Stack = SelfStack | NestStack | ConvexStack;
