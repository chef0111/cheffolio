'use client';

import { Panel } from '@/components/cheffolio/panel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { CreateCommand } from './create-command';
import { CreateNameField } from './create-name-field';
import { CreatePicker } from './create-picker';
import { CreateProvider } from './create-provider';
import { CreateTree } from './create-tree';

export function CreateWorkspace() {
  return (
    <CreateProvider>
      <Panel className="screen-line-bottom-none screen-line-top-none p-0">
        <CreateNameField />
        <div className="border-border border-t px-4 py-3">
          <CreateCommand />
        </div>
      </Panel>
      <Panel className="screen-line-top-none screen-line-bottom-none border-t p-0">
        <div className="grid md:grid-cols-2">
          <div className="border-border md:border-r">
            <CreatePicker />
          </div>
          <Card className="rounded-none bg-transparent ring-0">
            <CardHeader className="border-b">
              <CardTitle id="create-folder-tree">Folder tree</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <CreateTree />
            </CardContent>
          </Card>
        </div>
      </Panel>
    </CreateProvider>
  );
}
