import type { StudioFlags } from '../types/stack';
import { PROJECT_NAME } from './command';

export type TreeNode = {
  name: string;
  path: string;
  kind: 'file' | 'folder';
  children?: TreeNode[];
};

export function getFolderTree(flags: StudioFlags): TreeNode {
  switch (flags.backend) {
    case 'self':
      return folder(PROJECT_NAME, PROJECT_NAME, selfChildren(flags));
    case 'nest':
      return folder(PROJECT_NAME, PROJECT_NAME, nestChildren(flags));
    case 'convex':
      return folder(PROJECT_NAME, PROJECT_NAME, convexChildren(flags));
    default: {
      const _exhaustive: never = flags.backend;
      throw new Error(`unhandled backend: ${_exhaustive}`);
    }
  }
}

function selfChildren(flags: StudioFlags): TreeNode[] {
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

function nestChildren(flags: StudioFlags): TreeNode[] {
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

function convexChildren(flags: StudioFlags): TreeNode[] {
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
