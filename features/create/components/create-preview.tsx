'use client';

import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { cn } from '@/lib/utils';

import { CREATE_FILE_MAP, defaultSelectedPath } from '../data/file-map';
import { resolveProjectName } from '../lib/command';
import { treeFromPaths } from '../lib/tree-from-paths';
import { CreateFilePreview } from './create-file-preview';
import { useCreate } from './create-provider';
import { CreateTree } from './create-tree';

const FIXTURE_PATHS = Object.keys(CREATE_FILE_MAP);

type NarrowPane = 'tree' | 'code';

export function CreatePreview() {
  const { projectName } = useCreate();
  const rootName = resolveProjectName(projectName);
  const tree = useMemo(
    () => treeFromPaths(FIXTURE_PATHS, rootName),
    [rootName]
  );
  const [selectedPath, setSelectedPath] = useState(
    () => defaultSelectedPath(FIXTURE_PATHS) ?? FIXTURE_PATHS[0] ?? ''
  );
  const [narrowPane, setNarrowPane] = useState<NarrowPane>('tree');

  const contents = CREATE_FILE_MAP[selectedPath];
  const file = contents === undefined ? null : { path: selectedPath, contents };

  return (
    <div className="flex min-h-[28rem] flex-col">
      <CreatePreviewNarrowToggle
        pane={narrowPane}
        onPaneChange={setNarrowPane}
      />
      <div className="grid min-h-0 flex-1 lg:grid-cols-2">
        <div
          className={cn(
            'min-h-0 overflow-auto border-b lg:border-r lg:border-b-0',
            narrowPane === 'code' && 'max-lg:hidden'
          )}
        >
          <CreateTree
            tree={tree}
            selectedPath={selectedPath}
            onSelectPath={(path) => {
              if (!(path in CREATE_FILE_MAP)) {
                return;
              }
              setSelectedPath(path);
              setNarrowPane('code');
            }}
          />
        </div>
        <div
          className={cn(
            'min-h-0 overflow-auto',
            narrowPane === 'tree' && 'max-lg:hidden'
          )}
        >
          <CreateFilePreview file={file} />
        </div>
      </div>
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
