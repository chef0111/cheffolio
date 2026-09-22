import { expect, test } from 'bun:test';

import { defaultSelectedPath } from '../../data/file-map';
import {
  collectFolderIds,
  treeFromPaths,
  treeNodeId,
} from '../tree-from-paths';

test('treeFromPaths nests folders from literal paths', () => {
  const tree = treeFromPaths(
    ['package.json', 'app/page.tsx', 'app/layout.tsx', 'lib/utils.ts'],
    'my-gb-app'
  );

  expect(tree).toEqual({
    name: 'my-gb-app',
    path: '',
    kind: 'folder',
    children: [
      {
        name: 'app',
        path: 'app',
        kind: 'folder',
        children: [
          { name: 'layout.tsx', path: 'app/layout.tsx', kind: 'file' },
          { name: 'page.tsx', path: 'app/page.tsx', kind: 'file' },
        ],
      },
      {
        name: 'lib',
        path: 'lib',
        kind: 'folder',
        children: [{ name: 'utils.ts', path: 'lib/utils.ts', kind: 'file' }],
      },
      { name: 'package.json', path: 'package.json', kind: 'file' },
    ],
  });
});

test('folders sort before files at the same level', () => {
  const tree = treeFromPaths(['z.ts', 'a/b.ts', 'm.json'], 'app');

  expect(tree.children?.map((child) => child.name)).toEqual([
    'a',
    'm.json',
    'z.ts',
  ]);
});

test('root named app stays distinct from the app folder', () => {
  const tree = treeFromPaths(['app/page.tsx'], 'app');
  const ids = collectFolderIds(tree);
  const rootId = treeNodeId(tree);
  const appFolder = tree.children?.find((child) => child.name === 'app');

  expect(rootId).toBe('root:app');
  expect(appFolder?.name).toBe('app');
  expect(treeNodeId(appFolder!)).toBe('app');
  expect(treeNodeId(tree)).not.toBe(treeNodeId(appFolder!));
  expect(new Set(ids).size).toBe(ids.length);
  expect(ids).toContain(rootId);
  expect(ids).toContain('app');
});

test('collectFolderIds expands every folder with children', () => {
  const tree = treeFromPaths(['src/lib/utils.ts', 'package.json'], 'demo');

  expect(collectFolderIds(tree)).toEqual(['root:demo', 'src', 'src/lib']);
});

test('default selected path prefers package.json', () => {
  expect(
    defaultSelectedPath([
      'README.md',
      'app/page.tsx',
      'package.json',
      'lib/utils.ts',
    ])
  ).toBe('package.json');
});

test('treeFromPaths keeps README.md as a file', () => {
  const tree = treeFromPaths(['README.md', 'package.json'], 'my-gb-app');
  expect(tree.children?.map((child) => child.name)).toEqual([
    'package.json',
    'README.md',
  ]);
});

test('default selected path falls back to the first sorted key', () => {
  expect(defaultSelectedPath(['app/page.tsx', 'lib/utils.ts'])).toBe(
    'app/page.tsx'
  );
});

test('default selected path is null when there are no files', () => {
  expect(defaultSelectedPath([])).toBeNull();
});
