'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { useLocationHash } from '@/hooks/use-location-hash';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useNavScroll } from '@/hooks/use-nav-scroll';
import { haptic } from '@/lib/haptic';
import { cn } from '@/lib/utils';

import type { NavItem } from './types/nav';
import { buildNavPath, splitItems } from './utils/mobile-nav-notch';
import { isNavItemActive } from './utils/nav-active';

type MobileNavProps = {
  items: NavItem[];
  center?: React.ReactNode;
  className?: string;
  onItemClick?: () => void;
};

export function MobileNav({
  items,
  center,
  className,
  onItemClick,
}: MobileNavProps) {
  const isDesktop = useMediaQuery('(min-width: 40rem)');
  const pathname = usePathname();
  const locationHash = useLocationHash();
  const { hash: scrollHash, ready: scrollReady } = useNavScroll(items);
  const isHome = pathname === '/' || pathname === '/index';
  const effectiveHash = isHome
    ? scrollReady
      ? scrollHash
      : scrollHash || locationHash
    : locationHash;

  const handleLinkClick = useCallback(() => {
    haptic();
    onItemClick?.();
  }, [onItemClick]);

  if (isDesktop) return null;

  const { leading, trailing } = splitItems(items, Boolean(center));

  return (
    <div className={cn('relative', className)} data-slot="mobile-nav-root">
      <MobileNavContent
        leadingItems={leading}
        trailingItems={trailing}
        pathname={pathname}
        effectiveHash={effectiveHash}
        onLinkClick={handleLinkClick}
        center={center}
      />
    </div>
  );
}

interface MobileNavContentProps {
  leadingItems: NavItem[];
  trailingItems: NavItem[];
  pathname: string;
  effectiveHash: string;
  onLinkClick: () => void;
  center?: React.ReactNode;
}

function MobileNavContent({
  leadingItems,
  trailingItems,
  pathname,
  effectiveHash,
  onLinkClick,
  center,
}: MobileNavContentProps) {
  const [navNode, setNavNode] = React.useState<HTMLElement | null>(null);
  const [size, setSize] = React.useState<{ w: number; h: number } | null>(null);
  const clipId = React.useId().replace(/:/g, '');
  const hasCenter = Boolean(center);

  React.useEffect(() => {
    if (!navNode) return;

    const updateSize = () => {
      const { width, height } = navNode.getBoundingClientRect();
      setSize({ w: Math.round(width), h: Math.round(height) });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(navNode);

    return () => {
      observer.disconnect();
    };
  }, [navNode]);

  const pathD = size ? buildNavPath(size.w, size.h) : null;

  return (
    <div className="relative" data-slot="mobile-nav-content">
      {center && pathD && (
        <svg
          aria-hidden="true"
          style={{
            position: 'absolute',
            width: 0,
            height: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          <defs>
            <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
              <path d={pathD} />
            </clipPath>
          </defs>
        </svg>
      )}

      <nav
        ref={setNavNode}
        data-slot="mobile-nav-dock"
        className={cn(
          'bg-popover relative flex items-center rounded-2xl p-1.5 shadow-md',
          !hasCenter && 'ring-ring/20 border ring-1'
        )}
        style={{ clipPath: pathD ? `url(#${clipId})` : undefined }}
        aria-label="Mobile section dock"
      >
        <MobileNavItems
          items={leadingItems}
          pathname={pathname}
          effectiveHash={effectiveHash}
          onLinkClick={onLinkClick}
          className={cn(hasCenter && 'flex-1 justify-end')}
        />
        {hasCenter ? <div className="w-16 shrink-0" aria-hidden /> : null}
        {hasCenter ? (
          <MobileNavItems
            items={trailingItems}
            pathname={pathname}
            effectiveHash={effectiveHash}
            onLinkClick={onLinkClick}
            className="flex-1 justify-start"
          />
        ) : null}
      </nav>

      {pathD && size && (
        <svg
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            overflow: 'visible',
          }}
          viewBox={`0 0 ${size.w} ${size.h}`}
        >
          <path
            d={center ? pathD : undefined}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-foreground/10 dark:text-foreground/20"
          />
        </svg>
      )}

      {center ? (
        <div className="pointer-events-none absolute inset-x-0 -top-4 flex justify-center">
          <div
            className={cn(
              '**:data-[slot=command-menu-trigger]:border-border **:data-[slot=command-menu-trigger]:bg-primary **:data-[slot=command-menu-trigger]:hover:bg-foreground **:data-[slot=command-menu-trigger]:active:bg-foreground **:data-[slot=command-menu-trigger]:text-primary-foreground **:data-[slot=command-menu-trigger]:ring-ring/50 **:data-[slot=command-menu-trigger]:ring-2',
              '**:data-[slot=command-menu-trigger]:extend-touch-target pointer-events-auto **:data-[slot=command-menu-trigger]:size-10 **:data-[slot=command-menu-trigger]:min-w-10 **:data-[slot=command-menu-trigger]:rounded-full **:data-[slot=command-menu-trigger]:p-0',
              '[&_[data-slot=command-menu-trigger]_[data-slot=kbd-group]]:hidden [&_[data-slot=command-menu-trigger]>span]:hidden'
            )}
          >
            {center}
          </div>
        </div>
      ) : null}
    </div>
  );
}

interface MobileNavItemsProps {
  items: NavItem[];
  pathname: string;
  effectiveHash: string;
  onLinkClick: () => void;
  className?: string;
}

function MobileNavItems({
  items,
  pathname,
  effectiveHash,
  onLinkClick,
  className,
}: MobileNavItemsProps) {
  if (items.length === 0) return null;

  return (
    <div
      className={cn('flex items-center gap-0.5', className)}
      data-slot="mobile-nav-group"
    >
      {items.map((link) => {
        const active = isNavItemActive(link.href, pathname, effectiveHash);
        const Icon = link.icon;

        return (
          <Button
            key={link.href}
            variant={active ? 'secondary' : 'ghost'}
            size="icon"
            className="extend-touch-target rounded-xl active:scale-100"
            asChild
          >
            <Link
              href={link.href}
              aria-label={link.title}
              title={link.title}
              onClick={onLinkClick}
              data-slot="mobile-nav-link"
            >
              {Icon ? <Icon /> : null}
            </Link>
          </Button>
        );
      })}
    </div>
  );
}
