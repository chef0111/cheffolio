'use client';

import { CopyButton } from '@/components/cheffolio/copy-button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { useStudio } from './studio-provider';

export function StudioCommand() {
  const { command } = useStudio();

  return (
    <Card className="rounded-none ring-0">
      <CardHeader className="border-b">
        <CardTitle>Command</CardTitle>
        <CardAction>
          <CopyButton size="sm" variant="outline" text={command}>
            Copy
          </CopyButton>
        </CardAction>
      </CardHeader>
      <CardContent>
        <pre className="font-mono text-sm break-all whitespace-pre-wrap">
          {command}
        </pre>
      </CardContent>
    </Card>
  );
}
