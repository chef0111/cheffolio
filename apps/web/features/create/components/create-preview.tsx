'use client';

import {
  ChevronLeftIcon,
  FilesIcon,
  FoldersIcon,
  InfoIcon,
} from 'lucide-react';
import React from 'react';
import { browser } from 'react-dom';

import { Button } from '@/components/ui/button';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

import { defaultSelectedPath, type FileMap } from '../data/file-map';
import {
  type GeneratedPreview,
  type PreviewResult,
  useGeneratedPreview,
} from '../hooks/use-generated-preview';
import { resolveProjectName } from '../lib/command';
import { countTreeEntries, treeFromPaths } from '../lib/tree-from-paths';
import { CreateFilePreview } from './create-file-preview';
import { CreateTree } from './create-tree';

type NarrowPane = 'tree' | 'code';
type PreviewTree = ReturnType<typeof treeFromPaths>;
type PreviewFile = { path: string; contents: string };

const BUILDER_DEFAULT_SIZE = '32%';
const BUILDER_MIN_SIZE = '28%';
const PREVIEW_DEFAULT_SIZE = '66%';
const PREVIEW_MIN_SIZE = '50%';

export function CreatePreview() {
  React.use(browser());

  const preview = useGeneratedPreview();
  if (!preview) {
    return null;
  }

  return <CreatePreviewResult preview={preview} />;
}

function CreatePreviewResult({ preview }: { preview: GeneratedPreview }) {
  const result = React.use(preview.promise);

  return (
    <CreatePreviewContents result={result} projectName={preview.projectName} />
  );
}

function CreatePreviewContents({
  result,
  projectName,
}: {
  result: PreviewResult;
  projectName: string;
}) {
  const rootName = resolveProjectName(projectName);
  const [selectedPath, setSelectedPath] = React.useState('');
  const [narrowPane, setNarrowPane] = React.useState<NarrowPane>('tree');

  const files: FileMap | null = result.ok ? result.files : null;
  const paths = React.useMemo(() => Object.keys(files ?? {}).sort(), [files]);
  const pathKey = paths.join('\0');
  const tree = React.useMemo(
    () => treeFromPaths(pathKey ? pathKey.split('\0') : [], rootName),
    [pathKey, rootName]
  );

  const resolvedPath =
    files && selectedPath in files
      ? selectedPath
      : (defaultSelectedPath(paths) ?? paths[0] ?? '');

  const contents = files?.[resolvedPath];
  const file = contents === undefined ? null : { path: resolvedPath, contents };

  const onSelectPath = React.useCallback((path: string) => {
    setSelectedPath(path);
    setNarrowPane('code');
  }, []);

  if (!result.ok) {
    return (
      <p className="text-muted-foreground px-4 py-3 text-sm">
        {result.message}
      </p>
    );
  }

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
            defaultSize={BUILDER_DEFAULT_SIZE}
            minSize={BUILDER_MIN_SIZE}
            className="min-h-0 overflow-y-auto"
          >
            <CreatePreviewTreePane
              tree={tree}
              selectedPath={resolvedPath}
              onSelectPath={onSelectPath}
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel
            defaultSize={PREVIEW_DEFAULT_SIZE}
            minSize={PREVIEW_MIN_SIZE}
            className="min-h-0"
          >
            <CreatePreviewCodePane file={file} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

const CreatePreviewTreePane = React.memo(function CreatePreviewTreePane({
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
});

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
