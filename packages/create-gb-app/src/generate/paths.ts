import type { Stack } from "#/stack/types";

export function isStart(stack: Stack): boolean {
  return stack.frontend === "tanstack-start";
}

export function isAppsLayout(stack: Stack): boolean {
  return stack.backend === "nest" || stack.backend === "hono";
}

export function webPrefix(stack: Stack): string {
  if (isAppsLayout(stack)) {
    return "apps/web/";
  }
  return "";
}

export function serverPrefix(stack: Stack): string {
  if (isAppsLayout(stack)) {
    return "apps/server/";
  }
  return isStart(stack) ? "src/" : "";
}

export function appDir(stack: Stack): string {
  if (isAppsLayout(stack)) {
    return "apps/web/app";
  }
  return isStart(stack) ? "src/routes" : "app";
}

export function libDir(stack: Stack): string {
  if (isAppsLayout(stack)) {
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
