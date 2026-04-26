import dynamic from 'next/dynamic';
import Link from 'next/link';

import { GithubIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { MAIN_NAV } from '@/config/site';

import { DesktopNav } from './desktop-nav';
import { SiteHeaderLogo } from './site-header-logo';
import { SiteHeaderNav } from './site-header-nav';
import ThemeToggle from './theme-toggle';

const CommandMenu = dynamic(() =>
  import('@/components/cheffolio/command-menu').then((mod) => mod.CommandMenu)
);

export function SiteHeader() {
  return (
    <SiteHeaderNav>
      <Link
        className="transition-[scale] ease-out active:scale-98 has-data-[visible=false]:pointer-events-none [&_svg]:h-8"
        href="/"
        aria-label="Home"
      >
        <SiteHeaderLogo />
      </Link>
      <div className="flex items-center gap-2 *:first:mr-2 max-sm:*:data-[slot=command-menu-trigger]:hidden">
        <DesktopNav items={MAIN_NAV} />
        <CommandMenu enabledHotkeys />
        <Button size="icon" variant="ghost" asChild>
          <a
            href="https://github.com/chef0111/cheffolio"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open GitHub Repository"
          >
            <GithubIcon aria-hidden="true" />
          </a>
        </Button>
        <ThemeToggle />
      </div>
    </SiteHeaderNav>
  );
}
