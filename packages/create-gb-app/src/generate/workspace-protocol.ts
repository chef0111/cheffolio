import type { PackageManager } from "./types";

export function workspaceProtocol(
  packageManager: PackageManager,
): "workspace:*" | "*" {
  return packageManager === "npm" ? "*" : "workspace:*";
}
