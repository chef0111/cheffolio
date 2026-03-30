'use client';

import type { ComponentProps } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { useLocationHash } from '@/hooks/use-location-hash';
import { useNavScroll, markUserNavigation } from '@/hooks/use-nav-scroll';
import { isNavItemActive } from './utils/nav-active';
import { NavItem } from './types/nav';

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
        'text-muted-foreground hover:text-foreground font-mono text-sm font-medium transition-[color]',
        active && 'text-foreground',
        className
      )}
      {...props}
    />
  );
}
