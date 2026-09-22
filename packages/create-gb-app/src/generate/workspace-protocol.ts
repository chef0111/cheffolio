import type { PackageManager } from "#/generate/types";

export function workspaceProtocol(
  packageManager: PackageManager,
): "workspace:*" | "*" {
  return packageManager === "npm" ? "*" : "workspace:*";
}
