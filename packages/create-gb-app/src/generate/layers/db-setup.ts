import { setFile } from "#/generate/files";
import type { EmitCtx } from "#/generate/types";

export function emitDbSetup(ctx: EmitCtx): void {
  if (ctx.stack.backend === "convex") {
    return;
  }
  const setup = ctx.stack.dbSetup;
  const database = ctx.stack.database;
  const dbName = ctx.projectName.replace(/[^a-zA-Z0-9_]/g, "_") || "app";

  switch (setup) {
    case "none":
      return;
    case "docker": {
      if (database === "sqlite") {
        throw new Error("sqlite docker is forbidden");
      }
      const service =
        database === "mysql"
          ? `mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: ${dbName}
    ports:
      - "3306:3306"
`
          : `postgres:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: ${dbName}
    ports:
      - "5432:5432"
`;
      setFile(
        ctx.files,
        "docker-compose.yml",
        `services:
  ${service}`,
      );
      return;
    }
    case "neon":
      patchEnv(
        ctx,
        `DATABASE_URL="postgres://USER:PASSWORD@ep-xxx.region.aws.neon.tech/${dbName}?sslmode=require"`,
      );
      return;
    case "supabase":
      patchEnv(
        ctx,
        `DATABASE_URL="postgres://postgres:PASSWORD@db.${dbName}.supabase.co:5432/postgres"`,
      );
      return;
    default: {
      const _exhaustive: never = setup;
      throw new Error(`unhandled db-setup: ${_exhaustive}`);
    }
  }
}

function patchEnv(ctx: EmitCtx, databaseUrlLine: string): void {
  const current = ctx.files[".env"] ?? "";
  const next = current.includes("DATABASE_URL=")
    ? current.replace(/DATABASE_URL=".*"/, databaseUrlLine)
    : `${databaseUrlLine}\n${current}`;
  setFile(ctx.files, ".env", next);
  setFile(ctx.files, ".env.example", next);
}
