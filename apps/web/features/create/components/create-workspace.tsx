import { FolderTree, Settings2Icon } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { Spinner } from '@/components/ui/spinner';
import {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

import { CreateBuilder } from './create-builder';
import { CreateCommand } from './create-command';
import { CreateNameField } from './create-name-field';
import { CreateProvider } from './create-provider';

const CreatePreview = dynamic(() =>
  import('./create-preview').then((mod) => mod.CreatePreview)
);

export function CreateWorkspace() {
  return (
    <CreateProvider>
      <div className="grid flex-1 grid-cols-1 border-x p-0 [--builder-height:calc(100svh-var(--top-height)-var(--bottom-height))] xl:grid-cols-3">
        <div className="gap-0 rounded-none bg-transparent ring-0 xl:col-span-1">
          <CreateNameField />
          <div className="border-b px-4 pb-3">
            <CreateCommand />
          </div>
        </div>
        <div className="border-border h-(--builder-height) min-h-0 overflow-hidden xl:col-span-2 xl:border-l">
          <Tabs defaultValue="config" className="h-full gap-0">
            <div className="flex items-center border-b">
              <TabsList className="h-10 rounded-none inset-ring-0 dark:bg-transparent">
                <TabsTrigger value="config">
                  <Settings2Icon /> Configure
                </TabsTrigger>
                <TabsTrigger value="preview">
                  <FolderTree /> Preview
                </TabsTrigger>
                <TabsIndicator className="bg-foreground dark:bg-foreground h-0.5 translate-y-0 rounded-none inset-ring-0" />
              </TabsList>
            </div>
            <TabsContent value="config" className="overflow-auto">
              <CreateBuilder />
            </TabsContent>
            <TabsContent
              value="preview"
              className="h-full min-h-0 overflow-x-hidden"
            >
              <Suspense
                fallback={
                  <div className="rounded-mg flex h-full items-center justify-center gap-2 p-4">
                    <Spinner className="size-4" />
                    Loading…
                  </div>
                }
              >
                <CreatePreview />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </CreateProvider>
  );
}
