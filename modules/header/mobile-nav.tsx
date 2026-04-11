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
import { isNavItemActive } from './utils/nav-active';
import { buildNavPath } from './utils/nav-notch';

export function MobileNav({
  items,
  center,
}: {
  items: NavItem[];
  center?: React.ReactNode;
}) {
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
  }, []);

  if (isDesktop) return null;

  const leftItems = items.slice(0, 2);
  const rightItems = items.slice(2);

  return (
    <div className="relative">
      <MobileNavContent
        leftItems={leftItems}
        rightItems={rightItems}
        pathname={pathname}
        effectiveHash={effectiveHash}
        onLinkClick={handleLinkClick}
        center={center}
      />
    </div>
  );
}

function MobileNavContent({
  leftItems,
  rightItems,
  pathname,
  effectiveHash,
  onLinkClick,
  center,
}: {
  leftItems: NavItem[];
  rightItems: NavItem[];
  pathname: string;
  effectiveHash: string;
  onLinkClick: () => void;
  center?: React.ReactNode;
}) {
  const [size, setSize] = React.useState<{ w: number; h: number } | null>(null);
  const clipId = React.useId().replace(/:/g, '');

  const navRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const { width, height } = node.getBoundingClientRect();
    setSize({ w: Math.round(width), h: Math.round(height) });
  }, []);

  const pathD = size ? buildNavPath(size.w, size.h) : null;

  return (
    <div className="relative">
      {pathD && (
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

      <div
        ref={navRef}
        className="bg-popover relative flex items-center rounded-2xl p-1.5 shadow-md"
        style={{ clipPath: pathD ? `url(#${clipId})` : undefined }}
        role="navigation"
        aria-label="Mobile section dock"
      >
        <MobileNavItems
          items={leftItems}
          pathname={pathname}
          effectiveHash={effectiveHash}
          onLinkClick={onLinkClick}
        />
        <div className="w-16 shrink-0" aria-hidden />
        <MobileNavItems
          items={rightItems}
          pathname={pathname}
          effectiveHash={effectiveHash}
          onLinkClick={onLinkClick}
        />
      </div>

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
            d={pathD}
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
              '**:data-[slot=command-menu-trigger]:border-border **:data-[slot=command-menu-trigger]:bg-primary **:data-[slot=command-menu-trigger]:text-primary-foreground **:data-[slot=command-menu-trigger]:ring-ring/50 **:data-[slot=command-menu-trigger]:ring-2',
              'pointer-events-auto **:data-[slot=command-menu-trigger]:size-10 **:data-[slot=command-menu-trigger]:min-w-10 **:data-[slot=command-menu-trigger]:rounded-full **:data-[slot=command-menu-trigger]:p-0 **:data-[slot=command-menu-trigger]:shadow-md',
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

function MobileNavItems({
  items,
  pathname,
  effectiveHash,
  onLinkClick,
}: {
  items: NavItem[];
  pathname: string;
  effectiveHash: string;
  onLinkClick: () => void;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {items.map((link) => {
        const active = isNavItemActive(link.href, pathname, effectiveHash);
        const Icon = link.icon;
        return (
          <Button
            key={link.href}
            asChild
            variant={active ? 'secondary' : 'ghost'}
            size="icon-sm"
            className="rounded-xl"
          >
            <Link
              href={link.href}
              aria-label={link.title}
              title={link.title}
              onClick={onLinkClick}
            >
              {Icon ? <Icon data-icon="inline-start" /> : null}
            </Link>
          </Button>
        );
      })}
    </div>
  );
}
