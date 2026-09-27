'use client';

import type { PackageManager } from 'create-gb-app/generate';
import type { CreateFlags } from 'create-gb-app/preset';
import { ChevronDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

import { getProjectSummary } from '../lib/project-summary';
import { useCreate } from './create-provider';

export function CreateProjectSummary() {
  const { flags, packageManager, projectName } = useCreate();
  return (
    <CreateProjectSummaryContent
      flags={flags}
      packageManager={packageManager}
      projectName={projectName}
    />
  );
}

export function CreateProjectSummaryContent({
  flags,
  packageManager,
  projectName,
}: {
  flags: CreateFlags;
  packageManager: PackageManager;
  projectName: string;
}) {
  const summary = getProjectSummary(flags, packageManager, projectName);
  return (
    <section
      aria-label="Your project"
      className="space-y-4 border-b p-4 text-sm"
    >
      <div className="space-y-2">
        <h2 className="font-medium">Your project</h2>
        <p>
          <span className="font-medium">{summary.structure}</span>{' '}
          <span className="text-muted-foreground">
            · {summary.architecture}
          </span>
        </p>
        <p className="text-muted-foreground">{summary.tools.join(' · ')}</p>
        <div
          className="flex flex-wrap gap-1.5"
          aria-label="Included foundations"
        >
          {summary.foundations.map((foundation) => (
            <Badge key={foundation} variant="outline">
              {foundation}
            </Badge>
          ))}
        </div>
      </div>
      <Collapsible>
        <CollapsibleTrigger className="group flex w-full items-center justify-between gap-2 py-1 text-left font-medium">
          Setup and next steps
          <ChevronDown
            aria-hidden="true"
            className="size-4 transition-transform group-data-panel-open:rotate-180"
          />
        </CollapsibleTrigger>
        <CollapsibleContent keepMounted>
          <ol className="text-muted-foreground mt-3 list-decimal space-y-3 pl-4">
            {summary.steps.map((step) => (
              <li key={step.title} className="pl-1">
                <p className="text-foreground font-medium">{step.title}</p>
                {step.description ? (
                  <p className="mt-1 text-xs leading-relaxed">
                    {step.description}
                  </p>
                ) : null}
                {step.commands ? (
                  <pre className="bg-muted text-foreground mt-2 overflow-x-auto rounded-md p-2 text-xs">
                    <code>{step.commands.join('\n')}</code>
                  </pre>
                ) : null}
              </li>
            ))}
          </ol>
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
}
