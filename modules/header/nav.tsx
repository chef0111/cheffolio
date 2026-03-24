import Link from 'next/link';
import React from 'react';

import { cn } from '@/lib/utils';

export function Nav({
  items,
  activeId,
  className,
  exactMatch = false,
}: {
  items: NavItem[];
  activeId?: string;
  className?: string;
  exactMatch?: boolean;
}) {
  return (
    <nav
      data-active-id={activeId}
      className={cn('flex items-center gap-4', className)}
    >
      {items.map(({ title, href, className }) => {
        const active = exactMatch
          ? activeId === href
          : activeId === href ||
            (href === '/' // Home page
              ? ['/', '/index'].includes(activeId || '')
              : activeId?.startsWith(href));

        return (
          <NavItem key={href} className={className} href={href} active={active}>
            {title}
          </NavItem>
        );
      })}
    </nav>
  );
}

export type NavItem = {
  title: string;
  href: string;
  className?: string;
};

export function NavItem({
  className,
  active,
  href,
  onClick,
  ...props
}: React.ComponentProps<typeof Link> & {
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
            window.history.pushState(null, '', hrefString);
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
