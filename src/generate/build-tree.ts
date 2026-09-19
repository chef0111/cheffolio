import type { Stack } from "../stack/types.ts";
import { setFile, sortRecord } from "./files.ts";
import { emitBetterAuth } from "./layers/better-auth.ts";
import { emitClerk } from "./layers/clerk.ts";
import { emitConvex } from "./layers/convex.ts";
import { emitDbSetup } from "./layers/db-setup.ts";
import { emitDrizzle } from "./layers/drizzle.ts";
import { emitEslintPrettier } from "./layers/eslint.ts";
import { emitPolar } from "./layers/polar.ts";
import { emitStripe } from "./layers/stripe.ts";
import { emitNest } from "./layers/nest.ts";
import { emitNext } from "./layers/next.ts";
import { emitNotes } from "./layers/notes.ts";
import { emitOrpc } from "./layers/orpc.ts";
import { emitOxlint } from "./layers/oxlint.ts";
import { emitPostgres } from "./layers/postgres.ts";
import { emitPrisma } from "./layers/prisma.ts";
import { emitSelf } from "./layers/self.ts";
import { emitShadcn } from "./layers/shadcn.ts";
import { emitStart } from "./layers/start.ts";
import { emitTrpc } from "./layers/trpc.ts";
import { GenerateError } from "./errors.ts";
import type { FileMap, GenerateContext, PackageJsonShape } from "./types.ts";

function emitDatabase(stack: Extract<Stack, { backend: "self" | "nest" }>, ctx: Parameters<typeof emitNext>[0]) {
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

function emitUi(stack: Stack, ctx: Parameters<typeof emitNext>[0]) {
  switch (stack.ui) {
    case "shadcn":
      emitShadcn(ctx);
      break;
    case "none":
      break;
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
      emitApi(stack, emitCtx);
      emitDatabase(stack, emitCtx);
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
    emitNotes(emitCtx);
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
  return files;
}
