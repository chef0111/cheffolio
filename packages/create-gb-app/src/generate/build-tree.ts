import type { Stack } from "#/stack/types";
import { setFile, setFileIfAbsent, sortRecord } from "#/generate/files";
import { emitBetterAuth } from "#/generate/layers/better-auth";
import { emitClerk } from "#/generate/layers/clerk";
import { emitConvex } from "#/generate/layers/convex";
import { emitDbSetup } from "#/generate/layers/db-setup";
import { emitDrizzle } from "#/generate/layers/drizzle";
import { emitEslintPrettier } from "#/generate/layers/eslint";
import { emitPolar } from "#/generate/layers/polar";
import { emitStripe } from "#/generate/layers/stripe";
import { emitNest } from "#/generate/layers/nest";
import { emitNext } from "#/generate/layers/next";
import { emitNotes } from "#/generate/layers/notes";
import { emitOrpc } from "#/generate/layers/orpc";
import { emitOxlint } from "#/generate/layers/oxlint";
import { emitPostgres } from "#/generate/layers/postgres";
import { emitPrisma } from "#/generate/layers/prisma";
import { emitSelf } from "#/generate/layers/self";
import { emitShadcn } from "#/generate/layers/shadcn";
import { emitStart } from "#/generate/layers/start";
import { emitTrpc } from "#/generate/layers/trpc";
import { GenerateError } from "#/generate/errors";
import type { FileMap, GenerateContext, PackageJsonShape } from "#/generate/types";

function emitDatabase(stack: Extract<Stack, { backend: "self" | "nest" }>, ctx: Parameters<typeof emitNext>[0]) {
  if (stack.database === "none") {
    return;
  }

  switch (stack.database) {
    case "sqlite":
    case "mysql":
    case "postgres":
      emitPostgres(ctx);
      break;
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
      emitDrizzle(ctx);
      break;
    case "none":
      throw new Error("orm none requires database none");
    default: {
      const _exhaustive: never = stack.orm;
      throw new Error(`unhandled orm: ${_exhaustive}`);
    }
  }

  emitDbSetup(ctx);
}

function emitAuth(stack: Stack, ctx: Parameters<typeof emitNext>[0]) {
  switch (stack.auth) {
    case "better-auth":
      emitBetterAuth(ctx);
      break;
    case "none":
      break;
    case "clerk":
      emitClerk(ctx);
      break;
    default: {
      const _exhaustive: never = stack.auth;
      throw new Error(`unhandled auth: ${_exhaustive}`);
    }
  }
}

function emitUi(_stack: Stack, ctx: Parameters<typeof emitNext>[0]) {
  emitShadcn(ctx);
}

function emitLinter(stack: Stack, ctx: Parameters<typeof emitNext>[0]) {
  switch (stack.linter) {
    case "eslint":
      emitEslintPrettier(ctx);
      break;
    case "oxlint":
      emitOxlint(ctx);
      break;
    case "biome":
      throw new GenerateError("biome", "biome generate is not implemented yet");
    default: {
      const _exhaustive: never = stack.linter;
      throw new Error(`unhandled linter: ${_exhaustive}`);
    }
  }
}

function emitPayments(stack: Stack, ctx: Parameters<typeof emitNext>[0]) {
  switch (stack.payments) {
    case "none":
      break;
    case "stripe":
      emitStripe(ctx);
      break;
    case "polar":
      emitPolar(ctx);
      break;
    default: {
      const _exhaustive: never = stack.payments;
      throw new Error(`unhandled payments: ${_exhaustive}`);
    }
  }
}

function emitFrontend(stack: Stack, ctx: Parameters<typeof emitNext>[0]) {
  switch (stack.frontend) {
    case "next":
      emitNext(ctx);
      break;
    case "tanstack-start":
      emitStart(ctx);
      break;
    default: {
      const _exhaustive: never = stack.frontend;
      throw new Error(`unhandled frontend: ${_exhaustive}`);
    }
  }
}

function emitApi(stack: Extract<Stack, { backend: "self" }>, ctx: Parameters<typeof emitNext>[0]) {
  switch (stack.api) {
    case "orpc":
      if (stack.frontend !== "next") {
        throw new GenerateError(
          "start-orpc",
          "start oRPC generate is not implemented yet",
        );
      }
      emitOrpc(ctx);
      break;
    case "trpc":
      emitTrpc(ctx);
      break;
    case "none":
      break;
    default: {
      const _exhaustive: never = stack.api;
      throw new Error(`unhandled api: ${_exhaustive}`);
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
  const emitCtx = { ...ctx, files, pkg, stack };

  switch (stack.backend) {
    case "self": {
      emitSelf(emitCtx);
      emitFrontend(stack, emitCtx);
      if (stack.database !== "none") {
        if (stack.api !== "none") {
          emitApi(stack, emitCtx);
        }
        emitDatabase(stack, emitCtx);
      }
      break;
    }
    case "nest":
      emitNest(emitCtx);
      break;
    case "convex":
      emitFrontend(stack, emitCtx);
      emitConvex(emitCtx);
      break;
    default: {
      const _exhaustive: never = stack;
      throw new Error(`unhandled stack: ${JSON.stringify(_exhaustive)}`);
    }
  }

  if (stack.backend !== "nest") {
    emitAuth(stack, emitCtx);
    emitPayments(stack, emitCtx);
    emitUi(stack, emitCtx);
    emitLinter(stack, emitCtx);
    if (stack.backend === "convex" || stack.database !== "none") {
      emitNotes(emitCtx);
    }
  } else {
    if (stack.auth === "clerk") {
      emitClerk(emitCtx);
    }
    emitPayments(stack, emitCtx);
  }

  pkg.dependencies = sortRecord(pkg.dependencies);
  pkg.devDependencies = sortRecord(pkg.devDependencies);
  pkg.scripts = sortRecord(pkg.scripts);
  setFile(files, "package.json", JSON.stringify(pkg, null, 2));
  setFileIfAbsent(
    files,
    "README.md",
    `# ${ctx.projectName}\n\nGenerated by create-gb-app.\n`,
  );
  return files;
}
