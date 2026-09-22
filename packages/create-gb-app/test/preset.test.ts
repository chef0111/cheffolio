import { expect, test } from "bun:test";
import { GenerateError } from "#/generate/errors";
import { buildTree } from "#/generate/build-tree";
import {
  decodePreset,
  encodePreset,
  GOLDEN_PRESETS,
  rawFlagsFromPreset,
} from "#/preset";
import { resolveStack, YES_DEFAULTS } from "#/stack/resolve";
import type { PresetFields } from "#/stack/types";

test("encodePreset of --yes defaults is gb0", () => {
  expect(encodePreset(YES_DEFAULTS)).toBe("gb0");
  expect(decodePreset("gb0")).toEqual(YES_DEFAULTS);
});

test("encodePreset and decodePreset round-trip a non-default overlay", () => {
  const fields: PresetFields = {
    ...YES_DEFAULTS,
    frontend: "tanstack-start",
    linter: "oxlint",
  };
  const code = encodePreset(fields);
  expect(code).toBe("gbh33");
  expect(decodePreset(code)).toEqual(fields);
});

test("named goldens pin gb codes and decode back", () => {
  expect(encodePreset(GOLDEN_PRESETS.nest)).toBe("gb8wy");
  expect(decodePreset("gb8wy")).toEqual(GOLDEN_PRESETS.nest);
  expect(encodePreset(GOLDEN_PRESETS.start)).toBe("gbh3b");
  expect(decodePreset("gbh3b")).toEqual(GOLDEN_PRESETS.start);
  expect(encodePreset(GOLDEN_PRESETS.convex)).toBe("gb60");
  expect(decodePreset("gb60")).toEqual(GOLDEN_PRESETS.convex);
});

test("unknown prefixes throw", () => {
  expect(() => decodePreset("g111")).toThrow("invalid preset");
  expect(() => decodePreset("gc0")).toThrow("invalid preset");
});

test("golden nest builds a FileMap", () => {
  const files = buildTree(resolveStack(rawFlagsFromPreset(GOLDEN_PRESETS.nest)), {
    projectName: "nest-app",
    packageManager: "pnpm",
  });
  expect(files["turbo.json"]).toBeDefined();
  expect(files["README.md"]).toContain("nest-app");
});

test("golden start builds a FileMap", () => {
  const files = buildTree(
    resolveStack(rawFlagsFromPreset(GOLDEN_PRESETS.start)),
    {
      projectName: "start-app",
      packageManager: "bun",
    },
  );
  expect(files["vite.config.ts"]).toBeDefined();
});

test("golden convex builds a FileMap", () => {
  const files = buildTree(
    resolveStack(rawFlagsFromPreset(GOLDEN_PRESETS.convex)),
    {
      projectName: "convex-app",
      packageManager: "bun",
    },
  );
  expect(files["convex/schema.ts"]).toBeDefined();
});

test("nest plus default eslint throws GenerateError nest-eslint", () => {
  try {
    buildTree(resolveStack({ backend: "nest" }), {
      projectName: "nest-app",
      packageManager: "npm",
    });
    throw new Error("expected GenerateError");
  } catch (error) {
    expect(error).toBeInstanceOf(GenerateError);
    expect((error as GenerateError).code).toBe("nest-eslint");
    expect((error as GenerateError).message).toBe(
      "nest eslint generate is not implemented yet",
    );
  }
});

test("database none is an app shell", () => {
  const files = buildTree(
    resolveStack({
      database: "none",
      orm: "none",
      dbSetup: "none",
      auth: "none",
      api: "none",
    }),
    { projectName: "shell-app", packageManager: "bun" },
  );
  expect(files["package.json"]).toContain('"name": "shell-app"');
  expect(files["components/ui/button.tsx"]).toBeDefined();
  expect(files["app/notes/page.tsx"]).toBeUndefined();
  expect(files["prisma/schema.prisma"]).toBeUndefined();
  expect(files["router.ts"]).toBeUndefined();
});

test("api none still emits notes without an RPC router", () => {
  const files = buildTree(
    resolveStack({ api: "none" }),
    { projectName: "actions-app", packageManager: "bun" },
  );
  expect(files["app/notes/actions.ts"]).toContain('"use server"');
  expect(files["app/notes/page.tsx"]).toBeDefined();
  expect(files["router.ts"]).toBeUndefined();
  expect(files["app/rpc/[[...rest]]/route.ts"]).toBeUndefined();
  expect(files["prisma/schema.prisma"]).toContain("model Note");
});

test("api none on Start uses createServerFn", () => {
  const files = buildTree(
    resolveStack({
      frontend: "tanstack-start",
      api: "none",
      auth: "none",
      linter: "oxlint",
    }),
    { projectName: "start-actions", packageManager: "bun" },
  );
  expect(files["src/server/notes.ts"]).toContain("createServerFn");
  expect(files["src/server/router.ts"]).toBeUndefined();
  expect(files["packages/contract/package.json"]).toBeUndefined();
});

test("api none on Nest is REST without a contract package", () => {
  const files = buildTree(
    resolveStack({
      backend: "nest",
      api: "none",
      linter: "biome",
    }),
    { projectName: "nest-rest", packageManager: "pnpm" },
  );
  expect(files["apps/server/src/notes.controller.ts"]).toContain('@Get()');
  expect(files["packages/contract/src/contract.ts"]).toBeUndefined();
  expect(files["apps/server/prisma/schema.prisma"]).toBeDefined();
  expect(files["apps/web/prisma/schema.prisma"]).toBeUndefined();
  expect(JSON.stringify(files["apps/web/package.json"])).not.toContain("prisma");
});
