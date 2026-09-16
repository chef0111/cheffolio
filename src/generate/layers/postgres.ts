import { setFile } from "../files.ts";
import type { EmitCtx } from "../types.ts";

export function emitPostgres(ctx: EmitCtx): void {
  const dbName = ctx.projectName.replace(/[^a-zA-Z0-9_]/g, "_") || "app";
  const databaseUrl = `postgres://postgres:postgres@localhost:5432/${dbName}`;
  const authLines =
    ctx.stack.auth === "better-auth"
      ? `BETTER_AUTH_SECRET="dev-secret-change-me-please-32chars"
BETTER_AUTH_URL="http://localhost:3000"
`
      : ctx.stack.auth === "clerk"
        ? `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_replace_me"
CLERK_SECRET_KEY="sk_test_replace_me"
`
        : "";
  const env = `DATABASE_URL="${databaseUrl}"
${authLines}`;
  setFile(ctx.files, ".env", env);
  setFile(ctx.files, ".env.example", env);
}
