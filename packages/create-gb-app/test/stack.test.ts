import { describe, expect, test } from "bun:test";
import { CompatError, type RuleId } from "../src/stack/errors";
import { resolveStack } from "../src/stack/resolve";
import type { RawFlags, Stack } from "../src/stack/types";
import compat from "./fixtures/compat.json";

test("--yes default", () => {
  const stack = resolveStack({ yes: true });
  expect(stack).toEqual(compat.yesDefault as Stack);
});

for (const legal of compat.legal) {
  test(legal.name, () => {
    expect(resolveStack(legal.flags as RawFlags)).toEqual(legal.stack as Stack);
  });
}

for (const illegal of compat.illegal) {
  test(illegal.name, () => {
    try {
      resolveStack(illegal.flags as RawFlags);
      throw new Error(`expected CompatError ${illegal.ruleId}`);
    } catch (error) {
      expect(error).toBeInstanceOf(CompatError);
      expect((error as CompatError).ruleId).toBe(illegal.ruleId as RuleId);
    }
  });
}

describe("parse then resolve", () => {
  test("literal --yes stack JSON", () => {
    expect(resolveStack({ yes: true })).toEqual({
      frontend: "next",
      backend: "self",
      api: "orpc",
      database: "postgres",
      orm: "prisma",
      dbSetup: "none",
      auth: "better-auth",
      payments: "none",
      ui: "shadcn",
      linter: "eslint",
      monorepo: false,
    });
  });
});

test("convex with explicit db-setup none", () => {
  const convexHappy = compat.legal.find((row) => row.name === "convex happy path");
  expect(convexHappy).toBeDefined();
  expect(resolveStack({ backend: "convex", dbSetup: "none" })).toEqual(
    convexHappy!.stack as Stack,
  );
});

test("CompatError ruleId is not writable", () => {
  const error = new CompatError("nest-requires-orpc");
  expect(Object.getOwnPropertyDescriptor(error, "ruleId")?.writable).toBe(
    false,
  );
});
