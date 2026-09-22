export type TreeNode = {
  name: string;
  path: string;
  kind: 'file' | 'folder';
  children?: TreeNode[];
};

export function treeFromPaths(
  paths: readonly string[],
  rootName: string
): TreeNode {
  const root: TreeNode = {
    name: rootName,
    path: '',
    kind: 'folder',
    children: [],
  };
  const folders = new Map<string, TreeNode>([['', root]]);

  for (const raw of paths) {
    const filePath = normalizePath(raw);
    if (!filePath) {
      continue;
    }
    insertFile(folders, filePath);
  }

  sortTree(root);
  return root;
}

export function treeNodeId(node: TreeNode): string {
  return node.path === '' ? `root:${node.name}` : node.path;
}

export function collectFolderIds(node: TreeNode): string[] {
  if (node.kind === 'file') {
    return [];
  }

  const ids: string[] = [];
  if ((node.children?.length ?? 0) > 0) {
    ids.push(treeNodeId(node));
  }
  for (const child of node.children ?? []) {
    ids.push(...collectFolderIds(child));
  }
  return ids;
}

function insertFile(folders: Map<string, TreeNode>, filePath: string): void {
  const segments = filePath.split('/').filter(Boolean);
  if (segments.length === 0) {
    return;
  }

  let parentPath = '';
  for (let index = 0; index < segments.length; index += 1) {
    const name = segments[index];
    if (!name) {
      continue;
    }
    const isFile = index === segments.length - 1;
    const path = parentPath ? `${parentPath}/${name}` : name;
    const parent = folders.get(parentPath);
    if (!parent) {
      return;
    }
    const siblings = parent.children ?? (parent.children = []);

    if (isFile) {
      if (
        !siblings.some((child) => child.kind === 'file' && child.path === path)
      ) {
        siblings.push({ name, path, kind: 'file' });
      }
      continue;
    }

    let folder = folders.get(path);
    if (!folder) {
      folder = { name, path, kind: 'folder', children: [] };
      siblings.push(folder);
      folders.set(path, folder);
    }
    parentPath = path;
  }
}

function normalizePath(path: string): string {
  return path
    .replaceAll('\\', '/')
    .replace(/^\.\/+/, '')
    .replace(/^\/+|\/+$/g, '');
}

function sortTree(node: TreeNode): void {
  if (node.kind === 'file' || !node.children) {
    return;
  }
  node.children.sort(compareNodes);
  for (const child of node.children) {
    sortTree(child);
  }
}

function compareNodes(a: TreeNode, b: TreeNode): number {
  if (a.kind !== b.kind) {
    return a.kind === 'folder' ? -1 : 1;
  }
  return a.name.localeCompare(b.name);
}
