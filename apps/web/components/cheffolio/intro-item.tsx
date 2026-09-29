import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const iconVariants = cva(
  "border-muted-foreground/15 bg-muted ring-border ring-offset-background flex shrink-0 items-center justify-center rounded-md border ring-1 ring-offset-1 [&_svg]:text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      size: {
        default: 'size-6',
        sm: "size-5 rounded-sm [&_svg:not([class*='size-'])]:size-3.5",
        xs: "size-4 rounded-xs [&_svg:not([class*='size-'])]:size-3",
        lg: "size-7 [&_svg:not([class*='size-'])]:size-4.5",
        xl: "size-8 rounded-lg [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export function IntroItem({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex items-center gap-4 font-mono text-sm', className)}
      {...props}
    />
  );
}

export function IntroItemIcon({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof iconVariants>) {
  return (
    <div
      data-slot="intro-item-icon"
      data-size={size}
      className={cn(iconVariants({ size, className }))}
      {...props}
    />
  );
}

export function IntroItemContent({
  className,
  ...props
}: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="intro-item-content"
      className={cn('sm:text-base sm:text-balance', className)}
      {...props}
    />
  );
}

export function IntroItemLink({
  className,
  children,
  ...props
}: React.ComponentProps<'a'>) {
  return (
    <a
      data-slot="intro-item-link"
      className={cn('underline-offset-4 hover:underline', className)}
      target="_blank"
      rel="noopener"
      title="Open link"
      {...props}
    >
      {children}
    </a>
  );
}
