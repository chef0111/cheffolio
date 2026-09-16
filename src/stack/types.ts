export type Frontend = "next" | "tanstack-start";
export type Backend = "self" | "nest" | "convex";
export type Api = "orpc" | "trpc";
export type Database = "postgres" | "sqlite" | "mysql";
export type Orm = "prisma" | "drizzle";
export type DbSetup = "none" | "docker" | "neon" | "supabase";
export type Auth = "none" | "better-auth" | "clerk";
export type Payments = "none" | "stripe" | "polar";
export type Ui = "shadcn" | "none";
export type Linter = "eslint" | "biome" | "oxlint";

export type RawFlags = {
  help?: boolean;
  yes?: boolean;
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
