import type { CreateFlags } from '../types/stack';
import { DEFAULT_PROJECT_NAME, resolveProjectName } from './command';

export type TreeNode = {
  name: string;
  path: string;
  kind: 'file' | 'folder';
  children?: TreeNode[];
};

export function getFolderTree(
  flags: CreateFlags,
  projectName = DEFAULT_PROJECT_NAME
): TreeNode {
  const name = resolveProjectName(projectName);
  switch (flags.backend) {
    case 'self':
      return folder(name, name, selfChildren(flags));
    case 'nest':
      return folder(name, name, nestChildren(flags));
    case 'convex':
      return folder(name, name, convexChildren(flags));
    default: {
      const _exhaustive: never = flags.backend;
      throw new Error(`unhandled backend: ${_exhaustive}`);
    }
  }
}

export function collectFolderIds(node: TreeNode): string[] {
  const ids: string[] = [];
  const children = node.children ?? [];
  if (node.kind === 'folder' && children.length > 0) {
    ids.push(node.path);
  }
  for (const child of children) {
    if (child.kind === 'folder') {
      ids.push(...collectFolderIds(child));
    }
  }
  return ids;
}

function selfChildren(flags: CreateFlags): TreeNode[] {
  const appRoot = flags.frontend === 'next' ? 'app' : 'src/routes';
  const appChildren: TreeNode[] = [folder('notes', `${appRoot}/notes`)];

  if (flags.auth !== 'none') {
    appChildren.unshift(
      folder('api/auth', `${appRoot}/api/auth`),
      folder('login', `${appRoot}/login`)
    );
  }

  if (flags.api === 'orpc') {
    appChildren.push(folder('rpc', `${appRoot}/rpc`));
  } else {
    appChildren.push(folder('api/trpc', `${appRoot}/api/trpc`));
  }

  const children: TreeNode[] = [
    folder(appRoot, appRoot, appChildren),
    folder('lib', 'lib'),
  ];

  if (flags.ui === 'shadcn') {
    children.splice(1, 0, folder('components/ui', 'components/ui'));
  }

  if (flags.orm === 'prisma') {
    children.push(folder('prisma', 'prisma'));
  } else {
    children.push(folder('drizzle', 'drizzle'));
  }

  if (flags.dbSetup === 'docker') {
    children.push(file('docker-compose.yml', 'docker-compose.yml'));
  }

  children.push(file('package.json', 'package.json'));
  return children;
}

function nestChildren(flags: CreateFlags): TreeNode[] {
  const children: TreeNode[] = [
    folder('apps/web', 'apps/web'),
    folder('apps/server', 'apps/server'),
    folder('packages/contract', 'packages/contract'),
    folder('packages/typescript-config', 'packages/typescript-config'),
  ];

  if (flags.ui === 'shadcn') {
    children.push(folder('packages/ui', 'packages/ui'));
  }

  children.push(
    file('turbo.json', 'turbo.json'),
    file('package.json', 'package.json')
  );
  return children;
}

function convexChildren(flags: CreateFlags): TreeNode[] {
  const appRoot = flags.frontend === 'next' ? 'app' : 'src/routes';
  const children: TreeNode[] = [
    folder(appRoot, appRoot),
    folder('convex', 'convex'),
  ];

  if (flags.ui === 'shadcn') {
    children.splice(1, 0, folder('components/ui', 'components/ui'));
  }

  children.push(file('package.json', 'package.json'));
  return children;
}

function folder(name: string, path: string, children?: TreeNode[]): TreeNode {
  return { name, path, kind: 'folder', children };
}

function file(name: string, path: string): TreeNode {
  return { name, path, kind: 'file' };
}
