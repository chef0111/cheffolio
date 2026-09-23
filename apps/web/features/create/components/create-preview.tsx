'use client';

import { type CreateFlags, FLAG_GROUPS } from 'create-gb-app/preset';
import {
  ChevronLeftIcon,
  FilesIcon,
  FoldersIcon,
  InfoIcon,
} from 'lucide-react';
import { startTransition, useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

import { defaultSelectedPath, type FileMap } from '../data/file-map';
import { generatePreview } from '../lib/actions/generate-preview';
import { resolveProjectName } from '../lib/command';
import { countTreeEntries, treeFromPaths } from '../lib/tree-from-paths';
import { CreateFilePreview } from './create-file-preview';
import { useCreate } from './create-provider';
import { CreateTree } from './create-tree';

type NarrowPane = 'tree' | 'code';
type PreviewResult = Awaited<ReturnType<typeof generatePreview>>;
type PreviewTree = ReturnType<typeof treeFromPaths>;
type PreviewFile = { path: string; contents: string };

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

  const onSelectPath = (path: string) => {
    if (!(path in files)) {
      return;
    }
    setSelectedPath(path);
    setNarrowPane('code');
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-hidden md:hidden">
        {narrowPane === 'tree' ? (
          <CreatePreviewTreePane
            tree={tree}
            selectedPath={resolvedPath}
            onSelectPath={onSelectPath}
          />
        ) : (
          <CreatePreviewCodePane
            file={file}
            onBack={() => {
              setNarrowPane('tree');
            }}
          />
        )}
      </div>
      <div className="hidden min-h-0 flex-1 md:flex">
        <ResizablePanelGroup
          orientation="horizontal"
          className="min-h-0 flex-1"
        >
          <ResizablePanel
            defaultSize="32%"
            minSize="28%"
            className="min-h-0 overflow-y-auto"
          >
            <CreatePreviewTreePane
              tree={tree}
              selectedPath={resolvedPath}
              onSelectPath={onSelectPath}
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize="66%" minSize="50%" className="min-h-0">
            <CreatePreviewCodePane file={file} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

function CreatePreviewTreePane({
  tree,
  selectedPath,
  onSelectPath,
}: {
  tree: PreviewTree;
  selectedPath: string;
  onSelectPath: (path: string) => void;
}) {
  const { folders, files } = countTreeEntries(tree);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="text-muted-foreground flex h-10 shrink-0 items-center justify-between border-b px-4 md:h-11.5">
        <div className="flex items-center gap-4 text-xs [&_svg]:size-3.5">
          <span className="flex items-center gap-1">
            <FoldersIcon />
            {folders} {folders === 1 ? 'folder' : 'folders'}
          </span>
          <span className="flex items-center gap-1">
            <FilesIcon />
            {files} {files === 1 ? 'file' : 'files'}
          </span>
        </div>
        <InfoIcon className="size-4" />
      </div>
      <div className="bg-background scroll-fade min-h-0 flex-1 overflow-auto">
        <CreateTree
          tree={tree}
          selectedPath={selectedPath}
          onSelectPath={onSelectPath}
        />
      </div>
    </div>
  );
}

function CreatePreviewCodePane({
  file,
  onBack,
}: {
  file: PreviewFile | null;
  onBack?: () => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      {onBack && (
        <div className="flex shrink-0 items-center gap-1 border-b px-2 py-1">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onBack}
            aria-label="Back to files"
          >
            <ChevronLeftIcon data-icon="inline-start" />
            Files
          </Button>
          {file && (
            <span className="text-muted-foreground truncate text-[0.8rem]">
              {file.path}
            </span>
          )}
        </div>
      )}
      <div className="min-h-0 flex-1 overflow-hidden p-1">
        {file && <CreateFilePreview key={file.path} file={file} />}
      </div>
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
