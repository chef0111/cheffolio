'use client';

import { useSyncExternalStore } from 'react';

function getPageOverflows() {
  const scrollingElement =
    document.scrollingElement ?? document.documentElement;
  return scrollingElement.scrollHeight > scrollingElement.clientHeight;
}

function subscribeToPageOverflows(onChange: () => void) {
  const scrollingElement =
    document.scrollingElement ?? document.documentElement;
  const resizeObserver = new ResizeObserver(onChange);

  resizeObserver.observe(scrollingElement);
  if (document.body !== scrollingElement) {
    resizeObserver.observe(document.body);
  }

  window.addEventListener('resize', onChange, { passive: true });
  window.visualViewport?.addEventListener('resize', onChange);

  return () => {
    resizeObserver.disconnect();
    window.removeEventListener('resize', onChange);
    window.visualViewport?.removeEventListener('resize', onChange);
  };
}

const subscribeNoop = () => () => {};
const alwaysOverflows = () => true;

export function useOverflows(enabled = true) {
  return useSyncExternalStore(
    enabled ? subscribeToPageOverflows : subscribeNoop,
    enabled ? getPageOverflows : alwaysOverflows,
    alwaysOverflows
  );
}
