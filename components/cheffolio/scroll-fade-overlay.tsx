'use client';

import { useOverflows } from '@/hooks/use-overflows';
import { cn } from '@/lib/utils';

export function ScrollFadeOverlay({
  align,
  fadeOut = true,
}: {
  align: 'top' | 'bottom';
  fadeOut?: boolean;
}) {
  const isTop = align === 'top';
  const pageOverflows = useOverflows(fadeOut);

  // Scroll timelines stay at 0% when the page does not overflow, so the fade
  // never runs and a short page would keep a stuck overlay.
  if (fadeOut && !pageOverflows) {
    return null;
  }

  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-x-0 z-50',
        isTop
          ? fadeOut
            ? 'scroll-fade-effect-top -top-0.5'
            : '-top-0.5'
          : fadeOut
            ? 'scroll-fade-effect-bottom -bottom-0.5'
            : '-bottom-0.5'
      )}
      aria-hidden
    >
      <div
        className={cn(
          'to-background from-transparent backdrop-blur-[1px]',
          isTop
            ? 'h-(--fade-top-height) bg-linear-to-t mask-linear-[to_bottom,var(--background)_25%,transparent]'
            : 'h-(--fade-bottom-height) bg-linear-to-b mask-linear-[to_top,var(--background)_25%,transparent]'
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
