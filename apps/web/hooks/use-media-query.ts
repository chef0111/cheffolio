import { useEffect, useState } from 'react';

/**
 * Subscribes to `matchMedia` after mount. The initial value is always `false` so
 * server HTML and the first client render match (avoids hydration mismatches when
 * branching UI on viewport — e.g. Radix popover trigger vs plain button).
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
