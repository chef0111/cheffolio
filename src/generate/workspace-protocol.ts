import type { PackageManager } from "./types.ts";

export function workspaceProtocol(
  packageManager: PackageManager,
): "workspace:*" | "*" {
  return packageManager === "npm" ? "*" : "workspace:*";
}
