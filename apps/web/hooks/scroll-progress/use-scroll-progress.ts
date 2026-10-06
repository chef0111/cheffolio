'use client';

import type { Popover } from '@base-ui/react/popover';
import { useReducedMotion, useScroll } from 'motion/react';
import * as React from 'react';

import type {
  ScrollProgressProps,
  SectionLabelMotion,
} from '@/types/scroll-progress';

export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const LABEL_VERTICAL_PADDING = 6;

const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

type Size = { width: number; height: number };
type ScrollTrackingOptions = Pick<
  ScrollProgressProps,
  'sections' | 'containerRef' | 'offset'
>;

export function useScrollProgress({
  sections,
  containerRef,
  offset = 160,
}: ScrollTrackingOptions) {
  const reduceMotion = !!useReducedMotion();
  const { scrollYProgress } = useScroll(
    containerRef ? { container: containerRef } : undefined
  );
  const [open, setOpen] = React.useState(false);
  const [keyboardInteraction, setKeyboardInteraction] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const activeLinkRef = React.useRef<HTMLAnchorElement>(null);
  const [popupElement, setPopupElement] = React.useState<HTMLDivElement | null>(
    null
  );
  const { activeHeading, visibleHeadingIds, labelMotionRef } =
    useHeadingTracking({
      sections,
      containerRef,
      offset,
    });
  const sizes = usePopupSizes(triggerRef, popupElement, open);
  const activeSection =
    sections.find(({ id }) => id === activeHeading.id) ?? sections[0];
  const minimumDepth = Math.min(...sections.map(({ depth }) => depth ?? 2));
  const surfaceSize = open
    ? {
        width: sizes.popup.width,
        height: sizes.popup.height + sizes.trigger.height,
      }
    : sizes.trigger;
  const layoutTransition = {
    layout: {
      type: 'tween' as const,
      duration: reduceMotion || keyboardInteraction ? 0 : open ? 0.25 : 0.18,
      ease: open ? EASE_IN_OUT : EASE_OUT,
    },
  };
  const labelMotion: SectionLabelMotion = {
    direction: activeHeading.direction,
    edgeOffset: Math.max(0, sizes.trigger.height / 2 - LABEL_VERTICAL_PADDING),
    mode: !activeHeading.animate ? 'instant' : reduceMotion ? 'fade' : 'slide',
    duration: activeHeading.animate ? (reduceMotion ? 0.3 : 0.5) : 0,
  };
  const onOpenChange: NonNullable<Popover.Root.Props['onOpenChange']> = (
    nextOpen,
    { event }
  ) => {
    setKeyboardInteraction(
      event.type.startsWith('key') ||
        (event instanceof MouseEvent && event.detail === 0)
    );
    setOpen(nextOpen);
  };
  function selectSection(
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    const heading = document.getElementById(id);
    if (!heading) return;

    event.preventDefault();
    labelMotionRef.current = true;
    setKeyboardInteraction(event.detail === 0);
    setOpen(false);
    history.pushState(null, '', `#${encodeURIComponent(id)}`);
    heading.scrollIntoView({
      behavior: reduceMotion || event.detail === 0 ? 'instant' : 'smooth',
      block: 'start',
    });
  }

  return {
    state: {
      sections,
      activeSection,
      visibleHeadingIds,
      minimumDepth,
      open,
      keyboardInteraction,
      sizes,
      surfaceSize,
      layoutTransition,
      labelMotion,
      scrollYProgress,
    },
    actions: { onOpenChange, selectSection, setKeyboardInteraction },
    meta: { triggerRef, activeLinkRef, popupElement, setPopupElement },
  };
}

function useHeadingTracking({
  sections,
  containerRef,
  offset = 160,
}: ScrollTrackingOptions) {
  const labelMotionRef = React.useRef(false);
  const [activeHeading, setActiveHeading] = React.useState({
    id: sections[0]?.id,
    direction: 1,
    animate: false,
  });
  const [visibleHeadingIds, setVisibleHeadingIds] = React.useState<Set<string>>(
    () => new Set()
  );
  React.useEffect(() => {
    const scroller = containerRef?.current ?? window;
    const headings = sections.map(({ id }) => ({
      id,
      element: document.getElementById(id),
    }));
    // Let CSS resolve spacing expressions and responsive viewport insets.
    const readingArea = document.createElement('div');
    readingArea.setAttribute('aria-hidden', 'true');
    Object.assign(readingArea.style, {
      position: 'fixed',
      top: 'var(--top-height, 0px)',
      bottom: 'var(--bottom-height, 0px)',
      width: '0px',
      visibility: 'hidden',
      pointerEvents: 'none',
    });
    document.body.append(readingArea);
    let frame = 0;
    let initialized = false;

    const update = () => {
      frame = 0;
      const containerBounds = containerRef?.current?.getBoundingClientRect();
      const anchor = (containerBounds?.top ?? 0) + offset;
      const readingBounds = readingArea.getBoundingClientRect();
      const visibleTop = Math.max(readingBounds.top, containerBounds?.top ?? 0);
      const visibleBottom = Math.min(
        readingBounds.bottom,
        containerBounds?.bottom ?? window.innerHeight
      );
      const visibleIds = new Set<string>();
      let activeIndex = -1;
      headings.forEach(({ id, element }, index) => {
        if (!element) return;
        const bounds = element.getBoundingClientRect();
        if (bounds.top <= anchor) activeIndex = index;
        if (
          visibleTop < visibleBottom &&
          bounds.bottom > visibleTop &&
          bounds.top < visibleBottom
        ) {
          visibleIds.add(id);
        }
      });
      setVisibleHeadingIds((previous) =>
        previous.size === visibleIds.size &&
        [...visibleIds].every((id) => previous.has(id))
          ? previous
          : visibleIds
      );
      const index = Math.max(0, activeIndex);
      const id = headings[index]?.id;
      const animate = initialized && !labelMotionRef.current;
      setActiveHeading((previous) =>
        previous.id === id
          ? previous
          : {
              id,
              direction:
                index >
                headings.findIndex((heading) => heading.id === previous.id)
                  ? 1
                  : -1,
              animate,
            }
      );
      initialized = true;
    };
    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    scheduleUpdate();
    scroller.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(containerRef?.current ?? document.body);
    observer.observe(readingArea);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      readingArea.remove();
      scroller.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [sections, containerRef, offset]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        [
          'ArrowUp',
          'ArrowDown',
          'PageUp',
          'PageDown',
          'Home',
          'End',
          ' ',
        ].includes(event.key)
      ) {
        labelMotionRef.current = true;
      }
    };
    const onPointerInput = () => {
      labelMotionRef.current = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('wheel', onPointerInput, { passive: true });
    window.addEventListener('touchstart', onPointerInput, { passive: true });
    window.addEventListener('pointerdown', onPointerInput, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('wheel', onPointerInput);
      window.removeEventListener('touchstart', onPointerInput);
      window.removeEventListener('pointerdown', onPointerInput);
    };
  }, []);

  return { activeHeading, visibleHeadingIds, labelMotionRef };
}

function usePopupSizes(
  triggerRef: React.RefObject<HTMLButtonElement | null>,
  popupElement: HTMLElement | null,
  open: boolean
) {
  const [sizes, setSizes] = React.useState<{
    trigger: Size;
    popup: Size;
  }>({
    trigger: { width: 256, height: 48 },
    popup: { width: 360, height: 48 },
  });
  React.useLayoutEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const popup = popupElement;
    const measure = () => {
      setSizes((previous) => {
        const next = {
          trigger: {
            width: open ? previous.trigger.width : trigger.offsetWidth,
            height: trigger.offsetHeight,
          },
          popup: popup
            ? { width: popup.offsetWidth, height: popup.offsetHeight }
            : previous.popup,
        };
        return next.trigger.width === previous.trigger.width &&
          next.trigger.height === previous.trigger.height &&
          next.popup.width === previous.popup.width &&
          next.popup.height === previous.popup.height
          ? previous
          : next;
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(trigger);
    if (popup) observer.observe(popup);
    return () => observer.disconnect();
  }, [open, popupElement, triggerRef]);

  return sizes;
}
