'use client';

import * as React from 'react';

import type {
  ScrollProgressSection,
  SectionLabelNavigation,
} from '@/types/scroll-progress';

type NavigationSession = {
  snapshot: SectionLabelNavigation;
  scrollFinished: boolean;
  labelFinished: boolean;
  lastScrollTop: number;
};

export function useSectionLabelNavigation({
  sections,
  containerRef,
  reduceMotion,
}: {
  sections: ScrollProgressSection[];
  containerRef?: React.RefObject<HTMLElement | null>;
  reduceMotion: boolean;
}) {
  const [navigation, setNavigation] =
    React.useState<SectionLabelNavigation | null>(null);
  const sessionRef = React.useRef<NavigationSession | null>(null);
  const stripRef = React.useRef<HTMLSpanElement>(null);
  const settleTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const stopScrolling = React.useCallback(() => {
    const scroller = containerRef?.current ?? window;
    scroller.scrollTo({
      top: scroller instanceof Window ? scroller.scrollY : scroller.scrollTop,
      behavior: 'instant',
    });
  }, [containerRef]);

  const getScrollTop = React.useCallback(
    () => containerRef?.current?.scrollTop ?? window.scrollY,
    [containerRef]
  );

  const cancelNavigation = React.useCallback(() => {
    if (!sessionRef.current) return;
    sessionRef.current = null;
    if (settleTimerRef.current !== null) clearTimeout(settleTimerRef.current);
    settleTimerRef.current = null;
    stopScrolling();
    setNavigation(null);
  }, [stopScrolling]);

  const release = React.useCallback(() => {
    const session = sessionRef.current;
    if (!session?.scrollFinished || !session.labelFinished) return;
    sessionRef.current = null;
    setNavigation(null);
  }, []);

  const finishLabel = React.useCallback(
    (snapshot: SectionLabelNavigation) => {
      const session = sessionRef.current;
      if (!session || session.snapshot !== snapshot) return;
      session.labelFinished = true;
      release();
    },
    [release]
  );

  const finishScroll = React.useCallback(
    function finishScroll() {
      if (settleTimerRef.current !== null) {
        clearTimeout(settleTimerRef.current);
        settleTimerRef.current = null;
      }
      if (!sessionRef.current) return;
      const scrollTop = getScrollTop();
      // The compositor can keep scrolling while main-thread scroll events are delayed.
      if (scrollTop !== sessionRef.current.lastScrollTop) {
        sessionRef.current.lastScrollTop = scrollTop;
        settleTimerRef.current = setTimeout(finishScroll, 150);
        return;
      }
      sessionRef.current.scrollFinished = true;
      release();
    },
    [release, getScrollTop]
  );

  const startNavigation = React.useCallback(
    (sourceId: string, targetId: string, animate: boolean) => {
      const current = sessionRef.current?.snapshot;
      const strip = stripRef.current;
      if (current && strip?.firstElementChild instanceof HTMLElement) {
        const rowHeight = strip.firstElementChild.offsetHeight;
        const position = new DOMMatrixReadOnly(
          getComputedStyle(strip).transform
        );
        const index = Math.max(
          0,
          Math.min(
            current.sections.length - 1,
            Math.round(-position.m42 / rowHeight)
          )
        );
        sourceId =
          current.sections[
            current.direction > 0 ? index : current.sections.length - 1 - index
          ].id;
      }
      const from = sections.findIndex(({ id }) => id === sourceId);
      const to = sections.findIndex(({ id }) => id === targetId);
      if (from < 0 || to < 0) return;

      // Cancel the previous native scroll before starting a new destination.
      if (sessionRef.current) stopScrolling();

      const direction = to >= from ? 1 : -1;
      const path = sections.slice(Math.min(from, to), Math.max(from, to) + 1);
      if (direction < 0) path.reverse();
      const snapshot = { sections: path, direction, animate };
      sessionRef.current = {
        snapshot,
        scrollFinished: false,
        labelFinished: !animate || reduceMotion || from === to,
        lastScrollTop: getScrollTop(),
      };
      setNavigation(snapshot);
      if (settleTimerRef.current !== null) clearTimeout(settleTimerRef.current);
      // No-op and instant navigation may not emit scroll events.
      settleTimerRef.current = setTimeout(finishScroll, 200);
    },
    [sections, reduceMotion, finishScroll, stopScrolling, getScrollTop]
  );

  React.useEffect(() => {
    if (reduceMotion && sessionRef.current) {
      sessionRef.current.labelFinished = true;
      release();
    }
  }, [reduceMotion, release]);

  React.useEffect(() => {
    const scroller = containerRef?.current ?? window;
    const onScroll = () => {
      const session = sessionRef.current;
      if (!session) return;
      session.lastScrollTop = getScrollTop();
      session.scrollFinished = false;
      if (settleTimerRef.current !== null) clearTimeout(settleTimerRef.current);
      settleTimerRef.current = setTimeout(finishScroll, 150);
    };
    const onPointerInput = (event: Event) => {
      // Keep the pressed trigger's label mounted until its click opens the menu.
      if (
        event.target instanceof Element &&
        event.target.closest(
          '[data-slot="scroll-progress"], [data-slot="scroll-progress-surface"]'
        )
      )
        return;
      cancelNavigation();
    };
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
      )
        cancelNavigation();
    };

    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', cancelNavigation, { passive: true });
    window.addEventListener('touchstart', onPointerInput, { passive: true });
    window.addEventListener('pointerdown', onPointerInput, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    return () => {
      sessionRef.current = null;
      if (settleTimerRef.current !== null) clearTimeout(settleTimerRef.current);
      scroller.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', cancelNavigation);
      window.removeEventListener('touchstart', onPointerInput);
      window.removeEventListener('pointerdown', onPointerInput);
      window.removeEventListener('keydown', onKeyDown);
      setNavigation(null);
    };
  }, [containerRef, sections, finishScroll, cancelNavigation, getScrollTop]);

  return {
    navigation,
    startNavigation,
    finishLabel,
    stripRef,
    cancelNavigation,
  };
}
