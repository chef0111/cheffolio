import { Slot } from 'radix-ui';
import React from 'react';

import { cn } from '@/lib/utils';

function Panel({ className, ...props }: React.ComponentProps<'section'>) {
  return (
    <section
      data-slot="panel"
      className={cn(
        'screen-line-top screen-line-bottom border-line border-x',
        className
      )}
      {...props}
    />
  );
}

function PanelHeader({ className, ...props }: React.ComponentProps<'header'>) {
  return (
    <header
      data-slot="panel-header"
      className={cn(
        'screen-line-bottom has-data-[slot=panel-description]:*:data-[slot=panel-title]:screen-line-bottom px-4',
        className
      )}
      {...props}
    />
  );
}

function PanelTitle({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<'h2'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'h2';

  return (
    <Comp
      data-slot="panel-title"
      className={cn('text-3xl font-semibold tracking-tight', className)}
      {...props}
    />
  );
}

function PanelTitleSup({ className, ...props }: React.ComponentProps<'sup'>) {
  return (
    <sup
      className={cn(
        'text-muted-foreground -top-[0.75em] ml-1 text-sm font-medium tracking-normal',
        className
      )}
      {...props}
    />
  );
}

function PanelDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="panel-description"
      className={cn(
        'text-muted-foreground py-4 font-mono text-sm text-balance',
        className
      )}
      {...props}
    />
  );
}

function PanelContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="panel-body" className={cn('p-4', className)} {...props} />
  );
}

export {
  Panel,
  PanelContent,
  PanelDescription,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
};
