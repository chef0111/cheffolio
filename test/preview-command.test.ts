import { expect, test } from "bun:test";
import { formatCommand } from "../src/preview/command.ts";

test("quotes directory names with spaces", () => {
  expect(formatCommand({ projectName: "my app" })).toBe("create-gb-app 'my app'");
});

test("omits default flags", () => {
  expect(formatCommand({ projectName: "my-gb-app", yes: true })).toBe(
    "create-gb-app my-gb-app --yes",
  );
});

test("prints --preset token and overlay flags only", () => {
  expect(
    formatCommand({
      projectName: "my-gb-app",
      yes: true,
      preset: "nest",
      backend: "nest",
      linter: "biome",
      frontend: "tanstack-start",
    }),
  ).toBe("create-gb-app my-gb-app --preset nest --frontend tanstack-start --yes");
});

test("keeps the preset token and omits expanded defaults", () => {
  expect(
    formatCommand({
      projectName: "my-gb-app",
      yes: true,
      preset: "nest",
      backend: "nest",
      linter: "biome",
    }),
  ).toBe("create-gb-app my-gb-app --preset nest --yes");
});
