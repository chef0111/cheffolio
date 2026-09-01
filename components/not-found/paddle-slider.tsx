'use client';

import { Slider as SliderPrimitive } from '@base-ui/react/slider';
import { PlayIcon, Settings2Icon } from 'lucide-react';

import {
  CANVAS_WIDTH,
  paddleMaxX,
  paddleMinX,
} from '@/components/not-found/constants';
import { Button } from '@/components/ui/button';
import { fontPixel } from '@/config/font';
import { cn } from '@/lib/utils';

const PADDLE_MIN_X = paddleMinX();
const PADDLE_MAX_X = paddleMaxX(CANVAS_WIDTH);
const PADDLE_CENTER_X = (PADDLE_MIN_X + PADDLE_MAX_X) / 2;

/**
 * Mobile thumb-zone controls. Play sits here once (same reach as the paddle),
 * then swaps to the slider for the rest of the session.
 */
export function PaddleSlider({
  onPaddleX,
  onStartMotion,
  onPlay,
  showPlay,
  disabled,
  className,
}: {
  onPaddleX: (x: number) => void;
  /** Enable ball motion only. Never resets the round. */
  onStartMotion?: () => void;
  onPlay?: () => void;
  showPlay?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <footer
      aria-label={showPlay ? 'Start game' : 'Paddle control'}
      className={cn('fixed inset-x-8 bottom-8 z-40 md:hidden', className)}
    >
      <div className="mx-auto w-full max-w-200 pb-[env(safe-area-inset-bottom)]">
        {showPlay ? (
          <Button
            type="button"
            size="lg"
            disabled={disabled}
            aria-label="Play FIG_404"
            onClick={onPlay}
            className={cn(
              fontPixel.className,
              'h-12 w-full touch-manipulation gap-2 text-base tracking-wide uppercase'
            )}
          >
            <PlayIcon data-icon="inline-start" aria-hidden="true" />
            Play
          </Button>
        ) : (
          <SliderPrimitive.Root
            data-slot="paddle-slider"
            aria-label="Paddle"
            min={PADDLE_MIN_X}
            max={PADDLE_MAX_X}
            step={1}
            largeStep={16}
            defaultValue={PADDLE_CENTER_X}
            disabled={disabled}
            thumbAlignment="edge"
            onPointerDown={onStartMotion}
            onValueChange={(value, details) => {
              if (details.reason === 'none') return;
              if (typeof value !== 'number') return;
              onStartMotion?.();
              onPaddleX(value);
            }}
            className="bg-muted inset-ring-foreground/10 w-full touch-manipulation rounded-xl p-1 shadow-inner inset-ring-1 data-disabled:opacity-50"
          >
            <SliderPrimitive.Control className="relative flex h-10 w-full touch-none items-center overflow-visible select-none">
              <SliderPrimitive.Track
                data-slot="paddle-slider-track"
                className="relative h-10 w-full grow"
              />
              <SliderPrimitive.Thumb
                data-slot="button"
                data-variant="default"
                className="text-primary-foreground data-focused:ring-ring/50 ring-primary dark:ring-ring flex h-10 w-14 shrink-0 cursor-grab items-center justify-center rounded-lg border-none bg-[linear-gradient(to_bottom,color-mix(in_srgb,var(--accent-foreground)_80%,transparent),var(--primary-accent))] shadow-none ring-1 select-none data-disabled:pointer-events-none data-dragging:cursor-grabbing data-focused:ring-3 data-focused:outline-hidden dark:bg-[linear-gradient(to_top,var(--primary),var(--primary-accent))]"
              >
                <Settings2Icon className="size-7" aria-hidden="true" />
              </SliderPrimitive.Thumb>
            </SliderPrimitive.Control>
          </SliderPrimitive.Root>
        )}
      </div>
    </footer>
  );
}
