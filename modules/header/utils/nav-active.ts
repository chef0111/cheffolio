export function normalizeHash(value: string) {
  if (!value) return '';
  const body = value.replace(/^#+/, '');
  return body ? `#${body}` : '';
}

/**
 * Whether a nav link should show as active, using pathname (no hash) plus the
 * current `window.location.hash` for `#…` and `/#…` links.
 */
export function isNavItemActive(
  href: string,
  pathname: string | null | undefined,
  locationHash: string,
  exact = false
) {
  if (href.startsWith('#')) {
    return normalizeHash(locationHash) === normalizeHash(href);
  }

  if (href.startsWith('/#')) {
    try {
      const u = new URL(href, 'http://localhost');
      const pathMatches =
        pathname === u.pathname ||
        (u.pathname === '/' && ['/', '/index'].includes(pathname || ''));
      if (!pathMatches) return false;
      return !u.hash || normalizeHash(locationHash) === normalizeHash(u.hash);
    } catch {
      return false;
    }
  }

  if (exact) {
    return pathname === href;
  }

  return (
    pathname === href ||
    (href === '/'
      ? ['/', '/index'].includes(pathname || '')
      : Boolean(pathname?.startsWith(href)))
  );
}