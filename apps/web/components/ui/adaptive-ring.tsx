import { cn } from '@/lib/utils';

export function AdaptiveRing({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 inset-ring-1 inset-ring-black/15 ring-inset dark:inset-ring-white/15',
        className
      )}
      {...props}
    />
  );
}
