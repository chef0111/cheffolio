'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps } from 'react';

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
          <DesktopNavItem
            key={href}
            className={className}
            href={href}
            active={active}
          >
            {title}
          </DesktopNavItem>
        );
      })}
    </nav>
  );
}

function DesktopNavItem({
  className,
  active,
  href,
  onClick,
  ...props
}: ComponentProps<typeof Link> & {
  active?: boolean;
}) {
  const hrefString = typeof href === 'string' ? href : (href.hash ?? '');

  return (
    <Link
      href={href}
      onClick={(e) => {
        if (hrefString.startsWith('#')) {
          e.preventDefault();
          const el = document.getElementById(hrefString.slice(1));
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            markUserNavigation();
            window.history.pushState(null, '', hrefString);
            window.dispatchEvent(new Event('hashchange'));
          }
        }
        if (onClick) onClick(e);
      }}
      className={cn(
        'text-muted-foreground hover:text-foreground text-sm font-medium transition-[color]',
        active && 'text-foreground',
        className
      )}
      {...props}
    />
  );
}
