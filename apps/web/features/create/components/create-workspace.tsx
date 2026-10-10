import { FolderTree, Settings2Icon } from 'lucide-react';
import { lazy, Suspense } from 'react';

import { UrlTabs } from '@/components/app/url-tabs';
import { Spinner } from '@/components/ui/spinner';
import {
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

import { CreateActions } from './create-actions';
import { CreateCommand } from './create-command';
import { CreateNameField } from './create-name-field';
import { CreateProvider } from './create-provider';
import { CreateStackSummary } from './create-stack-summary';

const CreateBuilder = lazy(() =>
  import('./create-builder').then((mod) => ({ default: mod.CreateBuilder }))
);
const CreatePreview = lazy(() =>
  import('./create-preview').then((mod) => ({ default: mod.CreatePreview }))
);

const CREATE_TABS = ['builder', 'preview'] as const;

export function CreateWorkspace() {
  return (
    <CreateProvider>
      <div className="grid flex-1 grid-cols-1 border-x p-0 [--builder-height:calc(100svh-var(--top-height)-var(--bottom-height))] xl:grid-cols-3">
        <div className="flex max-h-(--builder-height) min-h-0 flex-col overflow-y-auto rounded-none bg-transparent ring-0 xl:col-span-1 xl:h-(--builder-height) xl:overflow-hidden">
          <CreateNameField />
          <div className="border-b px-3 pb-3">
            <CreateCommand />
          </div>
          <CreateStackSummary />
          <CreateActions />
        </div>
        <div className="border-border h-(--builder-height) min-h-0 overflow-hidden xl:col-span-2 xl:border-l">
          <UrlTabs
            defaultValue="builder"
            values={CREATE_TABS}
            className="h-full gap-0"
          >
            <div className="flex items-center border-b">
              <TabsList className="h-10 rounded-none inset-ring-0 dark:bg-transparent">
                <TabsTrigger value="builder">
                  <Settings2Icon /> Builder
                </TabsTrigger>
                <TabsTrigger value="preview">
                  <FolderTree /> Preview
                </TabsTrigger>
                <TabsIndicator className="bg-foreground dark:bg-foreground h-0.5 translate-y-0 rounded-none inset-ring-0" />
              </TabsList>
            </div>
            <TabsContent value="builder" className="overflow-auto">
              <Suspense
                fallback={<WorkspaceLoading placeholder="Loading builder…" />}
              >
                <CreateBuilder />
              </Suspense>
            </TabsContent>
            <TabsContent
              value="preview"
              className="h-full min-h-0 overflow-x-hidden"
            >
              <Suspense
                fallback={<WorkspaceLoading placeholder="Loading preview…" />}
              >
                <CreatePreview />
              </Suspense>
            </TabsContent>
          </UrlTabs>
        </div>
      </div>
    </CreateProvider>
  );
}

function WorkspaceLoading({ placeholder }: { placeholder: string }) {
  return (
    <div className="flex h-full w-full">
      <div className="bg-background dark:bg-input/30 m-auto flex w-fit items-center gap-2 rounded-md border p-2">
        <Spinner className="size-4" />
        {placeholder}
      </div>
    </div>
  );
}
