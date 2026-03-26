'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { FileCheckIcon } from 'lucide-react';

export function AwardReference({ href }: { href: string }) {
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
          <FileCheckIcon className="pointer-events-none size-4" />
          <span className="sr-only">Open Reference Attachment</span>
        </a>
      </TooltipTrigger>
      <TooltipContent>
        <p>Open Reference Attachment</p>
      </TooltipContent>
    </Tooltip>
  );
}
