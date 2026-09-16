import { Panel } from '@/components/cheffolio/panel';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { DEFAULT_COMMAND } from '../lib/command';

export function StudioFallback() {
  return (
    <>
      <Panel className="screen-line-bottom-none p-0">
        <Card className="rounded-none ring-0">
          <CardHeader className="border-b">
            <CardTitle>Command</CardTitle>
            <CardAction>
              <Button size="sm" variant="outline" disabled>
                Copy
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <pre className="font-mono text-sm break-all whitespace-pre-wrap">
              {DEFAULT_COMMAND}
            </pre>
          </CardContent>
        </Card>
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
              <p className="text-muted-foreground font-mono text-sm">my-app</p>
            </CardContent>
          </Card>
        </div>
      </Panel>
    </>
  );
}
