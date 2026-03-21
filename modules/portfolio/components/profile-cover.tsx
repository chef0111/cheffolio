'use client';

import { BrandLogo } from '@/components/brand';
import { cn } from '@/lib/utils';

export function ProfileCover() {
  return (
    <div className={cn('screen-line-bottom cover-background')}>
      <BrandLogo id="js-cover-mark" className="h-auto w-28 sm:w-32" />
    </div>
  );
}
