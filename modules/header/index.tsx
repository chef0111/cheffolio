'use client';

import { cn } from '@/lib/utils';
import { useScroll } from '@/hooks/use-scroll';
import { Button } from '@/components/ui/button';
import ThemeToggle from './theme-toggle';
import { GithubIcon } from '@/components/icons';
import { DesktopNav } from './desktop-nav';
import { MAIN_NAV } from '@/config/site';
import { CommandMenu } from '@/components/cheffolio/command-menu';
import { SiteHeaderLogo } from './site-header-logo';
import { FullWidthDivider } from '@/components/cheffolio/full-width-divider';
import Link from 'next/link';

export function SiteHeader() {
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
        <Link
          className="transition-[scale] ease-out active:scale-98 has-data-[visible=false]:pointer-events-none [&_svg]:h-8"
          href="/"
          aria-label="Home"
        >
          <SiteHeaderLogo />
        </Link>
        <div className="flex items-center gap-2 *:first:mr-2 max-sm:*:data-[slot=command-menu-trigger]:hidden">
          <DesktopNav items={MAIN_NAV} />
          <CommandMenu />
          <Button size="icon" variant="ghost" asChild>
            <a href="https://github.com/chef0111/cheffolio" target="_blank">
              <GithubIcon />
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </nav>
      <FullWidthDivider
        className={cn('transition-none', { hidden: scrolled })}
      />
    </header>
  );
}
