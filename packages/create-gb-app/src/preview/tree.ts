import type { Stack } from '#/types/stack';

export function previewTree(stack: Stack): string {
  switch (stack.backend) {
    case 'nest':
    case 'hono': {
      const web =
        stack.backend === 'nest' && stack.frontend === 'tanstack-start'
          ? 'apps/web/src/routes'
          : 'apps/web';
      const rows = [web, 'apps/server'];
      if (stack.api !== 'none') {
        rows.push('packages/contract');
      }
      rows.push('packages/typescript-config', 'packages/ui', 'turbo.json');
      return rows.join('\n');
    }
    case 'convex':
      return ['app', 'convex', 'package.json'].join('\n');
    case 'self':
      if (stack.frontend === 'tanstack-start') {
        return [
          'src/routes',
          stack.api === 'none' ? 'src/server/notes.ts' : 'src/server',
          ...(stack.database === 'none' ? [] : ['prisma']),
          'package.json',
        ].join('\n');
      }
      return [
        'app',
        'lib',
        ...(stack.database === 'none' ? [] : ['prisma']),
        'package.json',
      ].join('\n');
    default: {
      const _exhaustive: never = stack;
      throw new Error(`unhandled backend: ${JSON.stringify(_exhaustive)}`);
    }
  }
}
