'use client';

import { CommandMenu } from '@/components/cheffolio/command-menu';
import { FullWidthDivider } from '@/components/cheffolio/full-width-divider';
import { MOBILE_NAV } from '@/config/site';
import { useScroll } from '@/hooks/use-scroll';
import { cn } from '@/lib/utils';

import { MobileNav } from './mobile-nav';

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
      <div className="from-background pointer-events-none fixed inset-x-0 bottom-0 z-50 h-[calc(--spacing(18)+env(safe-area-inset-bottom,0px))] bg-linear-to-t from-[calc(env(safe-area-inset-bottom,0%))] to-transparent sm:hidden" />
      <div className="fixed bottom-[calc(--spacing(3)+env(safe-area-inset-bottom,0px))] left-1/2 z-50 -translate-x-1/2 sm:hidden">
        <MobileNav items={MOBILE_NAV} center={<CommandMenu />} />
      </div>
    </>
  );
}
