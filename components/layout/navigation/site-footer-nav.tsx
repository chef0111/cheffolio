'use client';

import { Suspense } from 'react';

import { CommandMenu } from '@/components/cheffolio/command-menu';
import { MOBILE_NAV } from '@/config/site';

import { NavMobile } from './nav-mobile';

export function SiteFooterNav() {
  return (
    <div className="not-found-hidden fixed bottom-[calc(--spacing(4)+env(safe-area-inset-bottom,0))] left-1/2 z-50 -translate-x-1/2 sm:hidden">
      <Suspense fallback={null}>
        <NavMobile items={MOBILE_NAV}>
          <CommandMenu />
        </NavMobile>
      </Suspense>
    </div>
  );
}
