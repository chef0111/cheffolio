import { expect, test } from 'bun:test';

import { YES_DEFAULTS } from './compat';
import { collectFolderIds, getFolderTree, treeNodeId } from './tree';

test('folder ids stay unique when the project name matches a child', () => {
  const tree = getFolderTree(YES_DEFAULTS, 'app');
  const ids = collectFolderIds(tree);
  const rootId = treeNodeId(tree);
  const appFolder = tree.children?.find((child) => child.name === 'app');

  expect(rootId).toBe('root:app');
  expect(appFolder).toBeDefined();
  expect(treeNodeId(appFolder!, rootId)).not.toBe(rootId);
  expect(new Set(ids).size).toBe(ids.length);
  expect(ids).toContain(rootId);
  expect(ids).toContain(treeNodeId(appFolder!, rootId));
});

test('tanstack start expands src/routes instead of app', () => {
  const nextIds = collectFolderIds(getFolderTree(YES_DEFAULTS));
  const tanstackIds = collectFolderIds(
    getFolderTree({ ...YES_DEFAULTS, frontend: 'tanstack-start' })
  );

  expect(nextIds.some((id) => id.includes('/app'))).toBe(true);
  expect(tanstackIds.some((id) => id.includes('src/routes'))).toBe(true);
  expect(nextIds.join('|')).not.toBe(tanstackIds.join('|'));
});
