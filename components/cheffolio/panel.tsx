import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { cn } from '@/lib/utils';

const panelPlusVariants = cva(
  'bg-background pointer-events-none absolute z-1 size-4 shrink-0 text-border',
  {
    variants: {
      position: {
        'top-left':
          'top-0 left-0 -translate-x-[calc(50%+0.5px)] -translate-y-[calc(50%+0.5px)]',
        'top-right':
          'top-0 right-0 translate-x-[calc(50%+0.5px)] -translate-y-[calc(50%+0.5px)]',
        'bottom-right':
          'right-0 bottom-0 translate-x-[calc(50%+0.5px)] translate-y-[calc(50%+0.5px)]',
        'bottom-left':
          'bottom-0 left-0 -translate-x-[calc(50%+0.5px)] translate-y-[calc(50%+0.5px)]',
      },
    },
    defaultVariants: {
      position: 'top-left',
    },
  }
);

function Panel({ className, ...props }: React.ComponentProps<'section'>) {
  return (
    <section
      data-slot="panel"
      className={cn(
        'screen-line-top screen-line-bottom border-border relative border-x',
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
  render,
  ...props
}: useRender.ComponentProps<'h2'>) {
  return useRender({
    defaultTagName: 'h2',
    props: mergeProps<'h2'>(
      {
        className: cn('text-3xl font-semibold tracking-tight', className),
      },
      props
    ),
    render,
    state: {
      slot: 'panel-title',
    },
  });
}

function PanelTitleSup({ className, ...props }: React.ComponentProps<'sup'>) {
  return (
    <sup
      className={cn(
        'text-muted-foreground top-[-0.75em] ml-1 text-sm font-medium tracking-normal',
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

function PanelPlus({
  className,
  position,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof panelPlusVariants>) {
  return (
    <span
      data-slot="panel-plus"
      aria-hidden="true"
      className={cn(panelPlusVariants({ position }), className)}
      {...props}
    >
      <svg
        className="size-full stroke-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M8 12h8" />
        <path d="M12 8v8" />
      </svg>
    </span>
  );
}

export {
  Panel,
  PanelContent,
  PanelDescription,
  PanelHeader,
  PanelPlus,
  PanelTitle,
  PanelTitleSup,
};
