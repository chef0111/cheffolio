import type { Route } from 'next';
import Link from 'next/link';
import React from 'react';

import { cn } from '@/lib/utils';
import type { NavItem } from '@/types/nav';

import { isNavItemActive } from './utils/nav-active';

export function Nav({
  items,
  activeId,
  className,
  exactMatch = false,
}: {
  items: NavItem<Route>[];
  activeId?: string;
  className?: string;
  exactMatch?: boolean;
}) {
  return (
    <nav
      data-active-id={activeId}
      className={cn('flex items-center gap-4', className)}
    >
      {items.map(({ title, href }) => {
        const isActive = isNavItemActive(href, activeId, exactMatch);

        return (
          <NavItem
            key={href}
            href={href}
            aria-current={isActive ? 'page' : undefined}
          >
            {title}
          </NavItem>
        );
      })}
    </nav>
  );
}

export function NavItem({
  className,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        'text-muted-foreground hover:text-foreground aria-[current=page]:text-foreground text-sm font-medium tracking-wide transition-[color]',
        className
      )}
      {...props}
    />
  );
}
