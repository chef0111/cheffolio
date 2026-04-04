'use client';

import {
  type ComponentProps,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { cn } from '@/lib/utils';

export type ScrollFadeEffectProps = ComponentProps<'div'> & {
  /**
   * Scroll direction to apply the fade effect.
   * @defaultValue "vertical"
   * */
  orientation?: 'horizontal' | 'vertical';
};

export function ScrollFadeEffect({
  className,
  orientation = 'vertical',
  ...props
}: ScrollFadeEffectProps) {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  const checkOverflow = useCallback(() => {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    const isOverflowing =
      orientation === 'horizontal'
        ? element.scrollWidth - element.clientWidth > 1
        : element.scrollHeight - element.clientHeight > 1;

    setHasOverflow(isOverflowing);
  }, [orientation]);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    let frameId = 0;

    const scheduleCheck = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(checkOverflow);
    };

    const resizeObserver = new ResizeObserver(scheduleCheck);
    const mutationObserver = new MutationObserver(scheduleCheck);

    resizeObserver.observe(element);
    mutationObserver.observe(element, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    window.addEventListener('resize', scheduleCheck);
    element.addEventListener('scroll', scheduleCheck, { passive: true });

    scheduleCheck();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('resize', scheduleCheck);
      element.removeEventListener('scroll', scheduleCheck);
    };
  }, [checkOverflow]);

  return (
    <div
      ref={elementRef}
      data-orientation={orientation}
      className={cn(
        'data-vertical:overflow-y-auto data-[orientation=horizontal]:overflow-x-auto',
        hasOverflow &&
          (orientation === 'horizontal'
            ? 'scroll-fade-effect-x'
            : 'scroll-fade-effect-y'),
        className
      )}
      {...props}
    />
  );
}
