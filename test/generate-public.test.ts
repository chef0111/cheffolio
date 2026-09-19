import { expect, test } from "bun:test";
import {
  buildTree,
  resolveStack,
  YES_DEFAULTS,
} from "../src/generate/public.ts";
import * as generate from "../src/generate/public.ts";

const YES_PATHS = [
  ".env",
  ".env.example",
  ".gitignore",
  "app/api/auth/[...all]/route.ts",
  "app/globals.css",
  "app/layout.tsx",
  "app/login/page.tsx",
  "app/notes/notes-client.tsx",
  "app/notes/page.tsx",
  "app/page.tsx",
  "app/providers.tsx",
  "app/rpc/[[...rest]]/route.ts",
  "components.json",
  "components/ui/button.tsx",
  "components/ui/card.tsx",
  "components/ui/input.tsx",
  "eslint.config.mjs",
  "lib/auth-client.ts",
  "lib/auth.ts",
  "lib/db.ts",
  "lib/orpc.ts",
  "lib/query-client.ts",
  "lib/utils.ts",
  "next-env.d.ts",
  "next.config.ts",
  "package.json",
  "postcss.config.mjs",
  "prettier.config.mjs",
  "prisma/schema.prisma",
  "router.ts",
  "tsconfig.json",
];

test("public generate still emits YES paths", () => {
  const files = buildTree(resolveStack({ yes: true }), {
    projectName: "yes-app",
    packageManager: "bun",
  });
  expect(Object.keys(files).sort()).toEqual(YES_PATHS);
  expect(YES_DEFAULTS.frontend).toBe("next");
  expect(YES_DEFAULTS.backend).toBe("self");
});

test("public generate does not export CLI or goldens", () => {
  expect("GOLDEN_PRESETS" in generate).toBe(false);
  expect("writeTree" in generate).toBe(false);
  expect("generateApp" in generate).toBe(false);
  expect("parseArgs" in generate).toBe(false);
  expect("ParseError" in generate).toBe(true);
});
