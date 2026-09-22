'use client';

import { useScroll } from '@/hooks/use-scroll';
import { cn } from '@/lib/utils';

export function SiteHeaderNav({ children }: { children?: React.ReactNode }) {
  const scrolled = useScroll(10);

  return (
    <header
      className={cn(
        'border-x-border screen-line-top screen-line-bottom bg-background not-found-hidden sticky top-0 z-100 mx-auto -mb-(--header-height) w-full max-w-4xl shrink-0 rounded-none border border-y-transparent transition-all ease-out [@media(max-width:896px)]:max-w-[calc(100%-1rem)]',
        scrolled
          ? 'border-border bg-background/95 screen-line-top-none screen-line-bottom-none supports-backdrop-filter:bg-background/50 group-data-[layout=wide]/layout:container-inset top-2 rounded-lg shadow backdrop-blur-md [@media(max-width:896px)]:max-w-[calc(100%-2rem)] [@media(min-width:896px)]:max-w-[calc(var(--container-4xl)-1rem)]'
          : 'group-data-[layout=wide]/layout:container'
      )}
      aria-label="Site header"
    >
      <nav
        className={cn(
          'md:ease-out-cubic mx-auto flex h-(--header-height) w-full items-center justify-between px-2.5 md:transition-all',
          {
            'md:px-2.5': scrolled,
          }
        )}
      >
        {children}
      </nav>
    </header>
  );
}
