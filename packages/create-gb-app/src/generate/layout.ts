import type { Stack } from '#/types/stack';

export type ProjectLayout = {
  structure: Stack['structure'];
  frontendRoot: '' | 'apps/web';
  backendRoot: '' | 'apps/web' | 'apps/server' | 'convex' | 'apps/web/convex';
  frontendManifest: 'package.json' | 'apps/web/package.json';
  backendManifest:
    | 'package.json'
    | 'apps/web/package.json'
    | 'apps/server/package.json'
    | null;
  sharedPackagesRoot: 'packages' | null;
};

export function projectLayout(stack: Stack): ProjectLayout {
  const frontendRoot = stack.structure === 'single' ? '' : 'apps/web';
  const frontendManifest =
    stack.structure === 'single' ? 'package.json' : 'apps/web/package.json';

  if (stack.backend === 'nest' || stack.backend === 'hono') {
    return {
      structure: stack.structure,
      frontendRoot,
      backendRoot: 'apps/server',
      frontendManifest,
      backendManifest: 'apps/server/package.json',
      sharedPackagesRoot: 'packages',
    };
  }
  if (stack.backend === 'convex') {
    return {
      structure: stack.structure,
      frontendRoot,
      backendRoot: stack.structure === 'single' ? 'convex' : 'apps/web/convex',
      frontendManifest,
      backendManifest: null,
      sharedPackagesRoot: stack.structure === 'single' ? null : 'packages',
    };
  }
  return {
    structure: stack.structure,
    frontendRoot,
    backendRoot: frontendRoot,
    frontendManifest,
    backendManifest: frontendManifest,
    sharedPackagesRoot: stack.structure === 'single' ? null : 'packages',
  };
}
