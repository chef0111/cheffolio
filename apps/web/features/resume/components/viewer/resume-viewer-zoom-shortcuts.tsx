'use client';

import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { useResumeViewer } from '../../context/resume-viewer-provider';

const ZOOM_HOTKEYS = ['mod|+', 'mod|shift|+', 'mod|=', 'mod|-', 'mod|shift|-'];

export function ResumeViewerZoomShortcuts() {
  const { numPages, viewportRef, zoomIn, zoomOut } = useResumeViewer();
  const isLoaded = numPages > 0;

  useHotkeys(
    ZOOM_HOTKEYS,
    (event) => {
      if (event.key === '-') zoomOut();
      else zoomIn();
    },
    {
      enabled: isLoaded,
      useKey: true,
      splitKey: '|',
      preventDefault: true,
      ignoreEventWhen: (event) => {
        const viewport = viewportRef.current;
        return (
          event.defaultPrevented ||
          !viewport?.contains(viewport.ownerDocument.activeElement)
        );
      },
    }
  );

  React.useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !isLoaded) return;

    let accumulatedDelta = 0;
    let lastWheelTime = 0;
    let lastZoomTime = -Infinity;

    const handleWheel = (event: WheelEvent) => {
      if (
        event.defaultPrevented ||
        !(event.ctrlKey || event.metaKey) ||
        event.deltaY === 0
      ) {
        return;
      }
      event.preventDefault();

      const now = performance.now();
      const delta =
        event.deltaY *
        (event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? 16
          : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? viewport.clientHeight
            : 1);

      if (
        now - lastWheelTime > 150 ||
        Math.sign(delta) !== Math.sign(accumulatedDelta)
      ) {
        accumulatedDelta = 0;
      }

      accumulatedDelta += delta;
      lastWheelTime = now;

      // Keep high-resolution wheel gestures from producing excessive zoom steps.
      if (Math.abs(accumulatedDelta) < 40 || now - lastZoomTime < 100) return;

      accumulatedDelta = 0;
      lastZoomTime = now;
      if (delta < 0) zoomIn();
      else zoomOut();
    };

    // Cancel browser zoom only for modified wheel gestures inside the PDF.
    viewport.addEventListener('wheel', handleWheel, { passive: false });
    return () => viewport.removeEventListener('wheel', handleWheel);
  }, [isLoaded, viewportRef, zoomIn, zoomOut]);

  return null;
}
