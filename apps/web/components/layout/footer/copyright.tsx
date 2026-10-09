'use client';

import { UTM_PARAMS } from '@/config/site';
import { addQueryParams } from '@/utils/url';

export function FooterCopyright() {
  return (
    <p className="text-muted-foreground font-pixel-square text-center text-sm">
      &copy; {new Date().getFullYear()} giabao.dev, built by{' '}
      <a
        href={addQueryParams('https://github.com/gbaolt', UTM_PARAMS)}
        target="_blank"
        rel="noopener noreferrer"
        className="link-underline hover:text-foreground"
      >
        gbaolt
      </a>
    </p>
  );
}
