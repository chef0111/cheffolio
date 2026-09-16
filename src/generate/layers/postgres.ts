import { setFile } from "../files.ts";
import type { EmitCtx } from "../types.ts";

export function emitPostgres(ctx: EmitCtx): void {
  const dbName = ctx.projectName.replace(/[^a-zA-Z0-9_]/g, "_") || "app";
  setFile(
    ctx.files,
    ".env",
    `DATABASE_URL="postgres://postgres:postgres@localhost:5432/${dbName}"
BETTER_AUTH_SECRET="dev-secret-change-me-please-32chars"
BETTER_AUTH_URL="http://localhost:3000"
`,
  );
  setFile(
    ctx.files,
    ".env.example",
    `DATABASE_URL="postgres://postgres:postgres@localhost:5432/${dbName}"
BETTER_AUTH_SECRET="dev-secret-change-me-please-32chars"
BETTER_AUTH_URL="http://localhost:3000"
`,
  );
}
