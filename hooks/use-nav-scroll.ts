'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

/** Viewport offset from top (sticky header + small margin), px */
const DEFAULT_SCROLL_OFFSET = 88.5;

/**
 * Returns scroll-based `#section` for nav highlight (home only).
 * `ready` becomes true after the first measurement so callers can prefer URL hash
 * until then, then trust scroll position (including empty = no section at anchor).
 */
export function useNavScroll(
  items: { href: string }[],
  options?: { offset?: number }
): { hash: string; ready: boolean } {
  const pathname = usePathname();
  const offset = options?.offset ?? DEFAULT_SCROLL_OFFSET;

  const sectionIds = useMemo(
    () =>
      items
        .map((i) => i.href)
        .filter((h) => h.startsWith('#'))
        .map((h) => h.replace(/^#/, '')),
    [items]
  );

  const isHome = pathname === '/' || pathname === '/index';

  const [activeHash, setActiveHash] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setActiveHash('');
      setReady(false);
      return;
    }

    if (sectionIds.length === 0) {
      setActiveHash('');
      setReady(false);
      return;
    }

    const compute = () => {
      let currentId = '';

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;

        // "Active" when the header anchor line is inside the section.
        const rect = el.getBoundingClientRect();
        if (rect.top <= offset && rect.bottom > offset) {
          currentId = id;
          break;
        }
      }

      const nextHash = currentId ? `#${currentId}` : '';
      setActiveHash(nextHash);
      setReady(true);

      // Build the new URL preserving path + query, only swapping the hash.
      const { pathname: path, search } = window.location;
      const nextUrl = nextHash
        ? `${path}${search}${nextHash}`
        : `${path}${search}`;
      if (window.location.hash !== nextHash) {
        window.history.replaceState(null, '', nextUrl);
      }
    };

    let raf = 0;
    const onScrollOrResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };

    // Avoid setting state synchronously in effect body.
    onScrollOrResize();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [isHome, offset, sectionIds]);

  return { hash: isHome ? activeHash : '', ready: isHome && ready };
}
