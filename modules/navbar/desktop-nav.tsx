'use client';

import { usePathname } from 'next/navigation';

import { Nav } from './nav';
import type { NavItem } from './nav';

export function DesktopNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return <Nav className="max-sm:hidden" items={items} activeId={pathname} />;
}
