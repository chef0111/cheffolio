'use client';

import { LinkIcon } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function ProjectLink({ href }: { href: string }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <a
            className="text-muted-foreground hover:text-foreground relative z-1 flex size-6 shrink-0 items-center justify-center after:absolute after:-inset-2"
            href={href}
            target="_blank"
            rel="noopener"
            aria-label="Open project link"
            onClick={(e) => e.stopPropagation()}
          />
        }
      >
        <LinkIcon className="pointer-events-none size-4" />
        <span className="sr-only">Open Project Link</span>
      </TooltipTrigger>
      <TooltipContent>
        <p>Open Project Link</p>
      </TooltipContent>
    </Tooltip>
  );
}
