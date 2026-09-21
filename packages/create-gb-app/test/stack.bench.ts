import { expect, test } from "bun:test";
import { CompatError } from "../src/stack/errors.ts";
import { resolveStack } from "../src/stack/resolve.ts";
import type { RawFlags } from "../src/stack/types.ts";
import compat from "./fixtures/compat.json";

test("resolveStack 1000 mixed calls stay under 50ms", () => {
  const mixed: RawFlags[] = [
    { yes: true },
    ...(compat.legal.map((row) => row.flags) as RawFlags[]),
    ...(compat.illegal.map((row) => row.flags) as RawFlags[]),
  ];

  const start = performance.now();
  for (let i = 0; i < 1000; i++) {
    try {
      resolveStack(mixed[i % mixed.length]);
    } catch (error) {
      if (!(error instanceof CompatError)) {
        throw error;
      }
    }
  }
  const elapsed = performance.now() - start;
  expect(elapsed).toBeLessThan(50);
});
