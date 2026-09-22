'use client';

import { type CreateFlags, FLAG_GROUPS } from 'create-gb-app/preset';
import { startTransition, useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Label } from '@/components/ui/label';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { cn } from '@/lib/utils';

import { defaultSelectedPath, type FileMap } from '../data/file-map';
import { generatePreview } from '../lib/actions/generate-preview';
import { resolveProjectName } from '../lib/command';
import { treeFromPaths } from '../lib/tree-from-paths';
import { CreateFilePreview } from './create-file-preview';
import { useCreate } from './create-provider';
import { CreateTree } from './create-tree';

type NarrowPane = 'tree' | 'code';
type PreviewResult = Awaited<ReturnType<typeof generatePreview>>;

const EMPTY_FILES: FileMap = {};

const previewCache = new Map<string, ReturnType<typeof generatePreview>>();

export function CreatePreview() {
  const { flags, projectName } = useCreate();
  const rootName = resolveProjectName(projectName);
  const requestKey = previewKey(flags, projectName);
  const [result, setResult] = useState<PreviewResult | null>(null);
  const [selectedPath, setSelectedPath] = useState('');
  const [narrowPane, setNarrowPane] = useState<NarrowPane>('tree');

  useEffect(() => {
    let cancelled = false;
    void previewResult(flags, projectName).then((next) => {
      if (cancelled) {
        return;
      }
      startTransition(() => {
        setResult(next);
      });
    });
    return () => {
      cancelled = true;
    };
  }, [flags, projectName, requestKey]);

  const files: FileMap = result?.ok ? result.files : EMPTY_FILES;
  const paths = Object.keys(files);
  const tree = useMemo(() => treeFromPaths(paths, rootName), [paths, rootName]);
  const resolvedPath =
    selectedPath in files
      ? selectedPath
      : (defaultSelectedPath(paths) ?? paths[0] ?? '');
  const contents = files[resolvedPath];
  const file = contents === undefined ? null : { path: resolvedPath, contents };

  if (!result) {
    return null;
  }

  if (!result.ok) {
    return (
      <p className="text-muted-foreground px-4 py-3 text-sm">
        {result.message}
      </p>
    );
  }

  return (
    <div className="flex min-h-112 flex-col">
      <CreatePreviewNarrowToggle
        pane={narrowPane}
        onPaneChange={setNarrowPane}
      />
      <ResizablePanelGroup
        orientation="horizontal"
        className="min-h-0 flex-1 max-lg:block"
      >
        <ResizablePanel
          defaultSize={34}
          minSize={18}
          className={cn('min-h-0', narrowPane === 'code' && 'max-lg:hidden')}
        >
          <div className="flex h-full min-h-0 flex-col">
            <Label className="text-muted-foreground flex h-10 shrink-0 items-center px-4 text-sm">
              Files
            </Label>
            <div className="bg-background min-h-0 flex-1 overflow-auto">
              <CreateTree
                tree={tree}
                selectedPath={resolvedPath}
                onSelectPath={(path) => {
                  if (!(path in files)) {
                    return;
                  }
                  setSelectedPath(path);
                  setNarrowPane('code');
                }}
              />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className="max-lg:hidden" />
        <ResizablePanel
          defaultSize={66}
          minSize={30}
          className={cn('min-h-0', narrowPane === 'tree' && 'max-lg:hidden')}
        >
          <div className="h-full min-h-0 overflow-hidden p-1">
            {file ? <CreateFilePreview key={file.path} file={file} /> : null}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

function CreatePreviewNarrowToggle({
  pane,
  onPaneChange,
}: {
  pane: NarrowPane;
  onPaneChange: (pane: NarrowPane) => void;
}) {
  return (
    <div className="flex border-b px-3 py-2 lg:hidden">
      <ButtonGroup>
        <Button
          type="button"
          size="sm"
          variant={pane === 'tree' ? 'secondary' : 'outline'}
          aria-pressed={pane === 'tree'}
          onClick={() => {
            onPaneChange('tree');
          }}
        >
          Tree
        </Button>
        <Button
          type="button"
          size="sm"
          variant={pane === 'code' ? 'secondary' : 'outline'}
          aria-pressed={pane === 'code'}
          onClick={() => {
            onPaneChange('code');
          }}
        >
          Code
        </Button>
      </ButtonGroup>
    </div>
  );
}

function previewKey(flags: CreateFlags, projectName: string) {
  return `${projectName}:${FLAG_GROUPS.map((group) => flags[group]).join(',')}`;
}

function previewResult(flags: CreateFlags, projectName: string) {
  const key = previewKey(flags, projectName);
  const cached = previewCache.get(key);
  if (cached) {
    return cached;
  }
  const next = generatePreview(flags, projectName);
  previewCache.set(key, next);
  return next;
}
