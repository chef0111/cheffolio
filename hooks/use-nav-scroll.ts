'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

/** Viewport offset from top */
const DEFAULT_SCROLL_OFFSET = 88.5;

/** Flag to skip replaceState for a short time after user-initiated navigation */
let recentUserNavigation = false;
let userNavTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Call this immediately before user-initiated pushState to prevent
 * scroll-based replaceState from racing/overwriting the history entry.
 */
export function markUserNavigation() {
  recentUserNavigation = true;
  if (userNavTimeout) clearTimeout(userNavTimeout);
  userNavTimeout = setTimeout(() => {
    recentUserNavigation = false;
  }, 100);
}

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
  const urlDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

      if (urlDebounceRef.current) {
        clearTimeout(urlDebounceRef.current);
      }

      const nextHashForUrl = nextHash;
      const nextUrlForUrl = nextUrl;
      urlDebounceRef.current = setTimeout(() => {
        if (recentUserNavigation) return;
        if (window.location.hash === nextHashForUrl) return;
        window.history.replaceState(null, '', nextUrlForUrl);
      }, 300);
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
      if (urlDebounceRef.current) {
        clearTimeout(urlDebounceRef.current);
        urlDebounceRef.current = null;
      }
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [isHome, offset, sectionIds]);

  return { hash: isHome ? activeHash : '', ready: isHome && ready };
}
