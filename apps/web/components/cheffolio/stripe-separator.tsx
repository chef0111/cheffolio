import { cn } from '@/lib/utils';

import { PanelContent } from './panel';

export function StripeSeparator({ className }: { className?: string }) {
  return (
    <PanelContent
      data-slot="stripe-separator"
      className={cn(
        'border-border decor-all layout-wide:container relative mx-auto flex h-(--separator-height) w-full border-x p-0 md:max-w-4xl',
        'before:absolute before:inset-y-px before:left-[-100vw] before:-z-1 before:w-[200vw] [@media(max-width:896px)]:before:left-0 [@media(max-width:896px)]:before:w-full',
        'before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-border)]/56',
        className
      )}
    >
      <div className="screen-line-top screen-line-bottom absolute inset-0 flex h-full" />
    </PanelContent>
  );
}
