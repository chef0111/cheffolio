'use client';

import { useInView, usePageInView } from 'motion/react';
import { useRef } from 'react';

import { TextFlip } from '@/components/cheffolio/text-flip';

export function FlipSentences({
  children,
  ...props
}: Omit<React.ComponentProps<'div'>, 'children' | 'ref'> & {
  children: string[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isPageInView = usePageInView();
  const isInView = useInView(ref);

  return (
    <div ref={ref} aria-label="Flip sentences" {...props}>
      <TextFlip
        className="font-pixel-square shimmer shimmer-once shimmer-duration-1500 not-dark:shimmer-color-foreground text-muted-foreground text-sm text-balance"
        play={isPageInView && isInView}
        interval={3}
      >
        {children}
      </TextFlip>
    </div>
  );
}
