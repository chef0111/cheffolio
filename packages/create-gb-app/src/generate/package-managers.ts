import type { PackageManager } from '#/types/generate';

export const PACKAGE_MANAGER_METADATA = {
  bun: {
    version: '1.3.4',
    minimumVersion: '1.2.0',
    install: 'bun install',
    run: 'bun run',
  },
  pnpm: {
    version: '10.17.1',
    minimumVersion: '9.5.0',
    install: 'pnpm install',
    run: 'pnpm run',
  },
  yarn: {
    version: '4.11.0',
    minimumVersion: '4.11.0',
    install: 'yarn install',
    run: 'yarn run',
  },
  npm: {
    version: '11.6.2',
    minimumVersion: '7.0.0',
    install: 'npm install',
    run: 'npm run',
  },
} as const satisfies Record<
  PackageManager,
  { version: string; minimumVersion: string; install: string; run: string }
>;

export function isPackageManager(value: unknown): value is PackageManager {
  return (
    typeof value === 'string' && Object.hasOwn(PACKAGE_MANAGER_METADATA, value)
  );
}
