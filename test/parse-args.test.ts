import { expect, test } from "bun:test";
import { parseArgs, ParseError } from "../src/cli/parse-args.ts";

test("single directory positional", () => {
  expect(parseArgs(["my-app", "--yes"])).toEqual({
    projectName: "my-app",
    yes: true,
  });
});

test("extra positionals are rejected", () => {
  expect(() => parseArgs(["my-app", "extra", "--yes"])).toThrow(ParseError);
  try {
    parseArgs(["my-app", "extra"]);
    throw new Error("expected ParseError");
  } catch (error) {
    expect(error).toBeInstanceOf(ParseError);
    expect((error as ParseError).message).toContain("extra");
  }
});
