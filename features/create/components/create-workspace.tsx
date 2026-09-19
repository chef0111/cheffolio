'use client';

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
import { CreatePreview } from './create-preview';
import { CreateProvider } from './create-provider';

export function CreateWorkspace() {
  return (
    <CreateProvider>
      <div className="grid flex-1 grid-cols-1 border-x p-0 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-1 gap-0 rounded-none bg-transparent ring-0">
          <CreateNameField />
          <div className="border-b px-4 pb-3">
            <CreateCommand />
          </div>
        </div>
        <div className="border-border md:col-span-1 md:border-l lg:col-span-2">
          <Tabs defaultValue="builder" className="h-full gap-0">
            <div className="flex items-center border-b px-4 py-2">
              <TabsList>
                <TabsTrigger value="builder">Builder</TabsTrigger>
                <TabsTrigger value="tree">Tree</TabsTrigger>
                <TabsIndicator />
              </TabsList>
            </div>
            <TabsContent value="builder" className="overflow-auto">
              <CreateBuilder />
            </TabsContent>
            <TabsContent value="tree" className="min-h-0 overflow-hidden">
              <CreatePreview />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </CreateProvider>
  );
}
