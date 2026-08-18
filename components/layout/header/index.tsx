import Link from 'next/link';

import { CommandMenu } from '@/components/cheffolio/command-menu';
import { GitHubIcon } from '@/components/icons';
import { DesktopNav } from '@/components/layout/navigation/desktop-nav';
import { SiteHeaderNav } from '@/components/layout/navigation/site-header-nav';
import { Button } from '@/components/ui/button';
import { GITHUB_REPO_URL, MAIN_NAV, UTM_PARAMS } from '@/config/site';
import { addQueryParams } from '@/utils/url';

import { SiteHeaderLogo } from './site-header-logo';
import ThemeToggle from './theme-toggle';

export function SiteHeader() {
  return (
    <SiteHeaderNav>
      <Link
        className="ease-out-cubic transition-[scale] active:scale-98 has-data-[visible=false]:pointer-events-none [&_svg]:h-8"
        href="/"
        aria-label="Home"
      >
        <SiteHeaderLogo />
      </Link>
      <div className="flex items-center gap-2 *:first:mr-2 max-sm:*:data-[slot=command-menu-trigger]:hidden">
        <DesktopNav items={MAIN_NAV} />
        <CommandMenu enabledHotkeys />
        <Button
          size="icon"
          variant="ghost"
          render={
            <a
              href={addQueryParams(GITHUB_REPO_URL, UTM_PARAMS)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open GitHub Repository"
            />
          }
          nativeButton={false}
        >
          <GitHubIcon aria-hidden="true" />
        </Button>
        <ThemeToggle />
      </div>
    </SiteHeaderNav>
  );
}
