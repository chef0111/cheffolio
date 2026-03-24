import { InfinityIcon } from 'lucide-react';

import {
  Collapsible,
  CollapsibleChevronsIcon,
} from '@/components/ui/collapsible-animated';
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Markdown } from '@/components/cheffolio/markdown';
import { ProseMono } from '@/components/ui/typography';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Tag } from '@/components/ui/tag';
import { cn } from '@/lib/utils';

import type { ExperiencePosition } from '@/modules/portfolio/types/experiences';
import { ExperienceIcon } from './position-icon';
import {
  Status,
  StatusIndicator,
  StatusLabel,
} from '@/components/kibo-ui/status';

export function ExperiencePositionItem({
  position,
}: {
  position: ExperiencePosition;
}) {
  const { start, end } = position.employmentPeriod;
  const isOngoing = !end;

  return (
    <Collapsible
      className="last:before:bg-background relative last:before:absolute last:before:h-full last:before:w-4"
      defaultOpen={position.isExpanded}
      disabled={!position.description}
    >
      <CollapsibleTrigger
        className={cn(
          'group block w-full text-left',
          'hover:before:bg-accent-muted relative before:absolute before:-top-1 before:-right-1 before:-bottom-1.5 before:left-7 before:-z-1 before:rounded-lg before:transition-[background-color] before:ease-out',
          'focus-visible:before:ring-ring/50 outline-none focus-visible:before:ring-2 focus-visible:before:ring-inset',
          'data-disabled:before:content-none'
        )}
      >
        <div className="relative z-1 mb-1 flex items-center gap-3">
          <div
            className={cn(
              'flex size-6 shrink-0 items-center justify-center rounded-lg',
              'bg-muted text-muted-foreground',
              'border-muted-foreground/15 ring-line ring-offset-background border ring-1 ring-offset-1'
            )}
          >
            <ExperienceIcon className="size-4" icon={position.icon} />
          </div>

          <div className="flex min-w-0 flex-1 items-center gap-1">
            <Label className="self-start text-base font-medium text-pretty">
              {position.title}
            </Label>
            {position.isCurrentPosition && (
              <Status status="maintenance" className="bg-transparent">
                <StatusIndicator />
                <StatusLabel className="sr-only">Current Position</StatusLabel>
              </Status>
            )}
          </div>

          <div className="text-muted-foreground ml-auto shrink-0 group-data-disabled:hidden [&_svg]:size-4">
            <CollapsibleChevronsIcon duration={0.15} />
          </div>
        </div>

        <div className="text-muted-foreground flex items-center gap-2 pl-9 text-sm">
          {position.employmentType && (
            <>
              <dl>
                <dt className="sr-only">Employment Type</dt>
                <dd>{position.employmentType}</dd>
              </dl>

              <Separator
                className="data-vertical:h-4 data-vertical:self-center"
                orientation="vertical"
              />
            </>
          )}

          <dl>
            <dt className="sr-only">Employment Period</dt>
            <dd className="flex items-center gap-0.5">
              <span>{start}</span>
              <span className="font-mono">—</span>
              {isOngoing ? (
                <>
                  <InfinityIcon className="size-4.5 translate-y-[0.5px]" />
                  <span className="sr-only">Present</span>
                </>
              ) : (
                <span>{end}</span>
              )}
            </dd>
          </dl>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="sm:data-[state=closed]:animate-collapsible-up sm:data-[state=open]:animate-collapsible-down overflow-hidden">
        {position.description && (
          <ProseMono className="pt-2 pl-9">
            <Markdown>{position.description}</Markdown>
          </ProseMono>
        )}
      </CollapsibleContent>

      {Array.isArray(position.skills) && position.skills.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 pt-3 pl-9">
          {position.skills.map((skill, index) => (
            <li key={index} className="flex">
              <Tag>{skill}</Tag>
            </li>
          ))}
        </ul>
      )}
    </Collapsible>
  );
}
