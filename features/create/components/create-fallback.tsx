import { CodeBlockCommand } from '@/components/cheffolio/code-block-command';
import { Panel } from '@/components/cheffolio/panel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { convertNpmCommand } from '@/lib/convert-npm-command';

import { DEFAULT_COMMAND, DEFAULT_PROJECT_NAME } from '../lib/command';

export function CreateFallback() {
  return (
    <Panel className="screen-line-top-none screen-line-bottom-none grid grid-cols-1 p-0 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-1 gap-0 rounded-none bg-transparent ring-0">
        <div className="flex flex-col gap-2 px-4 py-3">
          <Label htmlFor="create-project-name">Project name</Label>
          <Input
            id="create-project-name"
            name="projectName"
            defaultValue={DEFAULT_PROJECT_NAME}
            disabled
          />
        </div>
        <div className="border-b px-4 pb-3">
          <CodeBlockCommand {...convertNpmCommand(DEFAULT_COMMAND)} />
        </div>
      </Card>
      <div className="border-border md:col-span-1 md:border-l lg:col-span-2">
        <Card className="rounded-none bg-transparent ring-0">
          <CardHeader className="border-b">
            <CardTitle>Builder</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Loading options</p>
          </CardContent>
        </Card>
      </div>
    </Panel>
  );
}
