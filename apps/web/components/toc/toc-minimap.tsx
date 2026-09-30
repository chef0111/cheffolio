'use client';

import type { TOCItemType } from 'fumadocs-core/toc';

import { ScrollProgress } from '@/components/ui/scroll-progress';
import { cn } from '@/lib/utils';

export function TOCMinimap({
  items,
  className,
}: {
  items: TOCItemType[];
  className?: string;
}) {
  if (!items.length) return null;

  return (
    <ScrollProgress
      className={cn('max-md:hidden', className)}
      sections={items.map((item) => ({
        id: decodeURIComponent(item.url.replace(/^#/, '')),
        label: item.title,
        depth: item.depth,
      }))}
    />
  );
}
