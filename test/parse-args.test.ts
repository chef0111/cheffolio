import { expect, test } from "bun:test";
import { parseArgs, ParseError } from "../src/cli/parse-args.ts";

test("single directory positional", () => {
  expect(parseArgs(["my-gb-app", "--yes"])).toEqual({
    projectName: "my-gb-app",
    yes: true,
  });
});

test("extra positionals are rejected", () => {
  expect(() => parseArgs(["my-gb-app", "extra", "--yes"])).toThrow(ParseError);
  try {
    parseArgs(["my-gb-app", "extra"]);
    throw new Error("expected ParseError");
  } catch (error) {
    expect(error).toBeInstanceOf(ParseError);
    expect((error as ParseError).message).toContain("extra");
  }
});

test("--preset nest expands to a generatable overlay", () => {
  const raw = parseArgs(["my-gb-app", "--yes", "--preset", "nest"]);
  expect(raw.preset).toBe("nest");
  expect(raw.backend).toBe("nest");
  expect(raw.linter).toBe("biome");
  expect(raw.api).toBeUndefined();
  expect(raw.database).toBeUndefined();
  expect(raw.orm).toBeUndefined();
  expect(raw.dbSetup).toBeUndefined();
  expect(raw.yes).toBe(true);
  expect(raw.projectName).toBe("my-gb-app");
});

test("explicit flags overlay the preset", () => {
  const raw = parseArgs([
    "--preset",
    "g111",
    "--frontend",
    "tanstack-start",
  ]);
  expect(raw.frontend).toBe("tanstack-start");
  expect(raw.preset).toBe("g111");
  expect(raw.backend).toBe("nest");
});

test("unknown --preset fails closed", () => {
  expect(() => parseArgs(["--preset", "nope"])).toThrow(ParseError);
});
