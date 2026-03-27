import { BoxIcon, InfinityIcon } from 'lucide-react';
import Image from 'next/image';

import {
  Collapsible,
  CollapsibleChevronsIcon,
} from '@/components/ui/collapsible-animated';
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Markdown } from '@/components/cheffolio/markdown';
import { Tag } from '@/components/ui/tag';
import { ProseMono } from '@/components/ui/typography';
import { UTM_PARAMS } from '@/config/site';
import { addQueryParams } from '@/utils/url';

import type { Project } from '@/modules/portfolio/types/projects';
import { GridPattern } from '@/components/cheffolio/grid-pattern';
import { ProjectLink } from './project-link';

/**
 * Render a collapsible project entry showing title, period, logo (or placeholder), link, and expandable details.
 *
 * The header displays the project's title, formatted period (start and optional end or "Present"), logo or placeholder icon,
 * a project link augmented with UTM parameters, and an expand/collapse chevron. When expanded, the item shows the project's
 * markdown description and a list of skill tags if present.
 *
 * @param className - Optional additional CSS class names applied to the root Collapsible container
 * @param project - Project data used to populate the item (title, period, logo, link, description, skills, isExpanded)
 * @returns A React element representing the project item with header and expandable content
 */
export function ProjectItem({
  className,
  project,
}: {
  className?: string;
  project: Project;
}) {
  const { start, end } = project.period;
  const isOngoing = !end;
  const isSinglePeriod = end === start;

  return (
    <Collapsible className={className} defaultOpen={project.isExpanded}>
      <div className="hover:bg-muted-accent active:bg-muted-accent bg-accent/50 dark:bg-muted/20 transition-color m-2 flex items-stretch rounded-lg border duration-200">
        {project.logo ? (
          <div className="bg-background m-1.5 mr-0 flex items-center rounded-md border">
            <Image
              src={project.logo}
              alt={project.title}
              width={32}
              height={32}
              quality={100}
              className="mx-3 flex size-8 shrink-0 select-none"
              unoptimized
              aria-hidden
            />
          </div>
        ) : (
          <div className="bg-background m-1.5 mr-0 flex items-center rounded-md border">
            <div className="border-muted-foreground/15 bg-muted text-muted-foreground ring-line ring-offset-background mx-3 flex size-8 shrink-0 items-center justify-center rounded-lg border ring-1 ring-offset-1 select-none">
              <BoxIcon className="size-5" />
            </div>
          </div>
        )}

        <div className="border-line relative flex-1 overflow-hidden border-dashed">
          <CollapsibleTrigger className="no-focus flex w-full items-center gap-2 p-4 pr-2 text-left">
            <div className="flex-1">
              <h3 className="mb-1 leading-snug font-medium text-balance">
                {project.title}
              </h3>

              <dl className="text-muted-foreground text-sm">
                <dt className="sr-only">Period</dt>
                <dd className="flex items-center gap-0.5">
                  <span>{start}</span>
                  {!isSinglePeriod && (
                    <>
                      <span className="font-mono">—</span>
                      {isOngoing ? (
                        <>
                          <InfinityIcon className="size-4.5 translate-y-[0.5px]" />
                          <span className="sr-only">Present</span>
                        </>
                      ) : (
                        <span>{end}</span>
                      )}
                    </>
                  )}
                </dd>
              </dl>
            </div>

            <ProjectLink href={addQueryParams(project.link, UTM_PARAMS)} />

            <div className="text-muted-foreground shrink-0 [&_svg]:size-4">
              <CollapsibleChevronsIcon duration={0.15} />
            </div>
          </CollapsibleTrigger>

          <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 size-full mask-[radial-gradient(farthest-side_at_top,white,transparent)]">
            <GridPattern
              className="stroke-border absolute inset-0 size-full"
              height={25}
              width={25}
              x={12}
              y={6}
            />
          </div>
        </div>
      </div>

      <CollapsibleContent className="sm:data-[state=closed]:animate-collapsible-up sm:data-[state=open]:animate-collapsible-down overflow-hidden">
        <div className="border-line space-y-4 p-4 pt-2">
          {project.description && (
            <ProseMono>
              <Markdown>{project.description}</Markdown>
            </ProseMono>
          )}

          {project.skills.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {project.skills.map((skill, index) => (
                <li key={index} className="flex">
                  <Tag>{skill}</Tag>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
