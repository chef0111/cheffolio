'use client';

import * as React from 'react';

import { Twemoji } from '@/components/ui/twemoji';
import { useMediaQuery } from '@/hooks/use-media-query';
import { haptic } from '@/lib/haptic';
import { cn } from '@/lib/utils';

interface ProfileStatusProps {
  emoji?: string;
  quote?: string;
}

export function ProfileStatus({ emoji, quote }: ProfileStatusProps) {
  const isTouchDevice = useMediaQuery('(pointer: coarse)');
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleClick = () => {
    if (isTouchDevice) {
      haptic();
      setIsExpanded((current) => !current);
    }
  };

  const handleBlur = () => {
    if (isTouchDevice) setIsExpanded(false);
  };

  if (!emoji) return null;

  return (
    <button
      type="button"
      className={cn(
        'avatar-ring bg-background group/status extend-touch-target absolute bottom-3 left-25 z-10 flex size-5 cursor-default items-center justify-center gap-1 text-xs select-none sm:bottom-3.5 sm:left-31.5 sm:size-6 sm:text-sm',
        !isTouchDevice &&
          quote &&
          'hover:w-fit hover:pr-1.5 hover:pl-[0.1rem] focus-visible:pr-1.5 focus-visible:pl-[0.1rem]',
        isTouchDevice && isExpanded && quote && 'w-fit pr-1 pl-px'
      )}
      onClick={handleClick}
      onBlur={handleBlur}
      aria-pressed={isTouchDevice ? isExpanded : undefined}
      aria-label="GitHub status"
    >
      <Twemoji>{emoji}</Twemoji>
      {quote && (
        <span
          className={cn(
            'text-foreground/80 hidden leading-none text-nowrap',
            isTouchDevice
              ? isExpanded && 'block'
              : 'group-hover/status:block group-focus-visible/status:block'
          )}
          aria-label="Status quote"
        >
          {quote}
        </span>
      )}
    </button>
  );
}
