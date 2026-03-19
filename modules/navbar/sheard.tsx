import { cn } from '@/lib/utils';
import { Route } from 'next';
import Link from 'next/link';

export type LinkItemType = {
  label: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
};

export function LinkItem({
  label,
  description,
  icon,
  className,
  href,
  ...props
}: React.ComponentProps<'a'> & LinkItemType) {
  return (
    <Link
      className={cn('flex items-center gap-x-2', className)}
      href={href as Route}
      {...props}
    >
      <div
        className={cn(
          'bg-card flex aspect-square size-12 items-center justify-center rounded-md border text-sm shadow-sm',
          "[&_svg:not([class*='size-'])]:text-foreground [&_svg:not([class*='size-'])]:size-5"
        )}
      >
        {icon}
      </div>
      <div className="flex flex-col items-start justify-center">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground line-clamp-2 text-xs">
          {description}
        </span>
      </div>
    </Link>
  );
}
