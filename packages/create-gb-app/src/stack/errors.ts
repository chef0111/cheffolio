export const RULE_IDS = {
  nestRequiresOrpc: "nest-requires-orpc",
  polarRequiresBetterAuth: "polar-requires-better-auth",
  paymentsRequireAuth: "payments-require-auth",
  convexDatabaseOff: "convex-database-off",
  convexApiOff: "convex-api-off",
  convexOrmOff: "convex-orm-off",
  convexDbSetupOff: "convex-db-setup-off",
  sqliteDockerForbidden: "sqlite-docker-forbidden",
  neonRequiresPostgres: "neon-requires-postgres",
  supabaseRequiresPostgres: "supabase-requires-postgres",
  clerkPolarForbidden: "clerk-polar-forbidden",
} as const;

export type RuleId = (typeof RULE_IDS)[keyof typeof RULE_IDS];

const RULE_MESSAGES: Record<RuleId, string> = {
  "nest-requires-orpc": "Nest requires oRPC",
  "polar-requires-better-auth": "Polar requires Better Auth",
  "payments-require-auth": "Payments require auth",
  "convex-database-off": "Convex cannot use a database",
  "convex-api-off": "Convex cannot use an API layer",
  "convex-orm-off": "Convex cannot use an ORM",
  "convex-db-setup-off": "Convex cannot use db-setup",
  "sqlite-docker-forbidden": "SQLite cannot use docker",
  "neon-requires-postgres": "Neon requires Postgres",
  "supabase-requires-postgres": "Supabase requires Postgres",
  "clerk-polar-forbidden": "Clerk cannot be used with Polar",
};

export class CompatError extends Error {
  readonly ruleId: RuleId;

  constructor(ruleId: RuleId) {
    super(`${RULE_MESSAGES[ruleId]} (${ruleId})`);
    this.name = "CompatError";
    this.ruleId = ruleId;
    Object.defineProperty(this, "ruleId", {
      value: ruleId,
      writable: false,
      enumerable: true,
      configurable: false,
    });
  }
}
