'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useLocationHash } from '@/hooks/use-location-hash';
import { markUserNavigation, useNavScroll } from '@/hooks/use-nav-scroll';
import { cn } from '@/lib/utils';

import type { NavItem } from './types/nav';
import { isNavItemActive } from './utils/nav-active';

export function DesktopNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const locationHash = useLocationHash();
  const { hash: scrollHash, ready: scrollReady } = useNavScroll(items);
  const isHome = pathname === '/';

  const effectiveHash = isHome
    ? scrollReady
      ? scrollHash
      : scrollHash || locationHash
    : locationHash;

  return (
    <nav
      data-active-id={pathname}
      data-active-hash={effectiveHash || undefined}
      className="flex items-center gap-4 max-sm:hidden"
    >
      {items.map(({ title, href, className }) => {
        const active = isNavItemActive(href, pathname, effectiveHash);

        return (
          <Link
            key={href}
            href={href}
            onClick={(event) => {
              if (!href.startsWith('#')) return;
              event.preventDefault();
              const el = document.getElementById(href.slice(1));
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
                markUserNavigation();
                window.history.pushState(null, '', href);
                window.dispatchEvent(new Event('hashchange'));
              }
            }}
            className={cn(
              'text-muted-foreground hover:text-foreground text-sm font-medium transition-[color]',
              active && 'text-foreground',
              className
            )}
          >
            {title}
          </Link>
        );
      })}
    </nav>
  );
}
