import type { PackageManager } from '#/types/generate';

export function workspaceProtocol(
  packageManager: PackageManager
): 'workspace:*' | '*' {
  return packageManager === 'npm' ? '*' : 'workspace:*';
}
