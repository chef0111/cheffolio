'use client';

import { cn } from '@/lib/utils';
import { useScroll } from '@/hooks/use-scroll';
import { FullWidthDivider } from '@/components/cheffolio/full-width-divider';
import { CommandMenu } from '@/components/cheffolio/command-menu';
import { Separator } from '@/components/ui/separator';
import { MobileNav } from './mobile-nav';
import { MOBILE_NAV } from '@/config/site';

export function SiteHeaderNav({ children }: { children?: React.ReactNode }) {
  const scrolled = useScroll(10);

  return (
    <>
      <header
        className={cn(
          'border-b-line border-x-line bg-background fixed top-0 left-1/2 z-100 mx-auto w-full max-w-4xl -translate-x-1/2 rounded-b-none border border-t-transparent transition-all ease-out [@media(max-width:896px)]:max-w-[calc(100%-1rem)]',
          {
            'border-border bg-background/95 supports-backdrop-filter:bg-background/50 top-2 rounded-md shadow backdrop-blur-md [@media(max-width:896px)]:max-w-[calc(100%-2rem)] [@media(min-width:896px)]:max-w-[calc(var(--container-4xl)-1rem)]':
              scrolled,
          }
        )}
        aria-label="Site header"
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

      {/* Mobile Nav */}
      <div className="from-background pointer-events-none fixed inset-x-0 bottom-0 z-50 h-[calc(--spacing(16)+env(safe-area-inset-bottom,0px))] bg-linear-to-t from-[calc(env(safe-area-inset-bottom,0%))] to-transparent sm:hidden" />
      <div
        className={cn(
          'bg-popover ring-foreground/10 dark:ring-foreground/20 fixed bottom-[calc(--spacing(4)+env(safe-area-inset-bottom,0px))] left-1/2 z-50 flex w-fit -translate-x-1/2 items-center rounded-xl py-1 pr-1 pl-2.5 shadow-md ring sm:hidden',
          '*:data-[slot=command-menu-trigger]:min-w-24 *:data-[slot=command-menu-trigger]:gap-2 *:data-[slot=command-menu-trigger]:rounded-none *:data-[slot=command-menu-trigger]:border-none *:data-[slot=command-menu-trigger]:bg-transparent *:data-[slot=command-menu-trigger]:px-0 *:data-[slot=command-menu-trigger]:hover:bg-transparent *:data-[slot=command-menu-trigger]:active:scale-none'
        )}
      >
        <CommandMenu />
        <Separator
          orientation="vertical"
          className="mr-1 ml-2.5 data-vertical:h-6 data-vertical:self-center"
        />
        <MobileNav items={MOBILE_NAV} />
      </div>
    </>
  );
}
