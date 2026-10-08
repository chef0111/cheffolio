'use client';

import * as React from 'react';

export function useTocScroll(
  listRef: React.RefObject<HTMLElement | null>,
  popupElement: HTMLElement | null,
  open: boolean
) {
  const [edges, setEdges] = React.useState({ up: false, down: false });
  const frameRef = React.useRef(0);

  const stop = React.useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;
  }, []);

  React.useLayoutEffect(() => {
    const list = listRef.current;
    if (!open || !popupElement || !list) return;

    const update = () => {
      const up = list.scrollTop > 1;
      const down = list.scrollHeight - list.clientHeight - list.scrollTop > 1;
      setEdges((previous) =>
        previous.up === up && previous.down === down ? previous : { up, down }
      );
    };
    const onVisibilityChange = () => {
      if (document.hidden) stop();
    };

    update();
    list.addEventListener('scroll', update, { passive: true });
    window.addEventListener('blur', stop);
    document.addEventListener('visibilitychange', onVisibilityChange);
    const observer = new ResizeObserver(update);
    observer.observe(list);
    const content = list.querySelector('ul');
    if (content) observer.observe(content);

    return () => {
      stop();
      observer.disconnect();
      list.removeEventListener('scroll', update);
      window.removeEventListener('blur', stop);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [listRef, popupElement, open, stop]);

  function start(direction: number) {
    stop();
    let previousTime = performance.now();
    const step = (time: number) => {
      const list = listRef.current;
      if (!list) return;
      const maximum = list.scrollHeight - list.clientHeight;
      if (
        (direction < 0 && list.scrollTop <= 1) ||
        (direction > 0 && list.scrollTop >= maximum - 1)
      ) {
        stop();
        return;
      }
      list.scrollTop += direction * Math.min(time - previousTime, 32) * 0.18;
      previousTime = time;
      frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
  }

  function scrollPage(direction: number) {
    stop();
    const list = listRef.current;
    if (!list) return;
    list.scrollBy({
      top: direction * list.clientHeight * 0.75,
      behavior: 'instant',
    });
  }

  return { ...edges, start, stop, scrollPage };
}

export function useActiveLinkScroll(
  listRef: React.RefObject<HTMLElement | null>,
  activeLinkRef: React.RefObject<HTMLAnchorElement | null>,
  popupElement: HTMLElement | null,
  open: boolean
) {
  React.useEffect(() => {
    if (!popupElement || !open) return;
    const frame = requestAnimationFrame(() => {
      const list = listRef.current;
      const link = activeLinkRef.current;
      if (!list || !link) return;
      const listBounds = list.getBoundingClientRect();
      const linkBounds = link.getBoundingClientRect();
      if (
        linkBounds.top < listBounds.top + 24 ||
        linkBounds.bottom > listBounds.bottom - 24
      ) {
        list.scrollTop +=
          linkBounds.top - listBounds.top - list.clientHeight / 2;
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [listRef, activeLinkRef, popupElement, open]);
}
