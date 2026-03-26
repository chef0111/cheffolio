'use client';

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { LinkIcon } from 'lucide-react';

export function ProjectLink({ href }: { href: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          className="text-muted-foreground hover:text-foreground relative flex size-6 shrink-0 items-center justify-center after:absolute after:-inset-2"
          href={href}
          target="_blank"
          rel="noopener"
          onClick={(e) => e.stopPropagation()}
        >
          <LinkIcon className="pointer-events-none size-4" />
          <span className="sr-only">Open Project Link</span>
        </a>
      </TooltipTrigger>
      <TooltipContent>
        <p>Open Project Link</p>
      </TooltipContent>
    </Tooltip>
  );
}
