import { cn } from '@/lib/utils';

import { FullWidthDivider } from './full-width-divider';
import { PanelContent } from './panel';

export function StripeSeparator({ className }: { className?: string }) {
  return (
    <PanelContent
      data-slot="stripe-separator"
      className={cn(
        'border-border relative flex h-(--separator-height) w-full border-x p-0',
        'decor-all',
        'before:absolute before:inset-y-px before:left-[-100vw] before:-z-1 before:w-[200vw]',
        'before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-border)]/56',
        className
      )}
    >
      <FullWidthDivider className="top-0" />
      <FullWidthDivider className="bottom-0" />
    </PanelContent>
  );
}
