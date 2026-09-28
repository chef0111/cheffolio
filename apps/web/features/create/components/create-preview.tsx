'use client';

import type { PackageManager } from 'create-gb-app/generate';
import type { CreateFlags } from 'create-gb-app/preset';
import {
  ChevronLeftIcon,
  FilesIcon,
  FoldersIcon,
  InfoIcon,
} from 'lucide-react';
import {
  memo,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { usePackageManager } from '@/components/cheffolio/code-block-command';
import { Button } from '@/components/ui/button';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Spinner } from '@/components/ui/spinner';

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
type PreviewResponse = {
  key: string;
  result: PreviewResult;
};
type PreviewCacheEntry = {
  promise: ReturnType<typeof generatePreview>;
  result?: PreviewResult;
};

const PREVIEW_CACHE_LIMIT = 20;
const previewCache = new Map<string, PreviewCacheEntry>();

export function CreatePreview() {
  const { flags, previewProjectName } = useCreate();
  const [selectedManager] = usePackageManager();
  const packageManager = selectedManager === 'prompt' ? 'bun' : selectedManager;
  const requestKey = previewKey(flags, previewProjectName, packageManager);
  const [response, setResponse] = useState<PreviewResponse | null>(() => {
    const result = previewCache.get(requestKey)?.result;
    return result ? { key: requestKey, result } : null;
  });
  const cachedResult = previewCache.get(requestKey)?.result;
  const visibleResponse = cachedResult
    ? { key: requestKey, result: cachedResult }
    : response;

  useEffect(() => {
    if (previewCache.get(requestKey)?.result) {
      return;
    }

    let cancelled = false;
    void previewResult(requestKey)
      .then((result) => {
        if (!cancelled) {
          startTransition(() => setResponse({ key: requestKey, result }));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setResponse({
            key: requestKey,
            result: {
              ok: false,
              message: 'Could not generate the preview. Please try again.',
              code: 'unknown',
            },
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [requestKey]);

  if (!visibleResponse) {
    return (
      <div className="flex h-full items-center justify-center gap-2 p-4">
        <Spinner className="size-4" />
        Loading preview…
      </div>
    );
  }

  return <CreatePreviewContents response={visibleResponse} />;
}

function CreatePreviewContents({ response }: { response: PreviewResponse }) {
  const [, deferredName] = JSON.parse(response.key) as [
    CreateFlags,
    string,
    PackageManager,
  ];
  const result = response.result;
  const rootName = resolveProjectName(deferredName);
  const [selectedPath, setSelectedPath] = useState('');
  const [narrowPane, setNarrowPane] = useState<NarrowPane>('tree');

  const files: FileMap | null = result.ok ? result.files : null;
  const paths = useMemo(() => Object.keys(files ?? {}).sort(), [files]);
  const pathKey = paths.join('\0');
  const tree = useMemo(
    () => treeFromPaths(pathKey ? pathKey.split('\0') : [], rootName),
    [pathKey, rootName]
  );
  const resolvedPath =
    files && selectedPath in files
      ? selectedPath
      : (defaultSelectedPath(paths) ?? paths[0] ?? '');
  const contents = files?.[resolvedPath];
  const file = contents === undefined ? null : { path: resolvedPath, contents };
  const onSelectPath = useCallback((path: string) => {
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

const CreatePreviewTreePane = memo(function CreatePreviewTreePane({
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

function previewKey(
  flags: CreateFlags,
  projectName: string,
  packageManager: PackageManager
) {
  return JSON.stringify([flags, projectName, packageManager]);
}

function previewResult(key: string) {
  const cached = previewCache.get(key);
  if (cached) {
    previewCache.delete(key);
    previewCache.set(key, cached);
    return cached.promise;
  }
  const [flags, projectName, packageManager] = JSON.parse(key) as [
    CreateFlags,
    string,
    PackageManager,
  ];
  const entry: PreviewCacheEntry = {
    promise: generatePreview(flags, projectName, packageManager),
  };
  previewCache.set(key, entry);
  void entry.promise.then(
    (result) => {
      entry.result = result;
    },
    () => {
      if (previewCache.get(key) === entry) {
        previewCache.delete(key);
      }
    }
  );

  if (previewCache.size > PREVIEW_CACHE_LIMIT) {
    const oldestKey = previewCache.keys().next().value;
    if (oldestKey) {
      previewCache.delete(oldestKey);
    }
  }

  return entry.promise;
}
