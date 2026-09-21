export function isNavItemActive(
  href: string,
  activeId: string | undefined,
  exactMatch = false
) {
  if (activeId === href) return true;
  if (exactMatch) return false;
  if (href === '/') return activeId === '/' || activeId === '/index';
  return Boolean(activeId?.startsWith(href));
}
