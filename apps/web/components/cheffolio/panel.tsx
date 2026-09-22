import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';
import { PlusIcon } from 'lucide-react';
import React from 'react';

import { cn } from '@/lib/utils';

const PANEL_DECOR_POSITIONS = [
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
] as const;

type PanelDecorPosition = (typeof PANEL_DECOR_POSITIONS)[number];

const panelDecorVariants = cva(
  'pointer-events-none absolute z-1 flex size-5 p-px shrink-0 items-center justify-center',
  {
    variants: {
      position: {
        'top-left':
          'top-0 left-0 -translate-x-[calc(50%+0.5px)] -translate-y-[calc(50%-0.5px)]',
        'top-right':
          'top-0 right-0 translate-x-[calc(50%+0.5px)] -translate-y-[calc(50%-0.5px)]',
        'bottom-right':
          'right-0 bottom-0 translate-x-[calc(50%+0.5px)] translate-y-[calc(50%-0.5px)]',
        'bottom-left':
          'bottom-0 left-0 -translate-x-[calc(50%+0.5px)] translate-y-[calc(50%-0.5px)]',
      },
    },
    defaultVariants: {
      position: 'top-left',
    },
  }
);

const PANEL_DECOR_CLASSES: Record<string, readonly PanelDecorPosition[]> = {
  'decor-all': PANEL_DECOR_POSITIONS,
  'decor-t': ['top-left', 'top-right'],
  'decor-b': ['bottom-left', 'bottom-right'],
  'decor-l': ['top-left', 'bottom-left'],
  'decor-r': ['top-right', 'bottom-right'],
  'decor-tr': ['top-right'],
  'decor-tl': ['top-left'],
  'decor-br': ['bottom-right'],
  'decor-bl': ['bottom-left'],
  'decor-dl': ['top-left', 'bottom-right'],
  'decor-dr': ['top-right', 'bottom-left'],
};

export function getPanelDecorPositions(
  className: string | undefined
): PanelDecorPosition[] {
  if (!className) return [];
  const positions = new Set<PanelDecorPosition>();
  for (const token of className.split(/\s+/)) {
    const corners = PANEL_DECOR_CLASSES[token];
    if (!corners) continue;
    for (const corner of corners) positions.add(corner);
  }
  return PANEL_DECOR_POSITIONS.filter((position) => positions.has(position));
}

function PanelDecor({
  className,
  position,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof panelDecorVariants>) {
  return (
    <span
      data-slot="panel-plus"
      data-position={position}
      aria-hidden="true"
      className={cn(panelDecorVariants({ position }), className)}
      {...props}
    >
      <PlusIcon
        data-slot="panel-plus-background"
        className="stroke-background absolute size-7 stroke-5"
      />
      <PlusIcon
        data-slot="panel-plus-icon"
        className="stroke-muted-foreground/30 relative size-full stroke-[1.5]"
      />
    </span>
  );
}

function PanelDecores({ className }: { className?: string }) {
  return getPanelDecorPositions(className).map((position) => (
    <PanelDecor key={position} position={position} />
  ));
}

function Panel({
  className,
  children,
  ...props
}: React.ComponentProps<'section'>) {
  return (
    <section
      data-slot="panel"
      className={cn(
        'screen-line-top screen-line-bottom border-border relative border-x',
        className
      )}
      {...props}
    >
      <PanelDecores className={className} />
      {children}
    </section>
  );
}

function PanelHeader({
  className,
  children,
  ...props
}: React.ComponentProps<'header'>) {
  return (
    <header
      data-slot="panel-header"
      className={cn(
        'screen-line-bottom has-data-[slot=panel-description]:*:data-[slot=panel-title]:screen-line-bottom px-4',
        className
      )}
      {...props}
    >
      <PanelDecores className={className} />
      {children}
    </header>
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
        className: cn(
          'text-3xl font-semibold text-balance tracking-tight py-1',
          className
        ),
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
  children,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="panel-description"
      className={cn(
        'text-muted-foreground relative py-4 font-mono text-sm text-balance',
        getPanelDecorPositions(className).length > 0 && 'relative',
        className
      )}
      {...props}
    >
      <PanelDecores className={className} />
      {children}
    </div>
  );
}

function PanelContent({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="panel-body"
      className={cn(
        'p-4',
        getPanelDecorPositions(className).length > 0 && 'relative',
        className
      )}
      {...props}
    >
      {children}
      <PanelDecores className={className} />
    </div>
  );
}

export {
  Panel,
  PanelContent,
  PanelDecores,
  PanelDescription,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
};
