'use client';

import { cn } from '@/lib/utils';

export function FadeOverlay({
  align,
  className,
}: {
  align: 'top' | 'bottom';
  className?: string;
}) {
  const isTop = align === 'top';

  return (
    <div
      className={cn(
        'not-found-hidden pointer-events-none fixed inset-x-0 z-50',
        isTop ? '-top-0.5' : '-bottom-0.5',
        className
      )}
      aria-hidden
    >
      <div
        className={cn(
          'to-background from-transparent backdrop-blur-[1px]',
          isTop
            ? 'h-(--top-height) bg-linear-to-t mask-linear-[to_bottom,var(--background)_25%,transparent]'
            : 'h-(--bottom-height) bg-linear-to-b mask-linear-[to_top,var(--background)_25%,transparent]'
        )}
      />
      <div
        className={cn(
          'bg-background',
          isTop
            ? 'pb-[env(safe-area-inset-top,0)]'
            : 'pb-[env(safe-area-inset-bottom,0)]'
        )}
      />
    </div>
  );
}
