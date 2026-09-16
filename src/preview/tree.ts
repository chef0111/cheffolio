import type { Stack } from "../stack/types.ts";

export function previewTree(stack: Stack): string {
  switch (stack.backend) {
    case "nest":
      return [
        "apps/web",
        "apps/server",
        "packages/contract",
        "packages/typescript-config",
        "packages/ui",
        "turbo.json",
      ].join("\n");
    case "convex":
      return ["app", "convex", "package.json"].join("\n");
    case "self":
      return ["app", "lib", "prisma", "package.json"].join("\n");
    default: {
      const _exhaustive: never = stack;
      throw new Error(`unhandled backend: ${JSON.stringify(_exhaustive)}`);
    }
  }
}
