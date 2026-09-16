import { expect, test } from "bun:test";
import { formatCommand } from "../src/preview/command.ts";

test("quotes directory names with spaces", () => {
  expect(formatCommand({ projectName: "my app" })).toBe("create-gb-app 'my app'");
});

test("omits default flags", () => {
  expect(formatCommand({ projectName: "my-app", yes: true })).toBe(
    "create-gb-app my-app --yes",
  );
});
