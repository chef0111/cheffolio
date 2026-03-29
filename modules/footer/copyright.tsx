'use client';

import { addQueryParams } from '@/utils/url';
import { UTM_PARAMS } from '@/config/site';

export function FooterCopyright() {
  return (
    <p className="text-muted-foreground text-center font-mono text-sm">
      &copy; {new Date().getFullYear()} cheffolio, built by{' '}
      <a
        href={addQueryParams('https://github.com/chef0111', UTM_PARAMS)}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-foreground transition-color underline underline-offset-4"
      >
        chef0111
      </a>
    </p>
  );
}
