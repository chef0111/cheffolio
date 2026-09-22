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
        'avatar-ring bg-background group/status extend-touch-target absolute bottom-3 left-25 z-10 flex cursor-default items-center text-xs select-none sm:bottom-3.5 sm:left-31.5 sm:text-sm'
      )}
      onClick={handleClick}
      onBlur={handleBlur}
      aria-pressed={isTouchDevice ? isExpanded : undefined}
      aria-label="GitHub status"
    >
      <span className="flex size-5 shrink-0 items-center justify-center sm:size-6">
        <Twemoji className="sm:translate-y-[-0.025em]" aria-hidden="true">
          {emoji}
        </Twemoji>
      </span>

      {quote && (
        <span
          className={cn(
            'block max-w-0 overflow-hidden leading-none text-nowrap opacity-0',
            'ease-out-cubic transition-[max-width,opacity,translate] duration-200',
            isTouchDevice
              ? isExpanded && 'max-w-xs opacity-100'
              : 'group-hover/status:max-w-xs group-hover/status:translate-x-px group-hover/status:opacity-100',
            'group-focus-visible/status:max-w-xs group-focus-visible/status:translate-x-px group-focus-visible/status:opacity-100'
          )}
          aria-label="Status quote"
        >
          <span className="text-foreground/80 block pr-2">{quote}</span>
        </span>
      )}
    </button>
  );
}
