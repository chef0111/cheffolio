'use client';

import { FileIcon, FolderIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { TreeNode } from '../lib/tree';
import { useStudio } from './studio-provider';

export function StudioTree() {
  const { tree } = useStudio();

  return (
    <Card className="rounded-none ring-0">
      <CardHeader className="border-b">
        <CardTitle>Folder tree</CardTitle>
      </CardHeader>
      <CardContent>
        <TreeList nodes={[tree]} />
      </CardContent>
    </Card>
  );
}

function TreeList({ nodes }: { nodes: TreeNode[] }) {
  return (
    <ul className="flex flex-col gap-1">
      {nodes.map((node) => (
        <TreeItem key={node.path} node={node} />
      ))}
    </ul>
  );
}

function TreeItem({ node }: { node: TreeNode }) {
  const Icon = node.kind === 'folder' ? FolderIcon : FileIcon;
  const hasChildren = Boolean(node.children?.length);

  return (
    <li>
      <div className="flex items-center gap-2 font-mono text-sm">
        <Icon className="text-muted-foreground size-3.5 shrink-0" />
        <span>{node.name}</span>
      </div>
      {hasChildren ? (
        <div className="border-border mt-1 ml-2 border-l pl-3">
          <TreeList nodes={node.children ?? []} />
        </div>
      ) : null}
    </li>
  );
}
