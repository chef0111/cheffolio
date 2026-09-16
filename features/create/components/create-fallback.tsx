import { Panel } from '@/components/cheffolio/panel';
import { CodeBlockCommand } from '@/components/code-block-command';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { convertNpmCommand } from '@/lib/convert-npm-command';

import { DEFAULT_COMMAND, DEFAULT_PROJECT_NAME } from '../lib/command';

export function CreateFallback() {
  return (
    <>
      <Panel className="screen-line-bottom-none p-0">
        <div className="flex flex-col gap-2 px-4 py-3">
          <Label htmlFor="create-project-name">Project name</Label>
          <Input
            id="create-project-name"
            name="projectName"
            defaultValue={DEFAULT_PROJECT_NAME}
            disabled
          />
        </div>
        <div className="border-border border-t px-4 py-3">
          <CodeBlockCommand {...convertNpmCommand(DEFAULT_COMMAND)} />
        </div>
      </Panel>
      <Panel className="screen-line-top-none p-0">
        <div className="grid md:grid-cols-2">
          <Card className="border-border rounded-none ring-0 md:border-r">
            <CardHeader className="border-b">
              <CardTitle>Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">Loading options</p>
            </CardContent>
          </Card>
          <Card className="rounded-none ring-0">
            <CardHeader className="border-b">
              <CardTitle>Folder tree</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground font-mono text-sm">
                {DEFAULT_PROJECT_NAME}
              </p>
            </CardContent>
          </Card>
        </div>
      </Panel>
    </>
  );
}
