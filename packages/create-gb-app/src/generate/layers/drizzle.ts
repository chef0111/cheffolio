import { setFile } from "#/generate/files";
import { isAppsLayout, joinPath, libDir } from "#/generate/paths";
import type { EmitCtx } from "#/generate/types";

export function emitDrizzle(ctx: EmitCtx): void {
  ctx.pkg.dependencies["drizzle-orm"] = "^0.44.5";
  ctx.pkg.devDependencies["drizzle-kit"] = "^0.31.4";
  ctx.pkg.scripts["db:generate"] = "drizzle-kit generate";
  ctx.pkg.scripts["db:push"] = "drizzle-kit push";

  const schemaPath = isAppsLayout(ctx.stack)
    ? "apps/server/src/schema.ts"
    : joinPath(libDir(ctx.stack), "schema.ts");
  const clientPath = isAppsLayout(ctx.stack)
    ? "apps/server/src/db.ts"
    : joinPath(libDir(ctx.stack), "db.ts");
  const driver =
    ctx.stack.backend === "convex"
      ? "postgresql"
      : ctx.stack.backend === "self" ||
          ctx.stack.backend === "nest" ||
          ctx.stack.backend === "hono"
        ? ctx.stack.database
        : "postgres";

  if (driver === "sqlite") {
    ctx.pkg.dependencies["better-sqlite3"] = "^12.2.0";
  } else if (driver === "mysql") {
    ctx.pkg.dependencies.mysql2 = "^3.14.3";
  } else {
    ctx.pkg.dependencies.pg = "^8.16.3";
  }

  const pgImport =
    driver === "sqlite"
      ? `import { sqliteTable, text } from "drizzle-orm/sqlite-core";`
      : driver === "mysql"
        ? `import { mysqlTable, varchar, text } from "drizzle-orm/mysql-core";`
        : `import { pgTable, text, timestamp } from "drizzle-orm/pg-core";`;

  setFile(
    ctx.files,
    schemaPath,
    `${pgImport}

export const notes = ${driver === "sqlite" ? "sqliteTable" : driver === "mysql" ? "mysqlTable" : "pgTable"}("notes", {
  id: ${driver === "postgres" || driver === "postgresql" ? 'text("id").primaryKey()' : 'text("id").primaryKey()'},
  title: text("title").notNull(),
  body: text("body").notNull(),
});
`,
  );

  setFile(
    ctx.files,
    clientPath,
    `import { drizzle } from "drizzle-orm/${driver === "sqlite" ? "better-sqlite3" : driver === "mysql" ? "mysql2" : "node-postgres"}";
import * as schema from "./schema";

export const db = drizzle(process.env.DATABASE_URL as string, { schema });
`,
  );

  setFile(
    ctx.files,
    isAppsLayout(ctx.stack) ? "apps/server/drizzle.config.ts" : "drizzle.config.ts",
    `import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./${schemaPath}",
  out: "./drizzle",
  dialect: "${driver === "sqlite" ? "sqlite" : driver === "mysql" ? "mysql" : "postgresql"}",
  dbCredentials: { url: process.env.DATABASE_URL as string },
});
`,
  );
}
