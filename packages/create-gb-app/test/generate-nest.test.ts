import { expect, test } from "bun:test";
import { buildTree } from "../src/generate/build-tree";
import { GenerateError } from "../src/generate/errors";
import { resolveStack } from "../src/stack/resolve";

const NEST_FLAGS = {
  backend: "nest",
  linter: "biome",
} as const;

test("buildTree Nest golden emits contract-first monorepo", () => {
  const started = performance.now();
  const stack = resolveStack(NEST_FLAGS);
  const files = buildTree(stack, {
    projectName: "nest-app",
    packageManager: "pnpm",
  });
  const ms = performance.now() - started;
  console.log(`buildTree nest ${ms.toFixed(2)}ms`);
  expect(ms).toBeLessThan(4000);

  expect(files["turbo.json"]).toBeDefined();
  expect(files["biome.json"]).toContain("unsafeParameterDecoratorsEnabled");
  expect(files["apps/web/package.json"]).toContain("@repo/contract");
  expect(files["apps/web/package.json"]).toContain("workspace:*");
  expect(files["apps/web/package.json"]).toContain("better-auth");
  expect(files["apps/server/package.json"]).toContain("better-auth");
  expect(files["apps/server/src/main.ts"]).toContain("bodyParser: false");
  expect(files["apps/server/src/app.module.ts"]).toContain("AuthModule.forRoot");
  expect(files["apps/server/src/app.module.ts"]).toContain("json:");
  expect(files["apps/server/src/main.ts"]).toContain("credentials: true");
  expect(files["apps/web/lib/orpc-link.ts"]).toContain("OpenAPILink");
  expect(files["apps/web/lib/orpc-link.ts"]).toContain('credentials: "include"');
  expect(files["apps/web/app/notes/notes-client.tsx"]).toContain("@repo/ui");
  expect(files["apps/web/app/notes/notes-client.tsx"]).not.toContain(
    "@/components/ui",
  );
  expect(files["apps/server/src/notes.controller.ts"]).toContain(
    "fromNodeHeaders",
  );

  const contract = Object.entries(files)
    .filter(([path]) => path.startsWith("packages/contract/"))
    .map(([, content]) => content)
    .join("\n");
  expect(contract).toContain("openapi(");
  expect(contract).not.toContain(".handler");

  expect(Object.keys(files).some((path) => path.includes("toWebHeaders"))).toBe(
    false,
  );
  expect(files["packages/eslint-config/package.json"]).toBeUndefined();
});

test("npm workspaces use star protocol", () => {
  const files = buildTree(resolveStack(NEST_FLAGS), {
    projectName: "nest-npm",
    packageManager: "npm",
  });
  expect(files["apps/web/package.json"]).toContain('"@repo/contract": "*"');
  expect(files["apps/web/package.json"]).not.toContain("workspace:");
});

test("nest plus default eslint has no FileMap", () => {
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
