import type { Stack } from "../stack/types.ts";

export function isStart(stack: Stack): boolean {
  return stack.frontend === "tanstack-start";
}

export function webPrefix(stack: Stack): string {
  if (stack.backend === "nest") {
    return "apps/web/";
  }
  return "";
}

export function serverPrefix(stack: Stack): string {
  if (stack.backend === "nest") {
    return "apps/server/";
  }
  return isStart(stack) ? "src/" : "";
}

export function appDir(stack: Stack): string {
  if (stack.backend === "nest") {
    return "apps/web/app";
  }
  return isStart(stack) ? "src/routes" : "app";
}

export function libDir(stack: Stack): string {
  if (stack.backend === "nest") {
    return "apps/web/lib";
  }
  return isStart(stack) ? "src/lib" : "lib";
}

export function joinPath(prefix: string, rel: string): string {
  if (!prefix) {
    return rel;
  }
  return `${prefix.replace(/\/$/, "")}/${rel}`;
}
