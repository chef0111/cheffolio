import { CompatError, RULE_IDS } from "./errors.ts";
import type {
  Auth,
  Database,
  DbSetup,
  Payments,
  RawFlags,
  Stack,
} from "./types.ts";

export const YES_DEFAULTS = {
  frontend: "next",
  backend: "self",
  api: "orpc",
  database: "postgres",
  orm: "prisma",
  dbSetup: "none",
  auth: "better-auth",
  payments: "none",
  ui: "shadcn",
  linter: "eslint",
} as const;

function assertPayments(auth: Auth, payments: Payments): void {
  if (auth === "clerk" && payments === "polar") {
    throw new CompatError(RULE_IDS.clerkPolarForbidden);
  }
  if (payments === "polar" && auth !== "better-auth") {
    throw new CompatError(RULE_IDS.polarRequiresBetterAuth);
  }
  if (payments !== "none" && auth === "none") {
    throw new CompatError(RULE_IDS.paymentsRequireAuth);
  }
}

function assertDbSetup(database: Database, dbSetup: DbSetup): void {
  if (database === "sqlite" && dbSetup === "docker") {
    throw new CompatError(RULE_IDS.sqliteDockerForbidden);
  }
  if (dbSetup === "neon" && database !== "postgres") {
    throw new CompatError(RULE_IDS.neonRequiresPostgres);
  }
  if (dbSetup === "supabase" && database !== "postgres") {
    throw new CompatError(RULE_IDS.supabaseRequiresPostgres);
  }
}

export function resolveStack(raw: RawFlags): Stack {
  const frontend = raw.frontend ?? YES_DEFAULTS.frontend;
  const backend = raw.backend ?? YES_DEFAULTS.backend;
  const auth = raw.auth ?? YES_DEFAULTS.auth;
  const payments = raw.payments ?? YES_DEFAULTS.payments;
  const ui = raw.ui ?? YES_DEFAULTS.ui;
  const linter = raw.linter ?? YES_DEFAULTS.linter;

  if (backend === "convex") {
    if (raw.database !== undefined) {
      throw new CompatError(RULE_IDS.convexDatabaseOff);
    }
    if (raw.api !== undefined) {
      throw new CompatError(RULE_IDS.convexApiOff);
    }
    if (raw.orm !== undefined) {
      throw new CompatError(RULE_IDS.convexOrmOff);
    }
    if (raw.dbSetup !== undefined && raw.dbSetup !== "none") {
      throw new CompatError(RULE_IDS.convexDbSetupOff);
    }
    assertPayments(auth, payments);
    return {
      frontend,
      backend: "convex",
      auth,
      payments,
      ui,
      linter,
      monorepo: false,
    };
  }

  const api = raw.api ?? (backend === "nest" ? "orpc" : YES_DEFAULTS.api);
  const database = raw.database ?? YES_DEFAULTS.database;
  const orm = raw.orm ?? YES_DEFAULTS.orm;
  const dbSetup = raw.dbSetup ?? YES_DEFAULTS.dbSetup;

  if (backend === "nest" && api !== "orpc") {
    throw new CompatError(RULE_IDS.nestRequiresOrpc);
  }

  assertPayments(auth, payments);
  assertDbSetup(database, dbSetup);

  if (backend === "nest") {
    return {
      frontend,
      backend: "nest",
      api: "orpc",
      database,
      orm,
      dbSetup,
      auth,
      payments,
      ui,
      linter,
      monorepo: true,
    };
  }

  if (backend === "self") {
    return {
      frontend,
      backend: "self",
      api,
      database,
      orm,
      dbSetup,
      auth,
      payments,
      ui,
      linter,
      monorepo: false,
    };
  }

  const _exhaustive: never = backend;
  throw new Error(`unhandled backend: ${_exhaustive}`);
}
