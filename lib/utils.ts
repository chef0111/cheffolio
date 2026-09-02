export { type ClassValue, cn } from 'cnfast';

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SITE_URL}${path}`;
}
