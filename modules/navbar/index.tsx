'use client';

import { cn } from '@/lib/utils';
import { useScroll } from '@/hooks/use-scroll';
import { Button } from '@/components/ui/button';
import ThemeToggle from './theme-toggle';
import { GithubIcon } from '@/components/icons';
import { DesktopNav } from './desktop-nav';
import { MAIN_NAV } from '@/config/site';
import { CommandMenu } from '@/components/command-menu';
import { NavbarLogo } from './navbar-logo';
import { FullWidthDivider } from '@/components/ui/full-width-divider';

export function Navbar() {
  const scrolled = useScroll(10);

  return (
    <header
      className={cn(
        'border-b-line border-x-line bg-background fixed top-0 left-1/2 z-50 mx-auto w-full max-w-4xl -translate-x-1/2 rounded-b-none border border-t-transparent sm:transition-all sm:ease-out',
        {
          'border-border bg-background/95 supports-backdrop-filter:bg-background/50 backdrop-blur-sm sm:top-2 sm:max-w-[calc(var(--container-4xl)-1rem)] sm:rounded-md sm:shadow':
            scrolled,
        }
      )}
    >
      <nav
        className={cn(
          'mx-auto flex h-12 w-full items-center justify-between px-4 md:transition-all md:ease-out',
          {
            'md:px-2': scrolled,
          }
        )}
      >
        <NavbarLogo />
        <div className="flex items-center gap-2 *:first:mr-2 max-sm:*:data-[slot=command-menu-trigger]:hidden">
          <DesktopNav items={MAIN_NAV} />
          <CommandMenu />
          <Button size="icon" variant="ghost">
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
