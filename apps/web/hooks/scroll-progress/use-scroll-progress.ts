'use client';

import type { Popover } from '@base-ui/react/popover';
import { type MotionValue, useScroll } from 'motion/react';
import React from 'react';

import { useScrollProgressMorph } from '@/hooks/scroll-progress/use-scroll-progress-morph';
import { useSectionLabelNavigation } from '@/hooks/scroll-progress/use-section-label-navigation';
import { useMediaQuery } from '@/hooks/use-media-query';
import type { ScrollProgressSize } from '@/lib/scroll-progress-morph';
import type {
  ScrollProgressProps,
  SectionLabelMotion,
} from '@/types/scroll-progress';

export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const LABEL_VERTICAL_PADDING = 6;

type ScrollTrackingOptions = Pick<
  ScrollProgressProps,
  'sections' | 'containerRef' | 'offset'
>;

export function useScrollProgress({
  sections,
  containerRef,
  offset = 160,
}: ScrollTrackingOptions) {
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
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
  const { activeHeading, visibleHeadingIds, labelMotionRef, trackingReady } =
    useHeadingTracking({
      sections,
      containerRef,
      offset,
      scrollYProgress,
    });
  const activeSection =
    sections.find(({ id }) => id === activeHeading.id) ?? sections[0];
  const {
    navigation: labelNavigation,
    startNavigation,
    finishLabel,
    stripRef,
    cancelNavigation,
  } = useSectionLabelNavigation({ sections, containerRef, reduceMotion });
  const labelSection = labelNavigation?.sections.at(-1) ?? activeSection;
  const sizes = usePopupSizes(triggerRef, popupElement, open, labelSection?.id);
  const minimumDepth = Math.min(...sections.map(({ depth }) => depth ?? 2));
  const surfaceSize = open
    ? {
        width: sizes.popup.width,
        height: sizes.popup.height + sizes.trigger.height,
      }
    : sizes.trigger;
  const { surfaceRef, contentReady, surfaceReady } = useScrollProgressMorph({
    triggerRef,
    popupElement,
    open,
    instant: !trackingReady || reduceMotion || keyboardInteraction,
    triggerSize: sizes.trigger,
    surfaceSize,
    measured: sizes.measured,
  });
  const animateLabel =
    trackingReady && (labelNavigation?.animate ?? activeHeading.animate);
  const labelMotion: SectionLabelMotion = {
    direction: activeHeading.direction,
    edgeOffset: Math.max(0, sizes.trigger.height / 2 - LABEL_VERTICAL_PADDING),
    mode: !animateLabel ? 'instant' : reduceMotion ? 'fade' : 'slide',
    duration: animateLabel ? (reduceMotion ? 0.3 : 0.4) : 0,
  };
  const onOpenChange: NonNullable<Popover.Root.Props['onOpenChange']> = (
    nextOpen,
    { event }
  ) => {
    if (nextOpen) cancelNavigation();
    setKeyboardInteraction(
      event.type.startsWith('key') ||
        (event instanceof MouseEvent && event.detail === 0)
    );
    setOpen(nextOpen);
  };
  const selectSection = React.useCallback(
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
      if (labelSection)
        startNavigation(labelSection.id, id, event.detail !== 0);
      labelMotionRef.current = event.detail === 0;
      setKeyboardInteraction(event.detail === 0);
      setOpen(false);
      history.pushState(null, '', `#${encodeURIComponent(id)}`);
      heading.scrollIntoView({
        behavior: reduceMotion || event.detail === 0 ? 'instant' : 'smooth',
        block: 'start',
      });
    },
    [reduceMotion, labelMotionRef, labelSection, startNavigation]
  );

  return {
    state: {
      sections,
      activeSection,
      labelSection,
      labelNavigation,
      visibleHeadingIds,
      minimumDepth,
      open,
      keyboardInteraction,
      sizes,
      surfaceSize,
      contentReady,
      surfaceReady,
      ready: trackingReady && surfaceReady && sizes.measured,
      labelMotion,
      scrollYProgress,
    },
    actions: {
      onOpenChange,
      selectSection,
      setKeyboardInteraction,
      finishLabel,
    },
    meta: {
      triggerRef,
      stripRef,
      surfaceRef,
      activeLinkRef,
      popupElement,
      setPopupElement,
    },
  };
}

function useHeadingTracking({
  sections,
  containerRef,
  offset = 160,
  scrollYProgress,
}: ScrollTrackingOptions & { scrollYProgress: MotionValue<number> }) {
  const labelMotionRef = React.useRef(false);
  const [initializedSource, setInitializedSource] =
    React.useState<ScrollTrackingOptions | null>(null);
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
    let geometryDirty = true;
    let disposed = false;
    let previousScrollTop: number | undefined;
    let previousScrollHeight: number | undefined;
    let headingBounds: {
      id: string;
      top: number;
      bottom: number;
      index: number;
    }[] = [];
    let contentRoot =
      headings.find(({ element }) => element)?.element?.parentElement ??
      document.body;
    while (
      contentRoot.parentElement &&
      headings.some(({ element }) => element && !contentRoot.contains(element))
    ) {
      contentRoot = contentRoot.parentElement;
    }

    const update = () => {
      frame = 0;
      const containerBounds = containerRef?.current?.getBoundingClientRect();
      const scrollTop = containerRef?.current?.scrollTop ?? window.scrollY;
      const geometryChanged = geometryDirty;
      const origin = containerBounds?.top ?? 0;
      const anchor = (containerBounds?.top ?? 0) + offset;
      const readingBounds = readingArea.getBoundingClientRect();
      const visibleTop = Math.max(readingBounds.top, containerBounds?.top ?? 0);
      const visibleBottom = Math.min(
        readingBounds.bottom,
        containerBounds?.bottom ?? window.innerHeight
      );
      const visibleIds = new Set<string>();
      let activeIndex = -1;
      // Document-space bounds stay valid during scrolling; remeasure only after layout changes.
      if (geometryDirty) {
        headingBounds = [];
        headings.forEach(({ id }, index) => {
          const element = document.getElementById(id);
          if (!element) return;
          const bounds = element.getBoundingClientRect();
          headingBounds.push({
            id,
            index,
            top: bounds.top - origin + scrollTop,
            bottom: bounds.bottom - origin + scrollTop,
          });
        });
        geometryDirty = false;
      }
      headingBounds.forEach(({ id, top, bottom, index }) => {
        const viewportTop = top + origin - scrollTop;
        const viewportBottom = bottom + origin - scrollTop;
        if (viewportTop <= anchor) activeIndex = index;
        if (
          visibleTop < visibleBottom &&
          viewportBottom > visibleTop &&
          viewportTop < visibleBottom
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
      if (!initialized) {
        // Seed both indicators from the same restored position before revealing the pill.
        const scrollElement =
          containerRef?.current ?? document.scrollingElement;
        const scrollHeight = scrollElement?.scrollHeight ?? 0;
        const viewportHeight =
          scrollElement?.clientHeight ?? window.innerHeight;
        const scrollRange = scrollHeight - viewportHeight;
        scrollYProgress.set(
          scrollRange > 0
            ? Math.min(1, Math.max(0, scrollTop / scrollRange))
            : 0
        );
        // Restoration can follow load/pageshow; confirm the next frame agrees.
        if (
          document.readyState === 'complete' &&
          !geometryChanged &&
          previousScrollTop === scrollTop &&
          previousScrollHeight === scrollHeight
        ) {
          initialized = true;
          setInitializedSource({ sections, containerRef, offset });
        } else {
          previousScrollTop = scrollTop;
          previousScrollHeight = scrollHeight;
          if (document.readyState === 'complete') scheduleUpdate();
        }
      }
    };
    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const invalidateGeometry = () => {
      if (disposed) return;
      geometryDirty = true;
      scheduleUpdate();
    };
    const onContentLoad = (event: Event) => {
      if (event.target instanceof Node && contentRoot.contains(event.target))
        invalidateGeometry();
    };

    scheduleUpdate();
    scroller.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', invalidateGeometry);
    window.addEventListener('load', invalidateGeometry);
    window.addEventListener('pageshow', invalidateGeometry);
    document.addEventListener('load', onContentLoad, true);
    document.fonts.addEventListener('loadingdone', invalidateGeometry);
    void document.fonts.ready.then(invalidateGeometry);
    const observer = new ResizeObserver(invalidateGeometry);
    observer.observe(containerRef?.current ?? document.body);
    observer.observe(readingArea);
    observer.observe(contentRoot);
    [...contentRoot.children].forEach((element) => observer.observe(element));
    const mutationObserver = new MutationObserver(invalidateGeometry);
    mutationObserver.observe(contentRoot, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['hidden', 'open'],
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      mutationObserver.disconnect();
      readingArea.remove();
      scroller.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', invalidateGeometry);
      window.removeEventListener('load', invalidateGeometry);
      window.removeEventListener('pageshow', invalidateGeometry);
      document.removeEventListener('load', onContentLoad, true);
      document.fonts.removeEventListener('loadingdone', invalidateGeometry);
    };
  }, [sections, containerRef, offset, scrollYProgress]);

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

  return {
    activeHeading,
    visibleHeadingIds,
    labelMotionRef,
    trackingReady:
      initializedSource?.sections === sections &&
      initializedSource?.containerRef === containerRef &&
      initializedSource?.offset === offset,
  };
}

function usePopupSizes(
  triggerRef: React.RefObject<HTMLButtonElement | null>,
  popupElement: HTMLElement | null,
  open: boolean,
  labelId: string | undefined
) {
  const [sizes, setSizes] = React.useState<{
    trigger: ScrollProgressSize;
    popup: ScrollProgressSize;
    measured: boolean;
  }>({
    trigger: { width: 256, height: 48 },
    popup: { width: 360, height: 48 },
    measured: false,
  });
  React.useLayoutEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) {
      setSizes((previous) =>
        previous.measured ? { ...previous, measured: false } : previous
      );
      return;
    }

    const popup = popupElement;
    const measure = () => {
      if (!trigger.offsetHeight || !trigger.offsetWidth) return;
      setSizes((previous) => {
        const next = {
          measured: true,
          trigger: {
            width: open ? previous.trigger.width : trigger.offsetWidth,
            height: trigger.offsetHeight,
          },
          popup:
            popup && open && popup.offsetWidth > 0
              ? { width: popup.offsetWidth, height: popup.offsetHeight }
              : previous.popup,
        };
        return previous.measured &&
          next.trigger.width === previous.trigger.width &&
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
  }, [open, popupElement, triggerRef, labelId]);

  return sizes;
}
