import { expect, test } from "bun:test";
import { GenerateError } from "../src/generate/errors.ts";
import { buildTree } from "../src/generate/build-tree.ts";
import {
  decodePreset,
  encodePreset,
  GOLDEN_PRESETS,
  rawFlagsFromPreset,
} from "../src/preset.ts";
import { resolveStack, YES_DEFAULTS } from "../src/stack/resolve.ts";
import type { PresetFields } from "../src/stack/types.ts";

test("encodePreset of --yes defaults is null", () => {
  expect(encodePreset(YES_DEFAULTS)).toBeNull();
});

test("encodePreset and decodePreset round-trip a non-default overlay", () => {
  const fields: PresetFields = {
    ...YES_DEFAULTS,
    frontend: "tanstack-start",
    linter: "oxlint",
  };
  const code = encodePreset(fields);
  expect(code).not.toBeNull();
  expect(decodePreset(code!)).toEqual(rawFlagsFromPreset(fields));
});

test("encodePreset packs nest backend only as g111", () => {
  expect(encodePreset({ ...YES_DEFAULTS, backend: "nest" }) as string | null).toBe(
    "g111",
  );
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

