'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useLocationHash() {
  const pathname = usePathname();
  const [locationHash, setLocationHash] = useState('');

  useEffect(() => {
    const syncHash = () => setLocationHash(window.location.hash);

    let prev = window.location.hash;
    let raf = 0;
    const watch = () => {
      const next = window.location.hash;
      if (next !== prev) {
        prev = next;
        syncHash();
      }
      raf = window.requestAnimationFrame(watch);
    };

    syncHash();
    window.addEventListener('hashchange', syncHash);
    window.addEventListener('popstate', syncHash);
    raf = window.requestAnimationFrame(watch);
    return () => {
      window.removeEventListener('hashchange', syncHash);
      window.removeEventListener('popstate', syncHash);
      window.cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return locationHash;
}
