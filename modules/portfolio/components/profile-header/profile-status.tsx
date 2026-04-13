'use client';

import { useState } from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

export function ProfileStatus() {
  const isTouchDevice = useMediaQuery('(pointer: coarse)');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (isTouchDevice) setIsExpanded((current) => !current);
  };

  const handleBlur = () => {
    if (isTouchDevice) setIsExpanded(false);
  };

  return (
    <button
      type="button"
      className={cn(
        'avatar-ring bg-background group/status extend-touch-target absolute bottom-3 left-25 z-10 flex size-5 items-center justify-center gap-1 text-xs select-none hover:w-fit hover:pr-1.5 hover:pl-[0.1rem] sm:bottom-3.5 sm:left-31.5 sm:size-6 sm:text-sm',
        isTouchDevice && isExpanded && 'w-fit pr-1 pl-px'
      )}
      onClick={handleClick}
      onBlur={handleBlur}
      aria-pressed={isTouchDevice && isExpanded}
      aria-label="GitHub status"
    >
      😴
      <span
        className={cn(
          'text-foreground/80 hidden leading-none text-nowrap',
          isTouchDevice ? isExpanded && 'block' : 'group-hover/status:block'
        )}
        aria-label="Status quote"
      >
        Focusing, don&apos;t let the emoji fool you
      </span>
    </button>
  );
}
