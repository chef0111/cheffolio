'use client';

import {
  TreeExpander,
  TreeIcon,
  TreeLabel,
  TreeNode,
  TreeNodeContent,
  TreeNodeTrigger,
  TreeProvider,
  TreeView,
} from '@/components/kibo-ui/tree';

import {
  collectFolderIds,
  type TreeNode as FolderNode,
  treeNodeId,
} from '../lib/tree';
import { useCreate } from './create-provider';

export function CreateTree() {
  const { tree } = useCreate();
  const expandedIds = collectFolderIds(tree);

  return (
    <TreeProvider
      key={expandedIds.join('|')}
      defaultExpandedIds={expandedIds}
      selectable={false}
      className="px-2 py-3"
    >
      <TreeView>
        <FolderTreeNode node={tree} level={0} isLast />
      </TreeView>
    </TreeProvider>
  );
}

function FolderTreeNode({
  node,
  level,
  isLast,
  parentId,
}: {
  node: FolderNode;
  level: number;
  isLast: boolean;
  parentId?: string;
}) {
  const children = node.children ?? [];
  const isFolder = node.kind === 'folder';
  const hasChildren = children.length > 0;
  const nodeId = treeNodeId(node, parentId);

  return (
    <TreeNode nodeId={nodeId} level={level} isLast={isLast}>
      <TreeNodeTrigger>
        <TreeExpander hasChildren={hasChildren} />
        <TreeIcon hasChildren={isFolder} />
        <TreeLabel className="font-mono">{node.name}</TreeLabel>
      </TreeNodeTrigger>
      {hasChildren ? (
        <TreeNodeContent hasChildren>
          {children.map((child, index) => (
            <FolderTreeNode
              key={treeNodeId(child, nodeId)}
              node={child}
              level={level + 1}
              isLast={index === children.length - 1}
              parentId={nodeId}
            />
          ))}
        </TreeNodeContent>
      ) : null}
    </TreeNode>
  );
}
