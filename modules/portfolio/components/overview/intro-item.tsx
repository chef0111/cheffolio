import { cn } from '@/lib/utils';

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
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'border-muted-foreground/15 bg-muted ring-line ring-offset-background flex size-6 shrink-0 items-center justify-center rounded-lg border ring-1 ring-offset-1',
        "[&_svg]:text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

export function IntroItemContent({
  className,
  ...props
}: React.ComponentProps<'p'>) {
  return (
    <p className={cn('text-base sm:text-balance', className)} {...props} />
  );
}

export function IntroItemLink({
  className,
  ...props
}: React.ComponentProps<'a'>) {
  return (
    <a
      className={cn('underline-offset-4 hover:underline', className)}
      target="_blank"
      rel="noopener"
      {...props}
    />
  );
}
