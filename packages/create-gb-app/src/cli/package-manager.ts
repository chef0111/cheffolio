import type { PackageManager } from '#/generate/types';

export function inferPackageManager(
  userAgent = process.env.npm_config_user_agent
): PackageManager {
  if (!userAgent) {
    return 'npm';
  }
  if (userAgent.startsWith('pnpm')) {
    return 'pnpm';
  }
  if (userAgent.startsWith('yarn')) {
    return 'yarn';
  }
  if (userAgent.startsWith('bun')) {
    return 'bun';
  }
  return 'npm';
}
