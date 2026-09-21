import { expect, test } from "bun:test";
import { buildTree } from "../src/generate/build-tree.ts";
import { resolveStack } from "../src/stack/resolve.ts";

const GOLDEN2_FLAGS = {
  frontend: "tanstack-start",
  backend: "self",
  api: "trpc",
  auth: "none",
  ui: "none",
  linter: "oxlint",
} as const;

const GOLDEN2_PATHS = [
  ".env",
  ".env.example",
  ".gitignore",
  ".oxlintrc.json",
  "README.md",
  "package.json",
  "prisma/schema.prisma",
  "src/components/providers.tsx",
  "src/lib/db.ts",
  "src/lib/query-client.ts",
  "src/lib/trpc.ts",
  "src/routes/__root.tsx",
  "src/routes/api/trpc.$.ts",
  "src/routes/index.tsx",
  "src/routes/notes.tsx",
  "src/server/router.ts",
  "src/server/trpc.ts",
  "src/styles.css",
  "tsconfig.json",
  "vite.config.ts",
];

test("buildTree golden 2 emits Start tRPC public notes with oxlint", () => {
  const yesStarted = performance.now();
  const yesFiles = buildTree(resolveStack({ yes: true }), {
    projectName: "yes-app",
    packageManager: "bun",
  });
  const yesMs = performance.now() - yesStarted;

  const started = performance.now();
  const stack = resolveStack(GOLDEN2_FLAGS);
  const files = buildTree(stack, {
    projectName: "start-trpc",
    packageManager: "bun",
  });
  const goldenMs = performance.now() - started;
  console.log(`buildTree --yes ${yesMs.toFixed(2)}ms golden2 ${goldenMs.toFixed(2)}ms`);
  expect(goldenMs).toBeLessThan(3000);
  expect(goldenMs).toBeLessThan(yesMs * 2 + 50);

  expect(Object.keys(files).sort()).toEqual(GOLDEN2_PATHS);
  expect(files["app/layout.tsx"]).toBeUndefined();
  expect(files["packages/contract"]).toBeUndefined();
  expect(files["eslint.config.mjs"]).toBeUndefined();
  expect(files["app/login/page.tsx"]).toBeUndefined();
  expect(files["components/ui/button.tsx"]).toBeUndefined();

  const pkg = JSON.parse(files["package.json"]) as {
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };
  expect(pkg.dependencies["@tanstack/react-start"]).toBeDefined();
  expect(pkg.dependencies["@trpc/server"]).toBeDefined();
  expect(pkg.devDependencies.oxlint).toBeDefined();
  expect(JSON.stringify(pkg.dependencies)).not.toContain("@orpc/");

  expect(files["src/routes/notes.tsx"]).toContain("trpc.notes.list.useQuery");
  expect(files["src/routes/notes.tsx"]).not.toContain("@/components/ui");
  expect(files["src/lib/trpc.ts"]).toContain('from "../server/router"');
  expect(files["src/server/router.ts"]).not.toContain("me:");
  expect(files["src/server/router.ts"]).toContain("publicProcedure");
  expect(files[".oxlintrc.json"]).toContain("oxlint");
  expect(files["prisma/schema.prisma"]).toContain("model Note");
  expect(files["prisma/schema.prisma"]).not.toContain("model User");
});

test("flags after --yes override ui and linter", () => {
  const stack = resolveStack({
    yes: true,
    frontend: "tanstack-start",
    api: "trpc",
    auth: "none",
    ui: "none",
    linter: "oxlint",
  });
  expect(stack.frontend).toBe("tanstack-start");
  expect(stack.backend).toBe("self");
  if (stack.backend !== "self") {
    throw new Error("expected self");
  }
  expect(stack.api).toBe("trpc");
  expect(stack.auth).toBe("none");
  expect(stack.ui).toBe("none");
  expect(stack.linter).toBe("oxlint");
});

test("resolver still rejects Nest plus tRPC", () => {
  expect(() => resolveStack({ backend: "nest", api: "trpc" })).toThrow(
    "nest-requires-orpc",
  );
});
