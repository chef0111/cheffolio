'use client';

import { cn } from '@/lib/utils';
import { useScroll } from '@/hooks/use-scroll';
import { FullWidthDivider } from '@/components/cheffolio/full-width-divider';

export function SiteHeaderNav({ children }: { children?: React.ReactNode }) {
  const scrolled = useScroll(10);

  return (
    <header
      className={cn(
        'border-b-line border-x-line bg-background fixed top-0 left-1/2 z-100 mx-auto w-full max-w-4xl -translate-x-1/2 rounded-b-none border border-t-transparent transition-all ease-out [@media(max-width:896px)]:max-w-[calc(100%-1rem)]',
        {
          'border-border bg-background/95 supports-backdrop-filter:bg-background/50 top-2 rounded-md shadow backdrop-blur-md [@media(max-width:896px)]:max-w-[calc(100%-2rem)] [@media(min-width:896px)]:max-w-[calc(var(--container-4xl)-1rem)]':
            scrolled,
        }
      )}
    >
      <nav
        className={cn(
          'mx-auto flex h-12 w-full items-center justify-between px-2 md:transition-all md:ease-out',
          {
            'md:px-2': scrolled,
          }
        )}
      >
        {children}
      </nav>
      <FullWidthDivider
        className={cn('transition-none', { hidden: scrolled })}
      />
    </header>
  );
}
