'use client';

import { UTM_PARAMS } from '@/config/site';
import { addQueryParams } from '@/utils/url';

export function FooterCopyright() {
  return (
    <p className="text-muted-foreground font-pixel-square text-center text-sm">
      &copy; {new Date().getFullYear()} cheffolio, built by{' '}
      <a
        href={addQueryParams('https://github.com/chef0111', UTM_PARAMS)}
        target="_blank"
        rel="noopener noreferrer"
        className="link-underline hover:text-foreground"
      >
        chef0111
      </a>
    </p>
  );
}
