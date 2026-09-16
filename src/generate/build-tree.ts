import type { Stack } from "../stack/types.ts";
import { setFile, sortRecord } from "./files.ts";
import { emitBetterAuth } from "./layers/better-auth.ts";
import { emitEslintPrettier } from "./layers/eslint.ts";
import { emitNext } from "./layers/next.ts";
import { emitNotes } from "./layers/notes.ts";
import { emitOrpc } from "./layers/orpc.ts";
import { emitPostgres } from "./layers/postgres.ts";
import { emitPrisma } from "./layers/prisma.ts";
import { emitSelf } from "./layers/self.ts";
import { emitShadcn } from "./layers/shadcn.ts";
import type { FileMap, GenerateContext, PackageJsonShape } from "./types.ts";

function emitDatabase(stack: Extract<Stack, { backend: "self" | "nest" }>, ctx: Parameters<typeof emitNext>[0]) {
  switch (stack.database) {
    case "postgres":
      emitPostgres(ctx);
      break;
    case "sqlite":
    case "mysql":
      throw new Error(`${stack.database} generate is not implemented yet`);
    default: {
      const _exhaustive: never = stack.database;
      throw new Error(`unhandled database: ${_exhaustive}`);
    }
  }

  switch (stack.orm) {
    case "prisma":
      emitPrisma(ctx);
      break;
    case "drizzle":
      throw new Error("drizzle generate is not implemented yet");
    default: {
      const _exhaustive: never = stack.orm;
      throw new Error(`unhandled orm: ${_exhaustive}`);
    }
  }
}

function emitAuth(stack: Stack, ctx: Parameters<typeof emitNext>[0]) {
  switch (stack.auth) {
    case "better-auth":
      emitBetterAuth(ctx);
      break;
    case "none":
    case "clerk":
      throw new Error(`${stack.auth} generate is not implemented yet`);
    default: {
      const _exhaustive: never = stack.auth;
      throw new Error(`unhandled auth: ${_exhaustive}`);
    }
  }
}

function emitUi(stack: Stack, ctx: Parameters<typeof emitNext>[0]) {
  switch (stack.ui) {
    case "shadcn":
      emitShadcn(ctx);
      break;
    case "none":
      throw new Error("ui none generate is not implemented yet");
    default: {
      const _exhaustive: never = stack.ui;
      throw new Error(`unhandled ui: ${_exhaustive}`);
    }
  }
}

function emitLinter(stack: Stack, ctx: Parameters<typeof emitNext>[0]) {
  switch (stack.linter) {
    case "eslint":
      emitEslintPrettier(ctx);
      break;
    case "biome":
    case "oxlint":
      throw new Error(`${stack.linter} generate is not implemented yet`);
    default: {
      const _exhaustive: never = stack.linter;
      throw new Error(`unhandled linter: ${_exhaustive}`);
    }
  }
}

export function buildTree(stack: Stack, ctx: GenerateContext): FileMap {
  const files: FileMap = {};
  const pkg: PackageJsonShape = {
    name: ctx.projectName,
    private: true,
    type: "module",
    scripts: {},
    dependencies: {},
    devDependencies: {},
  };
  const emitCtx = { ...ctx, files, pkg };

  switch (stack.backend) {
    case "self": {
      emitSelf(emitCtx);
      if (stack.frontend === "tanstack-start") {
        throw new Error("tanstack-start generate is not implemented yet");
      }
      emitNext(emitCtx);
      if (stack.api === "trpc") {
        throw new Error("trpc generate is not implemented yet");
      }
      emitOrpc(emitCtx);
      emitDatabase(stack, emitCtx);
      break;
    }
    case "nest":
      throw new Error("nest generate is not implemented yet");
    case "convex":
      throw new Error("convex generate is not implemented yet");
    default: {
      const _exhaustive: never = stack;
      throw new Error(`unhandled stack: ${JSON.stringify(_exhaustive)}`);
    }
  }

  emitAuth(stack, emitCtx);
  emitUi(stack, emitCtx);
  emitLinter(stack, emitCtx);
  emitNotes(emitCtx);

  pkg.dependencies = sortRecord(pkg.dependencies);
  pkg.devDependencies = sortRecord(pkg.devDependencies);
  pkg.scripts = sortRecord(pkg.scripts);
  setFile(files, "package.json", JSON.stringify(pkg, null, 2));
  return files;
}
