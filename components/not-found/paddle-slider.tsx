'use client';

import { Slider as SliderPrimitive } from '@base-ui/react/slider';
import { Settings2Icon } from 'lucide-react';
import { useEffect, useRef } from 'react';

import {
  CANVAS_WIDTH,
  paddleMaxX,
  paddleMinX,
} from '@/components/not-found/constants';
import { cn } from '@/lib/utils';

const PADDLE_MIN_X = paddleMinX();
const PADDLE_MAX_X = paddleMaxX(CANVAS_WIDTH);
const PADDLE_CENTER_X = (PADDLE_MIN_X + PADDLE_MAX_X) / 2;

export function PaddleSlider({
  onPaddleX,
  onEngage,
  disabled,
  className,
}: {
  onPaddleX: (x: number) => void;
  onEngage?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  const footerRef = useRef<HTMLElement>(null);
  const onEngageRef = useRef(onEngage);
  const disabledRef = useRef(disabled);

  useEffect(() => {
    onEngageRef.current = onEngage;
    disabledRef.current = disabled;
  }, [onEngage, disabled]);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const engage = () => {
      if (disabledRef.current) return;
      onEngageRef.current?.();
    };

    el.addEventListener('touchstart', engage, { capture: true, passive: true });
    el.addEventListener('pointerdown', engage, { capture: true });

    return () => {
      el.removeEventListener('touchstart', engage, true);
      el.removeEventListener('pointerdown', engage, true);
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      aria-label="Paddle control"
      className={cn(
        'bg-background fixed inset-x-4 bottom-4 z-40 md:hidden',
        className
      )}
    >
      <div className="mx-auto w-full max-w-200 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-1">
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
          onValueChange={(value, details) => {
            if (details.reason === 'none') return;
            if (typeof value !== 'number') return;
            onPaddleX(value);
          }}
          className="bg-muted inset-ring-foreground/10 w-full rounded-xl p-1 shadow-inner inset-ring-1 data-disabled:opacity-50 [&_input]:pointer-events-none"
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
              <Settings2Icon className="size-7" />
            </SliderPrimitive.Thumb>
          </SliderPrimitive.Control>
        </SliderPrimitive.Root>
      </div>
    </footer>
  );
}
